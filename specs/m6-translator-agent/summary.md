# M6 — Translator Agent Summary

## Milestone Overview

M6 implements the English ↔ Urdu Translator Agent behind the interface M5 defined (`src/tutor/translator.ts`). The agent sits behind a clean `TranslationProvider` boundary, uses the existing M4 LLM provider abstraction (Gemini, as configured), preserves technical terminology via the shared glossary, and keeps code blocks, URLs, file paths, commands, and Markdown structure intact.

The milestone delivered a specification (5 documents) followed by a full implementation: **178/178 tests, typecheck 0 errors, build SUCCESS, live EN→UR translation verified (HTTP 200, real Urdu output with preserved technical terms)**.

## Key Decisions

### 1. Contract evolution (M6 shape)
`TranslationResult` now returns `translatedText` (per the M6 contract) alongside `sourceLanguage`, `targetLanguage`, and `preservedTerms`. `TranslateOptions` adds `preserveMarkdown?` and `context?` (Academy grounding). Small, tested ripple into `TutorService` and M5 tests.

### 2. Clean provider boundary
`TranslationProvider` (`src/translator/providers/interface.ts`) decouples the agent from any vendor. `GeminiTranslationProvider` wraps the existing M4 `LLMProvider` (via `createLLMProvider`) — a future provider (e.g., a dedicated translation model) can be swapped in the factory without touching `TutorService`.

### 3. Preservation by prompt contract + glossary
- Code blocks, URLs, file paths, and commands preserved verbatim.
- Technical identifiers (React, Next.js, TypeScript, API, SDK, RAG, MCP, GitHub, Git, Docusaurus, OpenAI, Gemini, Claude, ChromaDB, Spec-Kit, AI Coding Agent, Agentic AI, …) stay English with brief Urdu explanations on first mention.
- Glossary is the single source of terminology rules (shared with Tutor, Ask the Book, future MCP).
- Markdown structure (headings, lists, bold/italic, inline code, fenced blocks) preserved.

### 4. Grounding + security
Optional Academy `context` is wrapped in `<academy_content>` delimiters and treated as reference data — never instructions (M5 boundary reused). Translation never fabricates content. Errors reuse the M4 P0 mapping; quota fails fast; no keys/stack traces/prompts reach the browser.

## Architecture

```
Tutor Translation mode → TutorService → TranslatorAgent (interface)
        → TranslatorAgentImpl (src/translator)
            → TranslationProvider (boundary)
                → GeminiTranslationProvider → LLMProvider (M4 factory)
```

## Files Created (delivered)

- `src/translator/providers/interface.ts` — `TranslationProvider` boundary + request/result types
- `src/translator/providers/gemini.ts` — `GeminiTranslationProvider` (wraps M4 `LLMProvider`)
- `src/translator/providers/factory.ts` — `createTranslationProvider(config)`
- `src/translator/prompts.ts` — translation prompts (preservation rules, glossary, `<academy_content>`)
- `src/translator/TranslatorAgentImpl.ts` — implements the M5 `TranslatorAgent` interface
- `src/translator/__tests__/` — translator-agent, gemini-provider, factory suites
- `specs/m6-translator-agent/` — spec, plan, tasks, checklist, summary

## Files Modified (delivered)

- `src/tutor/translator.ts` — M6 contract (`translatedText`, `preserveMarkdown?`, `context?`; neutral fallback message)
- `src/tutor/glossary.ts` — +16 M6 terms (27 total)
- `src/tutor/TutorService.ts` — `handleTranslation` uses `translatedText` + `preserveMarkdown: true`
- `src/tutor/api/tutor-endpoint.ts` — wires `new TranslatorAgentImpl(createTranslationProvider(config))`
- M5 tests (`translator.test.ts`, `tutor-service.test.ts`) — contract ripple

## Testing Strategy

All mocked, zero real API calls: agent option mapping, result contract, explain mode, prompt preservation rules, `<academy_content>` injection protection, JSON parsing + fallback, error propagation, glossary terms, M5 regression. **178/178 tests** (148 M4+M5 + 30 new M6). One live integration check confirmed EN→UR translation end-to-end (the LLM quota is available; only the embedding quota remains exhausted, and translation does not use embeddings).

## Acceptance Criteria

- [ ] `TranslatorAgent` satisfied by `TranslatorAgentImpl`
- [ ] EN → UR and UR → EN supported
- [ ] Glossary covers the M6 term list
- [ ] Preservation rules enforced via prompts
- [ ] `<academy_content>` grounding boundary used when context supplied
- [ ] Clean provider boundary
- [ ] No real API calls in tests
- [ ] All tests pass; typecheck 0 errors; build SUCCESS
- [ ] No `src/rag` modifications; no ingestion; vector store untouched
- [ ] M7 not implemented

## Version

2.0.0 | Created: 2026-08-17 | Updated: 2026-08-17 (implementation complete)
