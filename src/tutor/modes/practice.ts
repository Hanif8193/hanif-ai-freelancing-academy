// M5 — Practice mode: generate a practical exercise grounded in the topic.

import type { Level, ModeHandler } from '../types';
import { generateStructured, groundedOrInsufficient } from './shared';

interface PracticeOutput {
  title?: string;
  instructions?: string;
  topic?: string;
}

export const practiceHandler: ModeHandler = async (context) => {
  const fallback = groundedOrInsufficient(
    context,
    'The Academy content does not contain enough information to create an exercise for this topic yet.'
  );
  if (fallback) return fallback;

  const { grounded, intent } = context;
  const output = await generateStructured<PracticeOutput>(context, 'practice', {});

  const title = output.title?.trim() || 'Practical Exercise';
  const instructions = output.instructions?.trim() || grounded!.answer;

  return {
    mode: 'practice',
    language: intent.language,
    level: intent.level,
    exercise: {
      title,
      instructions,
      topic: output.topic?.trim(),
      difficulty: intent.level as Level,
      source: grounded!.sources[0],
    },
    sources: grounded!.sources,
    grounded: true,
    insufficientInfo: false,
  };
};
