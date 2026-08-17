// M5 — Assessment mode: evaluate the learner's answer against Academy content.

import type { AssessmentVerdict, ModeHandler } from '../types';
import { generateStructured, groundedOrInsufficient } from './shared';

interface AssessmentOutput {
  verdict?: unknown;
  whatIsCorrect?: string;
  whatIsMissing?: string;
  feedback?: string;
  suggestedNext?: string;
}

const VALID_VERDICTS: AssessmentVerdict[] = ['correct', 'partial', 'incorrect'];

function sanitizeVerdict(value: unknown): AssessmentVerdict {
  return VALID_VERDICTS.includes(value as AssessmentVerdict) ? (value as AssessmentVerdict) : 'partial';
}

export const assessmentHandler: ModeHandler = async (context) => {
  const fallback = groundedOrInsufficient(
    context,
    'The Academy content does not contain enough information to assess this answer yet.'
  );
  if (fallback) return fallback;

  const { grounded, intent } = context;
  const output = await generateStructured<AssessmentOutput>(context, 'assessment', {});

  return {
    mode: 'assessment',
    language: intent.language,
    level: intent.level,
    assessment: {
      verdict: sanitizeVerdict(output.verdict),
      whatIsCorrect: output.whatIsCorrect || 'Your answer was received.',
      whatIsMissing: output.whatIsMissing || '',
      feedback: output.feedback || 'Review the sources below and try again.',
      suggestedNext: output.suggestedNext,
      source: grounded!.sources[0],
    },
    sources: grounded!.sources,
    grounded: true,
    insufficientInfo: false,
  };
};
