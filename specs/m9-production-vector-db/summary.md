# M9 — Production Vector Database Summary (Turso, native vectors)

## Milestone Overview

M9 adds a production **Turso Cloud** vector store behind the existing `VectorStore` interface. Production Ask the Book, Tutor, and MCP can target Turso (`VECTOR_STORE_TYPE=turso`) while local development keeps the JSON store (`VECTOR_STORE_TYPE=memory`, `data/vector-store.json`) as the untouched fallback.

**Decisions (human-approved / verified)**:
- PostgreSQL / Supabase / Neon / Railway / Render are **NOT used** — Turso Cloud with native vector search was chosen (`@libsql/client`, Vercel-function compatible).
- **Verified against the live database**: `vec0` virtual tables are **unavailable** (`no such module: vec0`), while Turso's **native vector functions** (`vector32`, `vector_distance_cos`) are available. The provider therefore uses native `vector32` BLOB columns — no vec0, no extension.

**Status: IMPLEMENTATION COMPLETE + VERIFIED** — 300/300 tests, typecheck 0 errors, build SUCCESS. The Turso database still needs the migration re-run (with OpenAI 1536) and the approved production ingestion.

## What Was Delivered

### New files
- `src/rag/providers/vector-store/turso.ts` — `TursoVectorStore` (all 7 interface methods) + `buildTursoSchemaSql`
- `scripts/migrate-turso.ts` — idempotent, non-destructive schema migration (`npm run migrate:turso`)
- `src/rag/providers/vector-store/__tests__/turso.test.ts` — 23 mocked tests

### Modified files
- `src/rag/providers/factory.ts` — `createVectorStore` supports `memory | chroma | turso` (postgres case removed from the active switch)
- `src/rag/config.ts` + `src/rag/types/index.ts` — `vectorStoreType: 'turso'`, `tursoUrl` (TURSO_DATABASE_URL), `tursoAuthToken` (TURSO_AUTH_TOKEN), `tursoTable` (TURSO_TABLE), `vectorDimensions` (VECTOR_DIMENSIONS); `validateConfig` requires URL + token for turso; `getVectorDimensions` (Gemini 768 / OpenAI 1536)
- `.env.example` (Turso + OpenAI production block), `README.md`, `package.json` (`@libsql/client`, `migrate:turso`), `tsconfig.json` (archived postgres migration excluded), M9 spec docs
- `.env` (local, gitignored) — **removed a duplicate `VECTOR_STORE_TYPE` key** (`memory` first, `turso` second; dotenv keeps the first, so the effective store was silently `memory`). Now a single `VECTOR_STORE_TYPE=memory` for local dev; production commands use an explicit `VECTOR_STORE_TYPE=turso` prefix.
- `src/rag/__tests__/provider-factory.test.ts` — +3 provider/dimension compatibility tests

### Preserved (reversible — not deleted)
- `src/rag/providers/vector-store/postgres.ts` + `__tests__/postgres.test.ts` (on disk, still passing)
- `scripts/migrate-pgvector.ts` (on disk, excluded from `tsc`)
- `pg` + `@types/pg` retained (the preserved postgres implementation imports them)

### Intentionally untouched
`VectorStore` interface · memory/chroma stores · retriever · RAGService · context assembler · ingestion pipeline/chunker/parser · Tutor modes · Translator · MCP tools · Vercel API adapter · frontend · `data/vector-store.json` (sha256 `234215a88b…` unchanged).

## Architecture

```
Local dev (unchanged):  VECTOR_STORE_TYPE=memory → InMemoryVectorStore → data/vector-store.json
Production (Vercel):   VECTOR_STORE_TYPE=turso  → TursoVectorStore → Turso Cloud (native vector32)
                                    │
                      existing VectorStore interface (unchanged)
                    Retriever → RAGService → Ask / Tutor / MCP (no logic changes)
```

### Turso schema (native vectors)
- Single table `hanif_academy_chunks`: `id text PRIMARY KEY`, `content`, metadata columns (`title`, `module`, `chapter`, `section`, `source_path`, `url`, `content_type`, `heading_level`, `chunk_index`, `start_line`, `end_line`, `has_code_blocks`), `embedding BLOB NOT NULL`.
- Embeddings written with Turso's native `vector32('[…dimensioned array…]')`; search uses `vector_distance_cos(embedding, vector32(?)) AS distance ORDER BY distance LIMIT ?`.
- The BLOB column is **dimension-agnostic** (dimension consistency is enforced at query time by `vector32`/`vector_distance_cos`) — so the 768 (Gemini) vs 1536 (OpenAI) choice is a config/ingestion concern, not a schema lock-in. `VECTOR_DIMENSIONS` / `getVectorDimensions()` is printed by the migration for confirmation.
- `CREATE TABLE IF NOT EXISTS` only — non-destructive. The migration additionally runs a safe **additive repair** (`ALTER TABLE ADD COLUMN embedding BLOB`) if an older table lacks the column.

### Provider semantics
- **Similarity contract**: Turso returns cosine **distance** (0 = identical); the store converts to the retriever contract — `similarity = 1 - distance`, clamped to `[0, 1]`. `Retriever.retrieve()` unchanged.
- All SQL **parameterized** — content, embeddings, and filter values are bound (`?` args), never interpolated (tested).
- upsert: single `INSERT … ON CONFLICT (id) DO UPDATE` with `vector32(?)`; embeddings validated before any write.
- `MetadataFilter` → bound WHERE conditions (`module`, `chapter`, `source_path`, `content_type`); empty filter = all rows (matches memory store).
- Lazy client via `createClient({ url, authToken })` — created on first use (serverless-friendly).
- Errors wrapped safely: missing table → `Run npm run migrate:turso first`; auth token and database URL redacted from every message.

## Configuration

`VECTOR_STORE_TYPE=memory` (local, default) · `VECTOR_STORE_TYPE=turso` (production) with:
- `TURSO_DATABASE_URL` (e.g. `libsql://…turso.io`) · `TURSO_AUTH_TOKEN` (**secret** — Vercel env, never committed/logged)
- `TURSO_TABLE` (default `hanif_academy_chunks`) · `VECTOR_DIMENSIONS` (default derived from the embedding provider: OpenAI 1536 / Gemini 768)

For OpenAI + Turso production: `EMBEDDING_PROVIDER=openai`, `OPENAI_EMBEDDING_MODEL=text-embedding-3-small`, `VECTOR_STORE_TYPE=turso`, `VECTOR_DIMENSIONS=1536`.

## Verified Database State (read-only probe, 2026-08-17)

| Check | Result |
|---|---|
| vec0 module | **UNAVAILABLE** (`no such module: vec0`) — the earlier vec0-based implementation could not work on this database |
| Native `vector32` | AVAILABLE |
| Native `vector_distance_cos` | AVAILABLE (same-vector distance ≈ 0) |
| `hanif_academy_chunks` table | EXISTS (created by the earlier failed migration) — **empty (0 rows)** |
| `hanif_academy_chunks_vec` table | DOES NOT EXIST (the vec0-era migration failed at the vec0 CREATE) |
| Failed Gemini ingestion partial rows | **NONE** — 0 rows in the metadata table (the 429 hit before any document completed embedding) |

**Consequence**: the metadata table exists but predates the native schema and lacks the `embedding` column — `npm run migrate:turso` now detects this and adds the column additively (no data to lose; the table is empty). Because the table is empty and the vec0 table never existed, there is no wrong-dimension lock-in.

## Security

`TURSO_AUTH_TOKEN` never committed/logged/printed · all SQL parameterized · filter values bound · error messages redact the token and URL · table name validated (`/^[a-z_][a-z0-9_]*$/`) · prompt-injection and all existing M4–M8 boundaries untouched.

## Migration / Production Ingestion Strategy (human steps — NOT run)

1. Database already exists in Turso Cloud (credentials in `.env`).
2. Run the migration with the OpenAI dimension (creates/mends the schema):
   ```bash
   EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run migrate:turso
   ```
   (idempotent; prints dimension; additive repair if needed).
3. Run the fresh production ingestion (requires the OpenAI key + quota):
   ```bash
   EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run ingest
   ```
   — fresh re-index of all docs (normalized paths, correct chapters, no duplicates).
4. Verify `count()`, spot-check chapters/paths, grounded Ask/Tutor/MCP.
5. Rollback: `VECTOR_STORE_TYPE=memory` (local JSON untouched); Turso rows droppable via `reset()`.

## Testing

- `turso.test.ts` — 23 mocked tests: lazy client creation (url + token), upsert SQL/params (`vector32(?)`, ON CONFLICT, missing-embedding fail-fast), search `vector_distance_cos` conversion + clamping + topK + bound filters, get/delete/count/reset (incl. empty-filter semantics), empty results, missing-table error, token/URL redaction, schema-builder validation.
- `provider-factory.test.ts` — updated incl. **provider/dimension compatibility guard**: OpenAI provider reports 1536, Gemini reports 768, and `createEmbeddingProvider(config).getDimensions() === getVectorDimensions(config)` for both.
- **Zero real Turso calls** — `@libsql/client` fully mocked in tests. (The only live connection this task made was the read-only verification probe, which made no writes.)
- Full suite: **300/300 pass (28 suites)**.

## Verification Gates

| Gate | Result |
|---|---|
| `npm test` | 300/300 pass |
| `npm run typecheck` | 0 errors |
| `npm run build` | SUCCESS |
| `data/vector-store.json` | sha256 `234215a88b…` unchanged (mtime `2026-08-17 14:36:42`) |
| `npm run ingest` | NOT executed |
| Real Turso calls | read-only probe only (no writes); tests fully mocked |
| Deploy / commits | not touched |

## Remaining Limitations / Next Human Actions

- The Turso table exists but is **empty and lacks the `embedding` column** — the user must re-run the migration (with `EMBEDDING_PROVIDER=openai`) so the additive repair adds the BLOB column.
- Production grounding requires the approved fresh ingestion once the OpenAI quota is available (Gemini free-tier embedding quota is exhausted).
- `pg`/`@types/pg` remain installed only because the preserved PostgreSQL implementation is still on disk; remove both in a later cleanup once the Turso switch is confirmed.
- **Next**: run the migration command → run the ingestion command (both provided in this summary) → end-to-end grounded verification on Vercel.

## Version

4.0.0 | Updated: 2026-08-17 | Status: Implementation + verification complete (native vectors) — awaiting migration re-run + approved production ingestion
