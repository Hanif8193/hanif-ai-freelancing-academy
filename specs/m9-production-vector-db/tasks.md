# M9 — Production Vector Database Tasks (Turso)

> **Status**: M9 IMPLEMENTATION COMPLETE (Turso) — all code tasks done and verified (298/298 tests, typecheck 0, build SUCCESS). Remaining items are human deployment steps (Turso Cloud setup + approved production ingestion).

## Phase 0: Specification (complete)
- [x] `specs/m9-production-vector-db/spec.md` created
- [x] `specs/m9-production-vector-db/plan.md` created
- [x] `specs/m9-production-vector-db/tasks.md` created (this file)
- [x] `specs/m9-production-vector-db/checklist.md` created
- [x] `specs/m9-production-vector-db/summary.md` created

## Phase 0b: Database Decision (complete — human-approved)
- [x] PostgreSQL / Supabase / Neon / Railway / Render rejected
- [x] **Turso Cloud** (native vector search, `@libsql/client`) chosen
- [x] Verified live: vec0 unavailable, native `vector32`/`vector_distance_cos` available → provider rewritten to native vectors
- [x] PostgreSQL implementation preserved on disk (reversible); removed from active config

## Phase 1: Dependency & Provider (complete)

### Task 1.1: Add the Turso client — DONE
- [x] `@libsql/client@^0.17.4` (official, Node build — Vercel Function compatible) installed; no ORM added
- [x] `pg` + `@types/pg` retained ONLY because the preserved postgres implementation still imports them (remove in a later cleanup after the switch is confirmed)

### Task 1.2: TursoVectorStore provider — DONE
- [x] `src/rag/providers/vector-store/turso.ts` implements all 7 VectorStore methods
- [x] Single table with native `embedding BLOB` column (`vector32()`); search via `vector_distance_cos(embedding, vector32(?)) AS distance ORDER BY distance LIMIT ?`
- [x] Cosine distance → similarity: `1 - distance` clamped to [0, 1] (retriever contract preserved; `Retriever.retrieve()` untouched)
- [x] upsert: `INSERT … ON CONFLICT (id) DO UPDATE` with `vector32(?)`; embeddings validated before any write
- [x] search/get/delete/count/reset on the single table; filters bound, never interpolated
- [x] get/delete/count/reset; `delete`/`reset` clear both tables (empty filter = all rows, matching memory store)
- [x] Lazy `createClient({ url, authToken })`; all SQL parameterized
- [x] Safe errors: missing table → `Run npm run migrate:turso first`; token + URL redacted

## Phase 2: Factory + Config (complete)

### Task 2.1: createVectorStore factory — DONE
- [x] `createVectorStore(config)` supports `memory | chroma | turso`; postgres case removed from the active switch (implementation preserved on disk)

### Task 2.2: Config + validation — DONE
- [x] `RAGConfig.vectorStoreType` gains `'turso'` (postgres removed); added `tursoUrl`, `tursoAuthToken`, `tursoTable`, `vectorDimensions`
- [x] `validateConfig` throws when `turso` without `TURSO_DATABASE_URL` or `TURSO_AUTH_TOKEN`
- [x] `getVectorDimensions()` — Gemini 768 / OpenAI 1536, `VECTOR_DIMENSIONS` override
- [x] `.env.example` documents the Turso variables (`TURSO_AUTH_TOKEN` flagged SECRET)

## Phase 3: Wire the construction path (complete)

### Task 3.1: Endpoints + MCP use the factory — DONE
- [x] `ask-endpoint.ts`, `tutor-endpoint.ts`, `mcp/services.ts` construct via `createVectorStore(config)` (already wired in the earlier M9 pass; only comments updated)

### Task 3.2: Ingest targets the configured store — DONE
- [x] `scripts/ingest.ts` builds the store via the factory (real `VECTOR_STORE_TYPE=turso npm run ingest` = separate approved production run)

## Phase 4: Migration script (complete)

### Task 4.1: migrate:turso — DONE
- [x] `scripts/migrate-turso.ts` + `npm run migrate:turso`
- [x] Idempotent: `CREATE TABLE IF NOT EXISTS` with `embedding BLOB`; dimension via `getVectorDimensions()` (informational — BLOB column is dimension-agnostic)
- [x] Additive repair: `ALTER TABLE ADD COLUMN embedding BLOB` when a stale table lacks the column (non-destructive)
- [x] Requires `VECTOR_STORE_TYPE=turso`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`; prints table + dimension
- [x] **Not executed** against any real database (none provided/approved — expected)
- [x] Archived `scripts/migrate-pgvector.ts` excluded from `tsc` (references removed config fields; still on disk, still runnable via `tsx`)

## Phase 5: Tests (complete — all mocked)

### Task 5.1: Provider tests (mocked @libsql/client) — DONE
- [x] `turso.test.ts` — 23 tests: client creation (url + token), upsert SQL/params + fail-fast, search conversion + clamping + topK + filters, get/delete/count/reset, empty results, missing-table error, token/URL redaction, schema builder

### Task 5.2: Factory/config + regression — DONE
- [x] `provider-factory.test.ts` updated — createVectorStore (memory/chroma/turso/error), validateConfig (turso requires URL + token), getVectorDimensions
- [x] Full regression: **298/298 green (28 suites)**

## Phase 6: Verify + Docs (complete)

### Task 6.1: Gates — DONE
- [x] `npm test` 298/298 · `npm run typecheck` 0 errors · `npm run build` SUCCESS
- [x] `data/vector-store.json` untouched (sha256 `234215a88b…`, mtime unchanged) · `npm run ingest` NOT run

### Task 6.2: Docs — DONE
- [x] `specs/m9-production-vector-db/{checklist,summary,tasks}.md` updated; plan status updated
- [x] README: Turso Cloud setup (create database, migration, Vercel env, ingestion, rollback)

## Human Approval Gate (deployment — pending, not part of implementation)
- [ ] Owner sets env vars (`EMBEDDING_PROVIDER=openai`, `VECTOR_STORE_TYPE=turso`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `VECTOR_DIMENSIONS=1536`)
- [ ] Owner runs `EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run migrate:turso`
- [ ] Owner approves + runs the fresh production ingestion (`EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run ingest`) once the OpenAI quota is available

## Task Summary

- Phase 0: 1 task — DONE
- Phase 0b: 1 task (database decision) — DONE
- Phase 1: 2 tasks — DONE
- Phase 2: 2 tasks — DONE
- Phase 3: 2 tasks — DONE
- Phase 4: 1 task — DONE
- Phase 5: 2 tasks — DONE
- Phase 6: 2 tasks — DONE
- Approval/deployment gate: 4 human steps — PENDING
