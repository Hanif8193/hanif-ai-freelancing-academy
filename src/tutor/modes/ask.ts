// M5 — Ask mode: direct grounded answer (no extra LLM call).

import type { ModeHandler } from '../types';
import { groundedOrInsufficient } from './shared';

export const askHandler: ModeHandler = async (context) => {
  const fallback = groundedOrInsufficient(
    context,
    'The Academy content does not contain enough information to answer that question.'
  );
  if (fallback) return fallback;

  const { grounded, intent } = context;
  return {
    mode: 'ask',
    language: intent.language,
    level: intent.level,
    directAnswer: grounded!.answer,
    sources: grounded!.sources,
    grounded: true,
    insufficientInfo: false,
    suggestedTopics: grounded!.suggestedTopics,
  };
};
