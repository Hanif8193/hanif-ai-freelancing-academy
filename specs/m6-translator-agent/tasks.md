# M6 — Translator Agent Tasks

> **Status**: ✅ M6 implementation COMPLETE (178/178 tests, typecheck 0 errors, build SUCCESS, live EN→UR verified).

## Phase 0: Specification
- [x] `specs/m6-translator-agent/spec.md` created
- [x] `specs/m6-translator-agent/plan.md` created
- [x] `specs/m6-translator-agent/tasks.md` created (this file)
- [x] `specs/m6-translator-agent/checklist.md` created
- [x] `specs/m6-translator-agent/summary.md` created

**Acceptance Criteria**: Five documents exist; M4/M5/M7 boundaries clear.

## Phase 1: Contract Update (M6 shape)

### Task 1.1: TranslationResult contract
- [ ] `src/tutor/translator.ts`: `TranslationResult.translatedText` replaces `text`
- [ ] `TranslateOptions` gains `preserveMarkdown?: boolean` and `context?: string`
- [ ] Keep `TranslatorAgent` interface + `GLOSSARY`/`TECHNICAL_TERMS` exports; update fallback message wording

**Acceptance Criteria**: Contract compiles; no `text` references remain.

### Task 1.2: Ripple updates
- [ ] `src/tutor/TutorService.ts` `handleTranslation` uses `result.translatedText`
- [ ] Update `src/tutor/__tests__/translator.test.ts` + `tutor-service.test.ts` stubs

**Acceptance Criteria**: M5 tests pass with the updated contract.

## Phase 2: Glossary Expansion

### Task 2.1: Add M6 terms
- [ ] Add to `src/tutor/glossary.ts`: React, Next.js, TypeScript, Python, JavaScript, SDK, Git, Docusaurus, OpenAI, Gemini, Claude, ChromaDB, AI Coding Agent, Agentic AI, Node.js, npm
- [ ] Each entry: term + Urdu phrasing + short Urdu explanation; no blind translation

**Acceptance Criteria**: Glossary tests cover the new terms.

## Phase 3: Provider Boundary & Prompts

### Task 3.1: Provider interface
- [ ] `src/translator/providers/interface.ts`: `TranslationProvider`, `TranslationProviderRequest`, `TranslationProviderResult`

**Acceptance Criteria**: Interface typed; future providers can implement it.

### Task 3.2: Translation prompts
- [ ] `src/translator/prompts.ts`: system prompt with preservation rules (code/URLs/paths/commands/Markdown, glossary terms, no fabrication)
- [ ] User prompt builder: `<academy_content>` delimiters for context; `explain` variant with level
- [ ] Tests: rules present in prompt; injection content stays out of system prompt

**Acceptance Criteria**: Prompt tests pass.

## Phase 4: Gemini Provider & Factory

### Task 4.1: GeminiTranslationProvider
- [ ] `src/translator/providers/gemini.ts`: implements `TranslationProvider` using `LLMProvider`
- [ ] Parse `{translatedText, preservedTerms}` via `src/tutor/json.ts`; raw-text fallback; errors propagate

**Acceptance Criteria**: Provider tests pass (mocked LLM).

### Task 4.2: Factory
- [ ] `src/translator/providers/factory.ts`: `createTranslationProvider(config)` → Gemini provider via `createLLMProvider`

**Acceptance Criteria**: Factory test passes.

## Phase 5: Agent Implementation & Wiring

### Task 5.1: TranslatorAgentImpl
- [ ] `src/translator/TranslatorAgentImpl.ts`: implements `TranslatorAgent`; maps options; returns `TranslationResult`
- [ ] `explain()` passes `explain` flag + level to the provider

**Acceptance Criteria**: Agent tests pass.

### Task 5.2: Wire into Tutor
- [ ] `src/tutor/api/tutor-endpoint.ts` constructs `TutorService` with `translator: new TranslatorAgentImpl(createTranslationProvider(config))`

**Acceptance Criteria**: Translation mode routes through the agent.

## Phase 6: Tests

### Task 6.1: New M6 tests (mocked)
- [ ] `src/translator/__tests__/translator-agent.test.ts`
- [ ] `src/translator/__tests__/gemini-provider.test.ts`
- [ ] `src/translator/__tests__/factory.test.ts`

**Acceptance Criteria**: All new tests pass with zero real API calls.

### Task 6.2: Regression
- [ ] Existing 148 tests still pass (M4 + M5)

**Acceptance Criteria**: 148 + new tests all green.

## Phase 7: Verification & Docs

### Task 7.1: Verify
- [ ] `npm test` → all pass
- [ ] `npm run typecheck` → 0 errors
- [ ] `npm run build` → SUCCESS
- [ ] Confirm no `npm run ingest`; `data/vector-store.json` untouched; no `src/rag` modifications

**Acceptance Criteria**: All gates pass.

### Task 7.2: Docs
- [ ] Update `specs/m6-translator-agent/checklist.md` + `summary.md`
- [ ] Final report

**Acceptance Criteria**: Docs reflect delivered state.

## Task Summary

- Phase 0: 1 task (Specification)
- Phase 1: 2 tasks (Contract)
- Phase 2: 1 task (Glossary)
- Phase 3: 2 tasks (Boundary & Prompts)
- Phase 4: 2 tasks (Provider & Factory)
- Phase 5: 2 tasks (Agent & Wiring)
- Phase 6: 2 tasks (Tests)
- Phase 7: 2 tasks (Verification & Docs)
- **Total**: 14 tasks
