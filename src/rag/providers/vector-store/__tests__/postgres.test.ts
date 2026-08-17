// M9 — PostgresVectorStore tests
// ALL tests mock the `pg` Pool — zero real database connections.

import { PostgresVectorStore, buildPgvectorSchemaSql } from '../postgres';
import type { Chunk } from '../../../types';

const mockQuery = jest.fn();
const mockEnd = jest.fn();

jest.mock('pg', () => {
  class MockPool {
    query = mockQuery;
    end = mockEnd;
  }
  return { Pool: jest.fn().mockImplementation(() => new MockPool()) };
});

// The mocked Pool constructor (assert construction args).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Pool } = require('pg') as { Pool: jest.Mock };

const URL = 'postgresql://user:secret@db.example.com:5432/postgres';

function makeChunk(overrides: Partial<Chunk> = {}): Chunk {
  return {
    id: 'chunk-1',
    content: 'Some content',
    metadata: {
      title: 'Chapter 01',
      module: 'freelancing',
      chapter: '01',
      section: 'What is freelancing?',
      sourcePath: 'docs/freelancing/what-is-freelancing.md',
      url: '/docs/freelancing/what-is-freelancing',
      contentType: 'text',
      headingLevel: 2,
      chunkIndex: 0,
      startLine: 1,
      endLine: 5,
      hasCodeBlocks: false,
    },
    embedding: [0.1, 0.2, 0.3],
    ...overrides,
  };
}

function makeRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'chunk-1',
    content: 'Some content',
    title: 'Chapter 01',
    module: 'freelancing',
    chapter: '01',
    section: 'What is freelancing?',
    source_path: 'docs/freelancing/what-is-freelancing.md',
    url: '/docs/freelancing/what-is-freelancing',
    content_type: 'text',
    heading_level: 2,
    chunk_index: 0,
    start_line: 1,
    end_line: 5,
    has_code_blocks: false,
    ...overrides,
  };
}

beforeEach(() => {
  mockQuery.mockReset();
  mockEnd.mockReset();
  Pool.mockClear();
  mockQuery.mockResolvedValue({ rows: [] });
});

describe('PostgresVectorStore', () => {
  describe('construction / configuration', () => {
    it('throws a clear error when the connection URL is missing', () => {
      expect(() => new PostgresVectorStore({ url: '' })).toThrow(
        'PostgresVectorStore requires a connection URL (POSTGRES_URL).'
      );
    });

    it('rejects unsafe table names', () => {
      expect(() => new PostgresVectorStore({ url: URL, table: 'user_input; DROP TABLE x' })).toThrow(
        'Invalid pgvector table name'
      );
    });

    it('lazily creates a serverless-friendly pool (max 1, SSL) on first query', async () => {
      const store = new PostgresVectorStore({ url: URL });
      expect(Pool).not.toHaveBeenCalled();

      await store.count();
      expect(Pool).toHaveBeenCalledWith({
        connectionString: URL,
        max: 1,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        ssl: { rejectUnauthorized: false },
      });
    });
  });

  describe('upsert', () => {
    it('is a no-op for an empty array', async () => {
      const store = new PostgresVectorStore({ url: URL });
      await store.upsert([]);
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('uses parameterized INSERT ... ON CONFLICT with serialized embeddings', async () => {
      const store = new PostgresVectorStore({ url: URL });
      await store.upsert([makeChunk()]);

      const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]];
      expect(sql).toContain('INSERT INTO hanif_academy_chunks');
      expect(sql).toContain('ON CONFLICT (id) DO UPDATE SET');
      // Embedding serialized as pgvector text.
      expect(params).toContain('[0.1,0.2,0.3]');
      // Content is a bound parameter, never interpolated into SQL.
      expect(params).toContain('Some content');
      expect(sql).not.toContain('Some content');
    });

    it('respects a configured table name', async () => {
      const store = new PostgresVectorStore({ url: URL, table: 'my_chunks' });
      await store.upsert([makeChunk()]);
      expect(mockQuery.mock.calls[0][0]).toContain('INSERT INTO my_chunks');
    });

    it('refuses to upsert a chunk without an embedding', async () => {
      const store = new PostgresVectorStore({ url: URL });
      await expect(store.upsert([makeChunk({ embedding: undefined })])).rejects.toThrow(
        'Chunk is missing an embedding'
      );
      expect(mockQuery).not.toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('maps pgvector cosine distance to 0–1 similarity via SQL', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [makeRow({ score: 0.85 }), makeRow({ id: 'c2', score: 0.4 })] });
      const store = new PostgresVectorStore({ url: URL });
      const results = await store.search([0.1, 0.2, 0.3], 2);

      const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]];
      expect(sql).toContain('1 - (embedding <=> $1::vector) AS score');
      expect(sql).toContain('ORDER BY embedding <=> $1::vector');
      expect(sql).toContain('LIMIT $2');
      expect(params[0]).toBe('[0.1,0.2,0.3]');
      expect(params[1]).toBe(2);

      expect(results).toHaveLength(2);
      expect(results[0].score).toBe(0.85);
      expect(results[0].chunk.id).toBe('chunk-1');
      expect(results[1].chunk.id).toBe('c2');
    });

    it('round-trips chunk metadata from rows', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [makeRow()] });
      const store = new PostgresVectorStore({ url: URL });
      const [result] = await store.search([0.1, 0.2, 0.3], 5);
      expect(result.chunk.metadata.module).toBe('freelancing');
      expect(result.chunk.metadata.chapter).toBe('01');
      expect(result.chunk.metadata.sourcePath).toBe(
        'docs/freelancing/what-is-freelancing.md'
      );
      expect(result.chunk.metadata.url).toBe('/docs/freelancing/what-is-freelancing');
    });

    it('applies metadata filters as bound parameters', async () => {
      const store = new PostgresVectorStore({ url: URL });
      await store.search([0.1, 0.2, 0.3], 5, { module: 'freelancing', chapter: '01' });

      const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]];
      expect(sql).toContain('WHERE module = $2 AND chapter = $3');
      expect(params[1]).toBe('freelancing');
      expect(params[2]).toBe('01');
      // Filter values must never appear literally in the SQL.
      expect(sql).not.toContain('freelancing');
      expect(sql).not.toContain("'01'");
    });
  });

  describe('get / delete / count / reset', () => {
    it('get returns chunks with no WHERE clause when the filter is empty', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [makeRow(), makeRow({ id: 'c2' })] });
      const store = new PostgresVectorStore({ url: URL });
      const chunks = await store.get({});
      expect(mockQuery.mock.calls[0][0]).toContain('SELECT id, content, title, module');
      expect(mockQuery.mock.calls[0][0]).not.toContain('WHERE');
      expect(chunks).toHaveLength(2);
    });

    it('get applies the filter as a bound parameter', async () => {
      const store = new PostgresVectorStore({ url: URL });
      await store.get({ sourcePath: 'docs/ai/what-are-ai-coding-agents.md' });
      const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]];
      expect(sql).toContain('WHERE source_path = $1');
      expect(params[0]).toBe('docs/ai/what-are-ai-coding-agents.md');
      expect(sql).not.toContain('what-are-ai-coding-agents');
    });

    it('delete removes matching rows (all rows when the filter is empty)', async () => {
      const store = new PostgresVectorStore({ url: URL });
      await store.delete({ chapter: '01' });
      expect(mockQuery.mock.calls[0][0]).toBe('DELETE FROM hanif_academy_chunks WHERE chapter = $1');
      expect(mockQuery.mock.calls[0][1]).toEqual(['01']);

      await store.delete({});
      expect(mockQuery.mock.calls[1][0]).toBe('DELETE FROM hanif_academy_chunks');
    });

    it('count returns the row count as a number', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ count: 641 }] });
      const store = new PostgresVectorStore({ url: URL });
      await expect(store.count()).resolves.toBe(641);
      expect(mockQuery.mock.calls[0][0]).toContain('COUNT(*)::int AS count');
    });

    it('reset truncates the table', async () => {
      const store = new PostgresVectorStore({ url: URL });
      await store.reset();
      expect(mockQuery.mock.calls[0][0]).toBe('TRUNCATE hanif_academy_chunks');
    });
  });

  describe('error handling', () => {
    it('maps a missing table (42P01) to an actionable error', async () => {
      mockQuery.mockRejectedValueOnce({ code: '42P01' });
      const store = new PostgresVectorStore({ url: URL });
      await expect(store.count()).rejects.toThrow(
        'Vector store table "hanif_academy_chunks" does not exist. Run `npm run migrate:pgvector` first.'
      );
    });

    it('never leaks the connection string or password in errors', async () => {
      mockQuery.mockRejectedValueOnce(
        new Error(`connect ECONNREFUSED ${URL}?sslmode=require`)
      );
      const store = new PostgresVectorStore({ url: URL });
      const error = (await store.count().catch((e) => e)) as Error;
      expect(error.message).not.toContain(URL);
      expect(error.message).not.toContain('secret');
      expect(error.message).toContain('Vector store database error');
    });
  });
});

describe('buildPgvectorSchemaSql', () => {
  it('returns idempotent, non-destructive DDL with the configured dimensions', () => {
    const statements = buildPgvectorSchemaSql({ table: 'hanif_academy_chunks', dimensions: 768 });
    expect(statements).toHaveLength(3);
    expect(statements[0]).toBe('CREATE EXTENSION IF NOT EXISTS vector;');
    expect(statements[1]).toContain('CREATE TABLE IF NOT EXISTS hanif_academy_chunks');
    expect(statements[1]).toContain('embedding      vector(768) NOT NULL');
    expect(statements[2]).toContain('CREATE INDEX IF NOT EXISTS hanif_academy_chunks_embedding_hnsw');
    expect(statements[2]).toContain('USING hnsw (embedding vector_cosine_ops)');
    // No destructive operations.
    expect(statements.join('\n')).not.toMatch(/DROP|TRUNCATE/i);
  });

  it('rejects unsafe table names', () => {
    expect(() => buildPgvectorSchemaSql({ table: 'x; DROP TABLE y', dimensions: 768 })).toThrow(
      'Invalid pgvector table name'
    );
  });

  it('rejects invalid dimensions', () => {
    expect(() => buildPgvectorSchemaSql({ table: 'chunks', dimensions: 0 })).toThrow(
      'Invalid vector dimensions'
    );
    expect(() => buildPgvectorSchemaSql({ table: 'chunks', dimensions: -4 })).toThrow(
      'Invalid vector dimensions'
    );
  });
});
