// M5 — Quiz mode: generate quiz items grounded in retrieved Academy content.

import type { ModeHandler, QuizItem } from '../types';
import { generateStructured, groundedOrInsufficient } from './shared';

interface QuizOutputItem {
  question?: string;
  options?: unknown;
  correctIndex?: unknown;
  explanation?: string;
}

interface QuizOutput {
  quiz?: unknown;
}

/** Validate a quiz item defensively; returns null when malformed. */
function sanitizeQuizItem(item: QuizOutputItem, source: { title: string; section: string; url: string } | undefined): QuizItem | null {
  if (!item || typeof item !== 'object') return null;
  if (typeof item.question !== 'string' || !item.question.trim()) return null;
  if (!Array.isArray(item.options) || item.options.length < 2) return null;

  const options = item.options.filter((o): o is string => typeof o === 'string' && o.trim().length > 0);
  if (options.length < 2) return null;

  const correctIndex = typeof item.correctIndex === 'number' ? Math.floor(item.correctIndex) : NaN;
  const validIndex = Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < options.length;

  return {
    question: item.question.trim(),
    options,
    correctIndex: validIndex ? correctIndex : 0,
    explanation: typeof item.explanation === 'string' ? item.explanation : undefined,
    source,
  };
}

export const quizHandler: ModeHandler = async (context) => {
  const fallback = groundedOrInsufficient(
    context,
    'The Academy content does not contain enough information to create a quiz for this topic yet.'
  );
  if (fallback) return fallback;

  const { grounded, intent } = context;
  const output = await generateStructured<QuizOutput>(context, 'quiz', {});

  const rawItems = Array.isArray(output.quiz) ? (output.quiz as QuizOutputItem[]) : [];
  const source = grounded!.sources[0];
  const quiz = rawItems
    .map((item) => sanitizeQuizItem(item, source))
    .filter((item): item is QuizItem => item !== null)
    .slice(0, 5);

  return {
    mode: 'quiz',
    language: intent.language,
    level: intent.level,
    quiz,
    sources: grounded!.sources,
    grounded: true,
    insufficientInfo: false,
  };
};
