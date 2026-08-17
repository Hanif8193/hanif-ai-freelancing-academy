# M10 — Production Deployment & Operational Readiness Tasks

> **Status**: M10 IMPLEMENTATION IN PROGRESS — Phases 1–5 + Phase 8 docs COMPLETE and verified (300/300 tests, typecheck 0, build SUCCESS). Phase 6 (commit/deploy) awaits human approval; Phase 7 (production ingestion) is externally blocked on OpenAI embedding quota.

## Phase 0: Specification (complete)
- [x] `specs/m10-production-deployment/spec.md` created
- [x] `specs/m10-production-deployment/plan.md` created
- [x] `specs/m10-production-deployment/tasks.md` created (this file)
- [x] `specs/m10-production-deployment/checklist.md` created
- [x] `specs/m10-production-deployment/summary.md` created
- [x] M1 roadmap vs. actual M8/M9 trajectory conflict resolved (see spec §1)

## Phase 1: Repository URL corrections (complete)

### Task 1.1: Fix `docusaurus.config.ts` URLs — DONE
- [x] docs editUrl → `https://github.com/Hanif8193/hanif-ai-freelancing-academy/tree/main/`
- [x] blog editUrl → same
- [x] navbar GitHub item → `https://github.com/Hanif8193/hanif-ai-freelancing-academy`
- [x] footer GitHub item → same
- [x] `organizationName` → `Hanif8193`, `projectName` → `hanif-ai-freelancing-academy` (GitHub Pages deploy config now matches the real repo)

### Task 1.2: Fix `README.md` URLs — DONE
- [x] Clone URL → `https://github.com/Hanif8193/hanif-ai-freelancing-academy.git`
- [x] Issues / Discussions links corrected

### Task 1.3: Footer placeholder links — DONE (decision: remove)
- [x] **Decision**: no real Discord/Twitter presence exists → placeholder links (`discord.gg/example`, `twitter.com/hanif-ai`) **removed** from the footer rather than pointed at fake URLs; GitHub retained. Re-add when real community links exist.

### Verification
- [x] `grep` sweep: no `hanif-ai/freelancing-academy`, `discord.gg/example`, or `twitter.com/hanif-ai` remains in `docusaurus.config.ts`, `README.md`, `src/`, `docs/`, `static/`, `sidebars.ts`, `.env.example`
- [x] No old URL in the production `build/` output

## Phase 2: SEO (complete)

### Task 2.1: robots.txt — DONE
- [x] Created `static/robots.txt` (allow-all + `Sitemap: https://hanif-ai-freelancing-academy.vercel.app/sitemap.xml`)
- [x] Verified `build/robots.txt` present after `npm run build`

### Task 2.2: Metadata / canonical / Open Graph audit — DONE
- [x] Title/description: `title` + `tagline` in `docusaurus.config.ts` → Docusaurus emits `<title>` + meta description (correct)
- [x] Canonical URLs: emitted automatically from site `url` (`https://hanif-ai-freelancing-academy.vercel.app`) + `baseUrl` (`/`) — correct
- [x] Open Graph / twitter tags: emitted by the preset from config — correct
- [x] **Social card — genuine issue found and fixed**: `themeConfig.image` referenced `img/hanif-ai-social-card.jpg` which **did not exist** (og:image would 404). Created a branded 1200×630 SVG (`static/img/hanif-ai-social-card.svg`) and updated the reference. Documented that a PNG export is recommended before launch for maximum social-platform support.
- [x] No other metadata gaps found

### Task 2.3: Sitemap — DONE
- [x] `build/sitemap.xml` generated (preset-classic default; verified 200+ URLs with the correct production origin)
- [x] Re-verified after all Phase 2 changes

## Phase 3: CI/CD (workflow created — execution pending push)

### Task 3.1: CI workflow — DONE (created)
- [x] `.github/workflows/ci.yml` created: on push to `master` + all PRs → checkout → setup-node (Node 20, npm cache) → `npm ci` → `npm test` → `npm run typecheck` → `npm run build`
- [x] No secrets in the workflow (tests fully mocked)
- [x] No auto-deploy step in M10 (documented as a future option)
- [ ] CI run green on GitHub — **pending**: requires commit + push (human approval, Phase 6)

## Phase 4: Analytics + Monitoring (documented — owner decision required)

### Task 4.1: Analytics decision — DOCUMENTED (not configured)
- [x] Documented in README (M10 Operations section): options ranked — Vercel Web Analytics (zero-code, free tier) / Plausible (privacy-first script) / document-only
- [ ] Owner decision + configuration — **blocked on human decision**; nothing purchased/configured (per task constraints)

### Task 4.2: Uptime monitoring — DOCUMENTED (not configured)
- [x] Documented recommended free procedure: UptimeRobot (or equivalent) check on `GET https://hanif-ai-freelancing-academy.vercel.app/api/ask/health` (no-AI-call endpoint); manual `curl -i` alternative expecting `200`
- [ ] External uptime check configured — **requires external account** (deferred by task constraints)

## Phase 5: Security review (complete — no fixes required)

### Task 5.1: Secrets audit — DONE
- [x] Tracked-file sweep (`git ls-files`): clean — only `.env.example` placeholders (`your_…_here`, commented `libsql://your-db-org.turso.io`) and synthetic test fixtures (`sk-test`, `libsql://academy-test-org.turso.io` in `provider-factory.test.ts`)
- [x] `.gitignore` covers `.env`, `.env.local`, `.env.*.local`, `/data`, `/build`, `/node_modules`, `.vercel`
- [x] `.env` confirmed NOT tracked (`git ls-files | grep '^.env$'` → 0)
- [x] `.env.example` placeholders only

### Task 5.2: Runtime posture review — DONE (no genuine issues)
- [x] CORS: same-origin architecture (frontend + `/api/*` on one origin) — no CORS policy needed today; documented in README
- [x] M8 protections verified in code (`src/vercel/adapter.ts`): method enforcement 405, 16 KB body cap 413, rate limiting 429 + `Retry-After`, safe 500 fallback (no stack traces) — covered by the existing M8 tests (all passing)
- [x] `API_RATE_LIMIT_MAX` / `API_RATE_LIMIT_WINDOW_MS` configurable
- [x] Prompt-injection `<academy_content>` boundary present (`src/tutor/prompts.ts`)
- [x] No code fixes required — findings recorded

## Phase 6: Commit + Deploy + Verify (BLOCKED — human approval)

- [ ] Human approval to commit M9 + M10 changes
- [ ] `git commit` (push only with explicit approval)
- [ ] Vercel production env vars configured (names: EMBEDDING_PROVIDER, LLM_PROVIDER, OPENAI_API_KEY, OPENAI_EMBEDDING_MODEL, VECTOR_STORE_TYPE, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, optional TURSO_TABLE/VECTOR_DIMENSIONS/API_RATE_LIMIT_*)
- [ ] Deploy (dashboard or `vercel --prod`)
- [ ] Production route verification (health 200, 405/400/413/429 matrix, pages 200, robots/sitemap 200)

## Phase 7: Production ingestion (EXTERNALLY BLOCKED — DO NOT RUN)

- [ ] **Gate**: OpenAI embedding quota available (human confirmation) — currently unavailable
- [ ] `EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run migrate:turso` (idempotent; already executed — safe to re-run)
- [ ] `EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run ingest` (fresh re-index)
- [ ] Verify Turso `count()` > 0 + grounded Ask/Tutor/MCP responses with sources

## Phase 8: Documentation (complete)

### Task 8.1: README — DONE
- [x] New "Operations — M10" section: SEO, CI/CD, Analytics & Monitoring (decision required), Security posture, MCP production strategy
- [x] Corrected all repository URLs
- [x] Fixed stale "Development Milestones" list (M1–M9 complete, M10 in progress)

### Task 8.2: M10 spec docs — DONE (this update)
- [x] `checklist.md` updated with actual implementation status
- [x] `tasks.md` updated with completion markers (this file)
- [x] `summary.md` updated with delivered state and blockers

## Final gates (verified 2026-08-17)
- [x] `npm test` — **300/300 pass (28 suites)**
- [x] `npm run typecheck` — **0 errors**
- [x] `npm run build` — **SUCCESS**; `build/robots.txt` + `build/sitemap.xml` + `build/img/hanif-ai-social-card.svg` present
- [x] `data/vector-store.json` sha256 unchanged: `234215a88b1c0f524e223aab667c8a2be4365df18e9c7d7d6f16914c484c6fe1`
- [x] `npm run ingest` NOT executed
- [x] No secrets exposed; no M4–M9 source modified
