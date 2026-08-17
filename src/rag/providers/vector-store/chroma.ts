// M4 — ChromaDB Vector Store
// Primary vector store for development and production

import { ChromaClient, Collection } from 'chromadb';
import type { Chunk, SearchResult, MetadataFilter } from '../../types';
import type { VectorStore } from './interface';

export interface ChromaVectorStoreConfig {
  url?: string;
  collectionName?: string;
}

export class ChromaVectorStore implements VectorStore {
  name = 'chroma';
  private client: ChromaClient;
  private collectionName: string;
  private collection: Collection | null = null;

  constructor(config: ChromaVectorStoreConfig = {}) {
    this.client = new ChromaClient({
      path: config.url || 'http://localhost:8000',
    });
    this.collectionName = config.collectionName || 'hanif-academy';
  }

  private async getCollection(): Promise<Collection> {
    if (!this.collection) {
      this.collection = await this.client.getOrCreateCollection({
        name: this.collectionName,
      });
    }
    return this.collection;
  }

  async upsert(chunks: Chunk[]): Promise<void> {
    const collection = await this.getCollection();
    
    const ids = chunks.map(chunk => chunk.id);
    const documents = chunks.map(chunk => chunk.content);
    const embeddings = chunks.map(chunk => chunk.embedding!);
    const metadatas = chunks.map(chunk => ({
      title: chunk.metadata.title,
      module: chunk.metadata.module,
      chapter: chunk.metadata.chapter,
      section: chunk.metadata.section,
      sourcePath: chunk.metadata.sourcePath,
      url: chunk.metadata.url,
      contentType: chunk.metadata.contentType,
      headingLevel: chunk.metadata.headingLevel,
      chunkIndex: chunk.metadata.chunkIndex,
      startLine: chunk.metadata.startLine,
      endLine: chunk.metadata.endLine,
      hasCodeBlocks: chunk.metadata.hasCodeBlocks ?? false,
    }));

    await collection.upsert({
      ids,
      documents,
      embeddings,
      metadatas: metadatas as any,
    });
  }

  async search(
    embedding: number[],
    topK: number,
    filter?: MetadataFilter
  ): Promise<SearchResult[]> {
    const collection = await this.getCollection();
    
    // Build where clause for filtering
    let where: any = undefined;
    
    if (filter) {
      const conditions: any[] = [];
      
      if (filter.module) {
        conditions.push({ module: filter.module });
      }
      if (filter.chapter) {
        conditions.push({ chapter: filter.chapter });
      }
      if (filter.sourcePath) {
        conditions.push({ sourcePath: filter.sourcePath });
      }
      if (filter.contentType) {
        conditions.push({ contentType: filter.contentType });
      }
      
      if (conditions.length === 1) {
        where = conditions[0];
      } else if (conditions.length > 1) {
        where = { $and: conditions };
      }
    }

    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
      where,
    });

    const searchResults: SearchResult[] = [];
    
    if (results.ids && results.ids[0]) {
      for (let i = 0; i < results.ids[0].length; i++) {
        const chunk: Chunk = {
          id: results.ids[0][i],
          content: results.documents?.[0]?.[i] || '',
          metadata: this.parseMetadata(results.metadatas?.[0]?.[i] as Record<string, unknown> | undefined),
        };
        
        const score = results.distances?.[0]?.[i] || 0;
        
        searchResults.push({
          chunk,
          score: 1 - score, // Convert distance to similarity
        });
      }
    }

    return searchResults;
  }

  async delete(filter: MetadataFilter): Promise<void> {
    const collection = await this.getCollection();
    
    // Build where clause
    const conditions: any[] = [];
    
    if (filter.module) {
      conditions.push({ module: filter.module });
    }
    if (filter.chapter) {
      conditions.push({ chapter: filter.chapter });
    }
    if (filter.sourcePath) {
      conditions.push({ sourcePath: filter.sourcePath });
    }
    
    let where: any;
    if (conditions.length === 1) {
      where = conditions[0];
    } else if (conditions.length > 1) {
      where = { $and: conditions };
    }
    
    if (where) {
      await collection.delete({ where });
    }
  }

  async get(filter: MetadataFilter): Promise<Chunk[]> {
    const collection = await this.getCollection();
    
    // Build where clause
    const conditions: any[] = [];
    
    if (filter.module) {
      conditions.push({ module: filter.module });
    }
    if (filter.chapter) {
      conditions.push({ chapter: filter.chapter });
    }
    if (filter.sourcePath) {
      conditions.push({ sourcePath: filter.sourcePath });
    }
    
    let where: any;
    if (conditions.length === 1) {
      where = conditions[0];
    } else if (conditions.length > 1) {
      where = { $and: conditions };
    }

    const results = await collection.get({ where });
    
    return results.ids.map((id: string, index: number) => ({
      id,
      content: results.documents?.[index] || '',
      metadata: this.parseMetadata(results.metadatas?.[index] as Record<string, unknown> | undefined),
    }));
  }

  async count(): Promise<number> {
    const collection = await this.getCollection();
    return collection.count();
  }

  async reset(): Promise<void> {
    await this.client.deleteCollection({ name: this.collectionName });
    this.collection = null;
  }

  private parseMetadata(metadata: Record<string, unknown> | undefined): Chunk['metadata'] {
    if (!metadata) {
      return {
        title: '',
        module: '',
        chapter: '',
        section: '',
        sourcePath: '',
        url: '',
        contentType: 'text',
        headingLevel: 1,
        chunkIndex: 0,
        startLine: 0,
        endLine: 0,
        hasCodeBlocks: false,
      };
    }
    
    return {
      title: metadata.title as string || '',
      module: metadata.module as string || '',
      chapter: metadata.chapter as string || '',
      section: metadata.section as string || '',
      sourcePath: metadata.sourcePath as string || '',
      url: metadata.url as string || '',
      contentType: (metadata.contentType as Chunk['metadata']['contentType']) || 'text',
      headingLevel: metadata.headingLevel as number || 1,
      chunkIndex: metadata.chunkIndex as number || 0,
      startLine: metadata.startLine as number || 0,
      endLine: metadata.endLine as number || 0,
      hasCodeBlocks: metadata.hasCodeBlocks as boolean || false,
    };
  }
}
