// M4 — Provider Factory
// Creates the correct embedding/LLM providers based on config env vars

import type { RAGConfig } from '../types';
import type { EmbeddingProvider } from './embedding/interface';
import type { LLMProvider } from './llm/interface';
import type { VectorStore } from './vector-store/interface';

export function createEmbeddingProvider(config: RAGConfig): EmbeddingProvider {
  switch (config.embeddingProvider) {
    case 'gemini': {
      const { GeminiEmbeddingProvider } = require('./embedding/gemini');
      return new GeminiEmbeddingProvider({
        apiKey: config.geminiApiKey,
        model: config.geminiEmbeddingModel,
      });
    }
    case 'openai':
    default: {
      const { OpenAIEmbeddingProvider } = require('./embedding/openai');
      return new OpenAIEmbeddingProvider({
        apiKey: config.openaiApiKey,
        model: config.openaiEmbeddingModel,
      });
    }
  }
}

export function createLLMProvider(config: RAGConfig): LLMProvider {
  switch (config.llmProvider) {
    case 'gemini': {
      const { GeminiLLMProvider } = require('./llm/gemini');
      return new GeminiLLMProvider({
        apiKey: config.geminiApiKey,
        model: config.geminiLlmModel,
      });
    }
    case 'openai':
    default: {
      const { OpenAILLMProvider } = require('./llm/openai');
      return new OpenAILLMProvider({
        apiKey: config.openaiApiKey,
        model: config.openaiLlmModel,
      });
    }
  }
}

// M9 — Vector store factory
// Production: VECTOR_STORE_TYPE=postgres · Local dev: VECTOR_STORE_TYPE=memory
// Memory/chroma behavior is unchanged; postgres is new behind the same interface.
export function createVectorStore(config: RAGConfig): VectorStore {
  switch (config.vectorStoreType) {
    case 'postgres': {
      const { PostgresVectorStore } = require('./vector-store/postgres');
      return new PostgresVectorStore({
        url: config.postgresUrl || '',
        table: config.pgvectorTable,
        dimensions: config.pgvectorDimensions,
      });
    }
    case 'chroma': {
      const { ChromaVectorStore } = require('./vector-store/chroma');
      return new ChromaVectorStore({ url: config.chromaUrl });
    }
    case 'memory':
    default: {
      const { InMemoryVectorStore } = require('./vector-store/memory');
      return new InMemoryVectorStore({ persistPath: 'data/vector-store.json' });
    }
  }
}
