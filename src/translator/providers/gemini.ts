// M6 — GeminiTranslationProvider
// Reuses the existing M4 LLM provider abstraction (via the factory) so the
// project's configured LLM (Gemini by default) performs the translation.
// Errors propagate unmodified — the Tutor endpoint maps them with M4 P0 rules.

import type { LLMProvider } from '../../rag/providers/llm/interface';
import { extractJsonObjectStrict } from '../../tutor/json';
import { buildTranslationPrompt, TRANSLATION_SYSTEM_PROMPT } from '../prompts';
import type {
  TranslationProvider,
  TranslationProviderRequest,
  TranslationProviderResult,
} from './interface';

interface TranslationOutput {
  translatedText?: unknown;
  preservedTerms?: unknown;
}

export class GeminiTranslationProvider implements TranslationProvider {
  name = 'gemini-translation';

  constructor(private llm: LLMProvider) {}

  async translate(request: TranslationProviderRequest): Promise<TranslationProviderResult> {
    const prompt = buildTranslationPrompt({
      text: request.text,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      explain: request.explain ?? false,
      level: request.level,
      context: request.context,
    });

    const raw = await this.llm.generate(prompt, TRANSLATION_SYSTEM_PROMPT);

    const parsed = extractJsonObjectStrict<TranslationOutput>(raw);

    if (parsed && typeof parsed.translatedText === 'string' && parsed.translatedText.trim()) {
      return {
        translatedText: parsed.translatedText.trim(),
        preservedTerms: Array.isArray(parsed.preservedTerms)
          ? parsed.preservedTerms.filter((t): t is string => typeof t === 'string')
          : [],
      };
    }

    // Fallback: if the model did not return parseable JSON, use the raw output
    // as the translation (honest, no fabrication).
    return {
      translatedText: raw.trim(),
      preservedTerms: [],
    };
  }
}
