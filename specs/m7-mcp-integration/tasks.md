# M7 — MCP Integration Tasks

> **Status**: ✅ IMPLEMENTED AND VERIFIED (2026-08-17). All tasks complete.

## Phase 0: Specification (complete)
- [x] `specs/m7-mcp-integration/spec.md` created
- [x] `specs/m7-mcp-integration/plan.md` created
- [x] `specs/m7-mcp-integration/tasks.md` created (this file)
- [x] `specs/m7-mcp-integration/checklist.md` created
- [x] `specs/m7-mcp-integration/summary.md` created

**Acceptance Criteria**: ✅ Five documents exist; M4/M5/M6 delegation boundaries clear; SDK/transport decision documented; no code.

## Phase 1: Dependency & Server Scaffold

### Task 1.1: Install MCP SDK — ✅ DONE
- [x] `@modelcontextprotocol/sdk@^1.30.0` installed (official TypeScript SDK)
- [x] `zod@^4.4.3` added as an explicit dependency (directly imported by tool schemas)
- [x] `package.json` gains the dependency + `npm run mcp` script (`tsx src/mcp/server.ts`)

**Acceptance Criteria**: ✅ SDK installs; `npm run mcp` boots the server.

### Task 1.2: MCP Server Bootstrap — ✅ DONE
- [x] `src/mcp/server.ts` — stdio `McpServer` bootstrap (CLI entry; `buildMcpServer` in `src/mcp/index.ts` so tests never trigger stdio)
- [x] Register the 7 tools with names/descriptions/schemas
- [x] Test: server initializes and advertises all tools (in-process client)

**Acceptance Criteria**: ✅ Server boots over stdio (handshake verified); tools advertised.

## Phase 2: Shared Tool Infrastructure

### Task 2.1: Validation & Error Helpers — ✅ DONE
- [x] `src/mcp/tools/schemas.ts` — length limits, enum validation, bounded numbers (zod)
- [x] `src/mcp/tools/errors.ts` — safe tool-error mapping via `mapProviderError` (no raw text)
- [x] Output bounding helpers (max sources/quiz items/path items/sections, content truncation)

**Acceptance Criteria**: ✅ Helpers unit-tested; no raw provider text in error results.

## Phase 3: Content Tools

### Task 3.1: searchAcademyContent — ✅ DONE
- [x] Tool delegates to `RAGService.answer()`
- [x] Output: answer + sources (title/section/url/excerpt) + grounded + insufficientInfo + suggestedTopics

**Acceptance Criteria**: ✅ Grounded results; insufficient info surfaced; no invented results (delegation asserted via mock).

### Task 3.2: getChapter — ✅ DONE
- [x] Resolve chapter via `ACADEMY_TOPICS` (never user paths)
- [x] Read the known docs file; parse sections with M4 `MarkdownParser`
- [x] Unknown chapter → `found: false` (no fabrication)

**Acceptance Criteria**: ✅ Real chapters return metadata + content (verified: ch 05 → 47 sections); unknown → not-found.

### Task 3.3: getSection — ✅ DONE
- [x] Chapter resolution + parsed-section heading match (case-insensitive)
- [x] Unknown section → `found: false`

**Acceptance Criteria**: ✅ Real sections returned; unknown → not-found.

### Task 3.4: getLearningPath — ✅ DONE
- [x] Return `CHAPTER_ORDER` from the M5 topics map with real URLs
- [x] `from`/`max` support; invalid `from` → `INVALID_REQUEST`

**Acceptance Criteria**: ✅ Ordered path with real Academy routes.

### Task 3.5: getProjectInstructions — ✅ DONE
- [x] Read `docs/projects/index.md` via the topics map (known path)
- [x] No instructions for a requested project → `available: false` (distinguish unavailable vs generated)

**Acceptance Criteria**: ✅ Grounded overview; clear unavailable state (verified against the real doc).

## Phase 4: AI Tools

### Task 4.1: generateQuiz — ✅ DONE
- [x] Delegate to `TutorService.answer({ mode: 'quiz', ... })`
- [x] Grounded items + sources; insufficient grounding → `insufficientInfo: true`

**Acceptance Criteria**: ✅ Quiz items grounded with source citations (delegation asserted via mock).

### Task 4.2: translateContent — ✅ DONE
- [x] Delegate to `TranslatorAgentImpl.translate(...)`
- [x] EN↔UR, preserveTerms/preserveMarkdown options, preservedTerms output; zero-cost same-language no-op

**Acceptance Criteria**: ✅ M6 contract honored end-to-end.

## Phase 5: Security & Hardening

### Task 5.1: Input & Output Bounds — ✅ DONE
- [x] Per-tool validation (types, lengths, enums); oversized inputs rejected (SDK zod → safe `isError` results)
- [x] Output bounding verified

**Acceptance Criteria**: ✅ Invalid/oversized inputs produce safe error results (never thrown raw exceptions).

### Task 5.2: Injection & Leak Tests — ✅ DONE
- [x] Injection: retrieved content with instructions is treated as data (delegated services' `<academy_content>` boundary; question passed through unchanged)
- [x] Secret-leak: no key/stack/provider text in any tool result (tested with fake key + stack)
- [x] No arbitrary file/URL/code access (paths from internal map only)

**Acceptance Criteria**: ✅ Adversarial tests pass; no leaks.

## Phase 6: Tests

### Task 6.1: MCP Test Suite (mocked) — ✅ DONE
- [x] Server init + tool registration (7 tools)
- [x] Per-tool: success, validation failure, nonexistent chapter/section, insufficient info, unavailable instructions, bounds
- [x] Quota/provider error mapping; delegation assertions via mocks

**Acceptance Criteria**: ✅ All 36 M7 tests pass with zero real API calls.

### Task 6.2: Regression — ✅ DONE
- [x] M4 (70) + M5/M6 (108) tests remain green

**Acceptance Criteria**: ✅ Full suite: 214/214 pass (23 suites).

## Phase 7: Verification & Docs

### Task 7.1: Verify — ✅ DONE
- [x] `npm test` — 214/214 pass
- [x] `npm run typecheck` — 0 errors
- [x] `npm run build` — SUCCESS
- [x] Manual stdio smoke: initialize + tools/list handshake OK; 7 tools advertised; no AI calls
- [x] Content tools exercised against the real topics map + docs files (zero AI cost)
- [x] No `npm run ingest`; `data/vector-store.json` untouched (641 chunks); `src/rag`/`src/tutor`/`src/translator` unmodified

**Acceptance Criteria**: ✅ All gates pass.

### Task 7.2: Docs — ✅ DONE
- [x] Update `specs/m7-mcp-integration/checklist.md` + `summary.md` (+ tasks/plan status)
- [x] Final report delivered

**Acceptance Criteria**: ✅ Docs reflect delivered state.

## Task Summary

- Phase 0: 1 task (Specification) ✅
- Phase 1: 2 tasks (SDK & Server) ✅
- Phase 2: 1 task (Infrastructure) ✅
- Phase 3: 5 tasks (Content Tools) ✅
- Phase 4: 2 tasks (AI Tools) ✅
- Phase 5: 2 tasks (Security) ✅
- Phase 6: 2 tasks (Tests) ✅
- Phase 7: 2 tasks (Verification & Docs) ✅
- **Total: 17 implementation tasks + 1 specification task — ALL COMPLETE**
