// M5 — Translation mode (M6 boundary).
// The TranslatorAgent interface is defined in src/tutor/translator.ts but NOT
// implemented in M5. This handler returns a clear boundary response instead of
// pretending translation was performed. TutorService routes through the
// interface when a translator agent is provided (future M6).

import { TRANSLATOR_NOT_IMPLEMENTED_MESSAGE } from '../translator';
import type { Language, Level, TutorResponse } from '../types';

export function translationBoundaryResponse(language: Language, level: Level): TutorResponse {
  return {
    mode: 'translation',
    language,
    level,
    directAnswer: TRANSLATOR_NOT_IMPLEMENTED_MESSAGE,
    sources: [],
    grounded: false,
    insufficientInfo: false,
    suggestedTopics: [
      'Explain freelancing in Urdu',
      'Explain RAG in Urdu for a beginner',
      'What is Spec-Driven Development?',
    ],
  };
}
