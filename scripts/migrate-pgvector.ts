// M9 — PostgreSQL + pgvector schema migration
// Run with: npm run migrate:pgvector
//
// Idempotent: enables the vector extension, creates the configured table
// (if it does not exist), and creates the HNSW cosine index (if it does
// not exist). No destructive operations by default — existing rows are
// never dropped.
//
// Requires: VECTOR_STORE_TYPE=postgres and POSTGRES_URL.
// Dimensions default to the configured embedding provider's dimensions
// (Gemini gemini-embedding-001 = 768, OpenAI text-embedding-3-small =
// 1536); override with PGVECTOR_DIMENSIONS.

import dotenv from 'dotenv';
import { Pool } from 'pg';
import { getConfig, validateConfig, getVectorDimensions } from '../src/rag/config';
import { buildPgvectorSchemaSql } from '../src/rag/providers/vector-store/postgres';

dotenv.config();

async function main() {
  console.log('Starting pgvector schema migration...\n');

  try {
    const config = getConfig();
    validateConfig(config);

    if (config.vectorStoreType !== 'postgres' || !config.postgresUrl) {
      throw new Error(
        'VECTOR_STORE_TYPE=postgres and POSTGRES_URL are required to run the pgvector migration.'
      );
    }

    const table = config.pgvectorTable || 'hanif_academy_chunks';
    const dimensions = getVectorDimensions(config);

    console.log('Configuration:');
    console.log(`  - Table: ${table}`);
    console.log(`  - Dimensions: ${dimensions}`);
    console.log('  - Connection: POSTGRES_URL (value never printed)\n');

    // Supabase requires SSL; max 1 connection (serverless-friendly).
    const pool = new Pool({
      connectionString: config.postgresUrl,
      max: 1,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false },
    });

    for (const sql of buildPgvectorSchemaSql({ table, dimensions })) {
      await pool.query(sql);
      console.log('  OK');
    }

    await pool.end();
    console.log(`\nMigration complete: table "${table}" is ready for ${dimensions}-dimension vectors.`);
  } catch (error) {
    console.error('\nMigration failed:', error);
    process.exit(1);
  }
}

main();
