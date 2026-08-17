// M6 — TranslationProvider boundary
// Decouples the TranslatorAgent from any specific translation vendor. A future
// provider (dedicated translation model, local model, etc.) can be swapped in
// the factory without changing TranslatorAgentImpl or TutorService.

import type { Language, Level } from '../../tutor/types';

export interface TranslationProviderRequest {
  text: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  /** Preserve technical terminology (default true). */
  preserveTechnicalTerms: boolean;
  /** Preserve Markdown structure, code blocks, URLs, paths, and commands (default true). */
  preserveMarkdown: boolean;
  /** Learner level for explain mode. */
  level?: Level;
  /** Optional Academy context used to ground the translation (reference data only). */
  context?: string;
  /** True when an explanation is requested instead of a pure translation. */
  explain?: boolean;
}

export interface TranslationProviderResult {
  translatedText: string;
  /** Technical terms that were preserved in English. */
  preservedTerms: string[];
}

export interface TranslationProvider {
  name: string;
  translate(request: TranslationProviderRequest): Promise<TranslationProviderResult>;
}
