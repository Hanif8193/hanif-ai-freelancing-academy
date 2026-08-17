# M5 — Hanif AI Tutor Summary

## Milestone Overview

M5 — Hanif AI Tutor is the Academy's AI teaching assistant. It implements an eight-mode Tutor (Ask, Teach, Explain, Practice, Quiz, Assessment, Learning Path, Translation) that **builds on the existing M4 RAG / Ask the Book architecture** — reusing the RAGService, retriever, vector store, context assembler, provider factory, error mapping, and Ask the Book UI patterns.

The milestone began as a specification (spec.md/plan.md/tasks.md/checklist.md/summary.md) and, after human approval, was **fully implemented and verified**: 148/148 tests, typecheck 0 errors, build SUCCESS, no M4 changes, no ingestion, vector store untouched.

## Key Decisions

### 1. Tutor is a teaching layer above M4, not a new knowledge system
- `TutorService` (new) sits between the API and the existing `RAGService`.
- Academy-related questions are grounded through the M4 pipeline → answers carry M4 `Source` citations.
- **Zero changes to `src/rag/`.** The provider abstraction (Gemini/OpenAI embedding + LLM) is preserved and reused.

### 2. Eight explicit modes with deterministic detection
- Mode chosen via UI selector and/or natural-language markers.
- Deterministic priority: Translation > Assessment > Quiz > Practice > Teach > Explain > Learning Path > Ask.
- LLM fallback only when ambiguous — keeps costs low (free-first).

### 3. Strict grounding rules
- Academy questions MUST use RAG; answers MUST cite sources; never fabricate chapters/sources/URLs.
- Missing info → explicit `insufficientInfo` + suggested topics (reuse M4 semantics).
- General knowledge is clearly labeled and separated from Academy-grounded content.
- Code examples are never presented as Academy content unless they come from the Academy.

### 4. Urdu via a reusable Translator boundary (M6-ready)
- M5 defines the `TranslatorAgent` interface (`translate`, `explain`) + a shared terminology glossary.
- Technical terms (Freelancing, AI Agent, RAG, MCP, API, GitHub, Repository, Specification, Implementation, Verification, Vector Database, VS Code, Spec-Kit) stay English-first with consistent Urdu phrasing.
- **M6 implements the actual Translator Agent; M5 ships the interface + glossary only.**

### 5. Structured TutorResponse (sections only when relevant)
`{ mode, language, level?, directAnswer?, explanation?, example?, exercise?, quiz?, assessment?, recommendedNext?, sources, grounded, insufficientInfo, suggestedTopics? }` — no forced empty sections.

### 6. Security by design
- Reuse M4 P0 error mapping (`AI_QUOTA_EXCEEDED`, `AI_PROVIDER_ERROR`, etc.) — no raw provider errors.
- Prompt-injection protection: retrieved content wrapped in `<academy_content>` delimiters and treated as reference data, never instructions.
- Input validation (≤ 500 chars, enum checks, bounded history ≤ 10); keys stay server-side.

### 7. Future-ready boundaries (documented, not built)
- **MCP (M7)**: placeholder tool names (`searchAcademyContent`, `getChapter`, `getSection`, `getLearningPath`, `generateQuiz`, `translateContent`, `getProjectInstructions`) map to M5 capabilities; each mode handler exposes a thin capability function.
- **Monetization**: free (limited questions) vs premium (personalized paths, advanced quizzes, project guidance) documented; limits kept configurable. No payments/auth in M5.

## Architecture

```
Browser (Tutor UI, reuses Ask the Book patterns)
   ↓ POST /api/tutor
TutorService (mode dispatch, grounding delegation, TranslatorAgent boundary)
   ↓
RAGService (EXISTING M4 — unchanged)
   ↓ Retriever → Vector Store → Context Assembler → LLM Provider
Grounded Answer + Sources
```

## Files Created (specification)

- `specs/m5-hanif-ai-tutor/spec.md`
- `specs/m5-hanif-ai-tutor/plan.md`
- `specs/m5-hanif-ai-tutor/tasks.md`
- `specs/m5-hanif-ai-tutor/checklist.md`
- `specs/m5-hanif-ai-tutor/summary.md`

## Files Created (implementation)

- `src/tutor/types.ts` — TutorRequest/TutorResponse/modes/Exercise/QuizItem/Assessment/RecommendedNext/GroundingClient
- `src/tutor/intent.ts` — deterministic mode/language/level detection + validators
- `src/tutor/glossary.ts` — 13 technical terms with Urdu phrasing (shared with M6)
- `src/tutor/topics.ts` — Academy chapter URL map (never fabricates links)
- `src/tutor/translator.ts` — `TranslatorAgent` interface boundary (M6-ready)
- `src/tutor/json.ts` — robust LLM JSON extraction
- `src/tutor/prompts.ts` — system prompts, grounding rules, `<academy_content>` delimiters
- `src/tutor/TutorService.ts` — orchestration above M4 RAGService
- `src/tutor/modes/` — ask, teach, explain, practice, quiz, assessment, learning-path, translation + registry
- `src/tutor/api/tutor-endpoint.ts` + `src/tutor/api/plugin.ts` — POST /api/tutor
- `src/pages/tutor.tsx` + `src/pages/Tutor.module.css` — Tutor UI (reuses Ask the Book styles)
- `src/components/Markdown.tsx` — safe markdown renderer (prism highlighting, no raw HTML)
- `src/tutor/__tests__/` — intent, json, prompts, translator, tutor-service, tutor-endpoint suites

## Files Modified

- `docusaurus.config.ts` — registered `tutorPlugin`, added "AI Tutor" navbar link
- `specs/m5-hanif-ai-tutor/checklist.md` — implementation tasks marked complete

Reused (unchanged): `src/rag/errors.ts`, `src/rag/services/rag-service.ts`, `src/lib/ask-the-book-errors.ts`, Ask the Book styles.

## Testing Strategy (defined — not implemented)

16 test categories: normal question, RAG-grounded answer, missing info, source citations, teach, explain, quiz, assessment, learning recommendations, EN↔UR, provider failure, quota failure, invalid input, timeout, security boundaries, M4 regression. **All mocked — zero real API calls.**

## Acceptance Criteria

1. M1–M4 architecture reviewed and documented
2. Tutor vision + 8 modes specified
3. RAG integration defined (reuses M4, no `src/rag` changes)
4. Grounding + source citation behavior defined
5. English/Urdu support + terminology rules specified
6. Translator boundary defined for M6
7. Quiz/practice/assessment behavior specified
8. Future MCP boundary defined
9. Security requirements defined (incl. prompt injection)
10. Testing strategy defined
11. Future revenue boundary defined
12. M6/M7 dependencies documented
13. No application code implemented
14. No M4 data modified

## Implementation Verification

- **Tests**: 148/148 (70 M4 regression + 78 M5) — all providers mocked, zero real API calls
- **Typecheck**: 0 errors
- **Build**: SUCCESS
- **Live smoke test**: `/tutor` serves 200; `/api/tutor` validation returns 400 without API calls; full pipeline returns fast 429 `AI_QUOTA_EXCEEDED` (Gemini embedding quota still exhausted — same as Ask the Book; grounded answers resume when the quota resets, no code changes needed)
- **Boundary guard**: no `src/rag` modifications, no `npm run ingest`, `data/vector-store.json` untouched, no M6 translator implementation, no M7 MCP, no payments/auth, no new packages

## Version

2.0.0 | Created: 2026-08-17 | Updated: 2026-08-17 (implementation complete)
