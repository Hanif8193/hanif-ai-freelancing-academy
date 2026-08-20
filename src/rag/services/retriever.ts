// M4 — Retriever Service
// Retrieves relevant chunks from the vector store
// M4 enhancement — metadata-aware reranking to improve precision for
// dedicated-chapter queries, and a tighter relevance gate to reject
// clearly out-of-scope questions before they reach the LLM.

import type { SearchResult, MetadataFilter } from '../types';
import type { EmbeddingProvider, VectorStore } from '../providers';

export interface RetrieverConfig {
  topK: number;
  minScore?: number;
}

const DEFAULT_CONFIG: RetrieverConfig = {
  topK: 5,
  minScore: 0.5,
};

// ── Metadata reranking ──────────────────────────────────────────
// Normalised query and chapter/section tokens used to detect when a
// query is about a specific dedicated chapter.  A match bumps the
// score so the right chapter surfaces above generic results.

/** Strip common stop-words then split into lowercase tokens. */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

/**
 * Compute a metadata boost for a search result given the query tokens.
 * Returns 0 when there is no meaningful title/section overlap.
 */
export function metadataBoost(queryTokens: string[], result: SearchResult): number {
  const titleTokens = tokenize(result.chunk.metadata.title);
  const sectionTokens = tokenize(result.chunk.metadata.section);
  const metaTokens = new Set([...titleTokens, ...sectionTokens]);

  let matches = 0;
  for (const qt of queryTokens) {
    if (metaTokens.has(qt)) matches++;
  }

  // Require at least 2 token overlaps to avoid false-positive boosts.
  if (matches < 2) return 0;

  // Scale boost by the fraction of query tokens matched, capped at 0.25.
  return Math.min(0.25, (matches / queryTokens.length) * 0.5);
}

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

    // Search the vector store — fetch a wider pool so reranking has room
    const fetchK = this.config.topK * 3;
    const rawResults = await this.vectorStore.search(
      queryEmbedding,
      fetchK,
      filter
    );

    // Apply metadata-based reranking to boost dedicated-chapter results
    const queryTokens = tokenize(query);
    const reranked = rawResults.map(r => ({
      ...r,
      score: Math.min(1, r.score + metadataBoost(queryTokens, r)),
    }));

    // Re-sort by boosted score (best first)
    reranked.sort((a, b) => b.score - a.score);

    // Trim to topK and filter by minimum score
    return reranked
      .slice(0, this.config.topK)
      .filter(result => result.score >= (this.config.minScore || 0));
  }
}
