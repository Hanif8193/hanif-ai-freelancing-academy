# M9 — Production Vector Database Checklist (Turso)

> **Status**: M9 IMPLEMENTATION COMPLETE (Turso). All gates green (298/298 tests, typecheck 0, build SUCCESS). Turso Cloud setup + approved production ingestion remain human actions.

## Decision (human-approved)
- [x] PostgreSQL / Supabase / Neon / Railway / Render are **NOT used**
- [x] **Turso Cloud** with **native vector search** is the production vector store
- [x] Verified against the live DB: vec0 is unavailable, native `vector32`/`vector_distance_cos` are available → provider uses native vectors
- [x] PostgreSQL implementation **preserved on disk** (reversible), removed from the active configuration

## Implementation (complete)

### Provider
- [x] `src/rag/providers/vector-store/turso.ts` — `TursoVectorStore` implements all 7 `VectorStore` methods (name/upsert/search/delete/get/count/reset) using the official `@libsql/client`
- [x] Single table `hanif_academy_chunks` with a native `embedding BLOB` column (`vector32()`); search via `vector_distance_cos(embedding, vector32(?))` + `ORDER BY distance LIMIT ?`
- [x] Cosine **distance → similarity** conversion: `similarity = 1 - distance`, clamped to [0, 1]; `Retriever.retrieve()` unchanged
- [x] Fully parameterized SQL (filter values/content always bound); upsert = `INSERT … ON CONFLICT (id) DO UPDATE` with `vector32(?)`; embeddings validated before any write
- [x] Lazy client (`createClient({ url, authToken })`); missing table → `Run npm run migrate:turso first`; token + URL redacted from all errors

### Factory + Config
- [x] `createVectorStore(config)` supports `memory | chroma | turso` (postgres case removed from the active switch)
- [x] Config: `tursoUrl` (TURSO_DATABASE_URL), `tursoAuthToken` (TURSO_AUTH_TOKEN), `tursoTable` (TURSO_TABLE, default `hanif_academy_chunks`), `vectorDimensions` (VECTOR_DIMENSIONS)
- [x] `validateConfig` requires TURSO_DATABASE_URL + TURSO_AUTH_TOKEN for turso; `getVectorDimensions` (Gemini 768 / OpenAI 1536, env-overridable)
- [x] `.env.example` documents the Turso variables (`TURSO_AUTH_TOKEN` flagged SECRET)

### Wiring
- [x] `ask-endpoint.ts`, `tutor-endpoint.ts`, `mcp/services.ts`, `scripts/ingest.ts` construct the store via `createVectorStore(config)` (behavior unchanged for memory/chroma)

### Migration script
- [x] `scripts/migrate-turso.ts` + `npm run migrate:turso` — idempotent (`CREATE TABLE IF NOT EXISTS` with `embedding BLOB`), non-destructive, plus safe additive `ALTER TABLE ADD COLUMN embedding BLOB` repair for the stale empty table
- [x] **Not executed** against any real database (none provided/approved — expected)

### Tests (all mocked — zero real Turso calls)
- [x] `turso.test.ts` — 23 tests (client creation, upsert SQL/params + fail-fast, search conversion + clamping + topK + filters, get/delete/count/reset, empty results, missing-table error, token/URL redaction, schema builder)
- [x] `provider-factory.test.ts` updated — createVectorStore (turso), validateConfig (turso requires URL + token), getVectorDimensions
- [x] Full regression green — **298/298 tests (28 suites)**

### Verify + Docs
- [x] `npm test` 298/298 ✅ · `npm run typecheck` 0 errors ✅ · `npm run build` SUCCESS ✅
- [x] `data/vector-store.json` untouched — sha256 `234215a88b…` identical, mtime unchanged
- [x] `npm run ingest` NOT executed · no real Turso calls · no Turso Cloud resources · no Vercel env changes · no deploy · no commits
- [x] Checklist + summary + tasks + plan + README updated

## Verified Database State (read-only probe)
- [x] `hanif_academy_chunks` table EXISTS but is **empty (0 rows)** — no partial rows from the failed Gemini ingestion
- [x] vec0 module unavailable (`no such module: vec0`); native `vector32` + `vector_distance_cos` available
- [x] `.env` duplicate `VECTOR_STORE_TYPE` key removed (memory was silently effective; now a single `memory` for local dev)

## Human Action Gate (deployment — pending)
- [ ] Owner sets env (`EMBEDDING_PROVIDER=openai`, `VECTOR_STORE_TYPE=turso`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `VECTOR_DIMENSIONS=1536`)
- [ ] Owner runs `EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run migrate:turso` (additive repair adds the embedding column)
- [ ] Owner approves + runs the fresh production ingestion (`EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run ingest`) once the OpenAI quota is available

## Boundary Guard
- [x] `VectorStore` interface, retriever, RAGService, pipeline/chunker/parser untouched
- [x] No Tutor/Translator/MCP-tools/API-adapter/frontend changes
- [x] No auth/payments/remote MCP
- [x] No real Turso/API calls during tests
- [x] No secrets committed/logged
- [x] PostgreSQL implementation preserved on disk (reversible); `pg` deps retained for it
