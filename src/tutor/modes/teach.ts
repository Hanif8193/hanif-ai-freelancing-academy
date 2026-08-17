// M5 — Teach mode: progressive, beginner-friendly lesson.

import { resolveTopicUrl } from '../topics';
import type { ModeHandler } from '../types';
import { generateStructured, groundedOrInsufficient } from './shared';

interface TeachOutput {
  explanation?: string;
  example?: string;
  practiceStep?: string;
  nextStep?: string;
}

export const teachHandler: ModeHandler = async (context) => {
  const fallback = groundedOrInsufficient(
    context,
    'The Academy content does not contain enough information to teach this topic yet.'
  );
  if (fallback) return fallback;

  const { grounded, intent } = context;
  const output = await generateStructured<TeachOutput>(context, 'teach', {});

  const recommendedNext =
    output.nextStep && output.nextStep.trim()
      ? { topic: output.nextStep.trim(), url: resolveTopicUrl(output.nextStep), reason: 'Continue your learning journey' }
      : undefined;

  return {
    mode: 'teach',
    language: intent.language,
    level: intent.level,
    directAnswer: grounded!.answer,
    explanation: output.explanation,
    example: output.example,
    recommendedNext,
    sources: grounded!.sources,
    grounded: true,
    insufficientInfo: false,
  };
};
