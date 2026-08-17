# M6 — Translator Agent Specification

**Feature Branch**: `m6-translator-agent`
**Created**: 2026-08-17
**Status**: Draft (specification — implementation follows the M5-approved boundary)
**Input**: User description: "Implement the TranslatorAgent defined by M5 — English ↔ Urdu translation with preserved technical terminology, code blocks, URLs, file paths, commands, and Markdown structure, grounded in Academy content, with a clean provider boundary."

---

## Milestone Boundary (READ FIRST)

| Layer | Status | Scope |
|---|---|---|
| M1–M3 Foundation & Content | ✅ Existing | Untouched |
| M4 RAG / Ask the Book | ✅ Existing | Untouched |
| M5 Hanif AI Tutor | ✅ Existing | `TranslatorAgent` interface + glossary live in `src/tutor/translator.ts`; TutorService routes Translation mode through it |
| **M6 Translator Agent** | 📝 **This milestone** | Implement the agent + provider boundary behind the M5 interface |
| M7 MCP | ⏳ Future | Not implemented |

**Boundary guard**: do NOT modify `src/rag`; do NOT run `npm run ingest`; do NOT touch `data/vector-store.json`; do NOT implement M7.

---

## Product Vision

Implement the English ↔ Urdu Translator Agent that M5 defined as a boundary. The agent:

- Translates English ↔ Urdu and Urdu → English.
- Preserves technical terminology via the shared glossary (never blindly translates identifiers like React, Next.js, TypeScript, API, SDK, RAG, MCP, GitHub, Git, Docusaurus, OpenAI, Gemini, Claude, ChromaDB, Spec-Kit, AI Coding Agent, Agentic AI).
- Preserves code blocks, URLs, file paths, and commands **exactly**.
- Preserves Markdown structure (headings, lists, bold/italic, inline code, fenced blocks).
- Is **grounded** in supplied Academy content/context when translating Academy material (never fabricates).
- Sits behind a **clean provider boundary** so a future translation provider can replace Gemini without changing `TutorService` or the agent contract.
- Reuses the M4/M5 safe error classification (no raw provider errors, keys, or stack traces; quota fails fast).

## Scope

### In Scope
- `TranslatorAgent` implementation (`src/translator/TranslatorAgentImpl.ts`) satisfying the M5 interface
- `TranslationProvider` boundary (`src/translator/providers/interface.ts`)
- Gemini translation provider reusing the M4 LLM provider abstraction (`src/translator/providers/gemini.ts`)
- Provider factory (`src/translator/providers/factory.ts`)
- Translation prompt builder with glossary + Markdown-preservation rules + `<academy_content>` security boundary
- Glossary expansion (M6 term list) in `src/tutor/glossary.ts`
- Wire the agent into the Tutor endpoint so Translation mode works
- Contract update: `TranslationResult` uses `translatedText` (M6 contract) — small, tested ripple into `TutorService` + M5 tests
- Tests (all mocked, zero real API calls)

### Out of Scope
- M7 MCP implementation
- New translation endpoints/UI (translation is reached through the existing Tutor Translation mode)
- Dedicated non-LLM translation models (the provider boundary allows them later)
- Speech/TTS, offline translation
- Modifying `src/rag`

## Translation Contract

**Request options (M6):**
```typescript
interface TranslateOptions {
  preserveTerms?: boolean;      // default true
  preserveMarkdown?: boolean;   // default true
  level?: 'beginner' | 'intermediate' | 'advanced';
  context?: string;             // optional Academy context to ground the translation
}
```

**Result (M6):**
```typescript
interface TranslationResult {
  translatedText: string;
  sourceLanguage: 'en' | 'ur';
  targetLanguage: 'en' | 'ur';
  preservedTerms: string[];
}
```

**Provider boundary (internal):**
```typescript
interface TranslationProvider {
  name: string;
  translate(request: TranslationProviderRequest): Promise<TranslationProviderResult>;
}
// request: text, sourceLanguage, targetLanguage, preserveTechnicalTerms,
//          preserveMarkdown, level?, context?, explain?
// result:  { translatedText, preservedTerms }
```

## Preservation Rules

1. **Code blocks** (fenced ``` blocks) are copied verbatim — never translated.
2. **URLs, file paths, and commands** are preserved exactly.
3. **Technical identifiers** (React, Next.js, TypeScript, Python, JavaScript, API, SDK, RAG, MCP, GitHub, Git, Docusaurus, OpenAI, Gemini, Claude, ChromaDB, Spec-Kit, AI Coding Agent, Agentic AI, …) stay in English, with a brief Urdu explanation on first mention when helpful.
4. **Markdown structure** (headings, lists, bold/italic, inline code, links) is kept intact.
5. Glossary is the single source of terminology rules (shared by Tutor, Ask the Book, future MCP).

## Grounding

- When `context` (Academy content) is supplied, the translation is grounded in it and the content is treated as **reference data** wrapped in `<academy_content>` delimiters (M5 prompt-security boundary).
- Never fabricate content that is not in the supplied text/context.
- Prompt-injection protection: content from context is never treated as instructions.

## Error Handling

- Provider/LLM errors propagate to the existing M4 P0 `mapProviderError` (via the Tutor endpoint): quota → `AI_QUOTA_EXCEEDED` (429), provider → `AI_PROVIDER_ERROR` (502), auth → `AI_AUTH_ERROR`, internal → `INTERNAL_ERROR`.
- No raw Gemini errors, stack traces, API keys, or internal prompts reach the browser.
- Quota errors fail fast (the M4 LLM provider has no retry loop; no new retries added).

## Security

- API keys stay server-side (existing rules).
- Translation happens server-side through the LLM provider abstraction.
- Retrieved/context content is reference data, never instructions.
- No new secrets; `.env` remains untracked.

## Testing Strategy (defined — implemented with the code)

All mocked, zero real API calls:
1. Agent routes requests to the provider with correct option mapping
2. Result contract (`translatedText`, languages, `preservedTerms`)
3. explain mode passes `explain` flag + level
4. Provider builds a prompt with glossary + preservation rules
5. Context wrapped in `<academy_content>`; injected instructions stay out of the system prompt
6. JSON parsing of `{translatedText, preservedTerms}` + raw-text fallback
7. Provider errors propagate (quota/provider)
8. Glossary contains all required M6 terms
9. M5 contract tests updated (`translatedText`)
10. M4/M5 regression — all 148 existing tests remain green

## Acceptance Criteria

- [ ] `TranslatorAgent` interface satisfied by `TranslatorAgentImpl`
- [ ] English → Urdu and Urdu → English supported
- [ ] Glossary covers the M6 term list
- [ ] Code blocks/URLs/paths/commands/Markdown preservation enforced via prompt rules
- [ ] `<academy_content>` grounding boundary used when context supplied
- [ ] Clean `TranslationProvider` boundary (future providers swap without touching TutorService)
- [ ] No real API calls in tests
- [ ] All tests pass; typecheck 0 errors; build SUCCESS
- [ ] No `src/rag` modifications; no ingestion; vector store untouched
- [ ] M7 MCP not implemented

## Version

1.0.0 | Created: 2026-08-17 | Status: Draft
