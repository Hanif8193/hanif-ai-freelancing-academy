# M10 — Production Deployment & Operational Readiness Specification

**Feature Branch**: `m10-production-deployment`
**Created**: 2026-08-17
**Status**: Draft (specification only — no implementation until approved)
**Input**: "Complete the production deployment and operational readiness of Hanif AI Freelancing Academy: Vercel deployment + verification, production environment configuration, Turso vector-store readiness, ingestion workflow, Ask the Book / Tutor production verification, SEO, analytics, monitoring, GitHub Actions CI/CD, security review, repository URL corrections, MCP production strategy, and production documentation."

---

## Milestone Boundary (READ FIRST)

| Layer | Status | Scope |
|---|---|---|
| M1–M3 Foundation & Content | ✅ Implemented & verified | Untouched |
| M4 RAG / Ask the Book | ✅ Implemented & verified | Untouched — retrieval source of truth |
| M5 Hanif AI Tutor | ✅ Implemented & verified | Untouched — tutoring source of truth |
| M6 Translator Agent | ✅ Implemented & verified | Untouched — translation source of truth |
| M7 MCP Integration | ✅ Implemented & verified | Untouched — stdio adapter; remote MCP is future work |
| M8 Production Readiness | ✅ Implemented & verified | Untouched — Vercel Functions, adapter, rate limiting, safe errors |
| M9 Production Vector DB (Turso) | ✅ Implemented & verified | Untouched — provider + migration executed; production ingestion pending |
| **M10 Production Deployment** | 📝 **This milestone** | Deployment, operational readiness, SEO, analytics, monitoring, CI/CD, security review, docs |

**Boundary guard (specification phase, this document)**: no application implementation code changes, no packages installed, no `src/rag`/`src/tutor`/`src/translator`/`src/mcp`/`src/pages`/`api/`/`src/vercel` modifications, no `data/vector-store.json` changes, no `npm run ingest`, no deploy, no commit/push, no secret exposure or modification, no OpenAI/Gemini API calls, no purchase or configuration of an OpenAI key.

---

## 1. Conflict Resolution — M1 Roadmap vs. Actual Trajectory

The original M1 roadmap scheduled **M8 — Authentication & Learning Progress**, **M9 — Monetization**, and **M10 — Production Deployment** (infrastructure, monitoring, security, performance, SEO, analytics). The project's actual progression renumbered the milestones after M7 to match the implemented architecture:

| Roadmap item (M1 plan) | Actual milestone that absorbed it | Status |
|---|---|---|
| Production API deployability (Vercel Functions) | **M8 — Production Readiness** | ✅ Implemented |
| Production vector database | **M9 — Production Vector DB (Turso)** | ✅ Implemented (ingestion pending) |
| Authentication & Learning Progress (roadmap M8) | Future milestone | Deferred (not M10) |
| Monetization / payments (roadmap M9) | Future milestone | Deferred (not M10) |
| **Production deployment, monitoring, security, performance, SEO, analytics (roadmap M10)** | **M10 — this milestone** | 📝 Specified here |

**Resolution**: M10 is defined against the **current implemented architecture** — final deployment of the M1–M9 state, production verification, and the operational layer (SEO, analytics, monitoring, CI/CD, security review, documentation). Roadmap items renumbered out of M10 (auth, monetization, advanced agents, community) remain explicitly deferred.

## 2. Current Verified State (2026-08-17)

- **Codebase**: M1–M9 implemented. Gates green: **300/300 tests (28 suites), typecheck 0 errors, build SUCCESS** (re-verified during the discovery phase).
- **Production deployment**: live on Vercel — `https://hanif-ai-freelancing-academy.vercel.app` (`url` in `docusaurus.config.ts`). Static site + API Functions (`/api/ask`, `/api/ask/health`, `/api/tutor`) deployed; frontend fetches same-origin `/api/…`.
- **Turso**: `scripts/migrate-turso.ts` executed successfully — table `hanif_academy_chunks` exists and is ready for **1536-dimension** vectors (native `embedding BLOB` via `vector32`; schema dimension-agnostic). **Row count: 0** — no ingestion has run.
- **OpenAI**: `text-embedding-3-small` (1536 dims) configured; **embedding quota currently unavailable/insufficient** → production ingestion is **externally blocked**.
- **Git**: M9 changes are **uncommitted** (17 modified + 4 untracked files incl. `turso.ts`, `migrate-turso.ts`, M9 docs, M10 draft spec). Latest commit `adffeee` (M9 postgres — superseded by the Turso switch on disk). Do **not** commit/push without approval.
- **SEO**: `build/sitemap.xml` generated (preset-classic default). **`robots.txt` missing**. Default Docusaurus meta present; no explicit canonical/OG audit done.
- **Repo URLs**: `docusaurus.config.ts` (docs editUrl, blog editUrl, navbar GitHub, footer GitHub) and `README.md` (clone, issues, discussions) reference **`github.com/hanif-ai/freelancing-academy`** — the actual repository is **`github.com/Hanif8193/hanif-ai-freelancing-academy`**. These are incorrect (would 404 / point at the wrong repo).
- **CI/CD**: none — no `.github/` directory, no workflows; deploys are manual (`vercel` CLI / dashboard).
- **Analytics / monitoring**: none configured.
- **Search**: intentionally disabled (M8 — Algolia placeholder removed); re-enable is a future decision, not M10.
- **MCP**: stdio only (`npm run mcp`, 7 tools); Streamable HTTP deferred (needs auth/security requirements).
- **Rate limiting**: per-serverless-instance fixed-window limiter (M8); replaceable interface; hosted/distributed limiter deferred.

## 3. Problem Statement

The Academy is deployed and the core M1–M9 features are implemented, but production is not yet **operationally ready**: the production knowledge base is empty (ingestion pending), SEO is incomplete (no `robots.txt`), there is no analytics, monitoring, or CI/CD, repository links point at the wrong GitHub repo, and the production environment/operations are not documented end-to-end. M10 closes those gaps and verifies the deployed system.

## 4. Goals / Non-Goals

### Goals
1. Deploy the verified M1–M9 state to Vercel and verify frontend + API functions in production.
2. Document and validate the production environment configuration (env vars, secrets never committed).
3. Confirm Turso production readiness; define and gate the production ingestion workflow (explicitly blocked on OpenAI quota — not an M10 blocker for non-ingestion work).
4. Verify Ask the Book / Tutor / health in production (grounded retrieval after ingestion).
5. Complete SEO: sitemap (exists), `robots.txt` (missing), metadata, canonical URLs, Open Graph/social metadata.
6. Add lightweight analytics and monitoring/uptime.
7. Add GitHub Actions CI/CD (install → test → typecheck → build).
8. Perform a production security review (secrets, env handling, CORS, rate limiting, payload limits, error exposure).
9. Correct all repository URLs to `Hanif8193/hanif-ai-freelancing-academy`.
10. Document the production architecture and operational procedures (README + M10 docs).
11. Document the MCP production strategy: keep stdio; defer Streamable HTTP until authentication/security requirements are defined.

### Non-Goals (M10)
- No authentication, payments, monetization, user accounts, or usage limits.
- No Streamable HTTP / remote MCP implementation.
- No vector-store changes (Turso provider complete; ingestion is the only remaining data step).
- No Algolia/local search implementation.
- No hosted/distributed rate limiter.
- No enterprise observability stack.
- No custom-domain purchase or DNS work.
- No OpenAI purchase, billing, or quota changes.
- No changes to M4/M5/M6/M7/M8/M9 behavior or source.

## 5. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | The current M1–M9 application MUST be deployable to Vercel (static `build/` + `api/` Functions). | P0 |
| FR-002 | Production environment variables MUST be documented and configured WITHOUT committing secret values; `.env`/`.env.local` remain gitignored. | P0 |
| FR-003 | `GET /api/ask/health` MUST return a successful response in production without making AI calls. | P0 |
| FR-004 | Production API endpoints MUST preserve the M8 contract: 405 invalid method, 400 invalid JSON/request, 413 oversized body, 429 rate limit / AI quota, 502 provider failure, 500 safe fallback — no stack traces or secrets. | P0 |
| FR-005 | The production Turso database MUST contain the `hanif_academy_chunks` table ready for 1536-dimension vectors. | P0 |
| FR-006 | A documented production ingestion workflow MUST exist: `npm run migrate:turso` (idempotent) then `EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run ingest`; execution MUST remain gated on OpenAI embedding quota availability. | P0 |
| FR-007 | After ingestion, Ask the Book and Tutor MUST retrieve grounded answers with sources from the production Turso store; MCP `searchAcademyContent` MUST return the same knowledge. | P0 |
| FR-008 | The production website MUST expose a valid `sitemap.xml`. | P1 |
| FR-009 | The production website MUST provide a `robots.txt`. | P1 |
| FR-010 | Important pages MUST have correct title and description metadata. | P1 |
| FR-011 | Production pages SHOULD expose correct canonical URLs. | P1 |
| FR-012 | Production pages SHOULD provide Open Graph / social metadata and a working social-card image. | P1 |
| FR-013 | The production website SHOULD include lightweight, privacy-conscious analytics. | P2 |
| FR-014 | Production availability SHOULD be monitored via a lightweight uptime/health-check mechanism. | P2 |
| FR-015 | The repository MUST include a GitHub Actions CI workflow running install → test → typecheck → build on push/PR. | P1 |
| FR-016 | A production security review MUST be performed and documented: secrets, env handling, CORS, rate limiting, payload limits, error exposure, prompt-injection boundaries. | P0 |
| FR-017 | All repository links in the application and documentation MUST point to `github.com/Hanif8193/hanif-ai-freelancing-academy`. | P1 |
| FR-018 | The MCP production strategy MUST be documented: stdio supported; Streamable HTTP deferred until authentication/security requirements are defined. | P1 |
| FR-019 | Production architecture and operational procedures MUST be documented for future maintenance. | P1 |

## 6. Non-Functional Requirements

- **NFR-001 — Security**: no API keys, tokens, or database credentials committed to the repository; safe error responses only; no secret leakage in logs.
- **NFR-002 — Reliability**: the deployed build MUST pass the project gates (tests, typecheck, build) and the health endpoint must respond.
- **NFR-003 — Performance**: keep the static + serverless architecture; no heavy client bundles; no unnecessary dependencies.
- **NFR-004 — Maintainability**: configuration via documented env vars; no new infra without clear boundaries.
- **NFR-005 — Observability**: production failures discoverable via monitoring or logs.

## 7. Out of Scope (explicitly deferred)

User authentication · payments/monetization · usage limits · advanced freelancing AI agents (M11) · community features (M12) · Streamable HTTP MCP · Algolia/local search · hosted/distributed rate limiter · enterprise observability · custom-domain/DNS · OpenAI purchase or billing changes.

## 8. External Dependencies & Known Blockers

1. **OpenAI embedding quota unavailable/insufficient** → production ingestion (FR-006/FR-007) is **externally blocked**. This MUST NOT block M10 specification, planning, docs, SEO, CI/CD, or security work. Ingestion stays explicitly gated.
2. **M9 changes uncommitted** → deployment of the current state requires commit + push (human approval). Deployment is a Phase-6 step, not a spec-phase action.
3. **Vercel CLI credentials** — a `vercel login`/token may be needed for CLI deploys; dashboard deploys from Git work without it. Not a code blocker.
4. **Analytics/monitoring vendor choice** — lightweight option selection (e.g. Vercel Analytics vs. Plausible; uptime service) requires a documented human decision.

## 9. Acceptance Criteria

M10 is complete when:
1. The verified M1–M9 state is committed, pushed, and deployed to Vercel; frontend pages load; `/api/ask/health` returns 200 with no AI call.
2. M8 API contract verified in production (405/400/413/429/502/500 — no stack traces, no secrets).
3. Turso `hanif_academy_chunks` confirmed ready for 1536-dim embeddings (migration executed).
4. Production ingestion workflow documented and gated; executed and verified **only when OpenAI quota is available** (FR-006/FR-007 then confirmed with grounded Ask/Tutor/MCP responses + sources).
5. SEO: valid `sitemap.xml` + `robots.txt` deployed; metadata/canonical/OG audited and correct.
6. Lightweight analytics and uptime monitoring implemented or documented as configured.
7. GitHub Actions CI green on the repository (install/test/typecheck/build).
8. Security review completed and documented; no secrets exposed; CORS/rate-limit/payload behavior confirmed.
9. All repository URLs point to `Hanif8193/hanif-ai-freelancing-academy`.
10. MCP production strategy documented (stdio; Streamable HTTP deferred).
11. README + M10 docs complete; `data/vector-store.json` untouched; `npm run ingest` not executed without approval.

## 10. Verification Strategy

- Local gates: `npm test`, `npm run typecheck`, `npm run build` (all green before deploy).
- Production route verification (post-deploy, no AI calls): `GET /`, `/ask-the-book`, `/tutor`, `/docs/` → 200; `GET /api/ask/health` → 200; `GET /api/ask` → 405; invalid/oversized POST → 400/413; repeated POST → 429.
- SEO verification: fetch `/sitemap.xml` and `/robots.txt` from the production origin; inspect page metadata via the production HTML.
- CI verification: GitHub Actions workflow passes on a push/PR.
- Grounded verification (post-ingestion, quota permitting): Ask the Book and Tutor return grounded answers with sources; MCP `searchAcademyContent` returns indexed content.
- Integrity: `data/vector-store.json` sha256 `234215a88b1c0f524e223aab667c8a2be4365df18e9c7d7d6f16914c484c6fe1` unchanged; `npm run ingest` not executed without approval.

## 11. Files Expected to Change During Implementation

- `docusaurus.config.ts` — repository URLs (docs/blog editUrl, navbar/footer GitHub links); metadata/OG/canonical if audit requires.
- `static/robots.txt` — NEW (static file served by Docusaurus/Vercel).
- `README.md` — repository URLs, deployment/operations documentation.
- `.github/workflows/ci.yml` — NEW (install → test → typecheck → build).
- `specs/m10-production-deployment/*` — implementation status updates.
- Possibly: analytics config (`docusaurus.config.ts` or a static script), monitoring config, `.env.example` additions (non-secret).

**Must remain untouched**: `src/rag/`, `src/tutor/`, `src/translator/`, `src/mcp/`, `src/pages/`, `api/`, `src/vercel/`, `scripts/ingest.ts`, `scripts/migrate-turso.ts`, `data/vector-store.json`, `vercel.json` (unless a verified need arises), Turso provider/tests.
