// M9 — TursoVectorStore tests
// ALL tests mock the @libsql/client — zero real Turso calls.

import { TursoVectorStore, buildTursoSchemaSql } from '../turso';
import type { Chunk } from '../../../types';

const mockExecute = jest.fn();
const mockClose = jest.fn();

jest.mock('@libsql/client', () => {
  class MockClient {
    execute = mockExecute;
    close = mockClose;
  }
  return { createClient: jest.fn(() => new MockClient()) };
});

// The mocked createClient (assert construction args).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createClient } = require('@libsql/client') as { createClient: jest.Mock };

const URL = 'libsql://academy-test-org.turso.io';
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.test-secret-token';

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

const SEARCH_COLUMNS = [
  'id', 'content', 'title', 'module', 'chapter', 'section', 'source_path',
  'url', 'content_type', 'heading_level', 'chunk_index', 'start_line',
  'end_line', 'has_code_blocks', 'distance',
];

/** A search row in column order (as returned by the libsql client). */
function makeSearchRow(overrides: Partial<Record<string, unknown>> = {}) {
  const base: Record<string, unknown> = {
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
    has_code_blocks: 0,
    distance: 0.1,
  };
  Object.assign(base, overrides);
  return SEARCH_COLUMNS.map((c) => base[c]);
}

function makeResult(columns: string[], rows: unknown[][]) {
  return {
    columns,
    columnTypes: columns.map(() => ''),
    rows,
    rowsAffected: rows.length,
    lastInsertRowid: undefined,
  };
}

beforeEach(() => {
  mockExecute.mockReset();
  mockClose.mockReset();
  createClient.mockClear();
  mockExecute.mockResolvedValue(makeResult([], []));
});

describe('TursoVectorStore', () => {
  describe('construction / configuration', () => {
    it('throws a clear error when the database URL is missing', () => {
      expect(() => new TursoVectorStore({ url: '' })).toThrow(
        'TursoVectorStore requires a database URL (TURSO_DATABASE_URL).'
      );
    });

    it('rejects unsafe table names', () => {
      expect(() =>
        new TursoVectorStore({ url: URL, table: 'user_input; DROP TABLE x' })
      ).toThrow('Invalid Turso table name');
    });

    it('lazily creates the client with url + auth token on first use', async () => {
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      expect(createClient).not.toHaveBeenCalled();

      await store.count();
      expect(createClient).toHaveBeenCalledWith({ url: URL, authToken: TOKEN });
    });
  });

  describe('upsert', () => {
    it('is a no-op for an empty array', async () => {
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      await store.upsert([]);
      expect(mockExecute).not.toHaveBeenCalled();
    });

    it('writes a single row with a native vector32() embedding (ON CONFLICT upsert)', async () => {
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      await store.upsert([makeChunk()]);

      expect(mockExecute).toHaveBeenCalledTimes(1);
      const [call] = mockExecute.mock.calls[0] as [{ sql: string; args: unknown[] }];
      expect(call.sql).toContain('INSERT INTO hanif_academy_chunks');
      expect(call.sql).toContain('vector32(?)');
      expect(call.sql).toContain('ON CONFLICT (id) DO UPDATE SET');
      expect(call.sql).toContain('embedding = excluded.embedding');
      // Content and embedding are bound, never interpolated into SQL.
      expect(call.args).toContain('Some content');
      expect(call.args).toContain('[0.1,0.2,0.3]');
      expect(call.args).toHaveLength(15);
      expect(call.sql).not.toContain('Some content');
      expect(call.sql).not.toContain('0.1,0.2,0.3');
    });

    it('respects a configured table name', async () => {
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN, table: 'my_chunks' });
      await store.upsert([makeChunk()]);
      expect(mockExecute.mock.calls[0][0].sql).toContain('INSERT INTO my_chunks');
    });

    it('refuses to upsert a chunk without an embedding', async () => {
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      await expect(store.upsert([makeChunk({ embedding: undefined })])).rejects.toThrow(
        'Chunk is missing an embedding'
      );
      expect(mockExecute).not.toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('converts Turso cosine distance to the 0–1 similarity contract', async () => {
      mockExecute.mockResolvedValueOnce(
        makeResult(SEARCH_COLUMNS, [
          makeSearchRow({ distance: 0.1 }),
          makeSearchRow({ id: 'c2', distance: 0.6 }),
        ])
      );
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      const results = await store.search([0.1, 0.2, 0.3], 2);

      const [call] = mockExecute.mock.calls[0] as [{ sql: string; args: unknown[] }];
      expect(call.sql).toContain('vector_distance_cos(embedding, vector32(?)) AS distance');
      expect(call.sql).toContain('ORDER BY distance');
      expect(call.sql).toContain('LIMIT ?');
      expect(call.args).toEqual(['[0.1,0.2,0.3]', 2]);

      // similarity = 1 - distance
      expect(results).toHaveLength(2);
      expect(results[0].chunk.id).toBe('chunk-1');
      expect(results[0].score).toBeCloseTo(0.9);
      expect(results[1].score).toBeCloseTo(0.4);
    });

    it('clamps similarity into [0, 1]', async () => {
      mockExecute.mockResolvedValueOnce(
        makeResult(SEARCH_COLUMNS, [
          makeSearchRow({ distance: 0 }),   // identical → 1
          makeSearchRow({ id: 'c2', distance: 2 }), // opposite → clamped to 0
        ])
      );
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      const results = await store.search([0.1, 0.2, 0.3], 5);
      expect(results[0].score).toBe(1);
      expect(results[1].score).toBe(0);
    });

    it('round-trips chunk metadata from rows', async () => {
      mockExecute.mockResolvedValueOnce(makeResult(SEARCH_COLUMNS, [makeSearchRow()]));
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      const [result] = await store.search([0.1, 0.2, 0.3], 5);
      expect(result.chunk.metadata.module).toBe('freelancing');
      expect(result.chunk.metadata.chapter).toBe('01');
      expect(result.chunk.metadata.sourcePath).toBe(
        'docs/freelancing/what-is-freelancing.md'
      );
      expect(result.chunk.metadata.url).toBe('/docs/freelancing/what-is-freelancing');
      expect(result.chunk.metadata.hasCodeBlocks).toBe(false);
    });

    it('applies metadata filters as bound parameters', async () => {
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      await store.search([0.1, 0.2, 0.3], 5, { module: 'freelancing', chapter: '01' });

      const [call] = mockExecute.mock.calls[0] as [{ sql: string; args: unknown[] }];
      expect(call.sql).toContain('WHERE module = ? AND chapter = ?');
      expect(call.args).toEqual(['[0.1,0.2,0.3]', 'freelancing', '01', 5]);
      // Filter values must never appear literally in the SQL.
      expect(call.sql).not.toContain('freelancing');
      expect(call.sql).not.toContain("'01'");
    });

    it('returns an empty array when there are no results', async () => {
      mockExecute.mockResolvedValueOnce(makeResult(SEARCH_COLUMNS, []));
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      await expect(store.search([0.1, 0.2, 0.3], 5)).resolves.toEqual([]);
    });
  });

  describe('get / delete / count / reset', () => {
    it('get returns chunks with no WHERE clause when the filter is empty', async () => {
      mockExecute.mockResolvedValueOnce(
        makeResult(['id', 'content', 'title', 'module'], [['c1', 'a', 't', 'm'], ['c2', 'b', 't', 'm']])
      );
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      const chunks = await store.get({});
      const [call] = mockExecute.mock.calls[0] as [{ sql: string; args: unknown[] }];
      expect(call.sql).toContain('SELECT id, content, title, module');
      expect(call.sql).not.toContain('WHERE');
      expect(chunks).toHaveLength(2);
      expect(chunks[0].id).toBe('c1');
    });

    it('get applies the filter as a bound parameter', async () => {
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      await store.get({ sourcePath: 'docs/ai/what-are-ai-coding-agents.md' });
      const [call] = mockExecute.mock.calls[0] as [{ sql: string; args: unknown[] }];
      expect(call.sql).toContain('WHERE source_path = ?');
      expect(call.args).toEqual(['docs/ai/what-are-ai-coding-agents.md']);
      expect(call.sql).not.toContain('what-are-ai-coding-agents');
    });

    it('delete removes matching rows (all rows when the filter is empty)', async () => {
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      await store.delete({ chapter: '01' });
      expect(mockExecute.mock.calls[0][0].sql).toBe(
        'DELETE FROM hanif_academy_chunks WHERE chapter = ?'
      );
      expect(mockExecute.mock.calls[0][0].args).toEqual(['01']);

      await store.delete({});
      expect(mockExecute.mock.calls[1][0].sql).toBe('DELETE FROM hanif_academy_chunks');
    });

    it('count returns the row count as a number', async () => {
      mockExecute.mockResolvedValueOnce(makeResult(['count'], [[641]]));
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      await expect(store.count()).resolves.toBe(641);
      expect(mockExecute.mock.calls[0][0].sql).toContain('COUNT(*) AS count');
    });

    it('reset clears the table', async () => {
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      await store.reset();
      expect(mockExecute.mock.calls[0][0].sql).toBe('DELETE FROM hanif_academy_chunks');
    });
  });

  describe('error handling', () => {
    it('maps a missing table to an actionable migration error', async () => {
      mockExecute.mockRejectedValueOnce(
        Object.assign(new Error('no such table: main.hanif_academy_chunks'), { code: 'LIBSQL_ERROR' })
      );
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      await expect(store.count()).rejects.toThrow(
        'Vector store table "hanif_academy_chunks" does not exist. Run `npm run migrate:turso` first.'
      );
    });

    it('never leaks the auth token or database URL in errors', async () => {
      mockExecute.mockRejectedValueOnce(
        new Error(`authentication failed for token ${TOKEN} against ${URL}`)
      );
      const store = new TursoVectorStore({ url: URL, authToken: TOKEN });
      const error = (await store.count().catch((e) => e)) as Error;
      expect(error.message).not.toContain(TOKEN);
      expect(error.message).not.toContain(URL);
      expect(error.message).toContain('Vector store database error');
    });
  });
});

describe('buildTursoSchemaSql', () => {
  it('returns idempotent, non-destructive DDL with a native vector BLOB column', () => {
    const statements = buildTursoSchemaSql({ table: 'hanif_academy_chunks', dimensions: 1536 });
    expect(statements).toHaveLength(1);

    const meta = statements[0];
    expect(meta).toContain('CREATE TABLE IF NOT EXISTS hanif_academy_chunks');
    expect(meta).toContain('id             text PRIMARY KEY');
    expect(meta).toContain('has_code_blocks integer NOT NULL DEFAULT 0');
    expect(meta).toContain('embedding      BLOB NOT NULL');
    // Native BLOB column is dimension-agnostic — no float[N] in the DDL.
    expect(meta).not.toContain('float[');

    expect(statements.join('\n')).not.toMatch(/DROP|TRUNCATE/i);
  });

  it('rejects unsafe table names', () => {
    expect(() => buildTursoSchemaSql({ table: 'x; DROP TABLE y', dimensions: 1536 })).toThrow(
      'Invalid Turso table name'
    );
  });

  it('rejects invalid dimensions', () => {
    expect(() => buildTursoSchemaSql({ table: 'chunks', dimensions: 0 })).toThrow(
      'Invalid vector dimensions'
    );
    expect(() => buildTursoSchemaSql({ table: 'chunks', dimensions: -4 })).toThrow(
      'Invalid vector dimensions'
    );
  });
});
