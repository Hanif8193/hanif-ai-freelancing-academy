# M4 — RAG / Ask the Book Plan

## Overview

Implement a RAG system that allows learners to ask questions about Academy content and receive grounded answers with source citations.

## Implementation Phases

### Phase 1: Foundation (Days 1-2)

#### 1.1 Project Setup
- Create `src/rag/` directory structure
- Set up TypeScript types and interfaces
- Configure environment variables
- Set up testing framework

#### 1.2 Content Ingestion Pipeline
- Create document loader for markdown/MDX files
- Implement frontmatter extraction
- Implement markdown parsing
- Create section splitter
- Implement chunking algorithm with code block preservation
- Create metadata extractor

### Phase 2: Embeddings & Vector Store (Days 3-4)

#### 2.1 Embedding Provider
- Create `EmbeddingProvider` interface
- Implement OpenAI embedding provider
- Create provider factory
- Add configuration and error handling

#### 2.2 Vector Store
- Create `VectorStore` interface
- Implement in-memory vector store
- Implement ChromaDB vector store
- Add metadata filtering
- Create vector store factory

### Phase 3: RAG Pipeline (Days 5-6)

#### 3.1 Retriever
- Create retriever service
- Implement similarity search
- Add relevance scoring
- Implement deduplication

#### 3.2 Context Assembly
- Create context assembler
- Implement chunk formatting
- Add source marker insertion
- Implement context window management

#### 3.3 LLM Provider
- Create `LLMProvider` interface
- Implement OpenAI LLM provider
- Create provider factory
- Implement grounded response generation

### Phase 4: API Layer (Days 7-8)

#### 4.1 API Routes
- Create `/api/ask` endpoint
- Implement input validation
- Add error handling
- Create health check endpoint

#### 4.2 Ingestion Script
- Create `npm run ingest` command
- Implement CLI interface
- Add progress reporting
- Handle errors gracefully

### Phase 5: UI (Days 9-10)

#### 5.1 Ask the Book Page
- Create `/ask` route
- Implement question input component
- Create answer display component
- Implement source citation component
- Add loading and error states

#### 5.2 Integration
- Add "Ask the Book" to navbar
- Style with Docusaurus theme
- Ensure responsive design
- Verify accessibility

### Phase 6: Testing & Polish (Days 11-12)

#### 6.1 Unit Tests
- Test document loader
- Test chunking algorithm
- Test metadata extraction
- Test embedding generation (mock)
- Test vector store operations
- Test context assembly
- Test source citation

#### 6.2 Integration Tests
- Test ingestion pipeline
- Test ask API endpoint
- Test error scenarios
- Test insufficient info behavior

#### 6.3 Final Verification
- Run all tests
- Verify build succeeds
- Check for broken links
- Verify no secrets exposed
- Test on mobile devices

## Dependencies

### External Dependencies (to install)
- `@langchain/textsplitters` - Text splitting utilities
- `openai` - OpenAI API client
- `chromadb` - ChromaDB client (optional)
- `marked` or `remark` - Markdown parsing
- `gray-matter` - Frontmatter extraction

### Internal Dependencies
- M1 Foundation (complete)
- M2 Docusaurus Foundation (complete)
- M3 Initial Learning Content (complete)

## Risk Mitigation

1. **Cost control**: Use gpt-4o-mini and text-embedding-3-small for cost efficiency
2. **Vercel compatibility**: Use in-memory vector store as fallback
3. **Rate limiting**: Implement exponential backoff
4. **Error handling**: Graceful degradation for all failure modes
5. **Testing**: Comprehensive tests before deployment

## Estimated Effort

- Phase 1: 2 days
- Phase 2: 2 days
- Phase 3: 2 days
- Phase 4: 2 days
- Phase 5: 2 days
- Phase 6: 2 days
- **Total**: 12 days

## Success Criteria

- All 10 chapters ingestible
- Questions answered with grounded responses
- Source citations accurate and clickable
- Insufficient info clearly indicated
- UI responsive and accessible
- All tests pass
- Build succeeds
- No secrets exposed
