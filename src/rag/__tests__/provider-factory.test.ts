// M4 — Provider Factory Tests

import { createEmbeddingProvider, createLLMProvider } from '../providers/factory';
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
});
