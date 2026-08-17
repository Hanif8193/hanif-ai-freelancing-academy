# M9 — Production Vector Database Plan

## Overview

Add a **Turso Cloud** vector store (native `vector32`/`vector_distance_cos` — vec0 was verified unavailable on the live database) behind the existing `VectorStore` interface, a `createVectorStore` factory, config/validation, an idempotent migration script, and a fresh re-index path — so production Ask the Book, Tutor, and MCP retrieve the same Academy knowledge from Turso while local development keeps the JSON store unchanged. (The earlier PostgreSQL/pgvector implementation is preserved on disk but is no longer the production choice.)

**Current milestone status**: M9 implementation **COMPLETE (Turso)** — all code tasks done and verified (298/298 tests, typecheck 0, build SUCCESS). **Database decision (human-approved)**: Turso Cloud native vector search replaces the earlier PostgreSQL/pgvector approach; the postgres implementation is preserved on disk for reversibility. Remaining steps are human deployment actions (Turso Cloud database + token, Vercel env, approved production ingestion). See `checklist.md` / `summary.md` for the delivered state.

## Guiding Constraints

1. `VectorStore` interface + memory/chroma stores unchanged; JSON store remains the local fallback.
2. No changes to retrieval/business logic (Retriever, RAGService, ContextAssembler, pipeline, chunker, parser).
3. No changes to Tutor, Translator, MCP tools, or the Vercel API adapter (only the vector-store construction path uses the shared factory).
4. All tests mocked — zero real DB/API calls, no quota consumed.
5. `POSTGRES_URL` is a secret — never committed/logged; set in Vercel env + local `.env`.
6. No auth/payments/remote MCP in M9.

## Implementation Phases (planned, after approval)

### Phase 1: Dependency & Provider
- Add `pg` (runtime) + `@types/pg` (dev) — verify Node 20+/tsx/ts-jest compatibility first (stop condition).
- `src/rag/providers/vector-store/postgres.ts` — `PostgresVectorStore` implementing all 7 interface methods with parameterized SQL:
  - upsert: `INSERT … ON CONFLICT (id) DO UPDATE`, embedding as `$n::vector` text cast
  - search: cosine `1 - (embedding <=> $1::vector) AS score`, filters → WHERE, `ORDER BY … LIMIT`
  - get/delete/count/reset (TRUNCATE)
  - filter→column mapping (`sourcePath`→`source_path`, etc.)
  - lazy `pg` Pool (`max: 1`), SSL per Supabase, bounded timeouts, safe error wrapping

### Phase 2: Factory + Config
- `src/rag/providers/factory.ts` — add `createVectorStore(config)` (memory/chroma/postgres) without touching existing exports.
- `src/rag/config.ts` + `src/rag/types/index.ts` — `vectorStoreType` gains `'postgres'`; add `postgresUrl`, `pgvectorTable` (default `hanif_academy_chunks`), `pgvectorDimensions`; `validateConfig` requires `POSTGRES_URL` for postgres.
- `.env.example` — document the new variables (placeholders).

### Phase 3: Wire the construction path
- `src/rag/api/ask-endpoint.ts`, `src/tutor/api/tutor-endpoint.ts`, `src/mcp/services.ts` — replace inline memory/chroma construction with `createVectorStore(config)` (behavior identical for memory/chroma; enables postgres in production).
- `scripts/ingest.ts` — build the store via the factory so `VECTOR_STORE_TYPE=postgres npm run ingest` populates Supabase.

### Phase 4: Migration script
- `scripts/migrate-turso.ts` (npm script `migrate:turso`) — idempotent `CREATE TABLE IF NOT EXISTS hanif_academy_chunks` with a native `embedding BLOB` column (dimension from `getVectorDimensions()`, env-overridable — printed for confirmation); plus a safe additive `ALTER TABLE ADD COLUMN embedding BLOB` repair when a stale table lacks the column. No vec0 extension.

### Phase 5: Tests (all mocked)
- `postgres.test.ts` (mocked `pg.Pool`): upsert/search/get/delete/count/reset SQL + params, score transform, filter translation, connection error mapping, missing-table error.
- factory + config/validate tests.
- ingest idempotency against the mocked store.
- Regression: 244 existing tests green.

### Phase 6: Verify + Docs
- `npm test`, `npm run typecheck`, `npm run build`.
- Local smoke against a provided dev Supabase URL (if the owner provides one) — `count()`, search, ingest dry-run; otherwise document the exact commands for deployment time.
- Update `specs/m9-production-vector-db/{checklist,tasks,summary}.md`; README Supabase setup section.

## Dependencies

- **New (implementation phase only)**: `pg` (runtime), `@types/pg` (devDependency).
- **Reused (unmodified)**: `VectorStore` interface, memory/chroma stores, embedding providers, Retriever, IngestionPipeline, RAGService, TutorService, MCP tools, Vercel adapter.

## Risks & Mitigations

1. **`pg` + tsx/ts-jest compatibility** → verify at Phase 1 start; stop if unresolvable.
2. **Dimension mismatch** → migration derives `<dim>` from the embedding provider; env-overridable.
3. **Quota for re-index** → Gemini exhausted today; use `EMBEDDING_PROVIDER=openai` or wait; never retry against the quota.
4. **Free-tier connection limits** → transaction pooler + `max: 1` pool per instance.
5. **Dirty store copy** → never copy the 641-chunk JSON; always fresh re-index.
6. **Rollback** → env switch to `memory`; local JSON untouched; table droppable via `reset()`.

## Success Criteria

- PostgresVectorStore passes all mocked tests; factory/config validated.
- `VECTOR_STORE_TYPE=postgres` works end-to-end in endpoints, Tutor, MCP, ingest.
- Migration script idempotent; fresh re-index yields normalized paths, correct chapters, no duplicates.
- 244 baseline + new tests green; typecheck 0; build SUCCESS; no secrets; JSON store untouched.
