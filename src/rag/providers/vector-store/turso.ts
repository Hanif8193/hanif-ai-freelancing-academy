// M9 — Turso (libSQL) Vector Store
// Production vector store for Turso Cloud native vector search, behind the
// existing VectorStore interface. Uses the official @libsql/client package
// (Node build — compatible with Vercel Node functions).
//
// Storage: a single table whose `embedding` column is a BLOB populated with
// Turso's native vector32() conversion. Similarity uses vector_distance_cos
// (native Turso — no vec0 extension required; verified against the live
// database: vec0 is unavailable, native vector functions are available).
//
// vec0-style cosine distance is NOT used; vector_distance_cos returns cosine
// DISTANCE (lower is better, 0 = identical). The existing Retriever contract
// expects SIMILARITY ~0-1 (higher is better), so we convert:
//     similarity = 1 - distance, clamped to [0, 1]
// All SQL is parameterized — user-controlled values are never interpolated.

import { createClient } from '@libsql/client';
import type { Client, InValue, ResultSet } from '@libsql/client';
import type { Chunk, SearchResult, MetadataFilter } from '../../types';
import type { VectorStore } from './interface';

export interface TursoVectorStoreConfig {
  /** Turso database URL (https://…turso.io or file:). Secret-adjacent — never logged. */
  url: string;
  /** Turso auth token (secret — never logged or exposed). */
  authToken?: string;
  /** Chunk table name (default: hanif_academy_chunks). Config-controlled, never user input. */
  table?: string;
}

const DEFAULT_TABLE = 'hanif_academy_chunks';
const SAFE_TABLE_PATTERN = /^[a-z_][a-z0-9_]*$/;

const CHUNK_COLUMNS = [
  'id', 'content', 'title', 'module', 'chapter', 'section', 'source_path',
  'url', 'content_type', 'heading_level', 'chunk_index', 'start_line',
  'end_line', 'has_code_blocks',
] as const;

/** Native vector32() accepts embeddings as JSON-array text (e.g. "[0.1,0.2,…]"). */
function serializeVector(embedding: number[] | undefined): string {
  if (!embedding || embedding.length === 0) {
    throw new Error('Chunk is missing an embedding; refusing to upsert into Turso.');
  }
  return `[${embedding.join(',')}]`;
}

/** Clamp similarity into the existing 0–1 retriever contract. */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Idempotent DDL for the Turso schema (native vector BLOB column).
 * `table` must match the safe-table pattern (config-controlled). The
 * `dimensions` argument is validated and informational — the native BLOB
 * column is dimension-agnostic (consistency is enforced at query time by
 * vector32()/vector_distance_cos, which require matching dimensions).
 * No destructive operations — CREATE … IF NOT EXISTS only.
 */
export function buildTursoSchemaSql(options: {
  table: string;
  dimensions: number;
}): string[] {
  const { table, dimensions } = options;
  if (!SAFE_TABLE_PATTERN.test(table)) {
    throw new Error('Invalid Turso table name (must be lowercase [a-z0-9_]).');
  }
  if (!Number.isInteger(dimensions) || dimensions <= 0) {
    throw new Error('Invalid vector dimensions (must be a positive integer).');
  }
  return [
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
      has_code_blocks integer NOT NULL DEFAULT 0,
      embedding      BLOB NOT NULL
    );`,
  ];
}

export class TursoVectorStore implements VectorStore {
  name = 'turso';
  private client: Client | null = null;
  private url: string;
  private authToken: string | undefined;
  private table: string;

  constructor(config: TursoVectorStoreConfig) {
    if (!config.url || !config.url.trim()) {
      throw new Error('TursoVectorStore requires a database URL (TURSO_DATABASE_URL).');
    }
    this.url = config.url;
    this.authToken = config.authToken;
    this.table = config.table || DEFAULT_TABLE;
    if (!SAFE_TABLE_PATTERN.test(this.table)) {
      throw new Error('Invalid Turso table name (must be lowercase [a-z0-9_]).');
    }
  }

  /** Lazy, serverless-friendly client — created on first use. */
  private getClient(): Client {
    if (!this.client) {
      this.client = createClient({
        url: this.url,
        authToken: this.authToken || undefined,
      });
    }
    return this.client;
  }

  async upsert(chunks: Chunk[]): Promise<void> {
    if (chunks.length === 0) return;

    // Build rows first — serializing embeddings validates them, so a missing
    // embedding fails before any write happens.
    const params: InValue[] = [];
    const rows: string[] = [];
    for (const chunk of chunks) {
      params.push(
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
        serializeVector(chunk.embedding)
      );
      rows.push(`(${CHUNK_COLUMNS.map(() => '?').join(', ')}, vector32(?))`);
    }
    const sql = `INSERT INTO ${this.table} (${CHUNK_COLUMNS.join(', ')}, embedding)
      VALUES ${rows.join(', ')}
      ON CONFLICT (id) DO UPDATE SET
        content = excluded.content, title = excluded.title,
        module = excluded.module, chapter = excluded.chapter,
        section = excluded.section, source_path = excluded.source_path,
        url = excluded.url, content_type = excluded.content_type,
        heading_level = excluded.heading_level, chunk_index = excluded.chunk_index,
        start_line = excluded.start_line, end_line = excluded.end_line,
        has_code_blocks = excluded.has_code_blocks, embedding = excluded.embedding`;

    await this.safeExecute(sql, params);
  }

  async search(
    embedding: number[],
    topK: number,
    filter?: MetadataFilter
  ): Promise<SearchResult[]> {
    const params: InValue[] = [serializeVector(embedding)];
    const filterSql = this.buildFilterClause(filter, params);
    const sql = `SELECT ${CHUNK_COLUMNS.join(', ')},
        vector_distance_cos(embedding, vector32(?)) AS distance
      FROM ${this.table}${filterSql ? ` WHERE ${filterSql}` : ''}
      ORDER BY distance
      LIMIT ?`;
    params.push(topK);

    const result = await this.safeExecute(sql, params);
    return result.rows.map((row) => {
      const distance = Number(this.column(result, row, 'distance') ?? 1);
      return {
        chunk: this.rowToChunk(result, row),
        score: clamp01(1 - distance),
      };
    });
  }

  async get(filter: MetadataFilter): Promise<Chunk[]> {
    const params: InValue[] = [];
    const filterSql = this.buildFilterClause(filter, params);
    const sql = `SELECT ${CHUNK_COLUMNS.join(', ')} FROM ${this.table}${
      filterSql ? ` WHERE ${filterSql}` : ''
    }`;
    const result = await this.safeExecute(sql, params);
    return result.rows.map((row) => this.rowToChunk(result, row));
  }

  async delete(filter: MetadataFilter): Promise<void> {
    const params: InValue[] = [];
    const filterSql = this.buildFilterClause(filter, params);
    // Matches the in-memory store semantics: an empty filter deletes all rows.
    await this.safeExecute(
      `DELETE FROM ${this.table}${filterSql ? ` WHERE ${filterSql}` : ''}`,
      params
    );
  }

  async count(): Promise<number> {
    const result = await this.safeExecute(
      `SELECT COUNT(*) AS count FROM ${this.table}`
    );
    return Number(result.rows[0] ? this.column(result, result.rows[0], 'count') : 0);
  }

  async reset(): Promise<void> {
    await this.safeExecute(`DELETE FROM ${this.table}`);
  }

  // ============================================================
  // Helpers
  // ============================================================

  /**
   * Translate a MetadataFilter into parameterized WHERE conditions.
   * Filter values are always bound parameters — never interpolated.
   * Returns an empty string when there is nothing to filter on.
   */
  private buildFilterClause(
    filter: MetadataFilter | undefined,
    params: InValue[]
  ): string {
    if (!filter) return '';
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
        conditions.push(`${column} = ?`);
      }
    }
    return conditions.join(' AND ');
  }

  /** Read a column by name from an array-like libsql row. */
  private column(result: ResultSet, row: ArrayLike<unknown>, name: string): unknown {
    const index = result.columns.indexOf(name);
    return index >= 0 ? row[index] : undefined;
  }

  private rowToChunk(result: ResultSet, row: ArrayLike<unknown>): Chunk {
    const s = (name: string): string =>
      String(this.column(result, row, name) ?? '');
    return {
      id: s('id'),
      content: s('content'),
      metadata: {
        title: s('title'),
        module: s('module'),
        chapter: s('chapter'),
        section: s('section'),
        sourcePath: s('source_path'),
        url: s('url'),
        contentType: (this.column(result, row, 'content_type') as
          Chunk['metadata']['contentType']) || 'text',
        headingLevel: Number(this.column(result, row, 'heading_level')) || 1,
        chunkIndex: Number(this.column(result, row, 'chunk_index')) || 0,
        startLine: Number(this.column(result, row, 'start_line')) || 0,
        endLine: Number(this.column(result, row, 'end_line')) || 0,
        hasCodeBlocks: Boolean(this.column(result, row, 'has_code_blocks')),
      },
    };
  }

  /** Execute with safe error wrapping — never leak the URL or auth token. */
  private async safeExecute(
    sql: string,
    params: InValue[] = []
  ): Promise<ResultSet> {
    try {
      return await this.getClient().execute({ sql, args: params });
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown): Error {
    const rawMessage = error instanceof Error ? error.message : String(error);
    const code = (error as { code?: string })?.code;

    // SQLite "no such table" → actionable migration hint.
    if (code === 'LIBSQL_ERROR' || /no such table/i.test(rawMessage)) {
      if (/no such table/i.test(rawMessage)) {
        return new Error(
          `Vector store table "${this.table}" does not exist. Run \`npm run migrate:turso\` first.`
        );
      }
    }

    let message = rawMessage;
    if (this.authToken) {
      message = message.split(this.authToken).join('***');
    }
    message = message.split(this.url).join('***');

    const wrapped = new Error(
      message ? `Vector store database error: ${message}` : 'Vector store database error'
    );
    (wrapped as { cause?: unknown }).cause = error;
    return wrapped;
  }
}
