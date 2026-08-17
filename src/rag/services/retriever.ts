// M4 — Retriever Service
// Retrieves relevant chunks from the vector store

import type { SearchResult, MetadataFilter } from '../types';
import type { EmbeddingProvider, VectorStore } from '../providers';

export interface RetrieverConfig {
  topK: number;
  minScore?: number;
}

const DEFAULT_CONFIG: RetrieverConfig = {
  topK: 5,
  minScore: 0.3,
};

export class Retriever {
  private embeddingProvider: EmbeddingProvider;
  private vectorStore: VectorStore;
  private config: RetrieverConfig;

  constructor(
    embeddingProvider: EmbeddingProvider,
    vectorStore: VectorStore,
    config: Partial<RetrieverConfig> = {}
  ) {
    this.embeddingProvider = embeddingProvider;
    this.vectorStore = vectorStore;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async retrieve(query: string, filter?: MetadataFilter): Promise<SearchResult[]> {
    // Generate embedding for the query
    const queryEmbedding = await this.embeddingProvider.embed(query);
    
    // Search the vector store
    const results = await this.vectorStore.search(
      queryEmbedding,
      this.config.topK,
      filter
    );
    
    // Filter by minimum score
    return results.filter(result => result.score >= (this.config.minScore || 0));
  }
}
