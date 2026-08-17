// M9 — PostgreSQL + pgvector Vector Store
// Production vector store for Supabase, behind the existing VectorStore
// interface. Uses parameterized SQL only — user-controlled values are never
// interpolated into SQL. Cosine similarity maps pgvector distance to the
// existing 0–1 similarity model: similarity = 1 - (embedding <=> $query).
//
// The table is created by `npm run migrate:pgvector` (idempotent); this
// provider tolerates a missing table with a clear, actionable error.

import { Pool } from 'pg';
import type { Chunk, SearchResult, MetadataFilter } from '../../types';
import type { VectorStore } from './interface';

// ============================================================
// Config & schema helpers
// ============================================================

export interface PostgresVectorStoreConfig {
  /** Supabase/Postgres connection string (secret — never logged). */
  url: string;
  /** Table name (default: hanif_academy_chunks). Config-controlled, never user input. */
  table?: string;
  /** Embedding dimensions (used by the schema builder; default derived from the embedding provider). */
  dimensions?: number;
}

const DEFAULT_TABLE = 'hanif_academy_chunks';
const SAFE_TABLE_PATTERN = /^[a-z_][a-z0-9_]*$/;

/**
 * Idempotent DDL for the pgvector schema. `table` must match the safe-table
 * pattern (config-controlled); `dimensions` must be a positive integer.
 * No destructive operations — CREATE … IF NOT EXISTS only.
 */
export function buildPgvectorSchemaSql(options: {
  table: string;
  dimensions: number;
}): string[] {
  const { table, dimensions } = options;
  if (!SAFE_TABLE_PATTERN.test(table)) {
    throw new Error('Invalid pgvector table name (must be lowercase [a-z0-9_]).');
  }
  if (!Number.isInteger(dimensions) || dimensions <= 0) {
    throw new Error('Invalid vector dimensions (must be a positive integer).');
  }
  return [
    'CREATE EXTENSION IF NOT EXISTS vector;',
    `CREATE TABLE IF NOT EXISTS ${table} (
      id             text PRIMARY KEY,
      content        text NOT NULL,
      title          text NOT NULL,
      module         text NOT NULL,
      chapter        text NOT NULL,
      section        text NOT NULL,
      source_path    text NOT NULL,
      url            text NOT NULL,
      content_type   text NOT NULL,
      heading_level  integer NOT NULL,
      chunk_index    integer NOT NULL,
      start_line     integer NOT NULL,
      end_line       integer NOT NULL,
      has_code_blocks boolean NOT NULL DEFAULT false,
      embedding      vector(${dimensions}) NOT NULL
    );`,
    `CREATE INDEX IF NOT EXISTS ${table}_embedding_hnsw
      ON ${table} USING hnsw (embedding vector_cosine_ops);`,
  ];
}

// ============================================================
// Provider
// ============================================================

const COLUMNS = [
  'id', 'content', 'title', 'module', 'chapter', 'section', 'source_path',
  'url', 'content_type', 'heading_level', 'chunk_index', 'start_line',
  'end_line', 'has_code_blocks',
];

/** pgvector accepts embeddings as "[0.1,0.2,…]" text (no native pg type). */
function serializeVector(embedding: number[] | undefined): string {
  if (!embedding || embedding.length === 0) {
    throw new Error('Chunk is missing an embedding; refusing to upsert into pgvector.');
  }
  return `[${embedding.join(',')}]`;
}

export class PostgresVectorStore implements VectorStore {
  name = 'postgres';
  private pool: Pool | null = null;
  private url: string;
  private table: string;

  constructor(config: PostgresVectorStoreConfig) {
    if (!config.url || !config.url.trim()) {
      throw new Error('PostgresVectorStore requires a connection URL (POSTGRES_URL).');
    }
    this.url = config.url;
    this.table = config.table || DEFAULT_TABLE;
    if (!SAFE_TABLE_PATTERN.test(this.table)) {
      throw new Error('Invalid pgvector table name (must be lowercase [a-z0-9_]).');
    }
  }

  private getPool(): Pool {
    if (!this.pool) {
      // Lazy, serverless-friendly pool: one connection per function instance;
      // SSL required by Supabase. Connection errors surface via query failures.
      this.pool = new Pool({
        connectionString: this.url,
        max: 1,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        ssl: { rejectUnauthorized: false },
      });
    }
    return this.pool;
  }

  async upsert(chunks: Chunk[]): Promise<void> {
    if (chunks.length === 0) return;

    const params: unknown[] = [];
    const rows: string[] = [];
    for (const chunk of chunks) {
      const base = params.length;
      const values = [
        chunk.id,
        chunk.content,
        chunk.metadata.title,
        chunk.metadata.module,
        chunk.metadata.chapter,
        chunk.metadata.section,
        chunk.metadata.sourcePath,
        chunk.metadata.url,
        chunk.metadata.contentType,
        chunk.metadata.headingLevel,
        chunk.metadata.chunkIndex,
        chunk.metadata.startLine,
        chunk.metadata.endLine,
        chunk.metadata.hasCodeBlocks ?? false,
        serializeVector(chunk.embedding),
      ];
      values.forEach((v) => params.push(v));
      const placeholders = values.map((_, i) => `$${base + i + 1}`).join(', ');
      rows.push(`(${placeholders})`);
    }

    const sql = `INSERT INTO ${this.table} (${COLUMNS.join(', ')}, embedding)
      VALUES ${rows.join(', ')}
      ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content, title = EXCLUDED.title,
        module = EXCLUDED.module, chapter = EXCLUDED.chapter,
        section = EXCLUDED.section, source_path = EXCLUDED.source_path,
        url = EXCLUDED.url, content_type = EXCLUDED.content_type,
        heading_level = EXCLUDED.heading_level, chunk_index = EXCLUDED.chunk_index,
        start_line = EXCLUDED.start_line, end_line = EXCLUDED.end_line,
        has_code_blocks = EXCLUDED.has_code_blocks, embedding = EXCLUDED.embedding`;

    try {
      await this.getPool().query(sql, params);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async search(
    embedding: number[],
    topK: number,
    filter?: MetadataFilter
  ): Promise<SearchResult[]> {
    const params: unknown[] = [serializeVector(embedding)];
    const where = this.buildWhere(filter, params);

    const sql = `SELECT ${COLUMNS.join(', ')},
        1 - (embedding <=> $1::vector) AS score
      FROM ${this.table}${where.sql}
      ORDER BY embedding <=> $1::vector
      LIMIT $${params.length + 1}`;
    params.push(topK);

    try {
      const result = await this.getPool().query(sql, params);
      return result.rows.map((row) => ({
        chunk: this.rowToChunk(row),
        score: Number(row.score),
      }));
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async get(filter: MetadataFilter): Promise<Chunk[]> {
    const params: unknown[] = [];
    const where = this.buildWhere(filter, params);

    const sql = `SELECT ${COLUMNS.join(', ')} FROM ${this.table}${where.sql}`;

    try {
      const result = await this.getPool().query(sql, params);
      return result.rows.map((row) => this.rowToChunk(row));
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async delete(filter: MetadataFilter): Promise<void> {
    const params: unknown[] = [];
    const where = this.buildWhere(filter, params);

    // Matches the in-memory store semantics: an empty filter deletes all rows.
    const sql = `DELETE FROM ${this.table}${where.sql}`;

    try {
      await this.getPool().query(sql, params);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async count(): Promise<number> {
    const sql = `SELECT COUNT(*)::int AS count FROM ${this.table}`;
    try {
      const result = await this.getPool().query(sql);
      return Number(result.rows[0]?.count ?? 0);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async reset(): Promise<void> {
    const sql = `TRUNCATE ${this.table}`;
    try {
      await this.getPool().query(sql);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  // ============================================================
  // Helpers
  // ============================================================

  /**
   * Translate a MetadataFilter into a parameterized WHERE clause.
   * Filter values are always bound parameters — never interpolated.
   */
  private buildWhere(
    filter: MetadataFilter | undefined,
    params: unknown[]
  ): { sql: string } {
    if (!filter) return { sql: '' };
    const mappings: Array<[string, string | undefined]> = [
      ['module', filter.module],
      ['chapter', filter.chapter],
      ['source_path', filter.sourcePath],
      ['content_type', filter.contentType],
    ];
    const conditions: string[] = [];
    for (const [column, value] of mappings) {
      if (value !== undefined && value !== null && value !== '') {
        params.push(value);
        conditions.push(`${column} = $${params.length}`);
      }
    }
    return { sql: conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '' };
  }

  private rowToChunk(row: Record<string, unknown>): Chunk {
    return {
      id: String(row.id),
      content: String(row.content),
      metadata: {
        title: String(row.title ?? ''),
        module: String(row.module ?? ''),
        chapter: String(row.chapter ?? ''),
        section: String(row.section ?? ''),
        sourcePath: String(row.source_path ?? ''),
        url: String(row.url ?? ''),
        contentType: (row.content_type as Chunk['metadata']['contentType']) || 'text',
        headingLevel: Number(row.heading_level) || 1,
        chunkIndex: Number(row.chunk_index) || 0,
        startLine: Number(row.start_line) || 0,
        endLine: Number(row.end_line) || 0,
        hasCodeBlocks: Boolean(row.has_code_blocks),
      },
    };
  }

  /** Wrap DB errors safely — never leak the connection string or credentials. */
  private mapError(error: unknown): Error {
    const code = (error as { code?: string })?.code;
    const rawMessage = error instanceof Error ? error.message : String(error);

    if (code === '42P01') {
      return new Error(
        `Vector store table "${this.table}" does not exist. Run \`npm run migrate:pgvector\` first.`
      );
    }

    let message = rawMessage;
    try {
      const url = new URL(this.url);
      if (url.password) {
        message = message.split(url.password).join('***');
      }
    } catch {
      // Not a parseable URL — fall through.
    }
    message = message.split(this.url).join('***');

    const wrapped = new Error(
      message ? `Vector store database error: ${message}` : 'Vector store database error'
    );
    (wrapped as { cause?: unknown }).cause = error;
    return wrapped;
  }
}
