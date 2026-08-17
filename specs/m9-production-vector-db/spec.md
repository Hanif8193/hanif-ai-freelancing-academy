# M9 — Production Vector Database / RAG Persistence Specification

**Feature Branch**: `m9-production-vector-db`
**Created**: 2026-08-17
**Status**: Draft (audit + specification only — no implementation)
**Input**: "M8 is live on Vercel but the local gitignored `data/vector-store.json` is not accessible to the serverless functions. Grounded Ask the Book / Tutor / MCP search needs a production-accessible hosted vector database. Prefer Supabase PostgreSQL + pgvector behind the existing VectorStore abstraction."

---

## Milestone Boundary (READ FIRST)

| Layer | Status | Scope |
|---|---|---|
| M1–M8 | ✅ Implemented & verified (244/244 tests, typecheck 0, build SUCCESS, Vercel live) | Untouched |
| M4 VectorStore interface + memory/chroma stores | ✅ Existing | **Interface preserved**; memory store untouched (local fallback) |
| **M9 Production Vector DB** | 📝 **This milestone** | Add a Supabase pgvector provider behind the existing abstraction + clean ingestion/migration |

**Boundary guard (audit phase, this document)**: no packages installed, no `src/rag`/`src/tutor`/`src/translator`/`src/mcp`/`api/` modifications, no `data/vector-store.json` changes, no `npm run ingest`, no real AI/API calls, no Supabase resource creation, no Vercel env changes, no deploy, no commits.

---

## 1. Problem Statement

M8 made the AI APIs deployable to Vercel, but the knowledge base lives in a **local, gitignored JSON file** (`data/vector-store.json`, 6.6 MB, 641 chunks, 768-dim embeddings). Serverless functions have no access to that file, so **grounded production Ask the Book / Tutor / MCP search cannot work on Vercel**. The fix is a hosted vector store reachable from serverless functions, behind the existing `VectorStore` interface so no retrieval/business logic changes.

## 2. Goals / Non-Goals

### Goals
1. Preserve the existing `VectorStore` interface (7 methods) and the memory/chroma stores.
2. Add a **Supabase PostgreSQL + pgvector** provider behind the abstraction (preferred; provider-agnostic if Supabase is rejected).
3. Keep the JSON store working as the **local-development fallback** (`VECTOR_STORE_TYPE=memory` default).
4. Give Ask the Book, Tutor, and MCP the same Academy knowledge from the hosted DB in production.
5. Provide a clean, idempotent **ingestion/migration** path that populates the hosted DB from `docs/` and **prevents the known stale duplicate chunks and `chapter: "00"` metadata problems** (fresh re-index, not a copy of the dirty JSON).
6. Reuse the existing embedding provider abstraction (Gemini 768-dim / OpenAI 1536-dim) — no re-embedding logic, no new embedding vendor.
7. Safe errors, no credential exposure, all tests mocked (no real DB/API calls).

### Non-Goals (M9)
- No authentication, payments, monetization, user accounts.
- No remote/Streamable HTTP MCP.
- No changes to Tutor, Translator, MCP, or Vercel API architecture (only the vector-store construction path in the endpoints/MCP services switches to the shared factory).
- No rewrite of the ingestion pipeline, chunker, parser, or retriever.
- No production data migration of the *dirty* JSON store as-is (it is the source of the duplicate/chapter bugs — a clean re-index from `docs/` replaces it).

## 3. Audit Findings (verified from the repository)

### A. Existing VectorStore interface — `src/rag/providers/vector-store/interface.ts`
```ts
interface VectorStore {
  name: string;
  upsert(chunks: Chunk[]): Promise<void>;
  search(embedding: number[], topK: number, filter?: MetadataFilter): Promise<SearchResult[]>;
  delete(filter: MetadataFilter): Promise<void>;
  get(filter: MetadataFilter): Promise<Chunk[]>;
  count(): Promise<number>;
  reset(): Promise<void>;
}
```
Implementations: `memory.ts` (JSON-persisted, cosine similarity, 0–1 score) and `chroma.ts` (ChromaDB, 1 − distance score). `MetadataFilter = { module?, chapter?, sourcePath?, contentType? }`.

### B. Chunk / record schema — `src/rag/types/index.ts`
```ts
Chunk = {
  id: string;                    // sha256 of sourcePath::section::chunkIndex (stable)
  content: string;
  metadata: { title, module, chapter, section, sourcePath, url,
              contentType, headingLevel, chunkIndex, startLine, endLine, hasCodeBlocks? };
  embedding?: number[];          // inline, 768-dim (Gemini) / 1536-dim (OpenAI)
}
```
`data/vector-store.json` = plain array of 641 such chunks (6.6 MB).

### C. Embeddings — `src/rag/providers/embedding/`
- `embedBatch(texts)` generates vectors; providers expose `getDimensions()`.
- Gemini `gemini-embedding-001`: **768 dims** (configurable via `dimensions`); OpenAI `text-embedding-3-small`: **1536 dims**.
- Both are compatible with pgvector `vector(n)` — **the column dimension must equal the configured provider's output dimension** (config-driven, see §5).

### D. Retrieval — `src/rag/services/retriever.ts`
`retrieve(query, filter?)` → `embeddingProvider.embed(query)` → `vectorStore.search(queryEmbedding, topK, filter)` → drop results below `minScore` (0.3). Scores are 0–1 similarity. **pgvector maps to this directly**: `1 - (embedding <=> $1::vector)` with `vector_cosine_ops`.

### E. Ingestion — `scripts/ingest.ts` + `src/rag/ingestion/pipeline.ts`
`npm run ingest` → `IngestionPipeline(embeddingProvider, InMemoryVectorStore, config, 'docs')` → load docs → parse → chunk → **idempotency check** (`get({ sourcePath: normalized })`, skip if same count) → `embedBatch` → `upsert`. Two defects to prevent in M9:
1. **Stale backslash-path duplicates**: the idempotency check only matches *normalized* paths, so ~233 chunks written with backslash `sourcePath`/`url` were never cleaned.
2. **`chapter: "00"` metadata**: chunks indexed before the title-fallback fix carry `chapter: "00"` (the parser now extracts "Chapter NN" from the document title — but the existing store predates it).
A **fresh re-index from `docs/`** (with the current parser/chunker/idempotency) produces normalized paths, correct chapters, and no duplicates — this is the migration mechanism.

### F. What must change to support Supabase pgvector
| Change | File | Type |
|---|---|---|
| New `PostgresVectorStore` (pgvector) | `src/rag/providers/vector-store/postgres.ts` | NEW |
| `createVectorStore(config)` factory | `src/rag/providers/factory.ts` | MODIFY (add, keep existing exports) |
| Config: `vectorStoreType: 'memory' \| 'chroma' \| 'postgres'` + `POSTGRES_URL` etc. | `src/rag/config.ts`, `src/rag/types/index.ts` (RAGConfig) | MODIFY |
| `validateConfig` requires `POSTGRES_URL` when `postgres` | `src/rag/config.ts` | MODIFY |
| Endpoints/MCP build the store via the factory (so production uses postgres) | `src/rag/api/ask-endpoint.ts`, `src/tutor/api/tutor-endpoint.ts`, `src/mcp/services.ts` | MODIFY (construction only) |
| Ingest targets the configured store | `scripts/ingest.ts` | MODIFY (use factory) |
| Idempotent table + index creation | `scripts/migrate-pgvector.ts` | NEW |
| `pg` driver dependency | `package.json` | ADD (runtime) + `@types/pg` (dev) |

**No changes to**: retriever, context assembler, RAGService, chunker, parser, loader, memory/chroma stores, Tutor modes, Translator, MCP tools, API adapter, frontend.

### G. Required environment variables
| Variable | Purpose |
|---|---|
| `VECTOR_STORE_TYPE` | `memory` (local default) \| `chroma` \| `postgres` |
| `POSTGRES_URL` | Supabase connection string (transaction-pooler URL recommended, port 6543, `sslmode=require`) — **never committed**; set in Vercel project env |
| `PGVECTOR_TABLE` | Optional; default `hanif_academy_chunks` |
| `PGVECTOR_DIMENSIONS` | Optional override; default derived from the embedding provider (Gemini 768 / OpenAI 1536) |

### H. Dimension compatibility
pgvector `vector(n)` requires a fixed dimension; Gemini 768 and OpenAI 1536 are both fine. The migration script derives the dimension from `createEmbeddingProvider(config).getDimensions()` (env-overridable) so the column always matches the provider in use.

### I. Safe migration of the knowledge base
**Recommended: fresh re-index** — reset the pgvector table, then `VECTOR_STORE_TYPE=postgres npm run ingest`. This regenerates embeddings from `docs/` with the current parser (normalized paths, correct chapters, idempotent upserts) — eliminating duplicates and `chapter: "00"`. Dependency: embedding quota (Gemini currently exhausted; the provider abstraction allows `EMBEDDING_PROVIDER=openai` or waiting for the Gemini quota). **Not recommended**: copying the existing 641-chunk JSON into pgvector (preserves the duplicate/chapter defects).

### J. Local development behavior (unchanged)
`VECTOR_STORE_TYPE` unset (default `memory`) → the existing `InMemoryVectorStore` + `data/vector-store.json` — identical local behavior.

### K. Vercel serverless → Supabase
- Use the **Supabase transaction pooler** URL (port 6543) with `sslmode=require` and `ssl: { rejectUnauthorized: false }` for the `pg` client (standard for Supabase).
- Small per-instance pool (`max: 1`), created lazily per function instance; connection errors map to the M4 P0 safe error layer.
- Table/index created once by `scripts/migrate-pgvector.ts` (idempotent `CREATE EXTENSION IF NOT EXISTS vector` / `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS`); the provider returns a clear error if the table is missing.
- Supabase project creation + Vercel env setup are **human actions** (deployment-time), not code.

## 4. Architecture (proposed)

```
Local dev (unchanged):           Production (Vercel):
  VECTOR_STORE_TYPE=memory         VECTOR_STORE_TYPE=postgres
  InMemoryVectorStore              PostgresVectorStore
  data/vector-store.json           Supabase Postgres + pgvector
         │                                  │
         └───── existing VectorStore interface (unchanged) ─────┘
                      Retriever → RAGService → Ask/Tutor/MCP
                      (no business-logic changes)

Ingestion/migration:
  docs/ → loader → parser → chunker → embedBatch → vectorStore.upsert
  (IngestionPipeline unchanged; vector store selected by config via createVectorStore)
```

### Supabase / pgvector schema
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS hanif_academy_chunks (
  id             text PRIMARY KEY,
  content        text NOT NULL,
  title          text NOT NULL,
  module         text NOT NULL,
  chapter        text NOT NULL,
  section        text NOT NULL,
  source_path    text NOT NULL,
  url            text NOT NULL,
  content_type   text NOT NULL,
  heading_level  integer NOT NULL,
  chunk_index    integer NOT NULL,
  start_line     integer NOT NULL,
  end_line       integer NOT NULL,
  has_code_blocks boolean NOT NULL DEFAULT false,
  embedding      vector(<dim>) NOT NULL          -- 768 (Gemini) / 1536 (OpenAI)
);

CREATE INDEX IF NOT EXISTS hanif_academy_chunks_embedding_hnsw
  ON hanif_academy_chunks USING hnsw (embedding vector_cosine_ops);
```
`<dim>` is derived at migration time from the embedding provider (env-overridable). HNSW index is optional for a 641-chunk corpus (a sequential cosine scan is fine at this size); included for scale.

### PostgresVectorStore → SQL mapping (provider sketch)
- `upsert(chunks)` → `INSERT … VALUES (…, $n::vector) ON CONFLICT (id) DO UPDATE SET …` (vector passed as `'[0.1,…]'` text and cast; `pg` has no native vector type).
- `search(embedding, topK, filter?)` → `SELECT …, 1 - (embedding <=> $1::vector) AS score FROM … [WHERE module=$x AND …] ORDER BY embedding <=> $1::vector LIMIT $2` → map rows to `Chunk` + score.
- `get(filter)` / `delete(filter)` / `count()` / `reset()` (TRUNCATE) → direct SQL with the same filter → WHERE translation (`source_path` maps from `sourcePath`, etc.).
- All SQL parameterized; metadata filter keys map to snake_case columns.

## 5. Configuration (implementation phase)

`src/rag/config.ts` / `RAGConfig` additions:
- `vectorStoreType: 'memory' | 'chroma' | 'postgres'`
- `postgresUrl?: string` (from `POSTGRES_URL`)
- `pgvectorTable?: string` (from `PGVECTOR_TABLE`, default `hanif_academy_chunks`)
- `pgvectorDimensions?: number` (from `PGVECTOR_DIMENSIONS`; default derived at runtime from the embedding provider)
- `validateConfig`: throw when `vectorStoreType === 'postgres'` and no `POSTGRES_URL`.

`.env.example`: document the new variables (placeholders only).

## 6. Security

- `POSTGRES_URL` is a **secret**: never committed, never logged; set only in Vercel project env + local `.env` (gitignored).
- The `pg` client never logs connection strings; connection errors map through the M4 P0 `mapProviderError` (no internals to the browser).
- All SQL is parameterized (no string interpolation of user input or filter values); table/column names come only from config defaults, never user input.
- Filter values (`module`, `chapter`, `sourcePath`, `contentType`) are bound parameters, not spliced into SQL.
- The prompt-injection `<academy_content>` boundary, MCP path map, and all existing M4–M8 security boundaries are untouched.

## 7. Error Handling & Connection Management

- Provider methods wrap `pg` errors and rethrow so `mapProviderError`/`safeToolError` produce stable codes (`AI_PROVIDER_ERROR`, `INTERNAL_ERROR`); no raw DB errors to clients.
- Missing table → clear actionable error ("run `npm run migrate:pgvector`").
- Pool: lazy, `max: 1` per instance (serverless-friendly), `connectionTimeoutMillis` bounded; on failure the endpoint returns the safe mapped error (no retry loops against the DB).
- Rollback: set `VECTOR_STORE_TYPE=memory` (or unset) → everything returns to the local JSON store; the pgvector table can be dropped (`reset()`/TRUNCATE) without touching local data.

## 8. Migration / Ingestion Strategy (implementation phase)

1. **Human actions**: create the Supabase project, enable pgvector (it is available by default in the SQL editor via `create extension vector`), set Vercel env vars (`POSTGRES_URL`, `VECTOR_STORE_TYPE=postgres`).
2. `npm run migrate:pgvector` → idempotent: create extension, table (`vector(<dim>)`), HNSW index; print dimensions used and table state.
3. **Fresh re-index**: `VECTOR_STORE_TYPE=postgres npm run ingest` → all 18 docs, normalized paths, correct chapters, no duplicates (idempotent upserts). *Requires embedding quota (Gemini currently exhausted — use `EMBEDDING_PROVIDER=openai` or wait; the code path is provider-agnostic).*
4. Verify: `count()` = expected chunk count per document; spot-check chapter/sourcePath values; MCP `getChapter`/`getSection` and Ask/Tutor grounded answers against the hosted DB.
5. **Rollback**: env switch back to `memory` (no data loss; `data/vector-store.json` untouched throughout).

## 9. Testing Strategy (implementation phase — all mocked, zero real API/DB calls)

- `PostgresVectorStore` unit tests with a **mocked `pg` Pool** (jest): upsert SQL + parameters, search (cosine score transform, filters, LIMIT), get/delete/count/reset, filter→WHERE translation, connection error mapping.
- Factory test: `createVectorStore` returns memory/chroma/postgres per config.
- Config/validate tests: `postgres` requires `POSTGRES_URL`; dimensions default correctly.
- Ingestion idempotency against the mocked store (skip-when-same-count; normalized-path behavior).
- Regression: existing 244 tests remain green (memory store untouched).
- No real Supabase connection, no real Gemini/OpenAI calls in tests.

## 10. Deployment Verification (implementation phase)

- Local: `VECTOR_STORE_TYPE=postgres` against a local/dev Supabase URL (if the owner provides one) — smoke `count()`, search, ingest dry-run.
- Vercel: after env is set, verify `GET /api/ask/health` (unchanged, no AI call), one grounded `POST /api/ask` (subject to embedding quota — fast `AI_QUOTA_EXCEEDED` 429 is expected if exhausted; a grounded 200 with sources is the success signal), Tutor + MCP search against the hosted DB.
- Confirm `data/vector-store.json` untouched and `npm run ingest` only ever run explicitly with the target store configured.

## 11. Acceptance Criteria

1. `VectorStore` interface unchanged; memory store + local JSON fallback work as before.
2. `PostgresVectorStore` implements all 7 methods with parameterized SQL and cosine scoring compatible with the retriever.
3. `VECTOR_STORE_TYPE=postgres` + `POSTGRES_URL` selects the provider in endpoints, Tutor, MCP services, and ingest.
4. Migration script is idempotent (extension/table/index) with provider-derived dimensions.
5. Fresh re-index produces normalized paths, correct chapter metadata, no backslash-path duplicates.
6. `validateConfig` guards `postgres` without `POSTGRES_URL`.
7. All tests mocked and green (244 baseline + new M9 tests); typecheck 0; build SUCCESS.
8. No secrets committed/logged; `POSTGRES_URL` documented as a Vercel env secret.
9. Rollback path documented and trivial (env switch to `memory`).
10. **Explicit human approval gate** before implementation begins.

## 12. Risks / Stop Conditions

- **Supabase rejected / pgvector unavailable** → STOP and re-decide the hosted store (architecture is provider-agnostic; alternatives: Turbopuffer, Qdrant Cloud, Pinecone, or a Postgres provider other than Supabase).
- **Embedding quota exhausted** (Gemini) → re-index is deferred or run with `EMBEDDING_PROVIDER=openai`; do NOT retry against the quota.
- **`pg` driver compatibility** with Node 20+/tsx/ts-jest → verify at implementation start; STOP if a driver issue can't be resolved within the repo's constraints.
- **Dimension mismatch** → mitigated by provider-derived `getDimensions()`; migration prints the dimension.
- **Free-tier connection limits on serverless** → use the transaction pooler + `max: 1` pool; document.
- Do NOT copy the dirty 641-chunk JSON into pgvector (it carries the duplicate/chapter defects).

## Version

1.0.0 | Created: 2026-08-17 | Status: Draft (audit + specification — awaiting human approval)
