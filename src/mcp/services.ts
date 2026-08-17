// M7 — MCP services context
// The MCP layer is a thin adapter: every tool delegates to an existing
// M4/M5/M6 service. This module builds that context the same way the
// M4 ask-endpoint / M5 tutor-endpoint build theirs (provider factory +
// persisted vector store), and exposes a structural type so tests can
// inject mocks without touching any real service.

import fs from 'fs';
import path from 'path';

import type { AskResponse } from '../rag/types';
import type { AcademyTopic } from '../tutor/topics';
import { ACADEMY_TOPICS } from '../tutor/topics';
import type { TutorRequest, TutorResponse } from '../tutor/types';
import type { TranslatorAgent } from '../tutor/translator';

/**
 * Structural service context. Every member is satisfied by the real
 * M4/M5/M6 implementations; tests supply fakes.
 */
export interface McpServices {
  /** M4 RAGService (retrieval source of truth) — searchAcademyContent. */
  rag: {
    answer(request: { question: string; maxSources?: number }): Promise<AskResponse>;
  };
  /** M5 TutorService (tutoring source of truth) — generateQuiz. */
  tutor: {
    answer(request: TutorRequest): Promise<TutorResponse>;
  };
  /** M6 TranslatorAgent (translation source of truth) — translateContent. */
  translator: TranslatorAgent;
  /** M5 topics map — real Academy chapters/modules with URLs (never user-controlled paths). */
  topics: AcademyTopic[];
  /**
   * Read a project-relative file. Defaults to the real filesystem; injectable
   * for hermetic tests. Paths are always resolved from the internal topics
   * map — user input never becomes a filesystem path.
   */
  readFile(relativePath: string): Promise<string>;
}

const defaultReadFile = (relativePath: string): Promise<string> =>
  fs.promises.readFile(path.join(process.cwd(), relativePath), 'utf8');

// ============================================================
// Production builder (mirrors the ask/tutor endpoint wiring)
// ============================================================

let cachedServices: McpServices | null = null;

/**
 * Build the production services context (lazy singleton). Constructs the
 * same RAG stack the web endpoints use: config -> provider factory ->
 * persisted vector store -> RAGService -> TutorService -> TranslatorAgent.
 */
export async function createMcpServices(): Promise<McpServices> {
  if (cachedServices) {
    return cachedServices;
  }

  const { getConfig, validateConfig } = await import('../rag/config');
  const { createEmbeddingProvider, createLLMProvider, createVectorStore } = await import('../rag/providers/factory');
  const { RAGService } = await import('../rag/services/rag-service');
  const { TutorService } = await import('../tutor/TutorService');
  const { TranslatorAgentImpl } = await import('../translator/TranslatorAgentImpl');
  const { createTranslationProvider } = await import('../translator/providers/factory');

  const config = getConfig();
  validateConfig(config);

  const embeddingProvider = createEmbeddingProvider(config);
  const llmProvider = createLLMProvider(config);

  // Vector store via the factory (memory | chroma | turso)
  const vectorStore = createVectorStore(config);

  const ragService = new RAGService(embeddingProvider, vectorStore, llmProvider, {
    topK: config.topK,
    maxContextTokens: config.maxContextTokens,
  });

  const translator = new TranslatorAgentImpl(createTranslationProvider(config));

  const tutorService = new TutorService({
    grounding: ragService,
    llm: llmProvider,
    translator,
  });

  cachedServices = {
    rag: ragService,
    tutor: tutorService,
    translator,
    topics: ACADEMY_TOPICS,
    readFile: defaultReadFile,
  };
  return cachedServices;
}

/** Test-only: reset the cached singleton. */
export function resetMcpServicesCache(): void {
  cachedServices = null;
}
