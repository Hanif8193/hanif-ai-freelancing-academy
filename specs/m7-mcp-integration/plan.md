# M7 — MCP Integration Plan

## Overview

Build an MCP server as a thin **adapter layer** over the existing M4 RAG, M5 Tutor, and M6 Translator. The server registers seven tools that delegate to existing services (RAGService, TutorService, TranslatorAgentImpl, the M5 topics map, the M4 MarkdownParser). No business logic is duplicated.

**Current milestone status**: ✅ **IMPLEMENTED AND VERIFIED (2026-08-17)**. The plan below was executed per the approved spec; see `checklist.md`/`summary.md` for delivered state.

## Guiding Constraints

1. Do NOT modify `src/rag`, `src/tutor`, or `src/translator` — import and delegate only.
2. Do NOT run `npm run ingest`; do NOT touch `data/vector-store.json`.
3. All tests mocked — zero real API calls, no quota consumed.
4. MCP is an adapter: tools call existing services; no re-implemented retrieval/tutoring/translation.
5. Safe errors everywhere (reuse `src/rag/errors.ts`); no secrets/raw errors/stack traces in tool results.
6. No payments/auth; no ingestion changes; no vector-store migration; no production deployment in M7.

## Implementation Phases (planned, after approval)

### Phase 1: Dependency & Server Scaffold
- Install `@modelcontextprotocol/sdk` (official TS SDK, latest stable 1.x).
- `src/mcp/server.ts` — stdio MCP server bootstrap (`McpServer` from the SDK), registers tools, exposes capabilities.
- `npm run mcp` script (`tsx src/mcp/server.ts`).
- Verify server initializes and advertises the 7 tools (unit test with an in-process client).

### Phase 2: Shared Tool Infrastructure
- `src/mcp/tools/schemas.ts` — shared input validation helpers (length limits, enums, bounded numbers).
- `src/mcp/tools/errors.ts` — tool-result error mapping via `mapProviderError` (M4 P0 codes), safe text only.
- Output bounding helpers (max results, truncation).

### Phase 3: Content Tools (delegating to M4/M5)
- `searchAcademyContent` → `RAGService.answer()`.
- `getChapter` → `ACADEMY_TOPICS` resolution + server-side read of the known docs file + M4 `MarkdownParser` sections.
- `getSection` → chapter resolution + parsed-section match.
- `getLearningPath` → `CHAPTER_ORDER` from the M5 topics map.
- `getProjectInstructions` → projects doc read via the topics map (known path only).

### Phase 4: AI Tools (delegating to M5/M6)
- `generateQuiz` → `TutorService.answer({ mode: 'quiz', ... })`.
- `translateContent` → `TranslatorAgentImpl.translate(...)`.

### Phase 5: Security & Hardening
- Input validation per tool; oversized inputs rejected.
- Prompt-injection tests: retrieved content with injected instructions is treated as data (existing `<academy_content>` boundary in the delegated services).
- No arbitrary file/URL/code access (paths resolve only via the internal map).
- Secret-leak tests: assert no key/stack/provider text in any tool result.

### Phase 6: Tests
- Server init + tool registration (7 tools).
- Per-tool: success, validation failure, nonexistent chapter/section, insufficient info, unavailable instructions, output bounds.
- Quota/provider error mapping; delegation assertions via mocks.
- Regression: full M4/M5/M6 suite stays green.

### Phase 7: Verification & Docs
- `npm test`, `npm run typecheck`, `npm run build`.
- Manual smoke: run `npm run mcp` over stdio and list tools with an MCP client (`npx` inspector or a minimal client script) — no AI calls.
- Update `specs/m7-mcp-integration/checklist.md` + `summary.md`.

## Dependencies

- **New (implementation phase only)**: `@modelcontextprotocol/sdk` (^1.x).
- **Internal (reused, unmodified)**: `src/rag/services/rag-service.ts`, `src/rag/errors.ts`, `src/rag/providers/*`, `src/tutor/TutorService.ts`, `src/tutor/topics.ts`, `src/tutor/prompts.ts` (delimiter constants), `src/rag/ingestion/markdown-parser.ts`, `src/translator/TranslatorAgentImpl.ts`.

## Risks & Mitigations

1. **Logic duplication** → hard rule: tools only call existing services; code review + delegation tests.
2. **SDK churn** → pin to a stable 1.x release at install time; keep the adapter thin so protocol changes are localized.
3. **Quota cost from AI tools** → tools that call the LLM (search/quiz/translate) consume quota like the web features; mocked tests; no retry loops; fail-fast quota mapping.
4. **Injection via tool input** → tool input is user text passed to existing grounded services (M4/M5/M6 already enforce the reference-data boundary); adversarial tests.
5. **Nonexistent content** → `found/available/insufficientInfo` flags distinguish unavailable from generated; never fabricate.

## Estimated Effort (after approval)

- Phase 1: 1 day · Phase 2: 1 day · Phase 3: 2 days · Phase 4: 1 day · Phase 5: 1 day · Phase 6: 2 days · Phase 7: 1 day
- **Total**: ~9 days

## Success Criteria

- MCP server boots over stdio and advertises all 7 tools.
- Every tool delegates to M4/M5/M6 (no duplicated logic).
- Nonexistent chapters/sections/projects return clear not-found/unavailable results — never fabricated.
- No secrets, raw provider errors, or stack traces in any tool result.
- All tests pass (mocked); typecheck 0 errors; build SUCCESS.
- M4/M5/M6 untouched; no ingestion; vector store untouched.
