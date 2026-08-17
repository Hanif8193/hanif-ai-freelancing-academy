// M4 — Provider Factory Tests
// M9 — Extended with createVectorStore, config validation, and vector dimensions.

import { createEmbeddingProvider, createLLMProvider, createVectorStore } from '../providers/factory';
import { validateConfig, getVectorDimensions } from '../config';
import type { RAGConfig } from '../types';

function makeConfig(overrides: Partial<RAGConfig> = {}): RAGConfig {
  return {
    embeddingProvider: 'openai',
    llmProvider: 'openai',
    openaiApiKey: 'sk-test',
    openaiEmbeddingModel: 'text-embedding-3-small',
    openaiLlmModel: 'gpt-4o-mini',
    geminiApiKey: 'gemini-test',
    geminiEmbeddingModel: 'gemini-embedding-001',
    geminiLlmModel: 'gemini-2.0-flash',
    vectorStoreType: 'memory',
    chunkSize: 500,
    chunkOverlap: 100,
    topK: 5,
    maxContextTokens: 4000,
    ...overrides,
  };
}

describe('Provider Factory', () => {
  describe('createEmbeddingProvider', () => {
    it('should create OpenAI embedding provider', () => {
      const config = makeConfig({ embeddingProvider: 'openai' });
      const provider = createEmbeddingProvider(config);
      expect(provider.name).toBe('openai');
    });

    it('should create Gemini embedding provider', () => {
      const config = makeConfig({ embeddingProvider: 'gemini' });
      const provider = createEmbeddingProvider(config);
      expect(provider.name).toBe('gemini');
    });
  });

  describe('createLLMProvider', () => {
    it('should create OpenAI LLM provider', () => {
      const config = makeConfig({ llmProvider: 'openai' });
      const provider = createLLMProvider(config);
      expect(provider.name).toBe('openai');
    });

    it('should create Gemini LLM provider', () => {
      const config = makeConfig({ llmProvider: 'gemini' });
      const provider = createLLMProvider(config);
      expect(provider.name).toBe('gemini');
    });
  });

  // M9 — Vector store factory (memory | chroma | postgres)
  describe('createVectorStore', () => {
    it('should create the in-memory store by default', () => {
      const store = createVectorStore(makeConfig({ vectorStoreType: 'memory' }));
      expect(store.name).toBe('memory');
    });

    it('should create the Chroma store when configured with a URL', () => {
      const store = createVectorStore(
        makeConfig({ vectorStoreType: 'chroma', chromaUrl: 'http://localhost:8000' })
      );
      expect(store.name).toBe('chroma');
    });

    it('should create the Postgres store when configured with a URL', () => {
      const store = createVectorStore(
        makeConfig({ vectorStoreType: 'postgres', postgresUrl: 'postgresql://u:p@h:5432/db' })
      );
      expect(store.name).toBe('postgres');
    });

    it('should throw a clear error for postgres without a URL', () => {
      expect(() =>
        createVectorStore(makeConfig({ vectorStoreType: 'postgres', postgresUrl: '' }))
      ).toThrow('PostgresVectorStore requires a connection URL (POSTGRES_URL).');
    });
  });

  // M9 — Configuration validation
  describe('validateConfig', () => {
    it('requires POSTGRES_URL when VECTOR_STORE_TYPE=postgres', () => {
      const config = makeConfig({ vectorStoreType: 'postgres', postgresUrl: '' });
      expect(() => validateConfig(config)).toThrow(
        'POSTGRES_URL environment variable is required when VECTOR_STORE_TYPE=postgres'
      );
    });

    it('accepts postgres with a URL', () => {
      const config = makeConfig({
        vectorStoreType: 'postgres',
        postgresUrl: 'postgresql://u:p@h:5432/db',
      });
      expect(() => validateConfig(config)).not.toThrow();
    });

    it('requires CHROMA_URL when VECTOR_STORE_TYPE=chroma', () => {
      const config = makeConfig({ vectorStoreType: 'chroma', chromaUrl: '' });
      expect(() => validateConfig(config)).toThrow(
        'CHROMA_URL environment variable is required when VECTOR_STORE_TYPE=chroma'
      );
    });

    it('accepts memory without extra configuration', () => {
      expect(() => validateConfig(makeConfig())).not.toThrow();
    });
  });

  // M9 — pgvector dimensions
  describe('getVectorDimensions', () => {
    it('derives 768 for Gemini', () => {
      expect(getVectorDimensions(makeConfig({ embeddingProvider: 'gemini' }))).toBe(768);
    });

    it('derives 1536 for OpenAI', () => {
      expect(getVectorDimensions(makeConfig({ embeddingProvider: 'openai' }))).toBe(1536);
    });

    it('lets PGVECTOR_DIMENSIONS override the provider default', () => {
      const config = makeConfig({ embeddingProvider: 'gemini', pgvectorDimensions: 1024 });
      expect(getVectorDimensions(config)).toBe(1024);
    });
  });
});
