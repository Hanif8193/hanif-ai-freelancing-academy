// M5 — Deterministic intent detection
// Predictable and inexpensive: pure string matching, no LLM calls.
//
// Priority order (approved spec):
//   Translation → Assessment → Quiz → Practice → Teach → Explain → Learning Path → Ask
//
// Note (documented deviation): the marker "urdu/اردو" alone sets the response
// language to Urdu WITHOUT forcing Translation mode, so requests like
// "Explain RAG in Urdu for a beginner" resolve to Explain mode + Urdu language
// (matching the spec's Urdu examples). Explicit translate intent ("translate",
// "ترجمہ") selects Translation mode, which routes to the M6 TranslatorAgent
// boundary.

import type { Language, Level, TutorIntent, TutorMode } from './types';

const MARKER_TRANSLATION = /(^|\s|\b)(translate|translation|ترجمہ|into urdu|to urdu)(\b|\s|$)/i;
const MARKER_ASSESSMENT = /check my answer|assess|grade|evaluate my answer|how did i do|mark my answer/i;
const MARKER_QUIZ = /\bquiz(z|zes)?\b/i;
const MARKER_PRACTICE = /\b(practice|exercise|drill|work on a task)\b/i;
const MARKER_TEACH = /\bteach\b/i;
const MARKER_EXPLAIN = /\bexplain\b/i;
const MARKER_LEARNING_PATH = /what should i (learn|study|do) next|learning path|recommend(ed)? .* next|next (chapter|topic|module)|what.*(next|after this)/i;

const MARKER_URDU = /urdu|اردو/i;
const MARKER_BEGINNER = /\b(beginner|beginners|basic|simple|simply|from scratch|easy)\b/i;
const MARKER_INTERMEDIATE = /\bintermediate\b/i;
const MARKER_ADVANCED = /\b(advanced|expert|pro)\b/i;

/** Detect the Tutor mode from a question. Deterministic, priority-ordered. */
export function detectMode(question: string): TutorMode {
  const q = question.trim();

  if (MARKER_TRANSLATION.test(q)) return 'translation';
  if (MARKER_ASSESSMENT.test(q)) return 'assessment';
  if (MARKER_QUIZ.test(q)) return 'quiz';
  if (MARKER_PRACTICE.test(q)) return 'practice';
  if (MARKER_TEACH.test(q)) return 'teach';
  if (MARKER_EXPLAIN.test(q)) return 'explain';
  if (MARKER_LEARNING_PATH.test(q)) return 'learning-path';
  return 'ask';
}

/** Detect the response language. 'urdu' marker → Urdu, otherwise English. */
export function detectLanguage(question: string): Language {
  return MARKER_URDU.test(question) ? 'ur' : 'en';
}

/** Detect the learner level. Defaults to 'beginner'. */
export function detectLevel(question: string): Level {
  if (MARKER_INTERMEDIATE.test(question)) return 'intermediate';
  if (MARKER_ADVANCED.test(question)) return 'advanced';
  if (MARKER_BEGINNER.test(question)) return 'beginner';
  return 'beginner';
}

/**
 * Resolve the full intent. Explicit request fields (mode/language/level) take
 * precedence over detection.
 */
export function detectIntent(
  question: string,
  overrides: { mode?: TutorMode; language?: Language; level?: Level } = {}
): TutorIntent {
  const mode = overrides.mode ?? detectMode(question);
  const language = overrides.language ?? detectLanguage(question);
  const level = overrides.level ?? detectLevel(question);

  // An explicit language override ('ur') alone must not flip the mode.
  return { mode, language, level };
}

/** Validate that a mode string is a known TutorMode. */
export function isTutorMode(value: unknown): value is TutorMode {
  return (
    typeof value === 'string' &&
    (['ask', 'teach', 'explain', 'practice', 'quiz', 'assessment', 'learning-path', 'translation'] as string[]).includes(value)
  );
}

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'ur';
}

export function isLevel(value: unknown): value is Level {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced';
}
