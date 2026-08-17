// M4 — Vector Store Interface

import type { Chunk, SearchResult, MetadataFilter } from '../../types';

export interface VectorStore {
  name: string;
  upsert(chunks: Chunk[]): Promise<void>;
  search(embedding: number[], topK: number, filter?: MetadataFilter): Promise<SearchResult[]>;
  delete(filter: MetadataFilter): Promise<void>;
  get(filter: MetadataFilter): Promise<Chunk[]>;
  count(): Promise<number>;
  reset(): Promise<void>;
}
