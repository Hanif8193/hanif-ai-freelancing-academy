// M4 — RAG / Ask the Book Types

// ============================================================
// Metadata Types
// ============================================================

export interface ChunkMetadata {
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
  hasCodeBlocks?: boolean; // Whether section contains code blocks
}

export interface DocumentMetadata {
  title: string;
  module: string;
  chapter: string;
  sourcePath: string;
  url: string;
  lastModified: string;
  wordCount: number;
  hasCodeBlocks: boolean;
}

// ============================================================
// Chunk Types
// ============================================================

export interface Chunk {
  id: string;              // Stable chunk ID (hash of sourcePath + section + chunkIndex)
  content: string;         // Chunk text content
  metadata: ChunkMetadata;
  embedding?: number[];    // Embedding vector (optional for storage)
}

export interface SearchResult {
  chunk: Chunk;
  score: number;           // Similarity score (0-1)
}

// ============================================================
// API Types
// ============================================================

export interface AskRequest {
  question: string;        // User's question (1-500 characters)
  maxSources?: number;     // Maximum sources to return (default: 5)
}

export interface AskResponse {
  answer: string;          // Grounded answer text
  sources: Source[];       // Source citations
  insufficientInfo: boolean; // True if content is insufficient
  suggestedTopics?: string[]; // Related topics if insufficient
}

export interface Source {
  title: string;           // Chapter title
  section: string;         // Section heading
  url: string;             // Link to source
  excerpt?: string;        // Optional short relevant excerpt
}

export interface AskError {
  error: string;           // Error message
  code: string;            // Error code
  details?: string;        // Additional details (dev only)
}

// ============================================================
// Provider Interfaces
// ============================================================

export interface EmbeddingProvider {
  name: string;
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
  getDimensions(): number;
}

export interface LLMProvider {
  name: string;
  generate(prompt: string, systemPrompt: string): Promise<string>;
}

export interface VectorStore {
  name: string;
  upsert(chunks: Chunk[]): Promise<void>;
  search(embedding: number[], topK: number, filter?: MetadataFilter): Promise<SearchResult[]>;
  delete(filter: MetadataFilter): Promise<void>;
  get(filter: MetadataFilter): Promise<Chunk[]>;
  count(): Promise<number>;
  reset(): Promise<void>;
}

export interface MetadataFilter {
  module?: string;
  chapter?: string;
  sourcePath?: string;
  contentType?: string;
}

// ============================================================
// Configuration Types
// ============================================================

export interface RAGConfig {
  // Provider selection
  embeddingProvider: 'openai' | 'gemini';
  llmProvider: 'openai' | 'gemini';

  // OpenAI
  openaiApiKey: string;
  openaiEmbeddingModel: string;
  openaiLlmModel: string;

  // Gemini
  geminiApiKey: string;
  geminiEmbeddingModel: string;
  geminiLlmModel: string;

  // Vector Store
  vectorStoreType: 'memory' | 'chroma';
  chromaUrl?: string;

  // RAG Settings
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  maxContextTokens: number;
}

// ============================================================
// Ingestion Types
// ============================================================

export interface IngestionResult {
  documentsProcessed: number;
  chunksCreated: number;
  chunksUpdated: number;
  errors: string[];
}

export interface ParsedDocument {
  metadata: DocumentMetadata;
  content: string;
  sections: ParsedSection[];
}

export interface ParsedSection {
  heading: string;
  headingLevel: number;
  content: string;
  startLine: number;
  endLine: number;
  hasCodeBlocks: boolean;
}
