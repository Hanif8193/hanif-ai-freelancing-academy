// M6 — TranslatorAgent implementation
// Satisfies the TranslatorAgent interface defined in src/tutor/translator.ts,
// delegating the actual translation to a TranslationProvider (provider boundary).

import type { Language, Level } from '../tutor/types';
import type {
  TranslateOptions,
  TranslationResult,
  TranslatorAgent,
} from '../tutor/translator';
import type { TranslationProvider } from './providers/interface';

export class TranslatorAgentImpl implements TranslatorAgent {
  readonly name: string;

  constructor(private provider: TranslationProvider) {
    this.name = provider.name;
  }

  async translate(
    text: string,
    from: Language,
    to: Language,
    options?: TranslateOptions
  ): Promise<TranslationResult> {
    const result = await this.provider.translate({
      text,
      sourceLanguage: from,
      targetLanguage: to,
      preserveTechnicalTerms: options?.preserveTerms ?? true,
      preserveMarkdown: options?.preserveMarkdown ?? true,
      level: options?.level,
      context: options?.context,
    });

    return {
      translatedText: result.translatedText,
      sourceLanguage: from,
      targetLanguage: to,
      preservedTerms: result.preservedTerms,
    };
  }

  async explain(text: string, targetLanguage: Language, level?: Level): Promise<TranslationResult> {
    const result = await this.provider.translate({
      text,
      sourceLanguage: 'en',
      targetLanguage,
      preserveTechnicalTerms: true,
      preserveMarkdown: true,
      level: level ?? 'beginner',
      explain: true,
    });

    return {
      translatedText: result.translatedText,
      sourceLanguage: 'en',
      targetLanguage,
      preservedTerms: result.preservedTerms,
    };
  }
}
