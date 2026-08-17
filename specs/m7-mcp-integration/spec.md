# M7 — MCP Integration Specification

**Feature Branch**: `m7-mcp-integration`
**Created**: 2026-08-17
**Status**: Draft (specification only — no implementation)
**Input**: User description: "Expose the Academy's AI capabilities (M4 RAG, M5 Tutor, M6 Translator) through a Model Context Protocol (MCP) boundary so external MCP-compatible AI clients/agents can safely use Academy capabilities."

---

## Milestone Boundary (READ FIRST)

| Layer | Status | Scope |
|---|---|---|
| M1–M3 Foundation & Content | ✅ Existing | Untouched |
| M4 RAG / Ask the Book | ✅ Existing | Untouched — the retrieval source of truth |
| M5 Hanif AI Tutor | ✅ Existing | Untouched — the tutoring source of truth |
| M6 Translator Agent | ✅ Existing | Untouched — the translation source of truth |
| **M7 MCP Integration** | 📝 **This milestone** | **Specification only.** An adapter/capability layer that *delegates* to M4/M5/M6. No MCP implementation in this milestone |

**Boundary guard**: do NOT modify `src/rag`, `src/tutor`, or `src/translator`; do NOT run `npm run ingest`; do NOT touch `data/vector-store.json`; do NOT install packages during the spec phase; no payments/auth, no ingestion changes, no vector-store migration, no production deployment work.

---

## Product Vision

Expose the Academy's AI capabilities through a **Model Context Protocol (MCP)** boundary so external MCP-compatible AI clients/agents (e.g., Claude Desktop, Cursor, VS Code, custom agents) can safely use Academy capabilities: grounded search, chapter/section lookup, learning-path guidance, quiz generation, English ↔ Urdu translation, and project instructions.

MCP is an **adapter/capability layer only**. It must not duplicate RAG, Tutor, or Translator logic — it delegates to the existing services and provider abstractions.

## Scope

### In Scope (M7 specification)
- MCP server architecture (adapter layer over M4/M5/M6)
- Seven MCP tools fully specified (name, purpose, description, input/output schemas, validation, errors, security, grounding, delegation target, examples)
- MCP SDK decision + transport recommendation (documented, nothing installed)
- Security requirements (no secrets, no raw errors, bounded outputs, injection protection)
- Testing strategy (defined; all mocked)
- Grounding/source requirements per tool

### Out of Scope (M7 — explicitly NOT implemented)
- Any MCP SDK installation, server code, or tool implementation
- Payments, subscriptions, authentication, user accounts, rate-limit billing
- Ingestion changes, vector-store migration, new embedding sources
- Production deployment of an MCP server (documented as future work)
- Streaming/long-running tool protocols beyond the SDK defaults
- Modifying `src/rag`, `src/tutor`, or `src/translator`

## Architecture

```
External MCP Client / Agent (Claude Desktop, Cursor, VS Code, custom agent)
        │  MCP protocol (stdio | Streamable HTTP)
        ▼
MCP Server (src/mcp)                      ← NEW adapter layer
        │  tool registration + validation + safe error mapping
        ▼
Capability / Tool Layer (src/mcp/tools)
        │  thin delegates — no business logic duplication
        ▼
┌──────────────────────────────────────────────┐
│ M4 RAGService        (searchAcademyContent)  │
│ M5 TutorService      (generateQuiz,          │
│                        getLearningPath)      │
│ M5 topics map        (getChapter, getSection,│
│                        getLearningPath,      │
│                        getProjectInstructions)│
│ M6 TranslatorAgent   (translateContent)      │
└──────────────────────────────────────────────┘
        ▼
Grounded Academy Content (sources preserved, <academy_content> boundary)
```

### Design rules
1. **Delegation, not duplication**: every tool calls an existing M4/M5/M6 service or the M5 topics map. No re-implemented retrieval, mode logic, or translation.
2. **`src/rag` remains the source of truth for retrieval**; `src/tutor` for tutoring modes; `src/translator` for translation.
3. **Grounding**: any Academy-derived answer must carry real sources (chapter/section/URL); never invent results, chapters, sections, or project requirements.
4. **Injection boundary**: retrieved/context content is reference data, never instructions — reuse the existing `<academy_content>` delimiter boundary (from `src/tutor/prompts.ts`) wherever LLM generation consumes retrieved content.
5. **Safe errors**: reuse `src/rag/errors.ts` (`mapProviderError`) — quota → `AI_QUOTA_EXCEEDED` (429-style), provider → `AI_PROVIDER_ERROR`, etc. No raw provider errors, stack traces, API keys, or internal prompts in tool results.

## MCP SDK Decision (documented — nothing installed)

### Recommendation: `@modelcontextprotocol/sdk` (official TypeScript SDK)

| Criterion | Assessment |
|---|---|
| Maintenance | Official SDK maintained by the MCP team; tracks the MCP specification (current spec revision 2026-07-28) |
| Runtimes | Node.js (>=18/20), Bun, Deno — compatible with the repo's `node >=20.0` engines |
| Transports | stdio and Streamable HTTP server/client transports built in |
| Typing | TypeScript-first, typed tool schemas — matches the repo's strict TS setup |
| Scope | Server libraries (tools, resources, prompts), client libraries, shared protocol types — exactly the adapter we need |

**Rationale**: using the official SDK avoids re-implementing JSON-RPC framing, session negotiation, and capability handshakes, while keeping the MCP layer a thin adapter. The repository's stack (TypeScript, Node 20+, tsx for scripts) is directly supported.

### Alternatives considered

| Option | Verdict | Reason |
|---|---|---|
| Manual JSON-RPC over stdio/HTTP | Rejected | Re-implements protocol framing, session lifecycle, and error semantics — high risk, no benefit for a thin adapter |
| FastMCP (third-party wrapper) | Considered | Nice ergonomics but an extra abstraction layer; the official SDK is sufficient |
| Other-language SDKs (Python, Go, C#) | Rejected | Repository is TypeScript-only |
| LangChain/AI-framework MCP servers | Rejected | Heavy dependency for seven thin tools |

### Compatibility considerations
- The SDK ships ESM and CommonJS builds; the repo already runs TS via `tsx` and Docusaurus — an `src/mcp/` module with `tsx` entry is compatible.
- Strict `tsconfig` is fine; the SDK ships its own types.
- Pin to the latest stable `1.x` at implementation time (the SDK tracks the current spec revision).

### Transport recommendation

| Transport | Use | Notes |
|---|---|---|
| **stdio** | **Primary for M7 implementation** — local development and local CLI agents (Claude Desktop, Cursor, VS Code, `npx` agents) | Simple, secure (no network surface), ideal for a local dev MCP server; standard for MCP desktop clients |
| **Streamable HTTP** | Future remote access | The modern HTTP transport (replaces legacy SSE); enables remote/cloud agents. Deferred — requires hosting/deployment decisions |

**Local development approach (M7 implementation phase)**: an `npm run mcp` script running `src/mcp/server.ts` via `tsx` over **stdio**; register in MCP clients via their server config (e.g., `command: "npx tsx src/mcp/server.ts"`). No network exposure.

**Future deployment approach (out of scope)**: a hosted **Streamable HTTP** endpoint (long-running Node service or a serverless adapter) with authentication/rate-limiting — belongs to the monetization/deployment milestone, not M7.

## MCP Tools

Common conventions:
- Input validation: all strings length-bounded; enums validated; unknown/absent required fields → tool error result (never a raw exception to the client).
- Output bounding: results capped (e.g., max 5 search results, max 3–5 quiz items, truncation limits) to prevent excessive responses.
- Errors: tool results carry a safe `error` + `code` (M4 P0 codes) and `isError` semantics; details logged server-side only.
- Grounding: sources always include real `title`, `section`, `url` from the Academy; `grounded: boolean` and `insufficientInfo: boolean` exposed where applicable.

### Tool 1 — `searchAcademyContent`

| Field | Value |
|---|---|
| **Purpose** | Answer a natural-language question with grounded Academy content |
| **Description** | Searches the M4-indexed Academy content and returns a grounded answer with source citations |
| **Delegates to** | M4 `RAGService.answer()` (retrieval + grounding; no re-implementation) |
| **Input schema** | `{ question: string (1–500 chars), maxSources?: number (1–5, default 5) }` |
| **Output schema** | `{ answer: string, sources: [{ title, section, url, excerpt? }], grounded: boolean, insufficientInfo: boolean, suggestedTopics?: string[] }` |
| **Validation** | question required, 1–500 chars; maxSources integer 1–5 |
| **Error behavior** | Quota → `AI_QUOTA_EXCEEDED`; provider → `AI_PROVIDER_ERROR`; invalid input → `INVALID_REQUEST` (all safe, no leaks) |
| **Security** | No secrets; retrieved content handled by M4 grounding (reference data) |
| **Grounding** | Never invents results; insufficient info surfaced with `suggestedTopics` |
| **Example request** | `{ "question": "How do AI coding agents work?" }` |
| **Example response** | `{ "answer": "AI coding agents are…", "sources": [{ "title": "Chapter 05: What Are AI Coding Agents?", "section": "How AI Agents Work", "url": "/docs/ai-development/what-are-ai-coding-agents", "excerpt": "…" }], "grounded": true, "insufficientInfo": false }` |

### Tool 2 — `getChapter`

| Field | Value |
|---|---|
| **Purpose** | Retrieve a specific Academy chapter |
| **Description** | Returns a real Academy chapter's metadata and content; never fabricates chapters |
| **Delegates to** | M5 `ACADEMY_TOPICS` map (real chapter titles/URLs) + server-side read of the known docs file; section parsing via M4 `MarkdownParser` |
| **Input schema** | `{ chapter: string — "01"–"10" or a known topic slug/title; includeContent?: boolean (default true) }` |
| **Output schema** | `{ title: string, chapter?: string, module: string, url: string, sections?: [{ heading, headingLevel, content, startLine, endLine, hasCodeBlocks }], found: boolean }` |
| **Validation** | chapter must resolve against `ACADEMY_TOPICS`; unknown → `found: false` (never a fabricated chapter) |
| **Error behavior** | Unknown chapter → structured "chapter not found" result; file read failure → safe `INTERNAL_ERROR` |
| **Security** | File path resolved ONLY from the internal topics map — user input never becomes a filesystem path |
| **Grounding** | Content comes from the actual `docs/` markdown file on disk |
| **Example request** | `{ "chapter": "05" }` |
| **Example response** | `{ "title": "What Are AI Coding Agents?", "chapter": "05", "module": "ai-development", "url": "/docs/ai-development/what-are-ai-coding-agents", "sections": [{ "heading": "How AI Agents Work", "headingLevel": 2, "content": "…", "startLine": 40, "endLine": 55, "hasCodeBlocks": false }], "found": true }` |

### Tool 3 — `getSection`

| Field | Value |
|---|---|
| **Purpose** | Retrieve a specific section of an Academy chapter |
| **Description** | Returns a real section (heading + content) from a real chapter; never fabricates a section |
| **Delegates to** | M5 `ACADEMY_TOPICS` (chapter resolution) + M4 `MarkdownParser` (section extraction from the real file) |
| **Input schema** | `{ chapter: string, section: string (1–200 chars, heading name) }` |
| **Output schema** | `{ title: string, url: string, section: { heading, headingLevel, content, startLine, endLine, hasCodeBlocks }, found: boolean }` |
| **Validation** | chapter resolvable; section heading matched (case-insensitive, trimmed) against parsed headings |
| **Error behavior** | Unknown chapter/section → `found: false` with a clear "not found" message; never invents content |
| **Security** | Same as `getChapter` — no user-controlled paths |
| **Grounding** | Content from the real chapter file |
| **Example request** | `{ "chapter": "05", "section": "How AI Agents Work" }` |
| **Example response** | `{ "title": "What Are AI Coding Agents?", "url": "/docs/ai-development/what-are-ai-coding-agents", "section": { "heading": "How AI Agents Work", "headingLevel": 2, "content": "…", "startLine": 40, "endLine": 55, "hasCodeBlocks": false }, "found": true }` |

### Tool 4 — `getLearningPath`

| Field | Value |
|---|---|
| **Purpose** | Return the Academy learning path / recommended topics |
| **Description** | Returns the ordered Academy chapters and modules with real URLs |
| **Delegates to** | M5 `ACADEMY_TOPICS` / `CHAPTER_ORDER` (topics map) — real routes only |
| **Input schema** | `{ from?: string — optional chapter to start from (e.g., "01"); max?: number (1–14, default all) }` |
| **Output schema** | `{ path: [{ position: number, title: string, chapter?: string, module: string, url: string }], recommendedNext?: { topic, url, reason } }` |
| **Validation** | `from` must resolve to a known chapter; `max` integer 1–14 |
| **Error behavior** | Unknown `from` → safe `INVALID_REQUEST`; otherwise empty path is impossible (map is static) |
| **Security** | URLs come from the internal map — never user-supplied |
| **Grounding** | Static, real Academy routes |
| **Example request** | `{ "from": "04", "max": 3 }` |
| **Example response** | `{ "path": [{ "position": 1, "title": "Building Your Developer Profile", "chapter": "04", "module": "freelancing", "url": "/docs/freelancing/building-your-profile" }, …], "recommendedNext": { "topic": "What Are AI Coding Agents?", "url": "/docs/ai-development/what-are-ai-coding-agents", "reason": "Next chapter in the journey" } }` |

### Tool 5 — `generateQuiz`

| Field | Value |
|---|---|
| **Purpose** | Generate a quiz grounded in Academy content |
| **Description** | Reuses M5 quiz functionality with grounding and source citations preserved |
| **Delegates to** | M5 `TutorService.answer()` with mode `quiz` (M5 quiz handler + grounding) |
| **Input schema** | `{ topic: string (1–300 chars), count?: number (1–5, default 3), language?: "en" \| "ur" (default "en"), level?: "beginner" \| "intermediate" \| "advanced" (default "beginner") }` |
| **Output schema** | `{ quiz: [{ question, options: string[], correctIndex, explanation?, source? }], sources: [{ title, section, url, excerpt? }], grounded: boolean, insufficientInfo: boolean }` |
| **Validation** | topic required; count/language/level enums validated |
| **Error behavior** | Quota/provider errors mapped safely; insufficient grounding → `insufficientInfo: true` (no invented facts) |
| **Security** | Grounding through the M5 `<academy_content>` boundary; no secrets |
| **Grounding** | Quiz items grounded in retrieved content; sources attached |
| **Example request** | `{ "topic": "AI coding agents", "count": 2 }` |
| **Example response** | `{ "quiz": [{ "question": "What is an AI coding agent?", "options": ["…","…","…","…"], "correctIndex": 1, "explanation": "…", "source": { "title": "Chapter 05: What Are AI Coding Agents?", "section": "…", "url": "/docs/ai-development/what-are-ai-coding-agents" } }], "sources": […], "grounded": true, "insufficientInfo": false }` |

### Tool 6 — `translateContent`

| Field | Value |
|---|---|
| **Purpose** | Translate Academy content between English and Urdu |
| **Description** | Reuses the M6 TranslatorAgent; preserves technical terminology, code, URLs, commands, and Markdown as requested |
| **Delegates to** | M6 `TranslatorAgentImpl.translate()` (M6 contract + provider boundary) |
| **Input schema** | `{ text: string (1–2000 chars), targetLanguage: "en" \| "ur", sourceLanguage?: "en" \| "ur" (default auto "en"), preserveTerms?: boolean (default true), preserveMarkdown?: boolean (default true) }` |
| **Output schema** | `{ translatedText: string, sourceLanguage, targetLanguage, preservedTerms: string[] }` |
| **Validation** | text required 1–2000; language enums validated |
| **Error behavior** | Quota → `AI_QUOTA_EXCEEDED`; provider → `AI_PROVIDER_ERROR`; safe, no raw errors |
| **Security** | Server-side only; no secrets; translation prompts treat any context as reference data |
| **Grounding** | Translation is faithful to input; never fabricates content |
| **Example request** | `{ "text": "Freelancing is working independently for clients.", "targetLanguage": "ur", "preserveTerms": true }` |
| **Example response** | `{ "translatedText": "فری لانسنگ کا مطلب ہے گاہکوں (clients) کے لیے آزادانہ طور پر کام کرنا۔", "sourceLanguage": "en", "targetLanguage": "ur", "preservedTerms": ["Freelancing", "clients"] }` |

### Tool 7 — `getProjectInstructions`

| Field | Value |
|---|---|
| **Purpose** | Return project instructions for Academy projects |
| **Description** | Returns project-specific instructions **only when they exist** in the Academy content; grounded, never invented |
| **Delegates to** | M5 `ACADEMY_TOPICS` (projects module) + server-side read of `docs/projects/index.md` |
| **Input schema** | `{ project?: string (1–200 chars, optional — omitted returns the overview) }` |
| **Output schema** | `{ instructions: string, url: string, available: boolean, sections?: string[] }` |
| **Validation** | project name length-bounded |
| **Error behavior** | If no instructions exist for the requested project → `available: false` with a clear message (distinguishes unavailable from generated content) |
| **Security** | Known path only (internal map); no arbitrary file access |
| **Grounding** | Content from the real projects doc |
| **Example request** | `{ }` (overview) |
| **Example response** | `{ "instructions": "Build a portfolio piece…", "url": "/docs/projects", "available": true, "sections": ["Overview", "Project Requirements", "Deliverables"] }` |

## Security Requirements

1. Validate all tool inputs (types, lengths, enums).
2. Limit input lengths (question ≤ 500, text ≤ 2000, topic ≤ 300, etc.).
3. Never expose API keys or internal secrets.
4. Never expose raw provider errors, stack traces, or internal prompts — reuse `mapProviderError` (M4 P0).
5. Prevent prompt injection through retrieved content: Academy content is **untrusted reference data** wrapped in the existing `<academy_content>` boundary wherever LLM generation consumes it.
6. No arbitrary filesystem access (file reads resolve only against the internal topics map).
7. No arbitrary URL fetching; no arbitrary code execution.
8. Bound tool outputs (max results/quiz items, truncation).
9. Clearly distinguish unavailable information (`insufficientInfo`/`available: false`/`found: false`) from generated content.

## Testing Strategy (defined — all mocked, zero real API calls)

- MCP server initialization (server boots, capabilities advertised)
- Tool registration (all 7 registered with correct names/descriptions/schemas)
- Input validation (missing/oversized/out-of-enum inputs per tool)
- Output schema validation (shape per tool)
- `searchAcademyContent` (grounded answer + sources; insufficient info; suggested topics)
- `getChapter` (real chapter; **nonexistent chapter → found: false, no fabrication**)
- `getSection` (real section; **nonexistent section → found: false**)
- `getLearningPath` (ordered path; real URLs; `from`/`max` behavior)
- `generateQuiz` (items grounded; sources attached; invalid topic)
- `translateContent` (EN→UR; UR→EN; preservedTerms; oversized text)
- `getProjectInstructions` (available when instructions exist; `available: false` otherwise)
- Prompt injection (malicious content treated as data, never instructions)
- Provider errors (`AI_PROVIDER_ERROR`), quota errors (`AI_QUOTA_EXCEEDED`), fail-fast
- Secret leakage (no key/stack/provider text in any tool result)
- Source preservation and real Academy URLs
- Delegation verification (tools call the M4/M5/M6 services — asserted via mocks)
- Regression: all M4 (70) + M5/M6 (108) tests remain green

## Acceptance Criteria

- [ ] All seven MCP capabilities specified with explicit input/output schemas
- [ ] Existing M4/M5/M6 services reused — no duplicated RAG/Tutor/Translator logic
- [ ] Security boundaries explicit (no secrets, no raw errors, bounded outputs)
- [ ] Prompt-injection protection specified (`<academy_content>` reference-data boundary)
- [ ] Grounding/source requirements explicit per tool
- [ ] Error behavior defined per tool (safe codes, unavailable-vs-generated distinction)
- [ ] Testing strategy covers every tool + security cases, all mocked
- [ ] MCP SDK decision documented (`@modelcontextprotocol/sdk`) with alternatives, compatibility, and transport recommendation (stdio primary, Streamable HTTP future)
- [ ] No implementation code created
- [ ] No packages installed
- [ ] `npm run ingest` NOT executed
- [ ] `data/vector-store.json` NOT modified
- [ ] `src/rag` NOT modified
- [ ] M4/M5/M6 functionality untouched
- [ ] The five specification documents follow the repository's SDD format

## Version

1.0.0 | Created: 2026-08-17 | Status: Draft (awaiting approval)
