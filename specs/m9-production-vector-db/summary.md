# M9 — Production Vector Database Summary

## Milestone Overview

M9 adds a **PostgreSQL + pgvector** provider (Supabase-ready) behind the existing `VectorStore` interface, plus a `createVectorStore` factory, config/validation, and an idempotent schema-migration script. Production Ask the Book, Tutor, and MCP can now target a hosted vector DB (`VECTOR_STORE_TYPE=postgres`) while local development keeps the JSON store (`VECTOR_STORE_TYPE=memory`, `data/vector-store.json`) as the untouched fallback.

**Status: IMPLEMENTATION COMPLETE.** All gates green — 275/275 tests, typecheck 0 errors, build SUCCESS. Only the human Supabase setup + approved production ingestion remain.

## What Was Delivered

### New files
- `src/rag/providers/vector-store/postgres.ts` — `PostgresVectorStore` (all 7 interface methods) + `buildPgvectorSchemaSql`
- `scripts/migrate-pgvector.ts` — idempotent schema migration (`npm run migrate:pgvector`)
- `src/rag/providers/vector-store/__tests__/postgres.test.ts` — 20 mocked tests

### Modified files
- `src/rag/providers/factory.ts` — added `createVectorStore(config)` (memory | chroma | postgres)
- `src/rag/config.ts` + `src/rag/types/index.ts` — `vectorStoreType: 'postgres'`, `postgresUrl`, `pgvectorTable`, `pgvectorDimensions`; `validateConfig` (POSTGRES_URL / CHROMA_URL required per type); `getVectorDimensions()` (Gemini 768 / OpenAI 1536, env-overridable)
- `src/rag/api/ask-endpoint.ts`, `src/tutor/api/tutor-endpoint.ts`, `src/mcp/services.ts` — construct the store via the factory
- `scripts/ingest.ts` — store via the factory
- `.env.example`, `README.md` (Supabase setup + env docs), `package.json` (`pg`, `@types/pg`, `migrate:pgvector` script), M9 spec docs

### Intentionally untouched
`VectorStore` interface · memory/chroma stores · retriever · RAGService · context assembler · ingestion pipeline/chunker/parser · Tutor modes · Translator · MCP tools · Vercel API adapter (`api/`, `src/vercel/`) · frontend · `data/vector-store.json` (sha256 `234215a88b1c0f524e223aab667c8a2be4365df18e9c7d7d6f16914c484c6fe1` — byte-for-byte unchanged).

## Architecture

```
Local dev (unchanged):  VECTOR_STORE_TYPE=memory → InMemoryVectorStore → data/vector-store.json
Production (Vercel):   VECTOR_STORE_TYPE=postgres → PostgresVectorStore → Supabase pgvector
                                    │
                      existing VectorStore interface (unchanged)
                    Retriever → RAGService → Ask / Tutor / MCP (no logic changes)

Migration:  docs/ → loader → parser → chunker → embedBatch → upsert (pipeline unchanged;
            store selected via createVectorStore(config)) — fresh re-index, idempotent
```

### Supabase / pgvector schema (`buildPgvectorSchemaSql`)
- `CREATE EXTENSION IF NOT EXISTS vector`
- `hanif_academy_chunks` table: `id text PK`, `content`, metadata columns (`title`, `module`, `chapter`, `section`, `source_path`, `url`, `content_type`, `heading_level`, `chunk_index`, `start_line`, `end_line`, `has_code_blocks`), `embedding vector(<dim>) NOT NULL` — `<dim>` from `getVectorDimensions()` (Gemini 768 / OpenAI 1536, `PGVECTOR_DIMENSIONS` override)
- `CREATE INDEX IF NOT EXISTS … USING hnsw (embedding vector_cosine_ops)`
- Idempotent and non-destructive (`IF NOT EXISTS` only; no DROP/TRUNCATE)

### Provider semantics
- All SQL **parameterized** — user-controlled values are bound, never interpolated (tested)
- Cosine similarity: `1 - (embedding <=> $1::vector) AS score`, `ORDER BY embedding <=> $1::vector LIMIT topK` — matches the retriever's 0–1 contract
- `MetadataFilter` → WHERE with bound params (`module`, `chapter`, `source_path`, `content_type`); empty filter = all rows (matches memory store)
- upsert = `INSERT … ON CONFLICT (id) DO UPDATE`; embeddings serialized as `[0.1,0.2,…]` text
- Lazy pool: `max: 1`, `ssl: { rejectUnauthorized: false }` (Supabase), 5 s connect / 30 s idle timeouts — serverless-friendly
- Errors wrapped safely: missing table (42P01) → `Run npm run migrate:pgvector first`; connection string + password redacted from any message

## Configuration

`VECTOR_STORE_TYPE=memory` (local, default) · `VECTOR_STORE_TYPE=postgres` (production) with:
- `POSTGRES_URL` — **secret**; never committed/logged; set in Vercel env + local gitignored `.env`
- `PGVECTOR_TABLE` (default `hanif_academy_chunks`) · `PGVECTOR_DIMENSIONS` (default derived from the embedding provider)

## Security

`POSTGRES_URL` never committed/logged · all SQL parameterized · filter values bound, never spliced · DB error messages redact the connection string/password · provider name/table validated (`/^[a-z_][a-z0-9_]*$/`) · prompt-injection and all existing M4–M8 boundaries untouched · no secrets in the client bundle or source.

## Migration / Production Ingestion Strategy (human steps — NOT run)

1. Create the Supabase project; set Vercel env: `POSTGRES_URL`, `VECTOR_STORE_TYPE=postgres`.
2. `npm run migrate:pgvector` (idempotent; prints table + dimension).
3. `VECTOR_STORE_TYPE=postgres npm run ingest` — **fresh re-index of all docs** (normalized paths, correct chapters, no duplicates) — requires the embedding quota (Gemini currently exhausted; `EMBEDDING_PROVIDER=openai` or wait).
4. Verify `count()`, spot-check chapters/paths, grounded Ask/Tutor/MCP.
5. Rollback: `VECTOR_STORE_TYPE=memory` (local JSON untouched).

## Testing

- `postgres.test.ts` — 20 mocked tests: lazy pool construction (max 1, SSL), upsert SQL/params/embedding serialization, no-op empty upsert, missing-embedding refusal, cosine score transform + topK + bound filters, get/delete/count/reset, 42P01 → actionable error, connection-string/password redaction, schema-builder validation (safe table names, dims, idempotent DDL)
- `provider-factory.test.ts` — 11 new: `createVectorStore` (memory/chroma/postgres/error), `validateConfig` (postgres/chroma requirements), `getVectorDimensions` (768/1536/override)
- **Zero real DB/API calls** — the `pg` Pool is fully mocked
- Full suite: **275/275 pass (27 suites)** = 244 baseline + 31 new

## Verification Gates

| Gate | Result |
|---|---|
| `npm test` | 275/275 pass |
| `npm run typecheck` | 0 errors |
| `npm run build` | SUCCESS |
| `data/vector-store.json` | sha256 `234215a88b…` unchanged (mtime `2026-08-17 14:36:42`) |
| `npm run ingest` | NOT executed |
| Real DB/API calls | none (tests mock everything) |
| Supabase / Vercel / deploy / commits | not touched |

## Remaining Limitations / Next Human Actions

- The pgvector **table does not exist anywhere yet** — the migration script must be run against the real Supabase connection string by the owner.
- Production grounding requires the approved fresh re-index once the embedding quota is available.
- Chroma validation is now strict (throws without `CHROMA_URL`) — a config-time improvement, not a runtime change.
- **Next**: owner creates the Supabase project + sets Vercel env → `npm run migrate:pgvector` → approved `VECTOR_STORE_TYPE=postgres npm run ingest` → end-to-end grounded verification on Vercel.

## Version

2.0.0 | Updated: 2026-08-17 | Status: Implementation complete — awaiting Supabase setup + approved production ingestion
