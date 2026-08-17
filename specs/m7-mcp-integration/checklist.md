# M7 — MCP Integration Checklist

> **Status**: ✅ IMPLEMENTED AND VERIFIED (2026-08-17). Specification approved; implementation delivered per the approved spec.

## Specification Documents
- [x] `spec.md` created
- [x] `plan.md` created
- [x] `tasks.md` created
- [x] `checklist.md` created (this file)
- [x] `summary.md` created

## Specification Review (approved)
- [x] All seven MCP capabilities specified
- [x] Existing M4/M5/M6 services reused — no duplicated RAG/Tutor/Translator logic
- [x] Security boundaries explicit
- [x] Prompt-injection protection specified
- [x] Grounding/source requirements explicit per tool
- [x] Error behavior defined per tool
- [x] Testing strategy covers every tool + security cases
- [x] MCP SDK decision documented + alternatives + compatibility
- [x] Transport recommendation documented (stdio primary; Streamable HTTP future)

## Implementation

### Phase 1: SDK & Server
- [x] `@modelcontextprotocol/sdk@^1.30.0` installed
- [x] `zod@^4.4.3` added as an explicit dependency (directly imported by schemas)
- [x] `npm run mcp` script added (`tsx src/mcp/server.ts`)
- [x] `src/mcp/server.ts` boots over stdio, advertises 7 tools (verified via stdio handshake)
- [x] Server init/registration tests passing

### Phase 2: Infrastructure
- [x] `src/mcp/tools/schemas.ts` — zod input schemas + shared bounds (question ≤500, text ≤2000, topic ≤300, enums, integer bounds)
- [x] `src/mcp/tools/errors.ts` — `toolResult`/`invalidRequest`/`safeToolError` (reuses M4 P0 `mapProviderError`; no raw text/stack/secrets)
- [x] Output bounding (max 5 sources, 5 quiz items, 14 path entries, 50 sections, section content ≤4000, instructions ≤6000)

### Phase 3: Content Tools
- [x] `searchAcademyContent` → M4 RAGService (answer + sources + grounded + insufficientInfo + suggestedTopics)
- [x] `getChapter` → M5 topics map + real docs file + M4 MarkdownParser (unknown → `found: false`)
- [x] `getSection` → parsed-section heading match (case-insensitive; unknown → `found: false`)
- [x] `getLearningPath` → M5 CHAPTER_ORDER with real URLs; `from`/`max` support; invalid `from` → `INVALID_REQUEST`
- [x] `getProjectInstructions` → projects doc (known path only); no instructions → `available: false`
- [x] Not-found/unavailable behavior verified for nonexistent chapters/sections/projects

### Phase 4: AI Tools
- [x] `generateQuiz` → M5 TutorService (mode `quiz`); grounded items + sources; `insufficientInfo` surfaced
- [x] `translateContent` → M6 TranslatorAgentImpl; EN↔UR; preserveTerms/preserveMarkdown; zero-cost same-language no-op
- [x] Grounding + sources preserved

### Phase 5: Security
- [x] Input/output bounds enforced (SDK zod validation → safe `isError` results; manual `INVALID_REQUEST` for cross-field cases)
- [x] Injection tests passing (content = reference data; question passed through unchanged)
- [x] Secret-leak tests passing (no key/stack/provider text in any tool result)
- [x] No arbitrary file/URL/code access (paths resolve only via the internal topics map)

### Phase 6: Tests
- [x] M7 test suite: 36 tests — server init, registration, per-tool success/not-found, validation, bounds, quota/provider error mapping, secret leakage, injection, delegation assertions
- [x] Full regression green: **214/214 tests** (23 suites) — M4 (70) + M5/M6 (108) + M7 (36)

### Phase 7: Verification
- [x] `npm test` — 214/214 pass (23 suites)
- [x] `npm run typecheck` — 0 errors
- [x] `npm run build` — SUCCESS
- [x] Manual stdio smoke test — initialize + tools/list handshake OK; 7 tools advertised; no AI calls
- [x] Content tools exercised against the real topics map + real docs files (chapter 05 = 47 sections; learning path 09→10; projects overview) — zero AI calls
- [x] No ingestion run; `data/vector-store.json` untouched (641 chunks, mtime unchanged)
- [x] `src/rag`, `src/tutor`, `src/translator` unmodified (imported only)
- [x] Docs updated (checklist + summary + tasks + plan)

## Boundary Guard
- [x] No payments/auth/accounts
- [x] No ingestion changes
- [x] No vector-store migration
- [x] No production deployment work (Streamable HTTP deferred)
- [x] No `src/rag` / `src/tutor` / `src/translator` modifications
