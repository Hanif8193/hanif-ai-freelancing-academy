# M4 — RAG / Ask the Book Specification

**Feature Branch**: `m4-rag-ask-the-book`
**Created**: 2026-08-17
**Status**: Draft
**Input**: User description: "Allow learners to ask questions about the Academy's learning content and receive grounded answers based on the actual Docusaurus book content."

## Product Vision

Implement a Retrieval-Augmented Generation (RAG) system that allows learners to ask natural language questions about the Academy's content and receive accurate, grounded answers with source citations. The system prioritizes Academy content and clearly indicates when information is insufficient.

## Scope

### In Scope
- Content ingestion pipeline for Docusaurus markdown/MDX files
- Markdown parsing with code block preservation
- Semantic chunking with metadata preservation
- Embedding generation (provider-agnostic)
- Vector storage with metadata filtering
- Retrieval system with relevance scoring
- Context assembly for LLM prompts
- LLM response generation (provider-agnostic)
- Source citation with chapter/section attribution
- Ask the Book UI component
- Error handling and "insufficient information" behavior
- Basic testing for core components

### Out of Scope
- Hanif AI Tutor
- English ↔ Urdu Translator Agent
- MCP (Model Context Protocol)
- Authentication / User accounts
- Payments / Subscriptions
- Learning progress tracking
- Advanced freelancing agents
- Real-time streaming responses (future enhancement)
- Multi-language RAG (future enhancement)

## Target Users

1. **Learners**: Students using the Academy content
2. **Self-learners**: People studying independently
3. **Reviewers**: People reviewing content for accuracy

## User Scenarios

### User Story 1 — Ask a Question (Priority: P1)

As a learner, I want to ask a natural language question about the Academy content so that I can get a grounded answer without searching through chapters.

**Acceptance Scenarios**:
1. **Given** user is on the Ask the Book page, **When** they type a question, **Then** they receive a grounded answer based on Academy content
2. **Given** user asks a question, **When** the system retrieves relevant content, **Then** the answer includes source citations
3. **Given** user asks a question, **When** Academy content is insufficient, **Then** the system clearly indicates the limitation

### User Story 2 — View Sources (Priority: P1)

As a learner, I want to see which chapters and sections the answer came from so that I can verify and explore further.

**Acceptance Scenarios**:
1. **Given** user receives an answer, **When** they view sources, **Then** they see chapter, section, and link for each source
2. **Given** user clicks a source link, **When** navigation occurs, **Then** they reach the specific section in the documentation

### User Story 3 — Insufficient Information (Priority: P1)

As a learner, I want to be clearly informed when the Academy content doesn't contain enough information to answer my question so that I don't receive fabricated answers.

**Acceptance Scenarios**:
1. **Given** user asks a question outside Academy scope, **When** retrieval finds insufficient context, **Then** the system states that Academy content doesn't contain enough information
2. **Given** user asks a question, **When** no relevant content is found, **Then** the system suggests related topics from the Academy

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER / CLIENT                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Ask the Book UI Component              │    │
│  │  - Question input                                   │    │
│  │  - Answer display                                   │    │
│  │  - Source citations                                 │    │
│  │  - Loading states                                   │    │
│  │  - Error states                                     │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS API Call
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVER / API                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              /api/ask endpoint                      │    │
│  │  - Input validation                                 │    │
│  │  - Rate limiting (future)                           │    │
│  │  - Secrets management                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              RAG Pipeline                           │    │
│  │  1. Query embedding                                 │    │
│  │  2. Vector search                                   │    │
│  │  3. Context assembly                                │    │
│  │  4. LLM response generation                         │    │
│  │  5. Source citation extraction                      │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Vector Store   │ │  LLM Provider   │ │  Embedding      │
│  (Local/Cloud)  │ │  (API)          │ │  Provider (API) │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Ingestion Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  CONTENT INGESTION                          │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  Docusaurus     │    │  Content Processing Pipeline    │ │
│  │  docs/ directory│───▶│                                 │ │
│  │  *.md, *.mdx    │    │  1. File discovery              │ │
│  └─────────────────┘    │  2. Markdown parsing            │ │
│                         │  3. Frontmatter extraction      │ │
│                         │  4. Section splitting           │ │
│                         │  5. Code block preservation     │ │
│                         │  6. Metadata extraction         │ │
│                         │  7. Chunking                    │ │
│                         │  8. Embedding generation        │ │
│                         │  9. Vector store insertion      │ │
│                         └─────────────────────────────────┘ │
│                                    │                        │
│                                    ▼                        │
│                         ┌─────────────────────────────────┐ │
│                         │  Vector Store                   │ │
│                         │  - Chunks with embeddings       │ │
│                         │  - Metadata for filtering       │ │
│                         │  - Source attribution            │ │
│                         └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Boundaries

#### Browser/Client Boundary
- UI rendering and user interaction
- API calls to server endpoints
- No direct access to API keys or secrets
- No direct access to vector store

#### Server/API Boundary
- All AI/LLM API calls
- All embedding generation
- Vector store access
- Secrets management
- Rate limiting (future)

#### Secrets Boundary
- API keys stored in `.env` files
- Never committed to version control
- Never exposed to browser
- Loaded via `process.env` in server code

## Technology Decisions

### Vector Database Decision

#### Options Evaluated

| Option | Local Dev | Cost | Vercel | Metadata | DX | Verdict |
|--------|-----------|------|--------|----------|-----|---------|
| ChromaDB | ✅ Easy | ✅ Free | ⚠️ Needs adapter | ✅ Yes | ✅ Good | **Selected** |
| Pinecone | ⚠️ Cloud | ⚠️ Paid tier | ✅ Yes | ✅ Yes | ✅ Good | Rejected (cost) |
| Qdrant | ✅ Docker | ✅ Free | ⚠️ Needs adapter | ✅ Yes | ✅ Good | Alternative |
| Weaviate | ⚠️ Docker | ✅ Free | ⚠️ Complex | ✅ Yes | ⚠️ Complex | Rejected (DX) |
| In-memory (simple) | ✅ Easy | ✅ Free | ✅ Yes | ⚠️ Limited | ✅ Good | **Fallback** |
| localStorage | ✅ Easy | ✅ Free | ✅ Yes | ❌ No | ✅ Good | Rejected (limited) |

#### Decision: ChromaDB with In-Memory Fallback

**Primary**: ChromaDB
- Local development simplicity
- Free and open source
- Good metadata filtering
- Python and JavaScript clients
- Persistent storage

**Fallback**: In-memory vector store
- **ONLY for testing and development**
- **NOT for persistent production storage**
- Zero configuration
- Works anywhere JavaScript runs
- Good for Vercel serverless development

**Important**: The in-memory vector store is a development/testing fallback only. Production deployments must use a persistent vector store (ChromaDB, Qdrant, Pinecone, etc.). The vector store interface is abstracted so a persistent production provider can be introduced without rewriting the RAG pipeline.

### Embedding Provider Decision

#### Options Evaluated

| Provider | Cost | Quality | Vercel | Local | Verdict |
|----------|------|---------|--------|-------|---------|
| OpenAI | ⚠️ Paid | ✅ High | ✅ Yes | ✅ Yes | **Selected** |
| Cohere | ⚠️ Paid | ✅ High | ✅ Yes | ✅ Yes | Alternative |
| Local (all-MiniLM) | ✅ Free | ⚠️ Medium | ⚠️ Large model | ✅ Yes | Future |
| HuggingFace | ✅ Free tier | ✅ High | ✅ Yes | ✅ Yes | Alternative |

#### Decision: OpenAI Embeddings with Provider Abstraction

**Primary**: OpenAI `text-embedding-3-small`
- High quality embeddings
- Cost-effective ($0.00002/1K tokens)
- 1536 dimensions
- Good for semantic search

**Abstraction**: Provider interface
- `EmbeddingProvider` interface
- Can swap to Cohere, HuggingFace, or local models
- Configuration via environment variables

**Rationale**: OpenAI provides the best balance of quality and cost for initial implementation. The abstraction allows future providers without rewriting the system.

### LLM Provider Decision

#### Options Evaluated

| Provider | Cost | Quality | Vercel | Streaming | Verdict |
|----------|------|---------|--------|-----------|---------|
| OpenAI GPT-4o-mini | ⚠️ Paid | ✅ High | ✅ Yes | ✅ Yes | **Selected** |
| OpenAI GPT-4o | ⚠️ Paid | ✅ High | ✅ Yes | ✅ Yes | Alternative (expensive) |
| Claude 3.5 Sonnet | ⚠️ Paid | ✅ High | ✅ Yes | ✅ Yes | Alternative |
| Gemini 1.5 Flash | ✅ Free tier | ✅ High | ✅ Yes | ✅ Yes | Alternative |
| Local LLM | ✅ Free | ⚠️ Medium | ⚠️ Large | ⚠️ Slow | Future |

#### Decision: OpenAI GPT-4o-mini with Provider Abstraction

**Primary**: OpenAI `gpt-4o-mini`
- Cost-effective ($0.15/1M input tokens)
- Good quality for grounded Q&A
- Supports system prompts
- Fast response times

**Abstraction**: Provider interface
- `LLMProvider` interface
- Can swap to Claude, Gemini, or local models
- Configuration via environment variables

**Rationale**: GPT-4o-mini provides the best cost-to-quality ratio for grounded Q&A where the answer must come from provided context.

## Metadata Schema

### Chunk Metadata

```typescript
interface ChunkMetadata {
  // Source identification
  title: string;           // Chapter title
  module: string;          // Module name (e.g., "freelancing")
  chapter: string;         // Chapter number (e.g., "01")
  section: string;         // Section heading
  sourcePath: string;      // File path (e.g., "docs/freelancing/what-is-freelancing.md")
  url: string;             // URL to the section
  
  // Content classification
  contentType: 'text' | 'code' | 'example' | 'exercise' | 'summary';
  headingLevel: number;    // Heading level (1-6)
  
  // Position tracking
  chunkIndex: number;      // Position within the document
  startLine: number;       // Starting line number
  endLine: number;         // Ending line number
  
  // Additional context
  prerequisites?: string[]; // Related prerequisites
  tags?: string[];         // Content tags
}
```

### Document Metadata

```typescript
interface DocumentMetadata {
  title: string;
  module: string;
  chapter: string;
  sourcePath: string;
  url: string;
  lastModified: string;
  wordCount: number;
  hasCodeBlocks: boolean;
}
```

## Chunking Strategy

### Design Principles

1. **Semantic preservation**: Keep related content together
2. **Code preservation**: Never split code blocks from their explanations
3. **Section awareness**: Split on major sections, not arbitrary character counts
4. **Overlap for context**: Include heading context in each chunk
5. **Size limits**: Keep chunks between 200-1000 tokens for optimal retrieval

### Chunking Algorithm

```
1. Parse markdown file
2. Extract frontmatter as document metadata
3. Split by top-level sections (## headings)
4. For each section:
   a. If section < 500 tokens: keep as single chunk
   b. If section 500-1000 tokens: keep as single chunk
   c. If section > 1000 tokens:
      - Preserve code blocks as atomic units
      - Split remaining text by paragraphs
      - Group paragraphs into chunks of 300-600 tokens
      - Add heading context to each chunk
5. For each chunk:
   - Prepend section heading for context
   - Add metadata
   - Generate embedding
```

### Code Block Handling

Code blocks are preserved as atomic units:
- Never split a code block across chunks
- Keep code block with its preceding explanation
- Mark chunk as `contentType: 'code'` when code is primary content
- Include language tag in metadata

## API Design

### POST /api/ask

**Request**:
```typescript
interface AskRequest {
  question: string;        // User's question (1-500 characters)
  maxSources?: number;     // Maximum sources to return (default: 5)
  includeFullAnswer?: boolean; // Include full answer text (default: true)
}
```

**Response**:
```typescript
interface AskResponse {
  answer: string;          // Grounded answer text
  sources: Source[];       // Source citations
  insufficientInfo: boolean; // True if content is insufficient
  suggestedTopics?: string[]; // Related topics if insufficient
}

interface Source {
  title: string;           // Chapter title
  section: string;         // Section heading
  url: string;             // Link to source
  excerpt?: string;        // Optional short relevant excerpt
}
```

**Error Response**:
```typescript
interface AskError {
  error: string;           // Error message
  code: string;            // Error code
  details?: string;        // Additional details (dev only)
}
```

### GET /api/ask/health

Health check endpoint for monitoring.

## Content Ingestion Pipeline

### Pipeline Steps

1. **File Discovery**
   - Scan `docs/` directory recursively
   - Find all `.md` and `.mdx` files
   - Read frontmatter for metadata

2. **Markdown Parsing**
   - Parse markdown to AST
   - Extract sections by headings
   - Preserve code blocks
   - Extract inline code and references

3. **Section Splitting**
   - Split by `##` headings (level 2)
   - Preserve heading hierarchy
   - Track section positions

4. **Chunking**
   - Apply chunking algorithm
   - Preserve code blocks
   - Add heading context
   - Generate chunk metadata

5. **Embedding Generation**
   - Send chunk text to embedding provider
   - Generate vector embeddings
   - Handle rate limits and errors

6. **Vector Store Insertion**
   - Insert chunks with embeddings
   - Store metadata for filtering
   - Handle duplicates (idempotent ingestion)

### Ingestion Triggers

- **Manual**: Run `npm run ingest` command
- **Build-time**: Run during `npm run build`
- **Future**: Watch for content changes

### Idempotent Ingestion

The ingestion pipeline MUST be idempotent. Running ingestion multiple times must not create duplicate chunks.

**Stable Chunk IDs**: Each chunk receives a stable identifier based on:
- Source path (e.g., `docs/freelancing/what-is-freelancing.md`)
- Section heading (e.g., `What Is a Freelancer?`)
- Chunk index within section (e.g., `0`)

**ID Format**: `{sourcePath}::{section}::{chunkIndex}` (hashed for storage)

**Strategy**: Use upsert operations with stable IDs. If a chunk already exists, it is updated rather than duplicated.

## Grounded Response Generation

### System Prompt

```
You are an AI assistant for Hanif AI Freelancing Academy. Your role is to answer questions about the Academy's learning content.

RULES:
1. ONLY answer based on the provided context from Academy content
2. If the context doesn't contain enough information, clearly state that the Academy content doesn't contain enough information to answer
3. NEVER fabricate information or make up answers
4. Always cite your sources with chapter and section names
5. Be concise and helpful
6. Use clear, beginner-friendly language
7. If code examples are relevant, include them
8. If multiple sections are relevant, synthesize them accurately

FORMAT:
- Start with a direct answer
- Provide supporting details from the context
- List sources at the end
- If insufficient information, state clearly and suggest related topics
```

### Context Assembly

1. Retrieve top-k relevant chunks (k=5 default)
2. Sort by relevance score
3. Deduplicate overlapping content
4. Truncate to fit LLM context window
5. Format with source markers

### Source Citation Format

```
**Answer**:
[Grounded answer text]

**Sources**:
1. Chapter 01: What Is Freelancing? - Section: "What Is a Freelancer?"
   Link: /docs/freelancing/what-is-freelancing#what-is-a-freelancer
2. Chapter 02: How Freelancers Make Money - Section: "Pricing Models"
   Link: /docs/freelancing/how-freelancers-make-money#pricing-models
```

## UI Design

### Ask the Book Component

The Ask the Book UI is a dedicated page/section that provides:

1. **Question Input**: Text area for entering questions
2. **Submit Button**: Triggers the RAG pipeline
3. **Answer Display**: Shows the grounded answer
4. **Source Citations**: Lists sources with links
5. **Loading State**: Shows processing indicator
6. **Error State**: Shows error messages
7. **Insufficient Info State**: Shows limitation message

### Visual Design

- Matches existing Docusaurus theme (light/dark)
- Responsive design (mobile-friendly)
- Accessible (WCAG 2.1 AA)
- Professional appearance
- Clear distinction from regular search

### Integration Points

- Add "Ask the Book" to navbar
- Create `/ask` route
- Use existing theme colors and typography
- Follow existing component patterns

## Error Handling

### Error Types

1. **Invalid Input**: Question too long, empty, or invalid characters
2. **API Errors**: LLM or embedding provider failures
3. **Retrieval Errors**: Vector store failures
4. **Rate Limiting**: Too many requests (future)
5. **Insufficient Context**: No relevant content found

### Error Responses

Each error type returns a specific error code and user-friendly message.

### Fallback Behavior

- If LLM fails: Show error message
- If embedding fails: Show error message
- If retrieval fails: Show error message
- If insufficient context: State clearly, suggest topics

## Testing Strategy

### Unit Tests

1. **Document loading**: Test markdown parsing
2. **Chunking**: Test chunk generation and boundaries
3. **Metadata**: Test metadata extraction
4. **Embeddings**: Test embedding generation (mock)
5. **Retrieval**: Test vector search (mock)
6. **Context assembly**: Test context formatting
7. **Source citation**: Test citation generation

### Integration Tests

1. **Ingestion pipeline**: Test end-to-end ingestion
2. **Ask API**: Test question answering flow
3. **Error handling**: Test error scenarios
4. **Insufficient info**: Test boundary conditions

### Test Data

- Use existing 10 chapters as test data
- Create sample questions for each module
- Test edge cases (empty questions, out-of-scope questions)

## Performance Requirements

- **Ingestion**: Process all 10 chapters in < 60 seconds
- **Query response**: Return answer in < 5 seconds
- **API latency**: < 200ms for API overhead
- **Chunk retrieval**: < 100ms for vector search

## Security Requirements

- API keys never exposed to browser
- All AI calls server-side
- Input validation on all user inputs
- Rate limiting (future)
- No sensitive data in logs

## Acceptance Criteria

- [ ] Content ingestion pipeline works for all 10 chapters
- [ ] Chunks preserve semantic context and code blocks
- [ ] Metadata extraction works correctly
- [ ] Embedding generation works with provider abstraction
- [ ] Vector store stores and retrieves chunks
- [ ] Retrieval returns relevant chunks
- [ ] Context assembly formats chunks for LLM
- [ ] LLM generates grounded answers
- [ ] Source citations are accurate and clickable
- [ ] Insufficient info is clearly indicated
- [ ] UI is responsive and accessible
- [ ] Error handling works for all error types
- [ ] Tests pass for all components
- [ ] Build succeeds
- [ ] No secrets exposed to browser

## Version

1.0.0 | Created: 2026-08-17
