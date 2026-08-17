// M5 — Explain mode: simplify a difficult concept to the learner's level.

import type { ModeHandler } from '../types';
import { generateStructured, groundedOrInsufficient } from './shared';

interface ExplainOutput {
  explanation?: string;
  example?: string;
}

export const explainHandler: ModeHandler = async (context) => {
  const fallback = groundedOrInsufficient(
    context,
    'The Academy content does not contain enough information to explain this concept yet.'
  );
  if (fallback) return fallback;

  const { grounded, intent } = context;
  const output = await generateStructured<ExplainOutput>(context, 'explain', {});

  return {
    mode: 'explain',
    language: intent.language,
    level: intent.level,
    directAnswer: grounded!.answer,
    explanation: output.explanation,
    example: output.example,
    sources: grounded!.sources,
    grounded: true,
    insufficientInfo: false,
  };
};
