# M8 — Production Readiness Plan

## Overview

Make the Academy deployable to Vercel with working AI features. The core change is narrow: expose the **existing** Express-style API handlers (`createAskEndpoint`, `createHealthEndpoint`, `createTutorEndpoint`) as Vercel Functions from a new root `api/` directory, add a thin shared adapter (body-size cap, basic rate limiting, explicit content-type handling), disable the Algolia placeholder, and document deployment. No M4/M5/M6/M7 source changes; the vector-store migration is a separate, explicitly-approved follow-up milestone.

**Current milestone status**: ✅ **IMPLEMENTED AND VERIFIED (2026-08-17)**. The plan below was executed per the approved spec; see `checklist.md`/`summary.md` for delivered state.

## Guiding Constraints

1. Do NOT modify `src/rag`, `src/tutor`, `src/translator`, `src/mcp`, or `src/pages` — import and adapt only.
2. Do NOT run `npm run ingest`; do NOT touch `data/vector-store.json`.
3. Zero new runtime dependencies where possible; if `@vercel/node` types are needed for the function entry, add as a devDependency only (decision in Phase 1).
4. All tests mocked — zero real AI calls, no quota consumed.
5. Frontend stays unchanged (same-origin `/api/…` fetches keep working).
6. No remote MCP, no vector-DB migration, no auth/payments in M8.

## Implementation Phases (planned, after approval)

### Phase 1: Vercel Functions scaffold
- Add `api/` directory: `api/ask.ts`, `api/ask/health.ts`, `api/tutor.ts` — each a thin Node `(req, res)` handler that delegates to the existing endpoint factories.
- Shared adapter in `api/_lib/` (or `src/vercel/`): body-size cap (16 KB → 413), JSON content-type handling, basic per-instance rate limiter (conservative defaults, env-configurable), and pass-through of the existing error mapping.
- Update `vercel.json` (pin Node 20.x; confirm static output + functions).
- Tests: adapter unit tests (routing, body cap, rate limit, JSON parse) with mocked services — zero real API calls.

### Phase 2: Configuration & search
- Remove the Algolia placeholder block from `docusaurus.config.ts` (documented decision: disable until real credentials exist).
- `.env.example`: document the production variables (Vercel env list + rate-limit knobs).
- `README.md`: deployment section (Vercel project setup, env vars, verification steps, local `vercel dev` workflow).

### Phase 3: Verification & docs
- `npm test` (214 baseline + new adapter tests), `npm run typecheck`, `npm run build`.
- Local simulation of the function routes (e.g. `vercel dev` if available, or direct handler invocation in a smoke script) — no AI calls.
- Update `specs/m8-production-readiness/checklist.md` + `summary.md` + `tasks.md`.
- Final report; document the Stage-2 vector-DB migration as the next milestone.

## Dependencies

- **New (implementation phase only)**: none at runtime; optionally `@vercel/node` (devDependency for types) — decision in Phase 1.
- **Reused (unmodified)**: `src/rag/api/ask-endpoint.ts` (createAskEndpoint/createHealthEndpoint), `src/tutor/api/tutor-endpoint.ts` (createTutorEndpoint), `src/rag/errors.ts` (mapProviderError), existing tests.

## Risks & Mitigations

1. **Vercel body-parsing differences** → the adapter explicitly handles JSON bodies and a size cap; unit-tested; local simulation before deploy.
2. **Rate limiting is per-instance** → document the limitation; a distributed limiter (Upstash) is a future option, not a blocker for a v1.
3. **Vector store absent from deploy** → Stage 2 (hosted vector DB) is the real fix; Stage 1 keeps the dev store local-only and documents that AI features on Vercel require the DB migration (or a committed store snapshot with its caveats — not recommended).
4. **Quota cost** → all new tests mocked; live verification is optional and quota-dependent (honest reporting if blocked).
5. **Broken search UI** → Algolia placeholder removed; search hidden until credentials exist.

## Success Criteria

- Vercel Functions serve `/api/ask`, `/api/tutor`, `/api/ask/health` reusing the existing handlers (delegation proven by tests; local simulation passes).
- Body cap + rate limiter + error mapping verified by tests; no secrets/raw errors exposed.
- Algolia placeholder removed; build/typecheck/tests green; frontend unchanged.
- `data/vector-store.json` untouched; `npm run ingest` not run; M4–M7 sources untouched.
- Full suite green (214 + new M8 tests); typecheck 0 errors; build SUCCESS.
- Deployment checklist + Stage-2 vector-DB migration documented as the next milestone.
