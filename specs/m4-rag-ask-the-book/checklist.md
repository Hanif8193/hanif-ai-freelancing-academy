# M4 — RAG / Ask the Book Checklist

## Specification Documents
- [ ] spec.md created
- [ ] plan.md created
- [ ] tasks.md created
- [ ] checklist.md created (this file)

## Phase 1: Foundation

### Project Setup
- [ ] `src/rag/` directory structure created
- [ ] `src/rag/types/` created
- [ ] `src/rag/providers/` created
- [ ] `src/rag/services/` created
- [ ] `src/rag/utils/` created
- [ ] `src/rag/__tests__/` created
- [ ] `tsconfig.rag.json` configured
- [ ] `.env.example` created

### TypeScript Types
- [ ] `ChunkMetadata` interface defined
- [ ] `DocumentMetadata` interface defined
- [ ] `Chunk` interface defined
- [ ] `AskRequest` interface defined
- [ ] `AskResponse` interface defined
- [ ] `Source` interface defined
- [ ] `AskError` interface defined
- [ ] Provider interfaces defined

### Environment Configuration
- [ ] `.env.example` complete
- [ ] Config loads correctly
- [ ] `.env` in `.gitignore`
- [ ] `src/rag/config.ts` created

## Phase 2: Content Ingestion

### Document Loader
- [ ] Directory scanning implemented
- [ ] File filtering works (.md, .mdx)
- [ ] Frontmatter extraction works
- [ ] Error handling implemented

### Markdown Parser
- [ ] Markdown parsing works
- [ ] Code blocks preserved
- [ ] Sections extracted correctly

### Section Splitter
- [ ] Splitting by headings works
- [ ] Position tracking works
- [ ] Nested sections handled

### Chunking Algorithm
- [ ] Semantic chunking implemented
- [ ] Code blocks preserved as atomic units
- [ ] Size limits respected (200-1000 tokens)
- [ ] Heading context added to chunks
- [ ] Metadata generated correctly

### Ingestion Pipeline
- [ ] Pipeline orchestrates all steps
- [ ] Progress reporting works
- [ ] Error handling implemented
- [ ] All 10 chapters processable

## Phase 3: Embeddings & Vector Store

### Embedding Provider
- [ ] Interface defined
- [ ] OpenAI provider implemented
- [ ] Rate limiting handled
- [ ] Error handling implemented

### Vector Store
- [ ] Interface defined
- [ ] In-memory store implemented
- [ ] Similarity search works
- [ ] Metadata filtering works
- [ ] Factory pattern implemented

## Phase 4: RAG Pipeline

### Retriever
- [ ] Similarity search implemented
- [ ] Relevance scoring works
- [ ] Deduplication works
- [ ] Top-k results returned

### Context Assembler
- [ ] Context formatting works
- [ ] Source markers added
- [ ] Context window managed

### LLM Provider
- [ ] Interface defined
- [ ] OpenAI provider implemented
- [ ] System prompt enforced
- [ ] Error handling implemented

### RAG Service
- [ ] Full pipeline works
- [ ] Grounded responses generated
- [ ] Sources cited correctly
- [ ] Insufficient info handled

## Phase 5: API Layer

### API Endpoints
- [ ] POST `/api/ask` implemented
- [ ] Input validation works
- [ ] Error handling implemented
- [ ] GET `/api/ask/health` implemented

### Ingestion Script
- [ ] `scripts/ingest.ts` created
- [ ] `npm run ingest` works
- [ ] Progress reporting works

## Phase 6: UI

### Ask the Book Page
- [ ] `/ask` route created
- [ ] Question input works
- [ ] Answer display works
- [ ] Source citations display
- [ ] Loading state works
- [ ] Error state works
- [ ] Insufficient info state works

### Source Citation Component
- [ ] Component created
- [ ] Sources displayed correctly
- [ ] Links work
- [ ] Accessible

### Integration
- [ ] Navbar link added
- [ ] Styling consistent
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] Accessibility verified

## Phase 7: Testing

### Unit Tests
- [ ] Document loader tests
- [ ] Markdown parser tests
- [ ] Section splitter tests
- [ ] Chunker tests
- [ ] Embedding provider tests (mock)
- [ ] Vector store tests (mock)
- [ ] Retriever tests
- [ ] Context assembler tests
- [ ] LLM provider tests (mock)
- [ ] RAG service tests

### Integration Tests
- [ ] Ingestion pipeline tests
- [ ] Ask API tests
- [ ] Error scenario tests
- [ ] Insufficient info tests

### Final Verification
- [ ] `npm run build` succeeds
- [ ] No broken links
- [ ] No secrets exposed
- [ ] Mobile testing passed
- [ ] Accessibility testing passed

## Content Quality
- [ ] All 10 chapters ingested correctly
- [ ] Chunks preserve semantic context
- [ ] Code blocks preserved
- [ ] Metadata accurate
- [ ] Source citations accurate

## Security
- [ ] API keys not exposed to browser
- [ ] All AI calls server-side
- [ ] Input validation implemented
- [ ] No secrets in logs
- [ ] `.env` not committed

## M4+ Feature Check
- [ ] No Hanif AI Tutor implemented
- [ ] No Translator Agent implemented
- [ ] No MCP implemented
- [ ] No Auth implemented
- [ ] No Payments implemented
- [ ] No Subscriptions implemented
- [ ] No Learning Progress implemented
- [ ] No Advanced Agents implemented
