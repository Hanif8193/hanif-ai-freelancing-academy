// M9 — Turso schema migration
// Run with: npm run migrate:turso
//
// Idempotent and non-destructive:
//   - CREATE TABLE IF NOT EXISTS hanif_academy_chunks (native vector BLOB
//     schema — Turso vector32()/vector_distance_cos; no vec0 extension).
//   - If the table already exists but lacks the `embedding` column (e.g. it
//     was created by an earlier broken migration), the column is added with
//     a plain ALTER TABLE ADD COLUMN — additive, never destructive.
// Existing rows are never dropped.
//
// Requires: VECTOR_STORE_TYPE=turso, TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.
// Dimensions (VECTOR_DIMENSIONS or the embedding provider default: Gemini
// gemini-embedding-001 = 768, OpenAI text-embedding-3-small = 1536) are
// printed for confirmation — the native BLOB column is dimension-agnostic,
// but all rows must share the embedding provider's dimension.

import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import type { Client } from '@libsql/client';
import { getConfig, validateConfig, getVectorDimensions } from '../src/rag/config';
import { buildTursoSchemaSql } from '../src/rag/providers/vector-store/turso';

dotenv.config();

/** Read a column by name from an array-like libsql row. */
function column(result: { columns: string[]; rows: ArrayLike<unknown>[] }, name: string): unknown {
  const index = result.columns.indexOf(name);
  return index >= 0 ? result.rows[0][index] : undefined;
}

async function ensureEmbeddingColumn(client: Client, table: string): Promise<void> {
  const info = await client.execute(`PRAGMA table_info(${table})`);
  const hasEmbedding = Array.from(info.rows).some((row) => {
    const idx = info.columns.indexOf('name');
    return idx >= 0 && String((row as ArrayLike<unknown>)[idx]) === 'embedding';
  });
  if (!hasEmbedding) {
    console.log(`  Adding missing embedding column to "${table}" (additive)...`);
    await client.execute(`ALTER TABLE ${table} ADD COLUMN embedding BLOB`);
    console.log('  OK');
  }
}

async function main() {
  console.log('Starting Turso schema migration...\n');

  try {
    const config = getConfig();
    validateConfig(config);

    if (config.vectorStoreType !== 'turso' || !config.tursoUrl) {
      throw new Error(
        'VECTOR_STORE_TYPE=turso and TURSO_DATABASE_URL are required to run the Turso migration.'
      );
    }

    const table = config.tursoTable || 'hanif_academy_chunks';
    const dimensions = getVectorDimensions(config);

    console.log('Configuration:');
    console.log(`  - Table: ${table} (native vector32 BLOB column)`);
    console.log(`  - Dimensions: ${dimensions}`);
    console.log('  - Connection: TURSO_DATABASE_URL (auth token never printed)\n');

    const client = createClient({
      url: config.tursoUrl,
      authToken: config.tursoAuthToken || undefined,
    });

    for (const sql of buildTursoSchemaSql({ table, dimensions })) {
      await client.execute(sql);
      console.log('  OK');
    }

    await ensureEmbeddingColumn(client, table);
    client.close();

    console.log(
      `\nMigration complete: "${table}" is ready for ${dimensions}-dimension vectors.`
    );
  } catch (error) {
    console.error('\nMigration failed:', error);
    process.exit(1);
  }
}

main();
