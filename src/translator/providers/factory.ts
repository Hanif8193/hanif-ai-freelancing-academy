// M6 — Translation provider factory
// Returns a TranslationProvider based on configuration. Currently the Gemini
// provider (wrapping the project's configured LLM via the M4 factory). Future
// providers can be added here without changing the agent or TutorService.

import type { RAGConfig } from '../../rag/types';
import { createLLMProvider } from '../../rag/providers/factory';
import type { TranslationProvider } from './interface';
import { GeminiTranslationProvider } from './gemini';

export function createTranslationProvider(config: RAGConfig): TranslationProvider {
  // Uses the project's configured LLM provider (Gemini by default).
  const llm = createLLMProvider(config);
  return new GeminiTranslationProvider(llm);
}
