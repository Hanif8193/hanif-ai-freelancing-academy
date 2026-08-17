// M4 — RAG Configuration
// Server-side only — loads .env for process.env access

import path from 'path';
import dotenv from 'dotenv';

// Ensure .env is loaded regardless of how this module is imported
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import type { RAGConfig } from './types';

export type { RAGConfig };

export function getConfig(): RAGConfig {
  return {
    // Provider selection
    embeddingProvider: (process.env.EMBEDDING_PROVIDER as 'openai' | 'gemini') || 'openai',
    llmProvider: (process.env.LLM_PROVIDER as 'openai' | 'gemini') || 'openai',

    // OpenAI
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiEmbeddingModel: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    openaiLlmModel: process.env.OPENAI_LLM_MODEL || 'gpt-4o-mini',

    // Gemini
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiEmbeddingModel: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',
    geminiLlmModel: process.env.GEMINI_LLM_MODEL || 'gemini-2.5-flash',

    // Vector Store
    vectorStoreType: (process.env.VECTOR_STORE_TYPE as 'memory' | 'chroma') || 'memory',
    chromaUrl: process.env.CHROMA_URL,

    // RAG Settings
    chunkSize: parseInt(process.env.RAG_CHUNK_SIZE || '500', 10),
    chunkOverlap: parseInt(process.env.RAG_CHUNK_OVERLAP || '100', 10),
    topK: parseInt(process.env.RAG_TOP_K || '5', 10),
    maxContextTokens: parseInt(process.env.RAG_MAX_CONTEXT_TOKENS || '4000', 10),
  };
}

export function validateConfig(config: RAGConfig): void {
  if (config.embeddingProvider === 'openai' && !config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required when EMBEDDING_PROVIDER=openai');
  }
  if (config.llmProvider === 'openai' && !config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required when LLM_PROVIDER=openai');
  }
  if (config.embeddingProvider === 'gemini' && !config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required when EMBEDDING_PROVIDER=gemini');
  }
  if (config.llmProvider === 'gemini' && !config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required when LLM_PROVIDER=gemini');
  }
}
