// Ingest display logic — verify embedding model selection per provider

import type { RAGConfig } from '../types';

function selectEmbeddingModel(config: RAGConfig): string {
  return config.embeddingProvider === 'gemini'
    ? config.geminiEmbeddingModel
    : config.embeddingProvider === 'ollama'
      ? config.ollamaEmbeddingModel
      : config.openaiEmbeddingModel;
}

function makeConfig(overrides: Partial<RAGConfig> = {}): RAGConfig {
  return {
    embeddingProvider: 'openai',
    llmProvider: 'openai',
    openaiApiKey: 'sk-test',
    openaiEmbeddingModel: 'text-embedding-3-small',
    openaiLlmModel: 'gpt-4o-mini',
    geminiApiKey: 'gemini-test',
    geminiEmbeddingModel: 'gemini-embedding-001',
    geminiLlmModel: 'gemini-3.6-flash',
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

describe('Ingest embedding model display', () => {
  it('selects text-embedding-3-small for OpenAI', () => {
    const config = makeConfig({ embeddingProvider: 'openai' });
    expect(selectEmbeddingModel(config)).toBe('text-embedding-3-small');
  });

  it('selects gemini-embedding-001 for Gemini', () => {
    const config = makeConfig({ embeddingProvider: 'gemini' });
    expect(selectEmbeddingModel(config)).toBe('gemini-embedding-001');
  });

  it('selects nomic-embed-text for Ollama', () => {
    const config = makeConfig({ embeddingProvider: 'ollama' });
    expect(selectEmbeddingModel(config)).toBe('nomic-embed-text');
  });
});
