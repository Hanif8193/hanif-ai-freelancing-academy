// M5 — Tutor API Endpoint
// POST /api/tutor — reuses the M4 provider factory, RAGService, and error
// mapping. No M4 source files are modified.

import type { Request, Response } from 'express';
import { getConfig, validateConfig } from '../../rag/config';
import { mapProviderError } from '../../rag/errors';
import { createEmbeddingProvider, createLLMProvider, createVectorStore } from '../../rag/providers/factory';
import { RAGService } from '../../rag/services/rag-service';
import { isLanguage, isLevel, isTutorMode } from '../intent';
import { TutorService } from '../TutorService';
import type { TutorRequest } from '../types';
import { TranslatorAgentImpl } from '../../translator/TranslatorAgentImpl';
import { createTranslationProvider } from '../../translator/providers/factory';

const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY = 10;

// Singleton instance (mirrors the M4 ask-endpoint pattern).
let tutorService: TutorService | null = null;

async function initializeTutor(): Promise<TutorService> {
  if (tutorService) {
    return tutorService;
  }

  const config = getConfig();
  validateConfig(config);

  // Build the same RAG stack the M4 ask-endpoint builds (provider abstraction intact).
  const embeddingProvider = createEmbeddingProvider(config);
  const llmProvider = createLLMProvider(config);

  // Vector store via the factory (memory | chroma | turso)
  const vectorStore = createVectorStore(config);

  const ragService = new RAGService(embeddingProvider, vectorStore, llmProvider, {
    topK: config.topK,
    maxContextTokens: config.maxContextTokens,
  });

  tutorService = new TutorService({
    grounding: ragService,
    llm: llmProvider,
    // M6: TranslatorAgent implementation behind the provider boundary.
    translator: new TranslatorAgentImpl(createTranslationProvider(config)),
  });
  return tutorService;
}

export function createTutorEndpoint() {
  return createTutorEndpointWithService(() => initializeTutor());
}

/** Testable variant: accepts a function that resolves the TutorService. */
export function createTutorEndpointWithService(
  getService: () => Promise<TutorService>
) {
  return async (req: Request, res: Response) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
      return;
    }

    try {
      const service = await getService();
      const body = (req.body ?? {}) as Record<string, unknown>;

      const question = typeof body.question === 'string' ? body.question.trim() : '';
      if (!question) {
        res.status(400).json({ error: 'Question is required', code: 'INVALID_REQUEST' });
        return;
      }
      if (question.length > MAX_QUESTION_LENGTH) {
        res.status(400).json({
          error: `Question must be ${MAX_QUESTION_LENGTH} characters or less`,
          code: 'INVALID_REQUEST',
        });
        return;
      }

      if (body.mode !== undefined && !isTutorMode(body.mode)) {
        res.status(400).json({ error: 'Invalid mode', code: 'INVALID_REQUEST' });
        return;
      }
      if (body.language !== undefined && !isLanguage(body.language)) {
        res.status(400).json({ error: 'Invalid language', code: 'INVALID_REQUEST' });
        return;
      }
      if (body.level !== undefined && !isLevel(body.level)) {
        res.status(400).json({ error: 'Invalid level', code: 'INVALID_REQUEST' });
        return;
      }

      const history = Array.isArray(body.history) ? body.history.slice(0, MAX_HISTORY) : undefined;

      const request: TutorRequest = {
        question,
        mode: body.mode as TutorRequest['mode'],
        language: body.language as TutorRequest['language'],
        level: body.level as TutorRequest['level'],
        context: body.context as TutorRequest['context'],
        history,
        maxSources: typeof body.maxSources === 'number' ? body.maxSources : undefined,
      };

      const response = await service.answer(request);
      res.json(response);
    } catch (error) {
      // Server-side diagnostics only — never sent to the browser.
      console.error('Error processing tutor request:', error);
      const mapped = mapProviderError(error);
      res.status(mapped.statusCode).json({
        error: mapped.error,
        code: mapped.code,
        message: mapped.message,
      });
    }
  };
}
