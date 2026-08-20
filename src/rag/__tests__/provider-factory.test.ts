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
    ollamaBaseUrl: 'http://localhost:11434',
    ollamaEmbeddingModel: 'nomic-embed-text',
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

    it('should create Ollama embedding provider', () => {
      const config = makeConfig({ embeddingProvider: 'ollama' });
      const provider = createEmbeddingProvider(config);
      expect(provider.name).toBe('ollama');
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

  // M9 — Vector store factory (memory | chroma | turso)
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

    it('should create the Turso store when configured with a URL + token', () => {
      const store = createVectorStore(
        makeConfig({
          vectorStoreType: 'turso',
          tursoUrl: 'libsql://academy-test-org.turso.io',
          tursoAuthToken: 'test-token',
        })
      );
      expect(store.name).toBe('turso');
    });

    it('should throw a clear error for turso without a URL', () => {
      expect(() =>
        createVectorStore(makeConfig({ vectorStoreType: 'turso', tursoUrl: '' }))
      ).toThrow('TursoVectorStore requires a database URL (TURSO_DATABASE_URL).');
    });
  });

  // M9 — Configuration validation
  describe('validateConfig', () => {
    it('requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN when VECTOR_STORE_TYPE=turso', () => {
      const config = makeConfig({
        vectorStoreType: 'turso',
        tursoUrl: '',
        tursoAuthToken: '',
      });
      expect(() => validateConfig(config)).toThrow(
        'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required when VECTOR_STORE_TYPE=turso'
      );
    });

    it('accepts turso with a URL and token', () => {
      const config = makeConfig({
        vectorStoreType: 'turso',
        tursoUrl: 'libsql://academy-test-org.turso.io',
        tursoAuthToken: 'test-token',
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

  // M9 — Provider/dimension compatibility guard.
  // The embedding provider's getDimensions() must match getVectorDimensions()
  // so the Turso schema/config always agrees with the vectors actually produced.
  describe('embedding provider dimension compatibility', () => {
    it('OpenAI text-embedding-3-small reports 1536 dimensions', () => {
      const provider = createEmbeddingProvider(makeConfig({ embeddingProvider: 'openai' }));
      expect(provider.getDimensions()).toBe(1536);
    });

    it('Gemini gemini-embedding-001 reports 768 dimensions', () => {
      const provider = createEmbeddingProvider(makeConfig({ embeddingProvider: 'gemini' }));
      expect(provider.getDimensions()).toBe(768);
    });

    it('provider dimensions match getVectorDimensions for all providers', () => {
      for (const providerName of ['openai', 'gemini', 'ollama'] as const) {
        const config = makeConfig({ embeddingProvider: providerName });
        expect(createEmbeddingProvider(config).getDimensions()).toBe(
          getVectorDimensions(config)
        );
      }
    });
  });

  // M9 — Vector dimensions
  describe('getVectorDimensions', () => {
    it('derives 768 for Gemini', () => {
      expect(getVectorDimensions(makeConfig({ embeddingProvider: 'gemini' }))).toBe(768);
    });

    it('derives 768 for Ollama', () => {
      expect(getVectorDimensions(makeConfig({ embeddingProvider: 'ollama' }))).toBe(768);
    });

    it('derives 1536 for OpenAI', () => {
      expect(getVectorDimensions(makeConfig({ embeddingProvider: 'openai' }))).toBe(1536);
    });

    it('lets VECTOR_DIMENSIONS override the provider default', () => {
      const config = makeConfig({ embeddingProvider: 'gemini', vectorDimensions: 1024 });
      expect(getVectorDimensions(config)).toBe(1024);
    });
  });
});
