# M8 — Production Readiness Checklist

> **Status**: ✅ IMPLEMENTED AND VERIFIED (2026-08-17). Audit + specification approved; implementation delivered per the approved spec.

## Audit (complete)
- [x] Full repository inspected (package.json, docusaurus.config.ts, vercel.json, src/rag, src/tutor, src/translator, src/mcp, pages, plugins, data/vector-store.json, tests, M4–M7 specs)
- [x] Verified `/api/*` is dev-server middleware only (production `build/` has no `api/` directory)
- [x] Verified the existing handlers are plain `(req, res)` — reusable as Vercel Functions
- [x] Verified vector-store format + deployability (6.6 MB JSON, gitignored `/data`, synchronous load)
- [x] Verified security state (no secrets; prompt-injection boundary; error mapping; gaps closed in implementation: body cap, rate limiting, content-type)
- [x] Verified Algolia placeholder (`YOUR_APP_ID` / `YOUR_ALGOLIA_API_KEY`)
- [x] Verified frontend readiness (timeouts, error states, a11y, dark mode, responsive; hardcoded same-origin `/api/…` kept working)
- [x] Verified MCP status (stdio local; remote is future work)
- [x] Verified Git history contains only the template initial commit (no secrets)

## Specification Documents
- [x] `spec.md` created · [x] `plan.md` created · [x] `tasks.md` created · [x] `checklist.md` created · [x] `summary.md` created

## Decisions (specified)
- [x] Production target: **Vercel static + Functions, same origin** (frontend unchanged)
- [x] Vector store: JSON for local dev; **hosted vector DB (pgvector/Supabase-class) is the Stage-2 production path** — no migration in M8
- [x] MCP: stdio now; Streamable HTTP + auth + rate limiting = future milestone
- [x] Algolia placeholder: **disabled**
- [x] API hardening: body-size cap (16 KB → 413) + per-instance rate limiter (→ 429) in the function adapter

## Implementation

### Phase 1: Vercel Functions — ✅ DONE
- [x] `api/ask.ts` → `createAskEndpoint()` (POST /api/ask)
- [x] `api/ask/health.ts` → `createHealthEndpoint()` (GET /api/ask/health, `parseBody: false`, no AI calls)
- [x] `api/tutor.ts` → `createTutorEndpoint()` (POST /api/tutor)
- [x] `api/_lib/adapter.ts` + `api/_lib/rate-limit.ts` (re-exports; logic in `src/vercel/` for jest testability)
- [x] `src/vercel/adapter.ts` — JSON parsing (pre-parsed + streaming paths), 16 KB body cap → 413, method checks → 405, safe 500 fallback (no stack traces)
- [x] `src/vercel/rate-limit.ts` — per-instance fixed-window limiter, env-configurable (`API_RATE_LIMIT_MAX` / `API_RATE_LIMIT_WINDOW_MS`), replaceable `RateLimiter` interface
- [x] `vercel.json` — static output config only; Node version follows `engines.node` (>=20) / dashboard setting (the initial `functions.runtime: nodejs20.x` declaration was removed post-deploy — that field is for custom runtimes and is rejected by the Vercel API)
- [x] `.env.example` — production/Vercel settings documented

### Phase 2: Configuration & Search — ✅ DONE
- [x] Algolia placeholder removed from `docusaurus.config.ts` (with a re-enable note)
- [x] `README.md` — Deployment (Vercel) section: architecture, env vars table, deploy/verify steps, known limitations, search + MCP notes

### Phase 3: Verification — ✅ DONE
- [x] 30 new mocked M8 tests (rate-limit, adapter, routes) — zero real API calls
- [x] Full suite: **244/244 pass (26 suites)** — M4 70 + M5/M6 108 + M7 36 + M8 30
- [x] `npm run typecheck` — 0 errors
- [x] `npm run build` — SUCCESS
- [x] Local route simulation against the REAL `api/` files (node http): health 200 (no AI call), invalid JSON 400, oversized 413, GET→405, tutor invalid 400, rate limit 429 — all passed
- [x] `data/vector-store.json` untouched (sha256 identical to pre-implementation baseline) · `npm run ingest` NOT run
- [x] `src/rag` / `src/tutor` / `src/translator` / `src/mcp` / `src/pages` unmodified (imported only)
- [x] Docs updated (this checklist + summary + tasks + plan)

## Boundary Guard
- [x] No vector-store migration in M8 (documented as Stage 2)
- [x] No remote MCP in M8
- [x] No payments/auth/accounts
- [x] No new runtime packages (zero new dependencies)
