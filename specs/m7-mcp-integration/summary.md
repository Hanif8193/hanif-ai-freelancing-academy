# M7 — MCP Integration Summary

## Milestone Overview

M7 exposes the Academy's AI capabilities (M4 RAG, M5 Tutor, M6 Translator) through a **Model Context Protocol (MCP)** boundary so external MCP-compatible AI clients/agents (Claude Desktop, Cursor, VS Code, custom agents) can safely use them. MCP is a thin **adapter/capability layer** — every tool delegates to existing services; no RAG, Tutor, or Translator logic is duplicated.

**M7 is implemented and verified (2026-08-17).** Specification documents were created first (per the SDD workflow), then the adapter was built with the official `@modelcontextprotocol/sdk` over stdio.

## Architecture (delivered)

```
External MCP Client/Agent
   ↓  MCP protocol (stdio)
src/mcp/server.ts — stdio CLI entry (npm run mcp)
   ↓
src/mcp/index.ts — buildMcpServer (McpServer + tools-only capabilities)
   ↓  src/mcp/tools/ — validation (zod), safe errors, output bounds
M4 RAGService · M5 TutorService · M5 topics map · M4 MarkdownParser · M6 TranslatorAgent
   ↓
Grounded Academy Content (sources preserved, <academy_content> boundary)
```

- `src/mcp/services.ts` — `McpServices` structural context (test-injectable) + `createMcpServices()` production builder that wires the same RAG stack the web endpoints use (provider factory → persisted vector store → RAGService → TutorService → TranslatorAgentImpl). Loads the existing `data/vector-store.json` (641 chunks) — no new ingestion.
- `src/mcp/tools/` — `schemas.ts` (zod input schemas + shared bounds), `errors.ts` (safe tool results via M4 P0 `mapProviderError`), `content.ts` (chapter/section/path/project tools), `ai.ts` (search/quiz/translate tools), `index.ts` (registration).
- `src/mcp/server.ts` — stdio CLI entry (never imported by tests; `buildMcpServer` lives in `src/mcp/index.ts`).

## Files Created

- `src/mcp/services.ts`, `src/mcp/index.ts`, `src/mcp/server.ts`
- `src/mcp/tools/{schemas,errors,content,ai,index}.ts`
- `src/mcp/__tests__/{helpers,server,tools-content,tools-ai,security}.test.ts`

## Files Modified

- `package.json` — added `@modelcontextprotocol/sdk@^1.30.0` (approved), `zod@^4.4.3` (direct import), and the `"mcp": "tsx src/mcp/server.ts"` script
- `specs/m7-mcp-integration/{checklist,tasks,plan,summary}.md` — implementation status
- **`src/rag`, `src/tutor`, `src/translator`, Ask the Book, Tutor UI, vector data: untouched**

## MCP Tools Delivered (7)

| Tool | Delegates to | Key behavior |
|---|---|---|
| `searchAcademyContent` | M4 RAGService.answer | Grounded answer + sources; insufficient info surfaced with suggestedTopics |
| `getChapter` | M5 topics map + real docs file + M4 MarkdownParser | Real chapters only; unknown → `found: false` (verified: ch 05 → 47 sections) |
| `getSection` | topics map + MarkdownParser | Case-insensitive heading match; unknown → `found: false` |
| `getLearningPath` | M5 CHAPTER_ORDER | Ordered path with real Academy URLs; `from`/`max`; invalid `from` → `INVALID_REQUEST` |
| `generateQuiz` | M5 TutorService (mode `quiz`) | Grounded items + source citations; `insufficientInfo` surfaced |
| `translateContent` | M6 TranslatorAgentImpl | EN↔UR, preserveTerms/preserveMarkdown; zero-cost same-language no-op |
| `getProjectInstructions` | topics map + projects doc (known path) | Grounded overview; unknown project → `available: false` (never invented) |

Every tool advertises a zod input schema, validates (lengths, enums, integer bounds), bounds output, and returns errors as safe `isError` results with M4 P0 codes (`AI_QUOTA_EXCEEDED`, `AI_PROVIDER_ERROR`, `INVALID_REQUEST`, …) — never raw provider text, stack traces, or secrets.

## SDK & Transport (delivered)

- **SDK**: `@modelcontextprotocol/sdk@^1.30.0` (official TypeScript SDK) — subpath imports (`server/mcp.js`, `server/stdio.js`, `client/index.js`, `inMemory.js`) resolve in both ESM (tsx CLI) and CJS (ts-jest tests).
- **Transport**: stdio via `npm run mcp`. **Streamable HTTP remains future work** (deployment/monetization milestone) — intentionally not implemented.

## Security (delivered)

- All inputs validated by zod schemas (SDK returns safe `isError` results on failure); cross-field validation (`getLearningPath.from`) returns `INVALID_REQUEST`.
- Outputs bounded (sources ≤5, quiz items ≤5, path ≤14, sections ≤50, section content ≤4000 chars, instructions ≤6000 chars).
- No secrets/raw provider errors/stack traces in any tool result — tested.
- No arbitrary filesystem access (paths resolve only via the internal topics map), no arbitrary URL fetching, no code execution.
- Prompt-injection: retrieved content is reference data; adversarial question text passes through to the grounded M4/M5/M6 services unchanged (tested).

## Testing (delivered, all mocked — zero real API calls)

- **36 new M7 tests** (5 suites): server init + 7-tool registration, per-tool success/not-found/insufficient-info, validation failures (missing/oversized/enum/non-integer/out-of-range), quota (`AI_QUOTA_EXCEEDED`) and provider (`AI_PROVIDER_ERROR`) error mapping, secret leakage, prompt injection, output bounds, and delegation assertions (tools call the M4/M5/M6 services).
- **Full suite: 214/214 pass (23 suites)** — M4 (70) + M5/M6 (108) + M7 (36).
- **Typecheck**: 0 errors. **Build**: SUCCESS.
- **Stdio smoke test**: initialize + tools/list handshake OK, 7 tools advertised, no stderr, no AI calls.
- **Real-data check** (zero AI cost): `getChapter 05` → 47 sections from the real docs file; `getLearningPath from 09` → chapters 09→10 with real URLs; `getProjectInstructions` → real overview sections; unknown project → `available: false`.

## Integrity

- `npm run ingest` NOT run.
- `data/vector-store.json` untouched (641 chunks; mtime unchanged).
- `src/rag`, `src/tutor`, `src/translator` unmodified (imported only).
- No secrets committed; `.env` remains gitignored.

## Remaining Limitations

- AI tools (`searchAcademyContent`, `generateQuiz`, `translateContent`) consume provider quota like the web features; the embedding quota is currently exhausted, so grounded search/quiz over the live store will fail fast with `AI_QUOTA_EXCEEDED` until the quota resets (translation uses the LLM quota and is unaffected).
- stdio transport only — remote clients require Streamable HTTP (future milestone).
- `getProjectInstructions` returns the projects overview; per-project instructions will appear when the projects content is authored.
- MCP server is local-only; auth/rate-limiting for remote access belongs to the monetization/deployment milestone.

## Version

1.1.0 | Implemented & verified: 2026-08-17 | Status: ✅ Complete (stdio adapter over M4/M5/M6)
