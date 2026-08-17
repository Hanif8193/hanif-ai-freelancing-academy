# M5 — Hanif AI Tutor Checklist

> **Status**: ✅ M5 implementation COMPLETE (approved and delivered).
> Verification: 148/148 tests pass · typecheck 0 errors · build SUCCESS · no M4 changes · no ingestion · vector store untouched.

## Specification Documents
- [x] `spec.md` created
- [x] `plan.md` created
- [x] `tasks.md` created
- [x] `checklist.md` created (this file)
- [x] `summary.md` created

## Specification Review
- [x] M1–M4 architecture reviewed (specs/m1…m4, src/rag, Ask the Book, src/lib)
- [x] Tutor vision defined
- [x] Eight Tutor modes specified
- [x] RAG integration defined (reuses M4, no `src/rag` changes)
- [x] Grounding rules defined
- [x] Source citation behavior defined (reuse M4 `Source` shape)
- [x] English/Urdu support + terminology rules specified
- [x] Translator boundary (`TranslatorAgent` interface) defined for M6
- [x] Quiz/practice/assessment behavior specified
- [x] Future MCP boundary defined (placeholder tools)
- [x] Security requirements defined (incl. prompt-injection protection)
- [x] Testing strategy defined
- [x] Future revenue boundary defined (documented only)
- [x] M6/M7 dependencies documented
- [x] No application code implemented at spec time
- [x] No M4 data modified (vector store untouched, no ingestion run)

## Implementation Phase (COMPLETE)

### Phase 1: Types & Intent
- [x] `src/tutor/types.ts` created (TutorMode, TutorRequest, TutorResponse, Exercise, QuizItem, Assessment, RecommendedNext, GroundingClient)
- [x] `src/tutor/intent.ts` created (deterministic mode/language/level detection + validators)
- [x] `src/tutor/glossary.ts` + `src/tutor/topics.ts` created (terminology + Academy topic URL map)
- [x] Intent tests passing (mode table, priority order, Urdu deviation, overrides)

### Phase 2: TutorService & Modes
- [x] `src/tutor/TutorService.ts` created (orchestration above RAGService)
- [x] Ask + Teach handlers implemented
- [x] Explain + Practice + Quiz + Assessment handlers implemented
- [x] Learning Path handler implemented (real URLs only via topics map)
- [x] Translation boundary handler implemented (M6 message)
- [x] Mode handler tests passing (mocked providers, zero API calls)

### Phase 3: API
- [x] `POST /api/tutor` endpoint implemented (`src/tutor/api/tutor-endpoint.ts`)
- [x] Input validation (question ≤ 500, enums, bounded history) + M4 P0 error mapping
- [x] Plugin registration (`src/tutor/api/plugin.ts`) + `docusaurus.config.ts`
- [x] Endpoint tests passing (success, quota 429, provider 502, invalid input, 405)
- [x] `/api/ask` untouched

### Phase 4: Translator Boundary (M6-ready)
- [x] `TranslatorAgent` interface defined (`src/tutor/translator.ts`)
- [x] Glossary/terminology constants defined (13 terms, English-first with Urdu phrasing)
- [x] Boundary tests passing (interface contract + boundary message, no translation implementation)

### Phase 5: UI
- [x] `/tutor` page created (`src/pages/tutor.tsx` + `Tutor.module.css`) — chat, mode/language/level selectors, suggested prompts, source cards, assessment answer input
- [x] Safe Markdown renderer (`src/components/Markdown.tsx`, no dangerouslySetInnerHTML, prism highlighting, dark/light aware)
- [x] Urdu-ready (language selector; RTL-ready markup; terminology preservation)
- [x] Navbar link added ("AI Tutor")
- [x] Responsive + dark/light + accessibility (labels, focus-visible, aria-live, keyboard access)

### Phase 6: Security
- [x] Prompt-injection protection implemented (`<academy_content>` delimiters, reference-data rules) + adversarial tests passing
- [x] Input validation + limits enforced
- [x] No secrets in logs; error mapping reused (no raw provider errors)

### Phase 7: Verification
- [x] All tests pass — 148/148 (70 M4 regression + 78 M5)
- [x] `npm run typecheck` → 0 errors
- [x] `npm run build` → SUCCESS
- [x] Live smoke test: `/tutor` serves 200; `/api/tutor` validation 400; full pipeline 429 AI_QUOTA_EXCEEDED (fast, no leak) — grounded answers resume when the Gemini embedding quota resets
- [x] Confirmed: no `npm run ingest`, no vector store changes, no `src/rag` modifications

## Boundary Guard (must stay true at all times)
- [x] No M6 Translator Agent implementation (interface only)
- [x] No M7 MCP implementation (placeholder capability names only)
- [x] No payments/subscriptions/auth
- [x] No modifications to `src/rag/`
- [x] No changes to Ask the Book API/UI
- [x] No vector data changes
- [x] No new packages installed
