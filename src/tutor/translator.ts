// M5/M6 — TranslatorAgent boundary
//
// M5 defined this contract; M6 implements it (see src/translator/).
// TutorService routes Translation-mode requests through this interface; when
// no translator is provided, it returns a clear fallback response instead of
// pretending translation happened.

import type { Language, Level } from './types';
import { GLOSSARY, TECHNICAL_TERMS } from './glossary';

export interface TranslateOptions {
  /** Preserve technical terminology (default true). */
  preserveTerms?: boolean;
  /** Preserve Markdown structure, code blocks, URLs, paths, and commands (default true). */
  preserveMarkdown?: boolean;
  /** Keep the translation at a given learner level. */
  level?: Level;
  /** Optional Academy content/context used to ground the translation (reference data only). */
  context?: string;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  /** Technical terms that were preserved in English. */
  preservedTerms: string[];
}

export interface TranslatorAgent {
  name: string;
  translate(
    text: string,
    from: Language,
    to: Language,
    options?: TranslateOptions
  ): Promise<TranslationResult>;
  explain(text: string, targetLanguage: Language, level?: Level): Promise<TranslationResult>;
}

/** Fallback message shown only when no translator agent is wired up. */
export const TRANSLATOR_NOT_IMPLEMENTED_MESSAGE =
  'Translation between English and Urdu is not available right now. ' +
  'Please try again later, or ask the Tutor to explain a topic in Urdu ' +
  '(for example: "Explain RAG in Urdu for a beginner").';

export { GLOSSARY, TECHNICAL_TERMS };
