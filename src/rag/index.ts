// M4 — RAG Module Index

export * from './config';
export * from './ingestion';

// Provider exports (avoid duplicating types already in ./types)
export { OpenAIEmbeddingProvider } from './providers/embedding/openai';
export type { OpenAIEmbeddingConfig } from './providers/embedding/openai';
export { GeminiEmbeddingProvider } from './providers/embedding/gemini';
export type { GeminiEmbeddingConfig } from './providers/embedding/gemini';
export type { EmbeddingProvider } from './providers/embedding/interface';

export { InMemoryVectorStore } from './providers/vector-store/memory';
export { ChromaVectorStore } from './providers/vector-store/chroma';
export type { ChromaVectorStoreConfig } from './providers/vector-store/chroma';
export type { VectorStore } from './providers/vector-store/interface';

export { OpenAILLMProvider } from './providers/llm/openai';
export type { OpenAILLMConfig } from './providers/llm/openai';
export { GeminiLLMProvider } from './providers/llm/gemini';
export type { GeminiLLMConfig } from './providers/llm/gemini';
export type { LLMProvider } from './providers/llm/interface';

export { createEmbeddingProvider, createLLMProvider } from './providers/factory';

// Service exports
export { Retriever } from './services/retriever';
export { ContextAssembler } from './services/context-assembler';
export { RAGService } from './services/rag-service';
export type { RetrieverConfig } from './services/retriever';
export type { ContextAssemblerConfig } from './services/context-assembler';
export type { RAGServiceConfig } from './services/rag-service';

// API exports
export { createAskEndpoint, createHealthEndpoint } from './api/ask-endpoint';
