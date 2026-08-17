# M10 — Production Deployment & Operational Readiness Checklist

> **Status**: M10 IMPLEMENTATION IN PROGRESS — Phases 1–5 + Phase 8 complete and verified (300/300 tests, typecheck 0, build SUCCESS). Phase 6 (commit/deploy) awaits human approval; Phase 7 (production ingestion) is externally blocked on OpenAI embedding quota.

## Specification (complete)
- [x] `specs/m10-production-deployment/spec.md` created
- [x] `specs/m10-production-deployment/plan.md` created
- [x] `specs/m10-production-deployment/tasks.md` created
- [x] `specs/m10-production-deployment/checklist.md` created (this file)
- [x] `specs/m10-production-deployment/summary.md` created
- [x] M1 roadmap vs. actual M8/M9 trajectory conflict resolved (auth/monetization renumbered out; M10 = deployment + operational readiness)

## Deployment (FR-001, FR-002)
- [x] Vercel production env vars documented (names only — see plan Task 6.2 / README); no secrets in tracked files
- [ ] M1–M9 verified state committed (human approval) and pushed
- [ ] Latest state deployed to Vercel
- [ ] Production frontend pages load: `/`, `/ask-the-book`, `/tutor`, `/docs/`

## Production API verification (FR-003, FR-004)
- [x] M8 protections present in code (405 / 400 / 413 / 429 / 500, no stack traces/secrets) — covered by 30 passing M8 tests
- [ ] `GET /api/ask/health` → 200, no AI call (production)
- [ ] `GET /api/ask` → 405 (production)
- [ ] invalid JSON POST → 400 (production)
- [ ] oversized POST → 413 (production)
- [ ] repeated POST → 429 (production)

## Turso production readiness (FR-005)
- [x] (M9) `hanif_academy_chunks` table exists, ready for 1536-dim vectors — migration executed
- [ ] (M10) Confirmed row count / schema state in production (0 rows until ingestion)

## Ingestion workflow (FR-006, FR-007 — EXTERNALLY BLOCKED)
- [x] Workflow documented: `npm run migrate:turso` (idempotent) + `EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run ingest`
- [ ] OpenAI embedding quota available (human confirmation) — **currently unavailable; do not run**
- [ ] Production ingestion executed
- [ ] Turso `count()` > 0
- [ ] Grounded Ask the Book / Tutor responses with sources verified in production
- [ ] MCP `searchAcademyContent` returns indexed content

## SEO (FR-008 → FR-012)
- [x] `sitemap.xml` generated (verified in `build/`)
- [x] `robots.txt` created in `static/` and present in `build/`
- [x] Metadata (title/description) audited and correct
- [x] Canonical URLs correct (site url + baseUrl `/`)
- [x] Open Graph / social metadata verified; **social card fixed** (created branded SVG — reference previously pointed at a nonexistent `.jpg`)
- [ ] Production `/sitemap.xml` + `/robots.txt` return 200 (after deploy)

## Analytics + Monitoring (FR-013, FR-014)
- [x] Options documented in README (Vercel Web Analytics / Plausible / document-only) — **owner decision required; nothing configured**
- [x] Uptime procedure documented (free health-check on `/api/ask/health`) — **external account deferred**

## CI/CD (FR-015)
- [x] `.github/workflows/ci.yml` created (push to master + PRs; Node 20; `npm ci` → test → typecheck → build; no secrets)
- [ ] CI passes on the repository (pending commit + push)

## Security review (FR-016, NFR-001)
- [x] Tracked-file secret sweep clean (only `.env.example` placeholders + synthetic test fixtures)
- [x] `.gitignore` covers `.env`, `.env.local`, `data/`
- [x] `.env` confirmed not tracked
- [x] `.env.example` placeholders only
- [x] CORS posture documented (same-origin)
- [x] M8 protections confirmed in code: rate limit (429), body cap (413), method enforcement (405), safe errors
- [x] Prompt-injection boundaries intact (`<academy_content>`)

## Repository links (FR-017)
- [x] `docusaurus.config.ts` URLs corrected to `github.com/Hanif8193/hanif-ai-freelancing-academy` (editUrl ×2, navbar, footer, org/project name)
- [x] `README.md` URLs corrected (clone, issues, discussions)
- [x] Footer placeholder Discord/Twitter links **removed** (no real presence; decision recorded)

## MCP strategy (FR-018)
- [x] Documented: stdio supported (`npm run mcp`, 7 tools); Streamable HTTP deferred until auth/security requirements defined (README M10 section)

## Documentation (FR-019)
- [x] README "Operations — M10" section added (SEO, CI/CD, analytics/monitoring, security posture, MCP strategy)
- [x] Stale Development Milestones list fixed (M1–M9 complete, M10 in progress)
- [x] M10 spec docs updated with actual results

## Final gates (verified 2026-08-17)
- [x] `npm test` — **300/300 pass (28 suites)**
- [x] `npm run typecheck` — **0 errors**
- [x] `npm run build` — **SUCCESS**
- [x] `build/robots.txt`, `build/sitemap.xml`, `build/img/hanif-ai-social-card.svg` present
- [x] `data/vector-store.json` sha256 unchanged: `234215a88b1c0f524e223aab667c8a2be4365df18e9c7d7d6f16914c484c6fe1`
- [x] `npm run ingest` NOT executed
- [x] M4/M5/M6/M7/M8/M9 source untouched
