# M8 — Production Readiness Summary

## Milestone Overview

M8 makes the Academy's AI features deployable to Vercel. The verified headline finding — **the AI APIs (`/api/ask`, `/api/tutor`, `/api/ask/health`) were dev-server middleware and did not exist in production builds** — is fixed by exposing the **existing** Express-style handlers as Vercel Functions from a root `api/` directory, wrapped by a hardened adapter (16 KB body cap, per-instance rate limiting, method enforcement, safe errors). The Algolia placeholder was disabled, deployment documentation added, and the vector-store migration documented as a separate Stage-2 milestone. No M4/M5/M6/M7 source was modified.

**M8 is implemented and verified (2026-08-17).**

## Architecture (delivered)

```
Browser (unchanged) → static Docusaurus pages
  /ask-the-book → fetch('/api/ask')      /tutor → fetch('/api/tutor')     (same origin)
        │
PRODUCTION (Vercel, same origin):
  Static: build/ (Docusaurus)
  Functions (api/, Node 20.x):
    api/ask.ts        → POST /api/ask        → createAskEndpoint()     (M4 handler)
    api/ask/health.ts → GET  /api/ask/health → createHealthEndpoint()  (M4 handler, no AI calls)
    api/tutor.ts      → POST /api/tutor      → createTutorEndpoint()   (M5 handler)
  Shared edge (src/vercel/adapter.ts + rate-limit.ts; re-exported by api/_lib/):
    method checks (405) · body cap 16 KB (413) · JSON parsing (400 INVALID_JSON) ·
    per-instance rate limit (429 + Retry-After) · safe 500 fallback
DEV (unchanged): Docusaurus dev-server middleware serves the same routes locally.
```

- **Adapter**: `handleVercelRequest(req, res, handler, config)` — handles the Vercel pre-parsed `req.body` OR streams the body with a 16 KB cap; delegates to the existing handlers (single cast at the boundary); unexpected handler failures become a safe 500 (no stack traces/secrets).
- **Rate limiter**: `src/vercel/rate-limit.ts` — fixed-window per-instance limiter behind a replaceable `RateLimiter` interface; shared instance configured by `API_RATE_LIMIT_MAX` (default 30) / `API_RATE_LIMIT_WINDOW_MS` (default 60000); client key from `X-Forwarded-For` with socket fallback.
- **Logic location**: implementation lives in `src/vercel/` (unit-testable under the jest `src` roots); `api/_lib/*` re-export so the `api/` tree stays self-contained for the Vercel bundler.

## Files Created

- `api/ask.ts`, `api/ask/health.ts`, `api/tutor.ts`
- `api/_lib/adapter.ts`, `api/_lib/rate-limit.ts` (re-exports)
- `src/vercel/adapter.ts`, `src/vercel/rate-limit.ts`
- `src/vercel/__tests__/{rate-limit,adapter,routes}.test.ts`

## Files Modified

- `vercel.json` — static output config (buildCommand/outputDirectory/framework/installCommand); the initial `functions.runtime: nodejs20.x` pin was removed after the deployment API rejected it (that field is only for custom runtimes) — Node version follows `engines.node` (>=20) / the dashboard setting
- `docusaurus.config.ts` — Algolia placeholder removed (search disabled with a re-enable note)
- `.env.example` — production/Vercel settings + rate-limit knobs
- `README.md` — Deployment (Vercel) section (architecture, env vars, deploy/verify, limitations, search, MCP)
- `specs/m8-production-readiness/{checklist,tasks,summary,plan}.md`
- **`src/rag`, `src/tutor`, `src/translator`, `src/mcp`, `src/pages`, `data/vector-store.json`: untouched**

## Security (verified)

- No API keys in any tracked file (sweep clean on the new `api/` + `src/vercel/` too); `.env` gitignored; `.env.example` placeholders only.
- Adapter: body cap (413), method enforcement (405), invalid JSON (400), safe 500 with no stack traces, M4 P0 error mapping preserved inside the handlers (429 quota / 502 provider / 400 bad request / 405 method).
- Rate limiting per instance (429 + Retry-After) — documented limitation; replaceable interface for a hosted limiter later.
- Prompt-injection `<academy_content>` boundary, MCP path map, and all existing M4–M7 security boundaries untouched.

## Testing (delivered, all mocked — zero real API calls)

- **30 new M8 tests** (3 suites): rate limiter (window/reset/keys/env/client-key), adapter (parsing, 405/400/413/429, safe 500, pre-parsed + streaming paths, status().json shim), route wiring (ask/health/tutor contracts: 200, 400 INVALID_REQUEST, 429 AI_QUOTA_EXCEEDED, 502 AI_PROVIDER_ERROR, 500 INTERNAL_ERROR, 405; health = no AI call).
- **Full suite: 244/244 pass (26 suites)** — M4 70 + M5/M6 108 + M7 36 + M8 30.
- **Typecheck**: 0 errors. **Build**: SUCCESS.
- **Local route simulation** against the real `api/` files over node http (no AI calls): `GET /api/ask/health` → 200 · invalid JSON → 400 · oversized body → 413 · `GET /api/ask` → 405 · tutor invalid JSON → 400 · 4th request in window → 429. All passed.
- Vercel CLI 54.17.0 is available locally; a `vercel dev` / preview-deploy run remains a post-approval optional step (requires project auth).

## Data Safety

- `data/vector-store.json`: size/mtime/sha256 identical to the pre-implementation baseline (`234215a8…`, 6,632,138 bytes) — untouched.
- `npm run ingest` NOT executed.

## Remaining Limitations

- **Vector store**: the local JSON store is not deployed to Vercel (gitignored) — grounded answers on Vercel require the Stage-2 hosted vector DB (see recommendation below). Locally, Ask the Book / Tutor keep working from `data/vector-store.json`.
- **Rate limiting** is per serverless instance (in-memory); a hosted/distributed limiter is the future replacement (interface already in place).
- **Search** is disabled until real DocSearch/Algolia credentials exist.
- **MCP** remains stdio-only (remote Streamable HTTP = future milestone).
- Gemini embedding quota still exhausted — grounded live requests fail fast with `AI_QUOTA_EXCEEDED` until the quota resets.

## Stage-2 Vector Database Migration (recommendation — not implemented)

1. Add a hosted vector-store provider behind the existing `VectorStore` interface (e.g. **Supabase pgvector** on the free tier, or an equivalent hosted option) with `VECTOR_STORE_TYPE=pgvector` + connection env vars.
2. Add an ingestion path that populates the hosted index (reusing the M4 pipeline/parser/chunker — a clean reset + re-ingest also fixes the ~233 stale duplicate chunks and `chapter: "00"` metadata).
3. Keep the in-memory JSON store as the local-dev default; Vercel functions read the hosted index (no 6.6 MB cold-start load).
4. Re-verify Ask the Book / Tutor / MCP grounding end-to-end.

## Version

1.1.0 | Implemented & verified: 2026-08-17 | Status: ✅ Complete (Vercel Functions adapter over the existing M4/M5 handlers)
