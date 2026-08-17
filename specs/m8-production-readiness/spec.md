# M8 — Production Readiness & Deployment Architecture Specification

**Feature Branch**: `m8-production-readiness`
**Created**: 2026-08-17
**Status**: Draft (audit + specification only — no implementation)
**Input**: "Make the Academy production-ready: deploy `/api/ask` and `/api/tutor` to Vercel, evaluate the vector-store strategy, define the MCP production path, audit security, and produce a concrete deployment architecture."

---

## Milestone Boundary (READ FIRST)

| Layer | Status | Scope |
|---|---|---|
| M1–M3 Foundation & Content | ✅ Existing | Untouched |
| M4 RAG / Ask the Book | ✅ Existing | Untouched — retrieval source of truth |
| M5 Hanif AI Tutor | ✅ Existing | Untouched — tutoring source of truth |
| M6 Translator Agent | ✅ Existing | Untouched — translation source of truth |
| M7 MCP Integration | ✅ Existing | Untouched — stdio adapter; remote MCP is future work |
| **M8 Production Readiness** | 📝 **This milestone** | **Audit + specification.** Define the deployment architecture; do NOT implement until approved |

**Boundary guard**: do NOT modify `src/rag`, `src/tutor`, `src/translator`, `src/mcp`, or `src/pages`; do NOT run `npm run ingest`; do NOT touch `data/vector-store.json`; do NOT install packages during the spec phase; do NOT make real Gemini calls; do NOT expose secrets.

---

## 1. Current Architecture (as built — verified from the repository)

```
Browser (Docusaurus static pages)
  ├── /ask-the-book  ──► fetch('/api/ask')        [same-origin, relative URL]
  ├── /tutor         ──► fetch('/api/tutor')      [same-origin, relative URL]
  └── /docs/*        (static content)

DEVELOPMENT ONLY — Docusaurus dev server (npm run start, port 3000)
  └── configureWebpack → devServer.setupMiddlewares  (src/rag/api/plugin.ts, src/tutor/api/plugin.ts)
        ├── POST /api/ask        → createAskEndpoint()     (lazy singleton RAG stack)
        ├── GET  /api/ask/health → createHealthEndpoint()  (no live AI calls)
        └── POST /api/tutor      → createTutorEndpoint()   (lazy singleton Tutor stack)

PRODUCTION BUILD (npm run build → build/)  ← VERIFIED
  └── PURELY STATIC — build/ contains NO api/ directory
      → /api/ask, /api/tutor, /api/ask/health DO NOT EXIST in production

MCP (local only)
  └── npm run mcp → tsx src/mcp/server.ts (stdio transport, 7 tools)

Vector store
  └── data/vector-store.json — 6.6 MB, array of 641 chunks { id, content, metadata, embedding(768-dim) }
      - loaded SYNCHRONOUSLY in the InMemoryVectorStore constructor (readFileSync + JSON.parse)
      - persisted path is relative ("data/vector-store.json" → process.cwd())
      - gitignored (/data) → NOT present in any Vercel-from-git deploy
      - contains ~233 stale backslash-path duplicate chunks; chapter metadata "00" for most
      - backup copy: data/vector-store.backup.json

Deployment config
  └── vercel.json: framework "docusaurus", outputDirectory "build", buildCommand "npm run build"
  └── docusaurus.config.ts: url ...vercel.app, baseUrl "/", plugins [ragPlugin, tutorPlugin]
      (plugins only affect the dev server; harmless at build), Algolia PLACEHOLDER credentials
  └── package.json: engines node >=20.0; scripts test/typecheck/build/ingest/mcp
```

## 2. Verified Findings

### A. The API is dev-server middleware — it cannot deploy as-is
Both API endpoints are registered through `configureWebpack.devServer.setupMiddlewares`. Docusaurus applies this hook **only in `docusaurus start`**. `docusaurus build` emits static files; `vercel.json` deploys `build/`. **Consequence: a Vercel deployment today serves the static site and the AI features are dead (fetch to `/api/ask` returns the static host's 404).** This is the P0 problem M8 exists to solve.

### B. The Express-style handlers are reusable as Vercel Functions
`createAskEndpoint()`, `createHealthEndpoint()`, and `createTutorEndpoint()` are plain `(req, res)` handlers (Express-compatible, zero Express imports). Vercel Node Functions accept the same `(req, res)` signature. The same handlers can be exposed via a root `api/` directory with near-zero adapter code — the M4/M5/M6 logic is untouched and not duplicated.

### C. The JSON vector store does not fit Vercel's model
- `data/` is gitignored → the store is not in the repository → not available to a Vercel-from-git build.
- Even if committed, every cold start would `readFileSync` + `JSON.parse` 6.6 MB synchronously (~100–300 ms parse, tens of MB of memory for the parsed object + 768-dim float arrays), and the store carries ~233 stale duplicate chunks and `chapter: "00"` metadata (a clean re-ingest was already blocked by the exhausted Gemini embedding quota).
- The store is fine for **local development** and for a **long-running server** host, but is the wrong shape for serverless.

### D. Security state is good, with gaps
- ✅ No API keys in any tracked file (sweep clean: no `AIza…`, no `sk-…`).
- ✅ `.env` gitignored; `.env.example` contains placeholders only.
- ✅ Git history contains only the template initial commit (`.specify`/`.opencode` scaffolding) — no source or secrets.
- ✅ Prompt-injection boundary `<academy_content>` in place (M5/M6); MCP paths resolve only via the internal topics map.
- ✅ Provider errors mapped through M4 P0 `mapProviderError`; no stack traces/raw errors/keys to the browser.
- ⚠️ **No request body-size cap** (the dev middleware accumulates the body unboundedly).
- ⚠️ **No rate limiting** anywhere (once deployed, `/api/ask` and `/api/tutor` are open to abuse).
- ⚠️ **No CORS config** (fine same-origin today; needs scoping if the API ever moves cross-origin).
- ⚠️ No explicit content-type enforcement (non-JSON bodies are coerced to `{}` → 400; acceptable but should be explicit).
- ⚠️ Server logs use `console.error` with full error objects (no keys today; prefer structured logging in production).

### E. Algolia is a placeholder
`themeConfig.algolia` uses `appId: 'YOUR_APP_ID'` and `apiKey: 'YOUR_ALGOLIA_API_KEY'`. The production build succeeds (credentials are not validated at build time), but the search UI would fail at runtime with invalid credentials. Options: (1) **disable** the placeholder until real DocSearch credentials exist (recommended now), or (2) configure real Algolia/DocSearch credentials, or (3) replace with a free local search plugin (future decision — requires a package).

### F. Frontend is production-ready in isolation
Ask the Book and Tutor pages already have: 25 s client timeouts, quota/insufficient-info/generic error states, source cards, markdown rendering, dark mode, responsive layout, accessible labels, keyboard support. Only gap: API URLs are hardcoded to `/api/ask` and `/api/tutor` — correct for same-origin Vercel (functions are served under `/api/`), but should be configurable if `baseUrl` or the API host ever changes.

### G. MCP is local-only by design
stdio is the correct local/desktop transport (Claude Desktop, Cursor, VS Code). Remote clients need Streamable HTTP + authentication + rate limiting — documented as future work, not part of M8 implementation.

---

## 3. Production Architecture Recommendation

```
Vercel (single project, same origin — frontend unchanged)
  ├── Static: Docusaurus build/  (docs, /ask-the-book, /tutor, homepage)
  └── Functions: api/ directory (NEW, thin adapters over the EXISTING handlers)
        ├── api/ask.ts          → createAskEndpoint()       (POST /api/ask)
        ├── api/ask/health.ts   → createHealthEndpoint()    (GET /api/ask/health)
        └── api/tutor.ts        → createTutorEndpoint()     (POST /api/tutor)

  Env vars (Vercel project settings, never in repo):
    GEMINI_API_KEY / OPENAI_API_KEY, EMBEDDING_PROVIDER, LLM_PROVIDER,
    VECTOR_STORE_TYPE, and the vector-DB connection vars (Stage 2)

Shared server-side services (unchanged, imported only):
  M4 RAGService (provider factory + vector store)
  M5 TutorService (mode handlers)
  M6 TranslatorAgentImpl (provider boundary)

Vector store — staged strategy (no migration in M8 unless approved):
  Stage 1 (local/current): in-memory JSON store — keep for development.
  Stage 2 (recommended production): hosted vector DB behind the existing
    VectorStore interface — e.g. Supabase pgvector (Postgres, free tier) or
    an equivalent hosted option, with a new provider + ingestion path.
    Decouples data from deploys, removes the 6.6 MB cold-start load,
    and enables a clean re-ingest (fixing the stale/duplicate chunks).

MCP — staged strategy:
  Now: stdio (local) — unchanged.
  Future (M9+): Streamable HTTP server with auth + rate limiting (documented here, not implemented).

Search — recommended now: disable the Algolia placeholder (remove the algolia
  themeConfig block) until real credentials exist.
```

### Why Vercel remains the recommended target
- Static + Functions on one origin: the frontend's relative `/api/…` fetches keep working with **zero frontend changes**.
- Node 20+ runtime matches `engines`; functions auto-deploy from the `api/` directory.
- No server to operate; the existing handlers are already serverless-shaped (lazy singletons, no long-lived sockets, no AI calls at startup).
- The one architectural debt — where the vector data lives — is solved by Stage 2, not by abandoning Vercel.
- **Alternative considered** (documented, not chosen): a long-running Node host (Render/Railway/Fly) with a mounted `data/` directory — would keep the JSON store working but reintroduces server operations and costs; keep as a fallback only.

---

## 4. M8 Scope

### In scope (implementation phase, after approval)
- New `api/` Vercel Functions (`ask`, `ask/health`, `tutor`) that import and reuse the existing handlers; a thin shared adapter (body-size cap, basic rate limiting, JSON content-type handling).
- `vercel.json` updates (Node 20 pin, functions config, optional headers).
- Disable the Algolia placeholder until real credentials exist.
- `README.md` deployment documentation (env vars, Vercel setup, local verification).
- New tests for the function adapters, body cap, and rate limiter (all mocked — zero real API calls).
- Spec documents for the Stage-2 vector-DB migration (separate approved milestone to implement).

### Out of scope (M8 does NOT implement)
- Vector-DB migration (requires approval of Stage 2 as a follow-up milestone).
- Remote/Streamable HTTP MCP (M9+).
- Authentication, payments, subscriptions, user accounts, monetization.
- Algolia integration / any new search package.
- Any modification of `src/rag`, `src/tutor`, `src/translator`, `src/mcp`, `src/pages`, or the vector store.

---

## 5. Security Requirements (production)

1. API keys live only in Vercel environment variables — never in the repo, never in logs.
2. Request validation: question/topic/text length limits (reuse existing limits), method checks, and a **body-size cap** (e.g. 16 KB) in the function adapter.
3. **Basic rate limiting** in the function adapter (per-instance in-memory token bucket, conservative defaults, configurable via env) — a full distributed limiter (e.g. Upstash Redis) is a documented future option.
4. Error responses: reuse M4 P0 `mapProviderError`; no raw provider errors, stack traces, or keys (already the case — preserve it).
5. CORS: same-origin by default (no headers needed); if a cross-origin client is ever required, scope `Access-Control-Allow-Origin` explicitly and document it.
6. No arbitrary filesystem access: the functions read only the configured vector store; MCP file reads continue to resolve only via the internal topics map.
7. Prompt injection: `<academy_content>` reference-data boundary preserved (M5/M6) — no changes.
8. Logging: structured, minimal, key-free; full provider errors stay server-side only.
9. `vercel.json` / functions must never log request bodies or responses containing user content beyond normal operation.

---

## 6. Testing Strategy (implementation phase — all mocked, zero real API calls)

- Adapter unit tests: correct routing/method handling, body-size cap (oversized → 413), rate limit (burst → 429), JSON parse failure → 400.
- Handler reuse: the adapters call the existing `createAskEndpoint()` / `createTutorEndpoint()` handlers (mock the service layer exactly like the existing endpoint tests).
- Health endpoint unchanged behavior (`configured` / `initialized`, no live AI calls).
- Regression: full existing suite (M4 70 + M5/M6 108 + M7 36 = 214) stays green.
- Optional integration (needs credentials + approval): `vercel dev` local run + `vercel deploy --preview`, then verify `/api/ask/health` and a live POST (subject to Gemini quota).

---

## 7. Deployment Checklist (for the implementation milestone)

- [ ] `vercel.json`: pin Node 20.x; confirm `outputDirectory: build`; functions config as needed.
- [ ] Set Vercel env vars: `GEMINI_API_KEY` (or OpenAI equivalents), `EMBEDDING_PROVIDER`, `LLM_PROVIDER`, `VECTOR_STORE_TYPE`, vector-DB vars (Stage 2).
- [ ] Deploy; verify static pages (/, /docs, /ask-the-book, /tutor) load.
- [ ] Verify `GET /api/ask/health` → `configured`/`initialized` (no AI call).
- [ ] Verify `POST /api/ask` and `POST /api/tutor` return correct 200/400/429 shapes.
- [ ] Verify no CORS errors (same-origin) and no secrets in the deployed bundle or logs.
- [ ] Confirm `data/vector-store.json` was not modified; `npm run ingest` not run.
- [ ] Document the vector-store Stage 2 migration as the next milestone.

---

## 8. Acceptance Criteria (specification phase)

1. Current architecture documented with the verified finding that `/api/*` is dev-server-only. ✅
2. Production architecture recommendation explicit (Vercel static + Functions, same origin). ✅
3. Vector-store strategy evaluated (JSON vs Chroma vs hosted) with a staged recommendation. ✅
4. MCP production strategy evaluated (stdio now; Streamable HTTP + auth + rate limiting later). ✅
5. Security audit complete with P0/P1/P2 findings. ✅
6. Production configuration reviewed (vercel.json, env, CORS, logging, Node version). ✅
7. Frontend/UX reviewed against the production context (loading, timeouts, quota, a11y, SEO). ✅
8. Algolia placeholder decision made (disable until credentials exist). ✅
9. Concrete deployment checklist produced. ✅
10. No implementation performed: no code, no packages, no ingestion, no vector-store changes, no real Gemini calls. ✅

## Version

1.0.0 | Created: 2026-08-17 | Status: Draft (awaiting approval before M8 implementation)
