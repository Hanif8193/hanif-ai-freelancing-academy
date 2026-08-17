# M10 — Production Deployment & Operational Readiness Plan

## Overview

Deploy the verified M1–M9 state to Vercel and make the Academy operationally ready: production environment configuration, Turso ingestion workflow (gated on OpenAI quota), production verification of Ask the Book / Tutor / health, SEO (`robots.txt` + metadata/canonical/OG audit, sitemap already generated), lightweight analytics + uptime monitoring, GitHub Actions CI/CD, a production security review, repository URL corrections (`Hanif8193/hanif-ai-freelancing-academy`), and end-to-end production documentation. The MCP production strategy is documented (stdio kept; Streamable HTTP deferred). **Production ingestion is explicitly blocked on OpenAI embedding quota and is not part of the implementation until quota is available.**

**Current milestone status**: M10 **SPECIFICATION PHASE** — this document set is the spec; no implementation until human approval.

## Guiding Constraints

1. M4/M5/M6/M7/M8/M9 behavior and source remain untouched (`src/rag`, `src/tutor`, `src/translator`, `src/mcp`, `src/pages`, `api/`, `src/vercel`).
2. No new dependencies unless a verified need arises (robots.txt via static file; analytics/monitoring via existing platform options or a single small script).
3. No secrets created, modified, or exposed; `.env`/`.env.local` stay gitignored; `.env.example` placeholders only.
4. No `npm run ingest`; no `data/vector-store.json` modification (sha256 must stay `234215a88b1c0f524e223aab667c8a2be4365df18e9c7d7d6f16914c484c6fe1`).
5. No deploy, no commit/push during the specification phase; deployment and commit are separate human-approved steps.
6. OpenAI quota unavailability MUST NOT block SEO, CI/CD, security, or documentation work.
7. All repo URLs corrected to `https://github.com/Hanif8193/hanif-ai-freelancing-academy`.

## Implementation Phases (planned, after approval)

### Phase 1: Repository URL corrections
- `docusaurus.config.ts` — replace `github.com/hanif-ai/freelancing-academy` with `github.com/Hanif8193/hanif-ai-freelancing-academy` in docs editUrl, blog editUrl, navbar GitHub item, footer GitHub item.
- `README.md` — clone URL, Issues/Discussions links.
- Optional P3 cleanup: footer placeholder social links (`discord.gg/example`, `twitter.com/hanif-ai`) — either correct or remove; document decision.

### Phase 2: SEO
- Add `static/robots.txt` (Allow all + Sitemap: `https://hanif-ai-freelancing-academy.vercel.app/sitemap.xml`) — static file served by Docusaurus/Vercel; no dependency.
- Audit/verify metadata: title, description, canonical URLs, Open Graph tags, social-card image (`static/img/hanif-ai-social-card.jpg` — verify it exists and is referenced).
- Verify `sitemap.xml` still generated in `build/` after changes.
- Rebuild + re-verify `build/sitemap.xml` and `build/robots.txt` exist.

### Phase 3: CI/CD (GitHub Actions)
- Add `.github/workflows/ci.yml`: on push/PR → `actions/checkout@v4`, `setup-node@v4` (Node 20), `npm ci`, `npm test`, `npm run typecheck`, `npm run build`.
- No secrets needed for CI (tests are fully mocked).
- No auto-deploy step in M10 (deploy remains manual/human-approved); document how to add Vercel auto-deploy later if desired.

### Phase 4: Analytics + Monitoring (lightweight)
- **Decision to confirm with owner**: Vercel Analytics (built-in, no code) vs. Plausible (self-hosted script) vs. document-only.
- Uptime monitoring: `GET https://hanif-ai-freelancing-academy.vercel.app/api/ask/health` via a free uptime service (e.g. UptimeRobot) or documented manual check; health endpoint is a no-AI-call endpoint (M8).
- Keep it dependency-light; no enterprise observability.

### Phase 5: Security review (audit + document; fix only if a real issue is found)
- Re-sweep tracked files for secrets (`AIza…`, `sk-…`, `libsql://…` tokens, `postgresql://…` credentials) — confirm clean.
- Verify `.gitignore` covers `.env`, `.env.local`, `data/`.
- Document CORS posture (same-origin; note what would change if API moved cross-origin).
- Confirm rate limiting (per-instance, M8), 16 KB body cap, safe error mapping (no stack traces/secrets) — no code changes expected.
- Confirm prompt-injection `<academy_content>` boundaries intact.
- Fix only real issues discovered; otherwise record findings in the summary.

### Phase 6: Commit + Deploy + Verify (human-approved steps)
1. Human approval to commit M9 + M10 changes; `git commit` (no push unless approved) — then push so Vercel can build.
2. Set Vercel production env vars (names): `EMBEDDING_PROVIDER=openai`, `LLM_PROVIDER=openai`, `OPENAI_API_KEY` (secret), `OPENAI_EMBEDDING_MODEL=text-embedding-3-small`, `VECTOR_STORE_TYPE=turso`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (secret), optional `TURSO_TABLE`, `VECTOR_DIMENSIONS=1536`, optional `API_RATE_LIMIT_MAX` / `API_RATE_LIMIT_WINDOW_MS`.
3. Deploy (dashboard redeploy or `vercel --prod`; CLI requires login/token).
4. Production verification (no AI calls): `GET /`, `/ask-the-book`, `/tutor`, `/docs/` → 200; `GET /api/ask/health` → 200; `GET /api/ask` → 405; invalid JSON POST → 400; oversized POST → 413; repeated POST → 429; `/sitemap.xml` + `/robots.txt` → 200.

### Phase 7: Production ingestion (EXTERNALLY BLOCKED — do not run)
- Prerequisite: OpenAI embedding quota available (human confirmation).
- `EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run migrate:turso` (idempotent, already executed — re-run safe).
- `EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run ingest` (fresh re-index; normalizes paths, correct chapters, no stale duplicates).
- Verify: `count()` > 0 in Turso; grounded Ask the Book / Tutor responses with sources; MCP `searchAcademyContent` returns indexed content.
- This phase runs ONLY after explicit approval when quota is available.

### Phase 8: Documentation
- Update `README.md` (deployment/operations, env vars, SEO/analytics/CI sections, correct URLs).
- Finalize `specs/m10-production-deployment/{checklist,tasks,summary}.md` with actual results.

## Dependencies

- **New packages**: none expected. If `robots.txt`/metadata require a plugin, prefer a static file first (stop condition: no new dependency unless verified necessary).
- **Services (no code)**: Vercel (existing), Turso (existing), GitHub Actions (CI), optional analytics + uptime services (Phase 4 decision).
- **Reused (unmodified)**: M4 RAG, M5 Tutor, M6 Translator, M7 MCP, M8 Vercel Functions/adapter, M9 Turso provider/migration.

## Risks & Mitigations

1. **OpenAI quota unavailable** → ingestion (Phase 7) gated; all other M10 work proceeds; grounded verification deferred with a clear "externally blocked" marker. Not a blocker for spec/SEO/CI/security/docs.
2. **M9 uncommitted** → deployment blocked until human-approved commit/push; documented as a Phase-6 gate.
3. **Vercel CLI auth missing** → use dashboard deploy; CLI optional.
4. **CI flakiness (Node version)** → pin Node 20 in the workflow matching `engines.node >=20.0`.
5. **robots.txt/sitemap mismatch** → verify both in `build/` before deploy.
6. **Analytics vendor choice** → ask the owner; default to document-only or Vercel Analytics (zero-code) to avoid dependencies.
7. **Secret leakage** → keep sweep in CI? (Out of scope for M10 CI — keep CI dependency-free; manual sweep in Phase 5.)

## Rollback

- Every change in Phases 1–5 is small, reversible, and confined to config/docs/workflows — no application logic changes.
- The commit for M10 is separate from M9 content changes; a bad M10 deploy can be rolled back via Vercel to the previous deployment without code changes.
- `data/vector-store.json` and all M4–M9 source remain untouched, so the codebase is fully reversible to the current verified state.
