# M5 — Hanif AI Tutor Tasks

> **Status**: ✅ M5 specification approved and **implementation complete** (148/148 tests, typecheck 0 errors, build SUCCESS). All tasks below were delivered.

## Phase 0: Specification (current — complete on approval)

### Task 0.1: Specification Documents
- [x] `specs/m5-hanif-ai-tutor/spec.md` created
- [x] `specs/m5-hanif-ai-tutor/plan.md` created
- [x] `specs/m5-hanif-ai-tutor/tasks.md` created (this file)
- [x] `specs/m5-hanif-ai-tutor/checklist.md` created
- [x] `specs/m5-hanif-ai-tutor/summary.md` created

**Acceptance Criteria**: Five documents exist; M4/M6/M7/monetization boundaries clearly separated; no code implemented.

---

## Phase 1: Tutor Core Types & Intent Detection (implementation phase)

### Task 1.1: Tutor Types
- [ ] Create `src/tutor/types.ts`
- [ ] Define `TutorMode` union (ask | teach | explain | practice | quiz | assessment | learning-path | translation)
- [ ] Define `Language` (`en` | `ur`) and `Level` (beginner | intermediate | advanced)
- [ ] Define `TutorRequest` (question, mode?, language?, level?, history?)
- [ ] Define `TutorResponse` (mode, language, level?, directAnswer?, explanation?, example?, exercise?, quiz?, assessment?, recommendedNext?, sources, grounded, insufficientInfo, suggestedTopics?)
- [ ] Define `Exercise`, `QuizItem`, `Assessment` shapes
- [ ] Reuse M4 `Source` type (no redefinition)

**Acceptance Criteria**: Types compile; `Source` imported from M4 types, not duplicated.

### Task 1.2: Intent Detection
- [ ] Create `src/tutor/intent.ts`
- [ ] Implement `detectMode(question)` with spec priority order
- [ ] Implement `detectLanguage(question)` (`urdu`/`translate` markers)
- [ ] Implement `detectLevel(question)` (beginner/intermediate/advanced markers)
- [ ] Export pure functions for unit testing

**Acceptance Criteria**: All 8 modes detected; priority conflicts resolve correctly (Translation > Assessment > Quiz > Practice > Teach > Explain > Learning Path > Ask).

### Task 1.3: Intent Tests
- [ ] `src/tutor/__tests__/intent.test.ts`
- [ ] Test each mode trigger phrase
- [ ] Test priority conflict cases
- [ ] Test Urdu detection and level detection

**Acceptance Criteria**: All intent tests pass with mocked-free pure functions.

## Phase 2: TutorService & Mode Handlers (implementation phase)

### Task 2.1: TutorService
- [ ] Create `src/tutor/TutorService.ts`
- [ ] Constructor accepts `RAGService` (or answer-capable dependency) + `LLMProvider` + optional `TranslatorAgent`
- [ ] `answer(request: TutorRequest): Promise<TutorResponse>` dispatches to mode handlers
- [ ] Grounding: delegate Academy-related retrieval to RAGService; preserve `insufficientInfo` + sources
- [ ] Assemble response with only relevant sections (no empty sections)

**Acceptance Criteria**: Service orchestrates all modes; grounded answers carry M4 sources; provider-agnostic (LLMProvider via factory).

### Task 2.2: Ask & Teach Mode Handlers
- [ ] `src/tutor/modes/ask.ts` — grounded Q&A, level-aware phrasing
- [ ] `src/tutor/modes/teach.ts` — progressive lesson structure + recommended next step
- [ ] System prompt includes grounding rules + `<academy_content>` delimiter instructions

**Acceptance Criteria**: Ask returns directAnswer + sources; Teach returns progressive explanation + next step; both grounded.

### Task 2.3: Explain, Practice, Quiz, Assessment Handlers
- [ ] `src/tutor/modes/explain.ts` — simple language + analogy + optional example
- [ ] `src/tutor/modes/practice.ts` — exercise grounded in a topic/chapter
- [ ] `src/tutor/modes/quiz.ts` — quiz items with options/correct answer/explanation/source
- [ ] `src/tutor/modes/assessment.ts` — verdict + feedback against grounded content

**Acceptance Criteria**: Each handler returns its mode's structured output; sources attached when Academy content used.

### Task 2.4: Learning Path Handler
- [ ] `src/tutor/modes/learning-path.ts` — recommend next chapter/topic from Academy structure
- [ ] Recommendation includes topic + URL + reason; linked to real chapter

**Acceptance Criteria**: Recommendations reference actual chapter URLs from the docs.

### Task 2.5: Mode Handler Tests
- [ ] `src/tutor/__tests__/modes.test.ts` (mocked RAGService + LLMProvider)
- [ ] Tests: grounded answer, missing info, teach structure, explain simplicity, quiz shape, assessment verdicts, learning path

**Acceptance Criteria**: All mode tests pass with mocked providers; zero real API calls.

## Phase 3: API Layer (implementation phase)

### Task 3.1: /api/tutor Endpoint
- [ ] Create `src/tutor/api/tutor-endpoint.ts`
- [ ] Validate question (≤ 500 chars), mode/language/level enums, bounded history (≤ 10)
- [ ] Call TutorService; map errors via `src/rag/errors.ts` (no raw provider errors)
- [ ] Register `/api/tutor` in the Docusaurus plugin (alongside `/api/ask`) without altering `/api/ask`

**Acceptance Criteria**: POST /api/tutor works; /api/ask untouched; error mapping identical to M4 P0.

### Task 3.2: Endpoint Tests
- [ ] `src/tutor/__tests__/tutor-endpoint.test.ts` (mocked service)
- [ ] Tests: success, quota (429 AI_QUOTA_EXCEEDED), provider failure (AI_PROVIDER_ERROR), invalid input (400), no raw error leak

**Acceptance Criteria**: All endpoint tests pass.

## Phase 4: Translator Boundary (M6-ready) (implementation phase)

### Task 4.1: TranslatorAgent Interface
- [ ] Create `src/tutor/translator.ts`
- [ ] Define `TranslatorAgent` interface: `translate(text, from, to, options)`, `explain(text, targetLanguage, level)`
- [ ] TutorService depends on the interface; Translation mode routes through it
- [ ] NO actual translation implementation in M5 (that is M6)

**Acceptance Criteria**: Interface defined; Tutor compiles against it; a stub satisfies the contract in tests.

### Task 4.2: Glossary & Terminology Constants
- [ ] Define glossary: Freelancing, AI Agent, RAG, MCP, API, GitHub, Repository, Specification, Implementation, Verification, Vector Database, VS Code, Spec-Kit → consistent Urdu phrasing
- [ ] Export constants shared with future M6

**Acceptance Criteria**: Glossary defined; terms remain English-first with Urdu explanation rule documented.

### Task 4.3: Boundary Tests
- [ ] Test that Translation mode routes through the TranslatorAgent interface (mock)
- [ ] Test English → Urdu and Urdu → English request parsing

**Acceptance Criteria**: Boundary tests pass; no translation logic inside M5 beyond glossary constants.

## Phase 5: Tutor UI (implementation phase)

### Task 5.1: Tutor Page
- [ ] Create `src/pages/tutor.tsx` + `Tutor.module.css`
- [ ] Chat interface + client-side conversation history (bounded)
- [ ] Mode selector, language selector (RTL for Urdu), level selector
- [ ] Suggested questions (reuse Ask the Book pattern)
- [ ] Source cards (reuse M4 `Source` shape + Ask the Book styling)
- [ ] Markdown + code syntax highlighting (Docusaurus prism)
- [ ] Loading / error / quota / insufficient-info states (reuse `src/lib/ask-the-book-errors.ts`)

**Acceptance Criteria**: Page renders all states; RTL works for Urdu; mobile responsive; dark/light mode; keyboard accessible.

### Task 5.2: Integration & Accessibility
- [ ] Add "AI Tutor" to navbar (docusaurus.config.ts)
- [ ] Verify WCAG 2.1 AA focus states, labels, contrast
- [ ] Verify responsive behavior + reduced-motion

**Acceptance Criteria**: Navbar link works; accessibility checks pass.

## Phase 6: Security & Hardening (implementation phase)

### Task 6.1: Prompt-Injection Protection
- [ ] Wrap retrieved content in `<academy_content>` delimiters in prompt assembly
- [ ] System prompt: retrieved content is reference data, never instructions
- [ ] Adversarial test: retrieved chunk containing "ignore previous instructions" must not alter behavior

**Acceptance Criteria**: Injection test passes; system vs retrieved content separation verified.

### Task 6.2: Input Validation & Limits
- [ ] Question length cap, enum validation, history cap
- [ ] No secrets in logs; server-side diagnostics only
- [ ] Request limit constants configurable for future tiering

**Acceptance Criteria**: Invalid inputs rejected with INVALID_REQUEST; limits enforced.

## Phase 7: Integration, Regression & Verification (implementation phase)

### Task 7.1: Full Test Suite
- [ ] Run all M4 + M5 tests (target: all pass, no real API calls)
- [ ] Regression: existing 70 M4 tests unchanged and passing

**Acceptance Criteria**: All tests pass.

### Task 7.2: Typecheck & Build
- [ ] `npm run typecheck` → 0 errors
- [ ] `npm run build` → SUCCESS, no broken links

**Acceptance Criteria**: Typecheck and build pass.

### Task 7.3: Manual Verification
- [ ] Desktop + mobile + dark/light
- [ ] Urdu RTL, quota state, insufficient-info state
- [ ] Confirm NO `npm run ingest`, NO vector store changes, NO `src/rag` modifications

**Acceptance Criteria**: Manual checklist complete; M4 data untouched.

## Task Summary

- Phase 0: 1 task (Specification — current)
- Phase 1: 3 tasks (Types & Intent)
- Phase 2: 5 tasks (TutorService & Modes)
- Phase 3: 2 tasks (API)
- Phase 4: 3 tasks (Translator Boundary)
- Phase 5: 2 tasks (UI)
- Phase 6: 2 tasks (Security)
- Phase 7: 3 tasks (Verification)
- **Total**: 21 tasks (implementation phases) + 1 specification task
