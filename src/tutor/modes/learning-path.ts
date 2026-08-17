// M5 — Learning Path mode: recommend the next Academy topic.

import { resolveTopicUrl } from '../topics';
import type { ModeHandler } from '../types';
import { generateStructured, groundedOrInsufficient } from './shared';

interface PathOutput {
  topic?: string;
  reason?: string;
}

export const learningPathHandler: ModeHandler = async (context) => {
  const fallback = groundedOrInsufficient(
    context,
    'The Academy content does not contain enough information to recommend a next step yet.'
  );
  if (fallback) return fallback;

  const { grounded, intent } = context;
  const output = await generateStructured<PathOutput>(context, 'learning-path', {});

  const topic = output.topic?.trim() || grounded!.sources[0]?.title || 'Next chapter';

  return {
    mode: 'learning-path',
    language: intent.language,
    level: intent.level,
    directAnswer: `I recommend studying: ${topic}.`,
    recommendedNext: {
      topic,
      // Never fabricate a link — only attach a real URL when the topic matches.
      url: resolveTopicUrl(topic),
      reason: output.reason?.trim(),
    },
    sources: grounded!.sources,
    grounded: true,
    insufficientInfo: false,
  };
};
