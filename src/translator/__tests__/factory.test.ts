// M6 — Translation provider factory tests

import type { RAGConfig } from '../../rag/types';
import { createTranslationProvider } from '../providers/factory';
import { GeminiTranslationProvider } from '../providers/gemini';

const config: RAGConfig = {
  embeddingProvider: 'gemini',
  llmProvider: 'gemini',
  openaiApiKey: 'test',
  openaiEmbeddingModel: 'text-embedding-3-small',
  openaiLlmModel: 'gpt-4o-mini',
  geminiApiKey: 'test',
  geminiEmbeddingModel: 'gemini-embedding-001',
  geminiLlmModel: 'gemini-3.6-flash',
  ollamaBaseUrl: 'http://localhost:11434',
  ollamaEmbeddingModel: 'nomic-embed-text',
  vectorStoreType: 'memory',
  chunkSize: 500,
  chunkOverlap: 100,
  topK: 5,
  maxContextTokens: 4000,
};

describe('createTranslationProvider', () => {
  it('returns the Gemini translation provider for the configured stack', () => {
    const provider = createTranslationProvider(config);
    expect(provider).toBeInstanceOf(GeminiTranslationProvider);
    expect(provider.name).toBe('gemini-translation');
    expect(typeof provider.translate).toBe('function');
  });

  it('keeps the provider boundary decoupled from the agent contract', () => {
    const provider = createTranslationProvider(config);
    // The provider only needs translate() — swapping vendors never touches
    // TranslatorAgentImpl or TutorService.
    expect(typeof provider.translate).toBe('function');
    expect(provider.name).toBe('gemini-translation');
  });
});
