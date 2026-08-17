// M5 — Mode handler registry

import type { ModeHandler, TutorMode } from '../types';
import { askHandler } from './ask';
import { assessmentHandler } from './assessment';
import { explainHandler } from './explain';
import { learningPathHandler } from './learning-path';
import { practiceHandler } from './practice';
import { quizHandler } from './quiz';
import { teachHandler } from './teach';

/**
 * Handlers for modes that ground through RAG.
 * 'translation' is handled directly by TutorService (M6 boundary).
 */
export const modeHandlers: Record<Exclude<TutorMode, 'translation'>, ModeHandler> = {
  ask: askHandler,
  teach: teachHandler,
  explain: explainHandler,
  practice: practiceHandler,
  quiz: quizHandler,
  assessment: assessmentHandler,
  'learning-path': learningPathHandler,
};

export { translationBoundaryResponse } from './translation';
