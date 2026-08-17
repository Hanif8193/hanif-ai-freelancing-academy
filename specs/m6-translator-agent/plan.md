# M6 — Translator Agent Plan

## Overview

Implement the TranslatorAgent behind the M5-defined interface. The agent wraps a `TranslationProvider` (Gemini via the existing M4 LLM provider abstraction) with prompt-level preservation rules (code, URLs, paths, commands, Markdown, technical terms via the shared glossary) and the `<academy_content>` grounding boundary. Wire it into the Tutor endpoint so Translation mode works.

## Guiding Constraints

1. Do NOT modify `src/rag/` (reuse `createLLMProvider` + `LLMProvider` by import only).
2. Do NOT run `npm run ingest`; do NOT touch `data/vector-store.json`.
3. All tests mocked — zero real API calls, no quota consumed.
4. Provider boundary: swapping translation providers must not change `TutorService` or the agent contract.
5. No M7 MCP.

## Implementation Phases

### Phase 1: Contract update (M6 shape)
- Update `src/tutor/translator.ts`: `TranslationResult.translatedText` (replaces `text`), add `preserveMarkdown?` + `context?` to `TranslateOptions`; keep `TranslatorAgent` interface + glossary exports; update the fallback message wording.
- Update `src/tutor/TutorService.ts` `handleTranslation` → `result.translatedText`.
- Update the M5 tests that construct `TranslationResult` stubs.

### Phase 2: Glossary expansion
- Add M6 terms to `src/tutor/glossary.ts`: React, Next.js, TypeScript, Python, JavaScript, SDK, Git, Docusaurus, OpenAI, Gemini, Claude, ChromaDB, AI Coding Agent, Agentic AI (and Node.js, npm). Urdu phrasing = the term itself + short Urdu explanation. No blind translation.

### Phase 3: Provider boundary + prompts
- `src/translator/providers/interface.ts` — `TranslationProvider`, `TranslationProviderRequest`, `TranslationProviderResult`.
- `src/translator/prompts.ts` — translation system prompt (rules: preserve code/URLs/paths/commands/Markdown; glossary terms stay English; never fabricate) + user prompt builder with `<academy_content>` delimiters for optional context and an `explain` variant.

### Phase 4: Gemini provider + factory
- `src/translator/providers/gemini.ts` — `GeminiTranslationProvider` implements `TranslationProvider` using an `LLMProvider`; prompt → `generate` → parse `{translatedText, preservedTerms}` (reuse `src/tutor/json.ts`); raw-text fallback; errors propagate unmodified.
- `src/translator/providers/factory.ts` — `createTranslationProvider(config)` returns the Gemini provider wrapping `createLLMProvider(config)` (project is configured for Gemini).

### Phase 5: Agent implementation + wiring
- `src/translator/TranslatorAgentImpl.ts` — implements `TranslatorAgent`; maps `translate`/`explain` to the provider; returns the M6 `TranslationResult`.
- `src/tutor/api/tutor-endpoint.ts` — construct `TutorService` with `translator: new TranslatorAgentImpl(createTranslationProvider(config))`.

### Phase 6: Tests
- `src/translator/__tests__/translator-agent.test.ts`
- `src/translator/__tests__/gemini-provider.test.ts`
- `src/translator/__tests__/factory.test.ts`
- Update `src/tutor/__tests__/translator.test.ts` + `tutor-service.test.ts` for `translatedText`.

### Phase 7: Verification & docs
- `npm test`, `npm run typecheck`, `npm run build`.
- Update `specs/m6-translator-agent/checklist.md` + `summary.md`; final report.

## Dependencies

- Internal: M5 `TranslatorAgent` interface + glossary; M4 `LLMProvider` + `createLLMProvider`; `src/tutor/json.ts`; `src/rag/errors.ts` (via endpoint).
- External: none new (no package installs).

## Risks & Mitigations

1. **M5 regression** → contract ripple is small and tested (2 files + 2 test files); all 148 existing tests must stay green.
2. **Translation quality / term consistency** → shared glossary + strict prompt rules; glossary is the single source.
3. **Code/URL mangling** → prompt-level preservation rules + tests asserting the rules reach the prompt.
4. **Prompt injection via context** → `<academy_content>` delimiter boundary + adversarial test.
5. **Cost** → one LLM call per translation; mocked tests; no retry loops.

## Success Criteria

- `TranslatorAgent` satisfied by `TranslatorAgentImpl`; EN↔UR works.
- Glossary covers the M6 term list; preservation rules enforced via prompts.
- Provider boundary clean; future providers swap without touching TutorService.
- All tests pass; typecheck 0 errors; build SUCCESS; no `src/rag` changes; vector store untouched.
