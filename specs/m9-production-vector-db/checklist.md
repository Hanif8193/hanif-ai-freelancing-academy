# M9 — Production Vector Database Checklist

> **Status**: M9 IMPLEMENTATION COMPLETE. All gates green (275/275 tests, typecheck 0, build SUCCESS). Production Supabase ingestion/deployment steps remain human actions (see Summary).

## Audit (complete)
- [x] Inspected `src/rag/providers/vector-store/` (interface, memory, chroma) — 7-method `VectorStore` interface documented
- [x] Inspected `src/rag/services/` (retriever contract: embed → search → minScore 0.3; 0–1 cosine scores)
- [x] Inspected `src/rag/config.ts` + `factory.ts` (no `createVectorStore` today; endpoints construct stores inline)
- [x] Inspected `scripts/ingest.ts` + `src/rag/ingestion/pipeline.ts` (hardcoded InMemoryVectorStore; idempotency matches normalized paths only → stale backslash duplicates never cleaned)
- [x] Inspected `data/vector-store.json` schema (array of 641 `{id, content, metadata, embedding}`; 768-dim; ~233 stale backslash-path duplicates; `chapter: "00"` on pre-fix chunks)
- [x] Inspected embedding dimensions (Gemini 768 / OpenAI 1536; `getDimensions()` available)
- [x] Inspected `src/tutor`, `src/translator`, `src/mcp`, `api/` (no vector-store coupling beyond the shared RAG stack)
- [x] Verified no `pg` driver installed; `engines.node >= 20`
- [x] Reviewed M1–M8 specs + README deployment docs

## Specification Documents
- [x] `spec.md` created
- [x] `plan.md` created
- [x] `tasks.md` created
- [x] `checklist.md` created (this file)
- [x] `summary.md` created

## Implementation (complete)

### Phase 1: Dependency & Provider
- [x] `pg@^8.23.0` + `@types/pg@^8.21.0` installed; tsx/ts-jest compatibility verified
- [x] `src/rag/providers/vector-store/postgres.ts` — `PostgresVectorStore` implements all 7 methods (parameterized SQL; cosine scoring `1 - (embedding <=> $1::vector)`; filter→WHERE binding; safe error wrapping; lazy `max: 1` SSL pool; missing-table → "run migrate" error; connection string/password redacted from errors)
- [x] `buildPgvectorSchemaSql` — idempotent DDL (extension, table, HNSW cosine index); validates table name + dimensions; never destructive

### Phase 2: Factory + Config
- [x] `createVectorStore(config)` added to `src/rag/providers/factory.ts` (memory | chroma | postgres; existing exports untouched)
- [x] `RAGConfig.vectorStoreType` gains `'postgres'`; added `postgresUrl`, `pgvectorTable` (default `hanif_academy_chunks`), `pgvectorDimensions`
- [x] `validateConfig` requires `POSTGRES_URL` for postgres (and `CHROMA_URL` for chroma); `getVectorDimensions()` derives 768/1536 from the embedding provider (env-overridable)
- [x] `.env.example` documents the new variables (placeholders only, `POSTGRES_URL` flagged SECRET)

### Phase 3: Wire the construction path
- [x] `src/rag/api/ask-endpoint.ts`, `src/tutor/api/tutor-endpoint.ts`, `src/mcp/services.ts` construct via `createVectorStore(config)` (memory/chroma behavior identical)
- [x] `scripts/ingest.ts` uses the factory (a real `VECTOR_STORE_TYPE=postgres npm run ingest` is a separate approved production run)

### Phase 4: Migration script
- [x] `scripts/migrate-pgvector.ts` + `npm run migrate:pgvector` — idempotent extension/table/index; dimension from `getVectorDimensions()`; prints table/dimension; requires `VECTOR_STORE_TYPE=postgres` + `POSTGRES_URL`
- [x] Migration script NOT executed (no real database available/approved — expected)

### Phase 5: Tests (mocked — zero real DB/API calls)
- [x] `src/rag/providers/vector-store/__tests__/postgres.test.ts` — 20 tests (pool construction, upsert SQL/params, search cosine + topK + filters, get/delete/count/reset, error mapping, secret redaction, schema builder)
- [x] `src/rag/__tests__/provider-factory.test.ts` extended — 11 new tests (`createVectorStore` ×4, `validateConfig` ×4, `getVectorDimensions` ×3)
- [x] Full regression green — **275/275 tests pass (27 suites)** = 244 baseline + 31 new

### Phase 6: Verify + Docs
- [x] `npm test` 275/275 ✅ · `npm run typecheck` 0 errors ✅ · `npm run build` SUCCESS ✅
- [x] `data/vector-store.json` untouched — sha256 `234215a88b…` identical, mtime unchanged
- [x] `npm run ingest` NOT executed · no real DB/API calls · no Supabase resources · no Vercel env changes · no deploy · no commits
- [x] Checklist + summary + tasks + README updated

## Human Action Gate (deployment — pending)
- [ ] Owner creates the Supabase project and sets Vercel env (`POSTGRES_URL`, `VECTOR_STORE_TYPE=postgres`)
- [ ] Owner runs `npm run migrate:pgvector` against the Supabase connection string
- [ ] Owner runs the approved production ingestion (`VECTOR_STORE_TYPE=postgres npm run ingest`) once the embedding quota is available

## Boundary Guard
- [x] No `src/rag` business-logic changes (interface, retriever, RAGService, pipeline, chunker, parser untouched)
- [x] No Tutor/Translator/MCP-tools/API-adapter changes (only the shared vector-store construction path)
- [x] No auth/payments/remote MCP
- [x] No real API/DB calls during tests
- [x] No secrets committed/logged
