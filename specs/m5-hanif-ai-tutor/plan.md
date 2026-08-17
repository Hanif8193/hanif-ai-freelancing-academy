# M5 — Hanif AI Tutor Plan

## Overview

Implement the Hanif AI Tutor as a teaching layer **on top of the existing M4 RAG architecture**. The Tutor reuses the M4 provider factory, RAGService, retriever, vector store, context assembler, error mapping, and Ask the Book UI patterns. No changes to `src/rag/*` are permitted.

**Current milestone status**: ✅ M5 specification approved and **implementation complete** (148/148 tests, typecheck 0 errors, build SUCCESS). The phases below document the implementation as delivered.

## Guiding Constraints

1. Do NOT modify `src/rag/` (M4 RAG is frozen).
2. Do NOT modify the Ask the Book API contract or UI.
3. Keep the provider abstraction — no hard-coded AI vendor.
4. Reuse existing components/helpers (`src/lib/ask-the-book-errors.ts`, M4 `Source` shape, error mapping).
5. All tests use mocked providers — zero real API calls in tests.
6. Free-first: deterministic mode detection before LLM fallback; bounded history; no unnecessary retrieval.

## Implementation Phases (planned, after approval)

### Phase 1: Tutor Core Types & Intent Detection
- Define `TutorRequest`, `TutorResponse`, `TutorMode`, `Language`, `Level`, `Exercise`, `QuizItem`, `Assessment` types (`src/tutor/types.ts`)
- Implement deterministic mode/language/level detection (`src/tutor/intent.ts`) per spec priority order
- Unit tests for intent detection (all 8 modes + priority conflicts)

### Phase 2: TutorService & Mode Handlers
- `src/tutor/TutorService.ts` — orchestrates mode dispatch, grounds via RAGService, assembles TutorResponse
- Mode handlers: Ask, Teach, Explain, Practice, Quiz, Assessment, Learning Path (`src/tutor/modes/`)
- Level-aware prompt assembly; system prompt with grounding rules + injection protection delimiters
- Unit tests per mode (mocked RAGService + LLMProvider)

### Phase 3: API Layer
- `POST /api/tutor` endpoint registered via the existing Docusaurus plugin pattern (extend plugin or add `/api/tutor` alongside `/api/ask`)
- Input validation (question ≤ 500 chars, enum checks, bounded history ≤ 10)
- Error mapping — reuse `src/rag/errors.ts` (`AI_QUOTA_EXCEEDED`, `AI_PROVIDER_ERROR`, etc.); no raw provider errors
- Endpoint tests (mocked service): success, quota, provider failure, invalid input, method handling

### Phase 4: Translator Boundary (M6-ready)
- `src/tutor/translator.ts` — `TranslatorAgent` **interface** only: `translate(text, from, to, options)`, `explain(text, targetLanguage, level)`
- Glossary/terminology constants (English terms → Urdu phrasing) shared with future M6
- Boundary tests: Tutor routes translation requests through the interface; a stub/mock satisfies the contract
- **M6 implements the actual Translator Agent; M5 ships the interface + glossary only**

### Phase 5: Tutor UI
- `src/pages/tutor.tsx` + `Tutor.module.css` — chat interface, mode/language/level selectors, suggested questions, source cards, markdown rendering (Docusaurus prism), RTL support for Urdu
- Reuse Ask the Book patterns and `src/lib/ask-the-book-errors.ts` (timeout, quota, generic messages)
- Client-side conversation history (bounded); loading/error/quota/insufficient-info states
- Navbar link + responsive + dark/light + accessibility (WCAG 2.1 AA)

### Phase 6: Security & Hardening
- Prompt-injection protection: retrieved content wrapped in `<academy_content>` delimiters, system prompt rules, tests with adversarial retrieved content
- Input validation hardening, request limits, no secrets in logs
- Security boundary tests

### Phase 7: Integration, Regression & Verification
- Full test suite (existing 70 M4 tests + new M5 tests)
- `npm run typecheck`, `npm run build`
- Manual verification: desktop/mobile, dark/light, Urdu RTL, quota state, insufficient-info state
- No ingestion runs; no vector store changes

## Dependencies

### External
- None new for M5 (reuse existing deps: Docusaurus, React, existing provider SDKs). No package installs.

### Internal
- M4 RAG (complete) — RAGService, retriever, context assembler, vector store, providers, error mapping
- `src/lib/ask-the-book-errors.ts` (M4 P0) — client error UX helpers
- Docusaurus plugin pattern from `src/rag/api/plugin.ts` for the new endpoint

### Future milestones (dependencies documented, not built)
- M6 Translator Agent → implements `TranslatorAgent` interface
- M7 MCP → exposes Tutor capabilities as MCP tools
- Monetization → tier limits plug into configurable constants

## Risks & Mitigations

1. **Accidental M4 regression** → all M5 code lives in `src/tutor/` + new UI page; existing 70 tests must stay green; no `src/rag` edits.
2. **Provider cost** → deterministic detection; bounded history; retrieval only when Academy-related; mocked tests.
3. **Hallucination** → strict grounding rules + `<academy_content>` delimiters + source requirement + insufficient-info path.
4. **Prompt injection** → retrieved content treated as data; adversarial tests in Phase 6.
5. **Urdu quality** → shared glossary + RTL UI; M6 owns full translation; M5 only defines the boundary.
6. **Quota exhaustion (Gemini free tier)** → reuse M4 P0 fail-fast handling; UI shows quota state; no retry storms.

## Estimated Effort (after approval)

- Phase 1: 1 day
- Phase 2: 3 days
- Phase 3: 2 days
- Phase 4: 1 day
- Phase 5: 3 days
- Phase 6: 1 day
- Phase 7: 1 day
- **Total**: ~12 days

## Success Criteria — MET

- All 8 modes work with grounded answers + sources where applicable (grounded answers resume when the Gemini embedding quota resets)
- Insufficient-information handled; no fabricated sources
- English ↔ Urdu via `TranslatorAgent` boundary (M6-ready)
- Security tests pass (injection, no leaks)
- All M4 tests still pass (70/70); typecheck 0 errors; build SUCCESS
- No `src/rag` modifications; no ingestion runs; no vector data changes
