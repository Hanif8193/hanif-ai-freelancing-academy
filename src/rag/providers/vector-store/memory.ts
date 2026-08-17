// M4 — In-Memory Vector Store with File Persistence
// Development fallback with JSON file persistence

import fs from 'fs';
import path from 'path';
import type { Chunk, SearchResult, MetadataFilter } from '../../types';
import type { VectorStore } from './interface';

export interface InMemoryVectorStoreConfig {
  persistPath?: string;
}

export class InMemoryVectorStore implements VectorStore {
  name = 'memory';
  private chunks: Map<string, Chunk> = new Map();
  private persistPath: string | null = null;

  constructor(config?: InMemoryVectorStoreConfig) {
    this.persistPath = config?.persistPath || null;
    if (this.persistPath) {
      this.loadFromDisk();
    }
  }

  async upsert(chunks: Chunk[]): Promise<void> {
    for (const chunk of chunks) {
      this.chunks.set(chunk.id, chunk);
    }
    this.saveToDisk();
  }

  async search(
    embedding: number[],
    topK: number,
    filter?: MetadataFilter
  ): Promise<SearchResult[]> {
    let candidates = Array.from(this.chunks.values());

    if (filter) {
      candidates = candidates.filter(chunk => this.matchesFilter(chunk, filter));
    }

    const results: SearchResult[] = candidates.map(chunk => ({
      chunk,
      score: chunk.embedding ? this.cosineSimilarity(embedding, chunk.embedding) : 0,
    }));

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, topK);
  }

  async delete(filter: MetadataFilter): Promise<void> {
    const toDelete: string[] = [];

    for (const [id, chunk] of this.chunks.entries()) {
      if (this.matchesFilter(chunk, filter)) {
        toDelete.push(id);
      }
    }

    for (const id of toDelete) {
      this.chunks.delete(id);
    }
    this.saveToDisk();
  }

  async get(filter: MetadataFilter): Promise<Chunk[]> {
    const chunks = Array.from(this.chunks.values());

    if (!filter) {
      return chunks;
    }

    return chunks.filter(chunk => this.matchesFilter(chunk, filter));
  }

  async count(): Promise<number> {
    return this.chunks.size;
  }

  async reset(): Promise<void> {
    this.chunks.clear();
    this.saveToDisk();
  }

  private loadFromDisk(): void {
    if (!this.persistPath) return;
    try {
      if (fs.existsSync(this.persistPath)) {
        const data = JSON.parse(fs.readFileSync(this.persistPath, 'utf-8'));
        if (Array.isArray(data)) {
          for (const chunk of data) {
            this.chunks.set(chunk.id, chunk);
          }
          console.log(`Loaded ${this.chunks.size} chunks from ${this.persistPath}`);
        }
      }
    } catch (error) {
      console.warn(`Failed to load vector store from ${this.persistPath}:`, error);
    }
  }

  private saveToDisk(): void {
    if (!this.persistPath) return;
    try {
      const dir = path.dirname(this.persistPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data = Array.from(this.chunks.values());
      fs.writeFileSync(this.persistPath, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save vector store to ${this.persistPath}:`, error);
    }
  }

  private matchesFilter(chunk: Chunk, filter: MetadataFilter): boolean {
    if (filter.module && chunk.metadata.module !== filter.module) {
      return false;
    }
    if (filter.chapter && chunk.metadata.chapter !== filter.chapter) {
      return false;
    }
    if (filter.sourcePath && chunk.metadata.sourcePath !== filter.sourcePath) {
      return false;
    }
    if (filter.contentType && chunk.metadata.contentType !== filter.contentType) {
      return false;
    }
    return true;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);

    if (denominator === 0) {
      return 0;
    }

    return dotProduct / denominator;
  }
}
