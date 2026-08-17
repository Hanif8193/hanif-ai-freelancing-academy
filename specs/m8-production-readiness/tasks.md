# M8 — Production Readiness Tasks

> **Status**: ✅ IMPLEMENTED AND VERIFIED (2026-08-17). All tasks complete.

## Phase 0: Specification (complete)
- [x] `specs/m8-production-readiness/spec.md` created
- [x] `specs/m8-production-readiness/plan.md` created
- [x] `specs/m8-production-readiness/tasks.md` created (this file)
- [x] `specs/m8-production-readiness/checklist.md` created
- [x] `specs/m8-production-readiness/summary.md` created

**Acceptance Criteria**: ✅ Five documents exist; verified audit findings; production architecture decided; no code.

## Phase 1: Vercel Functions (implementation phase)

### Task 1.1: Function entry points — ✅ DONE
- [x] `api/ask.ts` → `createAskEndpoint()` (POST /api/ask)
- [x] `api/ask/health.ts` → `createHealthEndpoint()` (GET /api/ask/health, no AI calls)
- [x] `api/tutor.ts` → `createTutorEndpoint()` (POST /api/tutor)
- [x] Thin Node `(req, res)` adapters — zero new runtime dependencies

**Acceptance Criteria**: ✅ Functions delegate to the existing handlers; M4/M5/M6 logic untouched.

### Task 1.2: Shared adapter — ✅ DONE
- [x] `src/vercel/adapter.ts` (+ `api/_lib/adapter.ts` re-export) — JSON body handling + body-size cap (16 KB → 413)
- [x] `src/vercel/rate-limit.ts` (+ `api/_lib/rate-limit.ts` re-export) — per-instance fixed-window limiter (env-configurable, replaceable interface)
- [x] M4 P0 error mapping preserved (no raw errors/stack traces)

**Acceptance Criteria**: ✅ Oversized bodies rejected (413); bursts limited (429 + Retry-After); errors safe.

### Task 1.3: vercel.json + env docs — ✅ DONE
- [x] `vercel.json` — static output unchanged; Node version follows `engines.node` (>=20) / dashboard setting (the `functions.runtime: nodejs20.x` pin was removed post-deploy — rejected by the Vercel API; that field is for custom runtimes)
- [x] `.env.example` — Vercel env vars + `API_RATE_LIMIT_MAX` / `API_RATE_LIMIT_WINDOW_MS` documented

**Acceptance Criteria**: ✅ Config matches the recommendation; no secrets added.

## Phase 2: Configuration & Search (implementation phase)

### Task 2.1: Disable Algolia placeholder — ✅ DONE
- [x] Removed the placeholder `themeConfig.algolia` block from `docusaurus.config.ts` (with a re-enable note)

**Acceptance Criteria**: ✅ No `YOUR_APP_ID`/`YOUR_ALGOLIA_API_KEY` placeholders; build still succeeds.

### Task 2.2: Deployment docs — ✅ DONE
- [x] `README.md` Deployment (Vercel) section: architecture, env vars table, deploy + verify steps, known limitations, search + MCP notes

**Acceptance Criteria**: ✅ A new developer can deploy and verify in documented steps.

## Phase 3: Verification & Docs (implementation phase)

### Task 3.1: Tests (all mocked, zero AI calls) — ✅ DONE
- [x] Rate limiter unit tests (window/reset/keys/env/client-key)
- [x] Adapter tests (parsing, 405/400/413/429, safe 500, pre-parsed + streaming paths, status().json shim)
- [x] Route wiring tests (ask/health/tutor contracts incl. 429 AI_QUOTA_EXCEEDED / 502 AI_PROVIDER_ERROR / 500 INTERNAL_ERROR)
- [x] Full regression: 214 baseline + 30 new = **244/244 pass**

**Acceptance Criteria**: ✅ All tests pass with zero real API calls.

### Task 3.2: Local simulation — ✅ DONE
- [x] Simulated the real `api/` files over node http (no AI calls): health 200, invalid JSON 400, oversized 413, GET→405, tutor invalid 400, rate limit 429 — all passed

**Acceptance Criteria**: ✅ Routes behave as specified locally.

### Task 3.3: Gates + docs — ✅ DONE
- [x] `npm test` 244/244 · `npm run typecheck` 0 errors · `npm run build` SUCCESS
- [x] `data/vector-store.json` untouched (sha256 identical to baseline) · `npm run ingest` NOT run · M4–M7 sources unmodified
- [x] `specs/m8-production-readiness/checklist.md` + `summary.md` updated
- [x] Final report + Stage-2 vector-DB migration recommendation delivered

**Acceptance Criteria**: ✅ All gates pass; docs reflect delivered state.

## Task Summary

- Phase 0: 1 task (Specification) ✅
- Phase 1: 3 tasks (Functions + adapter + config) ✅
- Phase 2: 2 tasks (Search + docs) ✅
- Phase 3: 3 tasks (Tests + simulation + gates) ✅
- **Total: 8 implementation tasks + 1 specification task — ALL COMPLETE**
