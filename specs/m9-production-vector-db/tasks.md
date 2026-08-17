# M9 — Production Vector Database Tasks

> **Status**: M9 IMPLEMENTATION COMPLETE — all code tasks done and verified (275/275 tests, typecheck 0, build SUCCESS). Remaining items are human deployment steps (Supabase setup + approved production ingestion).

## Phase 0: Specification (complete)
- [x] `specs/m9-production-vector-db/spec.md` created
- [x] `specs/m9-production-vector-db/plan.md` created
- [x] `specs/m9-production-vector-db/tasks.md` created (this file)
- [x] `specs/m9-production-vector-db/checklist.md` created
- [x] `specs/m9-production-vector-db/summary.md` created

## Phase 1: Dependency & Provider (complete)

### Task 1.1: Add pg driver — DONE
- [x] `pg@^8.23.0` (runtime) + `@types/pg@^8.21.0` (dev) installed; Node 20+/tsx/ts-jest compatible

### Task 1.2: PostgresVectorStore provider — DONE
- [x] `src/rag/providers/vector-store/postgres.ts` implements all 7 VectorStore methods
- [x] upsert: `INSERT … ON CONFLICT (id) DO UPDATE` with bound params; embedding as `[0.1,0.2,…]` text
- [x] search: `1 - (embedding <=> $1::vector) AS score`, filter → WHERE, `ORDER BY … LIMIT topK`
- [x] get/delete/count/reset (TRUNCATE) with filter → column mapping (`sourcePath` → `source_path`)
- [x] Lazy `pg` Pool (`max: 1`, SSL, bounded timeouts)
- [x] Safe error wrapping: 42P01 → "run migrate" message; connection string/password redacted
- [x] `buildPgvectorSchemaSql`: idempotent, non-destructive DDL with validated table/dimensions

## Phase 2: Factory + Config (complete)

### Task 2.1: createVectorStore factory — DONE
- [x] `createVectorStore(config)` (memory/chroma/postgres) added; existing exports untouched

### Task 2.2: Config + validation — DONE
- [x] `RAGConfig.vectorStoreType` gains `'postgres'`; added `postgresUrl`, `pgvectorTable`, `pgvectorDimensions`
- [x] `validateConfig` throws when `postgres` without `POSTGRES_URL` (and `chroma` without `CHROMA_URL`)
- [x] `getVectorDimensions()` — Gemini 768 / OpenAI 1536, `PGVECTOR_DIMENSIONS` override
- [x] `.env.example` documents the new variables (`POSTGRES_URL` flagged SECRET, placeholders only)

## Phase 3: Wire the construction path (complete)

### Task 3.1: Endpoints + MCP use the factory — DONE
- [x] `src/rag/api/ask-endpoint.ts`, `src/tutor/api/tutor-endpoint.ts`, `src/mcp/services.ts` construct via `createVectorStore(config)`
- [x] Memory/chroma behavior identical (existing endpoint/MCP tests stay green)

### Task 3.2: Ingest targets the configured store — DONE
- [x] `scripts/ingest.ts` builds the store via the factory (real `VECTOR_STORE_TYPE=postgres npm run ingest` = separate approved production run)

## Phase 4: Migration script (complete)

### Task 4.1: migrate:pgvector — DONE
- [x] `scripts/migrate-pgvector.ts` + `npm run migrate:pgvector`
- [x] Idempotent: `CREATE EXTENSION IF NOT EXISTS vector`, `CREATE TABLE IF NOT EXISTS … embedding vector(<dim>)`, `CREATE INDEX IF NOT EXISTS … hnsw (embedding vector_cosine_ops)`; dimension via `getVectorDimensions()`
- [x] Requires `VECTOR_STORE_TYPE=postgres` + `POSTGRES_URL`; prints table + dimension
- [x] **Not executed** against any real database (none provided/approved — expected)

## Phase 5: Tests (complete — all mocked)

### Task 5.1: Provider tests (mocked pg Pool) — DONE
- [x] `postgres.test.ts` — 20 tests: pool creation, upsert SQL/params, search cosine + topK + filters, get/delete/count/reset, 42P01, secret redaction, schema builder

### Task 5.2: Factory/config + regression — DONE
- [x] `provider-factory.test.ts` extended — 11 new tests (createVectorStore, validateConfig, getVectorDimensions)
- [x] Full regression: **275/275 green** (244 baseline + 31 new)

## Phase 6: Verify + Docs (complete)

### Task 6.1: Gates — DONE
- [x] `npm test` 275/275 · `npm run typecheck` 0 errors · `npm run build` SUCCESS
- [x] `data/vector-store.json` untouched (sha256 `234215a88b…`, mtime unchanged) · `npm run ingest` NOT run

### Task 6.2: Docs — DONE
- [x] `specs/m9-production-vector-db/{checklist,summary,tasks}.md` updated; plan status updated
- [x] README: Supabase setup (create project, migration, Vercel env, ingestion, rollback)

## Human Approval Gate (deployment — pending, not part of implementation)
- [ ] Owner creates the Supabase project and sets Vercel env vars (`POSTGRES_URL`, `VECTOR_STORE_TYPE=postgres`)
- [ ] Owner runs `npm run migrate:pgvector` against the Supabase connection string
- [ ] Owner approves + runs the fresh production ingestion (`VECTOR_STORE_TYPE=postgres npm run ingest`) once the embedding quota is available

## Task Summary

- Phase 0: 1 task — DONE
- Phase 1: 2 tasks — DONE
- Phase 2: 2 tasks — DONE
- Phase 3: 2 tasks — DONE
- Phase 4: 1 task — DONE
- Phase 5: 2 tasks — DONE
- Phase 6: 2 tasks — DONE
- Approval/deployment gate: 3 human steps — PENDING
