// M4 — Ask the Book API Endpoint
// Docusaurus plugin that adds /api/ask endpoint
// M4 P0 — Provider errors are mapped to safe, structured responses (no internals leaked).

import type { Request, Response } from 'express';
import type { RAGConfig } from '../config';
import { getConfig, validateConfig } from '../config';
import { mapProviderError } from '../errors';
import { createEmbeddingProvider, createLLMProvider, createVectorStore } from '../providers/factory';
import { RAGService } from '../services/rag-service';
import type { AskRequest } from '../types';

// Singleton instances
let ragService: RAGService | null = null;
let isInitialized = false;
let initializationError: string | null = null;

async function initializeRAG(): Promise<RAGService> {
  if (ragService && isInitialized) {
    return ragService;
  }

  try {
    const config = getConfig();
    validateConfig(config);

    // Initialize providers via factory
    const embeddingProvider = createEmbeddingProvider(config);
    const llmProvider = createLLMProvider(config);

    // Initialize vector store via the factory (memory | chroma | postgres)
    const vectorStore = createVectorStore(config);

    // Initialize RAG service
    ragService = new RAGService(
      embeddingProvider,
      vectorStore,
      llmProvider,
      {
        topK: config.topK,
        maxContextTokens: config.maxContextTokens,
      }
    );

    isInitialized = true;
    return ragService;
  } catch (error) {
    initializationError = error instanceof Error ? error.message : String(error);
    throw error;
  }
}

export function createAskEndpoint() {
  return createAskEndpointWithService(() => initializeRAG());
}

/**
 * Testable variant: accepts a function that resolves the RAG service
 * (e.g. a mocked service), keeping the request/response handling identical.
 */
export function createAskEndpointWithService(
  getService: () => Promise<RAGService>
) {
  return async (req: Request, res: Response) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
      return;
    }

    try {
      const service = await getService();

      const { question, maxSources } = req.body as AskRequest;

      if (!question || typeof question !== 'string') {
        res.status(400).json({
          error: 'Question is required',
          code: 'INVALID_REQUEST',
        });
        return;
      }

      if (question.length > 500) {
        res.status(400).json({
          error: 'Question must be 500 characters or less',
          code: 'INVALID_REQUEST',
        });
        return;
      }

      const response = await service.answer({
        question: question.trim(),
        maxSources,
      });

      res.json(response);
    } catch (error) {
      // Server-side diagnostics only — never sent to the browser.
      console.error('Error processing question:', error);

      const mapped = mapProviderError(error);
      res.status(mapped.statusCode).json({
        error: mapped.error,
        code: mapped.code,
        message: mapped.message,
      });
    }
  };
}

export function createHealthEndpoint() {
  return async (req: Request, res: Response) => {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
      return;
    }

    try {
      if (!isInitialized) {
        const config = getConfig();
        const hasKey = config.embeddingProvider === 'gemini'
          ? !!config.geminiApiKey
          : !!config.openaiApiKey;

        // "configured" = valid config + API key present, but no request handled yet.
        res.json({
          status: hasKey ? 'configured' : 'not_initialized',
          message: hasKey
            ? 'RAG service is configured but has not handled a request yet. Runtime availability is not probed.'
            : 'RAG service is missing a provider API key.',
          vectorStore: 'unknown',
          embeddingProvider: config.embeddingProvider,
          llmProvider: config.llmProvider,
          hasApiKey: hasKey,
        });
        return;
      }

      const config = getConfig();

      // "initialized" = service constructed. Runtime availability is NOT probed
      // (a live Gemini call would consume API quota on every health request).
      res.json({
        status: 'initialized',
        message: 'RAG service is initialized. Runtime availability is not probed to avoid AI API usage.',
        vectorStore: config.vectorStoreType,
        embeddingProvider: config.embeddingProvider,
        llmProvider: config.llmProvider,
        model: config.llmProvider === 'gemini' ? config.geminiLlmModel : config.openaiLlmModel,
        runtimeAvailability: 'unknown',
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        status: 'unhealthy',
        error: 'Health check failed',
      });
    }
  };
}
