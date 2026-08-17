# M4 — RAG / Ask the Book Tasks

## Phase 1: Foundation

### Task 1.1: Project Setup
- [ ] Create `src/rag/` directory structure
- [ ] Create `src/rag/types/` for TypeScript interfaces
- [ ] Create `src/rag/providers/` for provider abstractions
- [ ] Create `src/rag/services/` for business logic
- [ ] Create `src/rag/utils/` for utility functions
- [ ] Create `src/rag/__tests__/` for tests
- [ ] Set up `tsconfig.rag.json` for RAG-specific TypeScript config
- [ ] Configure `.env.example` with required environment variables

**Acceptance Criteria**:
- Directory structure created
- TypeScript config works
- Environment variables documented

### Task 1.2: TypeScript Types
- [ ] Define `ChunkMetadata` interface
- [ ] Define `DocumentMetadata` interface
- [ ] Define `Chunk` interface (content + metadata + embedding)
- [ ] Define `AskRequest` interface
- [ ] Define `AskResponse` interface
- [ ] Define `Source` interface
- [ ] Define `AskError` interface
- [ ] Define provider interfaces (`EmbeddingProvider`, `LLMProvider`, `VectorStore`)

**Acceptance Criteria**:
- All types defined
- Types are consistent across interfaces
- Types exported from index file

### Task 1.3: Environment Configuration
- [ ] Create `.env.example` with all required variables
- [ ] Document `OPENAI_API_KEY` requirement
- [ ] Document `OPENAI_EMBEDDING_MODEL` optional (default: text-embedding-3-small)
- [ ] Document `OPENAI_LLM_MODEL` optional (default: gpt-4o-mini)
- [ ] Document `VECTOR_STORE_TYPE` optional (default: memory)
- [ ] Document `CHROMA_URL` optional (for ChromaDB)
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Create `src/rag/config.ts` to load configuration

**Acceptance Criteria**:
- `.env.example` complete
- Config loads correctly
- No secrets committed

## Phase 2: Content Ingestion

### Task 2.1: Document Loader
- [ ] Create `src/rag/ingestion/document-loader.ts`
- [ ] Implement recursive directory scanning
- [ ] Filter `.md` and `.mdx` files
- [ ] Read file contents
- [ ] Extract frontmatter using `gray-matter`
- [ ] Return `DocumentMetadata` for each file

**Acceptance Criteria**:
- Loads all markdown files from `docs/`
- Extracts frontmatter correctly
- Handles errors gracefully

### Task 2.2: Markdown Parser
- [ ] Create `src/rag/ingestion/markdown-parser.ts`
- [ ] Parse markdown to AST
- [ ] Extract sections by `##` headings
- [ ] Preserve code blocks as atomic units
- [ ] Extract inline code and links
- [ ] Return structured sections

**Acceptance Criteria**:
- Parses markdown correctly
- Code blocks preserved
- Sections split by headings

### Task 2.3: Section Splitter
- [ ] Create `src/rag/ingestion/section-splitter.ts`
- [ ] Split document by level-2 headings
- [ ] Preserve heading hierarchy
- [ ] Track section positions (start/end lines)
- [ ] Handle nested sections
- [ ] Return sections with metadata

**Acceptance Criteria**:
- Sections split correctly
- Positions tracked
- Nested sections handled

### Task 2.4: Chunking Algorithm
- [ ] Create `src/rag/ingestion/chunker.ts`
- [ ] Implement semantic chunking logic
- [ ] Preserve code blocks as atomic units
- [ ] Split large sections by paragraphs
- [ ] Add heading context to each chunk
- [ ] Generate chunk metadata
- [ ] Respect size limits (200-1000 tokens)

**Acceptance Criteria**:
- Chunks preserve semantic context
- Code blocks never split
- Size limits respected
- Metadata correct

### Task 2.5: Ingestion Pipeline
- [ ] Create `src/rag/ingestion/pipeline.ts`
- [ ] Orchestrate document loading
- [ ] Orchestrate parsing and splitting
- [ ] Orchestrate chunking
- [ ] Generate embeddings for chunks
- [ ] Insert into vector store
- [ ] Handle errors and retries
- [ ] Report progress

**Acceptance Criteria**:
- Pipeline processes all 10 chapters
- Progress reported
- Errors handled gracefully

## Phase 3: Embeddings & Vector Store

### Task 3.1: Embedding Provider Interface
- [ ] Create `src/rag/providers/embedding/embedding-provider.ts`
- [ ] Define `EmbeddingProvider` interface
- [ ] Define `embed(text: string): Promise<number[]>` method
- [ ] Define `embedBatch(texts: string[]): Promise<number[][]>` method

**Acceptance Criteria**:
- Interface defined
- Methods typed correctly

### Task 3.2: OpenAI Embedding Provider
- [ ] Create `src/rag/providers/embedding/openai-embedding.ts`
- [ ] Implement `EmbeddingProvider` interface
- [ ] Use `text-embedding-3-small` model
- [ ] Handle rate limits with exponential backoff
- [ ] Handle API errors gracefully
- [ ] Add request/response logging

**Acceptance Criteria**:
- Embeddings generated correctly
- Rate limits handled
- Errors handled

### Task 3.3: Vector Store Interface
- [ ] Create `src/rag/providers/vector-store/vector-store.ts`
- [ ] Define `VectorStore` interface
- [ ] Define `upsert(chunks: Chunk[]): Promise<void>` method
- [ ] Define `search(embedding: number[], topK: number): Promise<SearchResult[]>` method
- [ ] Define `delete(filter: MetadataFilter): Promise<void>` method
- [ ] Define `get(filter: MetadataFilter): Promise<Chunk[]>` method

**Acceptance Criteria**:
- Interface defined
- Methods typed correctly

### Task 3.4: In-Memory Vector Store
- [ ] Create `src/rag/providers/vector-store/memory-vector-store.ts`
- [ ] Implement `VectorStore` interface
- [ ] Store chunks in memory
- [ ] Implement cosine similarity search
- [ ] Implement metadata filtering
- [ ] Handle large datasets efficiently

**Acceptance Criteria**:
- Stores and retrieves chunks
- Similarity search works
- Metadata filtering works

### Task 3.5: Vector Store Factory
- [ ] Create `src/rag/providers/vector-store/index.ts`
- [ ] Implement factory pattern
- [ ] Create store based on `VECTOR_STORE_TYPE` env var
- [ ] Default to in-memory store
- [ ] Support future ChromaDB implementation

**Acceptance Criteria**:
- Factory creates correct store type
- Configuration works
- Extensible for future stores

## Phase 4: RAG Pipeline

### Task 4.1: Retriever Service
- [ ] Create `src/rag/services/retriever.ts`
- [ ] Implement similarity search
- [ ] Add relevance scoring
- [ ] Implement deduplication
- [ ] Filter by metadata
- [ ] Return top-k results

**Acceptance Criteria**:
- Retrieves relevant chunks
- Scores calculated correctly
- Deduplication works

### Task 4.2: Context Assembler
- [ ] Create `src/rag/services/context-assembler.ts`
- [ ] Format chunks for LLM
- [ ] Add source markers
- [ ] Manage context window size
- [ ] Order by relevance
- [ ] Return formatted context

**Acceptance Criteria**:
- Context formatted correctly
- Source markers added
- Context window respected

### Task 4.3: LLM Provider Interface
- [ ] Create `src/rag/providers/llm/llm-provider.ts`
- [ ] Define `LLMProvider` interface
- [ ] Define `generate(prompt: string, systemPrompt: string): Promise<string>` method

**Acceptance Criteria**:
- Interface defined
- Methods typed correctly

### Task 4.4: OpenAI LLM Provider
- [ ] Create `src/rag/providers/llm/openai-llm.ts`
- [ ] Implement `LLMProvider` interface
- [ ] Use `gpt-4o-mini` model
- [ ] Implement system prompt for grounded responses
- [ ] Handle rate limits with exponential backoff
- [ ] Handle API errors gracefully

**Acceptance Criteria**:
- LLM generates responses
- System prompt enforced
- Errors handled

### Task 4.5: RAG Service
- [ ] Create `src/rag/services/rag-service.ts`
- [ ] Orchestrate full RAG pipeline
- [ ] Embed user query
- [ ] Retrieve relevant chunks
- [ ] Assemble context
- [ ] Generate grounded response
- [ ] Extract source citations
- [ ] Handle insufficient information
- [ ] Return structured response

**Acceptance Criteria**:
- Full pipeline works
- Grounded responses generated
- Sources cited correctly
- Insufficient info handled

## Phase 5: API Layer

### Task 5.1: Ask API Endpoint
- [ ] Create `src/rag/api/ask.ts`
- [ ] Implement POST `/api/ask` handler
- [ ] Validate input (question length, characters)
- [ ] Call RAG service
- [ ] Format response
- [ ] Handle errors
- [ ] Return JSON response

**Acceptance Criteria**:
- API endpoint works
- Input validated
- Errors handled
- Response formatted correctly

### Task 5.2: Health Check Endpoint
- [ ] Create `src/rag/api/health.ts`
- [ ] Implement GET `/api/ask/health` handler
- [ ] Check vector store connectivity
- [ ] Check LLM provider connectivity
- [ ] Return health status

**Acceptance Criteria**:
- Health check works
- Status reported correctly

### Task 5.3: Ingestion Script
- [ ] Create `scripts/ingest.ts`
- [ ] Implement CLI interface
- [ ] Load configuration
- [ ] Run ingestion pipeline
- [ ] Report progress
- [ ] Handle errors
- [ ] Add to `package.json` scripts

**Acceptance Criteria**:
- `npm run ingest` works
- Progress reported
- Errors handled

## Phase 6: UI

### Task 6.1: Ask the Book Page
- [ ] Create `src/pages/ask.tsx`
- [ ] Implement question input
- [ ] Implement submit handler
- [ ] Implement answer display
- [ ] Implement source citations
- [ ] Implement loading state
- [ ] Implement error state
- [ ] Implement insufficient info state

**Acceptance Criteria**:
- Page renders correctly
- All states handled
- Responsive design

### Task 6.2: Source Citation Component
- [ ] Create `src/components/SourceCitation.tsx`
- [ ] Display source title
- [ ] Display source section
- [ ] Display source link
- [ ] Display relevance score
- [ ] Handle click navigation

**Acceptance Criteria**:
- Sources displayed correctly
- Links work
- Accessible

### Task 6.3: Integration
- [ ] Add "Ask the Book" to navbar in `docusaurus.config.ts`
- [ ] Style with existing theme
- [ ] Test responsive design
- [ ] Test accessibility
- [ ] Test dark mode

**Acceptance Criteria**:
- Navbar link works
- Styling consistent
- Responsive on all devices
- Accessible

## Phase 7: Testing

### Task 7.1: Unit Tests
- [ ] Test document loader
- [ ] Test markdown parser
- [ ] Test section splitter
- [ ] Test chunker
- [ ] Test embedding provider (mock)
- [ ] Test vector store (mock)
- [ ] Test retriever
- [ ] Test context assembler
- [ ] Test LLM provider (mock)
- [ ] Test RAG service

**Acceptance Criteria**:
- All unit tests pass
- Coverage > 80%

### Task 7.2: Integration Tests
- [ ] Test ingestion pipeline
- [ ] Test ask API endpoint
- [ ] Test error scenarios
- [ ] Test insufficient info behavior

**Acceptance Criteria**:
- All integration tests pass
- Edge cases covered

### Task 7.3: Final Verification
- [ ] Run `npm run build`
- [ ] Verify no broken links
- [ ] Verify no secrets exposed
- [ ] Test on mobile devices
- [ ] Verify accessibility

**Acceptance Criteria**:
- Build succeeds
- No broken links
- No secrets exposed
- Works on mobile
- Accessible

## Task Summary

- Phase 1: 3 tasks (Foundation)
- Phase 2: 5 tasks (Ingestion)
- Phase 3: 5 tasks (Embeddings & Vector Store)
- Phase 4: 5 tasks (RAG Pipeline)
- Phase 5: 3 tasks (API Layer)
- Phase 6: 3 tasks (UI)
- Phase 7: 3 tasks (Testing)
- **Total**: 27 tasks
