# M6 — Translator Agent Checklist

> **Status**: ✅ M6 implementation COMPLETE.
> Verification: 178/178 tests pass · typecheck 0 errors · build SUCCESS · no `src/rag` changes · no ingestion · vector store untouched · live EN→UR translation verified.

## Specification Documents
- [x] `spec.md` created
- [x] `plan.md` created
- [x] `tasks.md` created
- [x] `checklist.md` created (this file)
- [x] `summary.md` created

## Implementation Phase (COMPLETE)

### Phase 1: Contract (M6 shape)
- [x] `TranslationResult.translatedText` replaces `text`
- [x] `TranslateOptions` gains `preserveMarkdown?` + `context?`
- [x] `TutorService.handleTranslation` uses `translatedText` (+ `preserveMarkdown: true`)
- [x] M5 tests updated for the new contract

### Phase 2: Glossary
- [x] M6 terms added (React, Next.js, TypeScript, Python, JavaScript, SDK, Git, Docusaurus, OpenAI, Gemini, Claude, ChromaDB, AI Coding Agent, Agentic AI, Node.js, npm)
- [x] Glossary tests cover new terms (27 required terms)

### Phase 3: Provider Boundary & Prompts
- [x] `TranslationProvider` interface defined (`src/translator/providers/interface.ts`)
- [x] Translation system prompt with preservation rules (code/URLs/paths/commands/Markdown, glossary terms, no fabrication)
- [x] `<academy_content>` grounding + injection protection in prompts
- [x] Prompt tests passing

### Phase 4: Gemini Provider & Factory
- [x] `GeminiTranslationProvider` implemented (reuses M4 `LLMProvider` via factory)
- [x] JSON parsing + raw-text fallback
- [x] `createTranslationProvider` factory
- [x] Provider + factory tests passing

### Phase 5: Agent & Wiring
- [x] `TranslatorAgentImpl` implements the M5 interface (`src/translator/TranslatorAgentImpl.ts`)
- [x] `explain` mode supported (level-aware)
- [x] Tutor endpoint wires the translator into TutorService
- [x] Agent tests passing

### Phase 6: Tests
- [x] translator-agent tests (mocked) — option mapping, EN→UR + UR→EN, explain, error propagation
- [x] gemini-provider tests (mocked) — prompt rules, `<academy_content>` injection protection, JSON + fallback, quota fail-fast
- [x] factory tests
- [x] Existing 148 tests remain green (178 total)

### Phase 7: Verification
- [x] `npm test` all pass — 178/178 (19 suites)
- [x] `npm run typecheck` 0 errors
- [x] `npm run build` SUCCESS
- [x] Live smoke test: `/api/tutor` translation mode → HTTP 200, real Urdu translation with preserved technical terms (4.8s)
- [x] No `npm run ingest`; `data/vector-store.json` untouched (641 chunks); no `src/rag` modifications
- [x] Docs updated (checklist + summary)

## Boundary Guard
- [x] No M7 MCP implementation
- [x] No new packages
- [x] No payments/auth
- [x] No `src/rag` modifications
- [x] No vector data changes
