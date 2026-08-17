// M4 — Provider Factory
// Creates the correct embedding/LLM providers based on config env vars

import type { RAGConfig } from '../types';
import type { EmbeddingProvider } from './embedding/interface';
import type { LLMProvider } from './llm/interface';

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
