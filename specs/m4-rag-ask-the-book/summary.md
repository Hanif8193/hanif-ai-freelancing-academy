# M4 — RAG / Ask the Book Summary

## Milestone Overview

M4 — RAG / Ask the Book implements a Retrieval-Augmented Generation system that allows learners to ask natural language questions about the Academy's content and receive grounded answers with source citations.

## Key Decisions

### Vector Database: ChromaDB with In-Memory Fallback

**Primary**: ChromaDB
- Local development simplicity
- Free and open source
- Good metadata filtering
- Persistent storage

**Fallback**: In-memory vector store
- **ONLY for testing and development**
- **NOT for persistent production storage**
- Zero configuration
- Works anywhere JavaScript runs

**Important**: The in-memory vector store is a development/testing fallback only. Production deployments must use a persistent vector store. The vector store interface is abstracted so a persistent production provider can be introduced without rewriting the RAG pipeline.

### Embedding Provider: Multi-Provider (OpenAI + Gemini)

Provider selection via `EMBEDDING_PROVIDER` env var (`openai` or `gemini`).

**OpenAI**: `text-embedding-3-small`
- High quality embeddings
- Cost-effective ($0.00002/1K tokens)
- 1536 dimensions

**Gemini**: `gemini-embedding-exp-03-07`
- Free tier available
- 768 dimensions
- Good quality for RAG

**Abstraction**: Provider interface allows swapping to any embedding provider without rewriting the pipeline.

### LLM Provider: Multi-Provider (OpenAI + Gemini)

Provider selection via `LLM_PROVIDER` env var (`openai` or `gemini`).

**OpenAI**: `gpt-4o-mini`
- Cost-effective ($0.15/1M input tokens)
- Good quality for grounded Q&A

**Gemini**: `gemini-2.0-flash`
- Free tier available
- Good quality for grounded Q&A
- Fast response times

**Abstraction**: Provider interface allows swapping to any LLM provider without rewriting the pipeline.

### Provider Factory

A factory pattern (`src/rag/providers/factory.ts`) creates the correct embedding/LLM providers based on env vars. The RAG pipeline, ingestion script, and API endpoints all use the factory — no provider-specific code in the pipeline.

## Architecture

### System Architecture

```
Browser → API Server → RAG Pipeline → Vector Store
                          ↓
                    Provider Factory
                     ↙        ↘
              OpenAI         Gemini
                     ↘        ↙
                    LLM Provider
                          ↓
                Grounded Answer + Sources
```

### Ingestion Architecture

```
Docusaurus docs/ → Parser → Chunker → Provider Factory → Embedder → Vector Store
```

### Boundaries

- **Browser**: UI only, no secrets
- **Server**: All AI/LLM calls, secrets management
- **Vector Store**: Chunk storage and retrieval

## Metadata Schema

```typescript
interface ChunkMetadata {
  title: string;
  module: string;
  chapter: string;
  section: string;
  sourcePath: string;
  url: string;
  contentType: 'text' | 'code' | 'example' | 'exercise' | 'summary';
  headingLevel: number;
  chunkIndex: number;
  startLine: number;
  endLine: number;
}
```

## Chunking Strategy

- Semantic preservation
- Code block preservation (atomic units)
- Section-aware splitting
- Size limits: 200-1000 tokens
- Heading context in each chunk

## API Design

### POST /api/ask

**Request**: `{ question: string, maxSources?: number }`

**Response**:
```typescript
{
  answer: string;
  sources: Source[];
  insufficientInfo: boolean;
  suggestedTopics?: string[];
}
```

### GET /api/ask/health

Returns provider status, selected providers, and vector store type.

## Source Citation Strategy

Every answer includes:
- Chapter title
- Section heading
- Link to source
- Relevant excerpt

## Security Approach

- API keys in `.env` (never committed)
- All AI calls server-side
- Input validation on all inputs
- Provider selection via env vars (no secrets in code)

## Testing Strategy

- Unit tests for all components including Gemini providers
- Integration tests for pipeline
- Mock external providers
- Test insufficient info behavior
- Test error scenarios
- 38 tests across 7 test suites

## Files Created

### Specification Documents
- `specs/m4-rag-ask-the-book/spec.md`
- `specs/m4-rag-ask-the-book/plan.md`
- `specs/m4-rag-ask-the-book/tasks.md`
- `specs/m4-rag-ask-the-book/checklist.md`
- `specs/m4-rag-ask-the-book/summary.md`

### Environment
- `.env.example` — Multi-provider env var template
- `.env` — Actual env vars (in .gitignore)

## Acceptance Criteria

1. All 10 chapters ingestible
2. Questions answered with grounded responses
3. Source citations accurate and clickable
4. Insufficient info clearly indicated
5. UI responsive and accessible
6. All tests pass (38/38)
7. Build succeeds
8. No secrets exposed
9. Multi-provider support (OpenAI + Gemini)

## Version

1.1.0 | Created: 2026-08-17 | Updated: 2026-08-17
