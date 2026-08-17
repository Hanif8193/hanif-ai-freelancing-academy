// M5 — Hanif AI Tutor Types and Contracts
// Tutor types build on the existing M4 RAG types (AskRequest/AskResponse/Source).

import type { AskRequest, AskResponse, Source } from '../rag/types';

// ============================================================
// Language & Level
// ============================================================

export type Language = 'en' | 'ur';

export type Level = 'beginner' | 'intermediate' | 'advanced';

// ============================================================
// Modes
// ============================================================

export type TutorMode =
  | 'ask'
  | 'teach'
  | 'explain'
  | 'practice'
  | 'quiz'
  | 'assessment'
  | 'learning-path'
  | 'translation';

export const TUTOR_MODES: TutorMode[] = [
  'ask',
  'teach',
  'explain',
  'practice',
  'quiz',
  'assessment',
  'learning-path',
  'translation',
];

// ============================================================
// Intent
// ============================================================

export interface TutorIntent {
  mode: TutorMode;
  language: Language;
  level: Level;
}

// ============================================================
// Request
// ============================================================

export interface TutorContext {
  /** Learner's answer text for Assessment mode. */
  learnerAnswer?: string;
  /** Topic hint for Practice/Quiz modes. */
  topic?: string;
}

export interface TutorConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TutorRequest {
  /** The learner's question (1-500 characters). */
  question: string;
  /** Optional explicit mode override (auto-detected when omitted). */
  mode?: TutorMode;
  /** Optional language override (auto-detected when omitted). */
  language?: Language;
  /** Optional learner level (default: beginner). */
  level?: Level;
  /** Optional context (e.g. learner answer for assessment). */
  context?: TutorContext;
  /** Bounded conversation history (max 10 messages). */
  history?: TutorConversationMessage[];
  /** Maximum sources to attach (default 5). */
  maxSources?: number;
}

// ============================================================
// Structured outputs
// ============================================================

export interface Exercise {
  title: string;
  instructions: string;
  topic?: string;
  difficulty?: Level;
  source?: Source;
}

export interface QuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  source?: Source;
}

export type AssessmentVerdict = 'correct' | 'partial' | 'incorrect';

export interface Assessment {
  verdict: AssessmentVerdict;
  whatIsCorrect: string;
  whatIsMissing: string;
  feedback: string;
  suggestedNext?: string;
  source?: Source;
}

export interface RecommendedNext {
  topic: string;
  url?: string;
  reason?: string;
}

// ============================================================
// Response
// ============================================================

export interface TutorResponse {
  mode: TutorMode;
  language: Language;
  level?: Level;
  /** Short direct answer (present in most modes). */
  directAnswer?: string;
  /** Longer explanation (teach/explain). */
  explanation?: string;
  /** Worked example (teach/explain). */
  example?: string;
  /** Practical exercise (practice mode). */
  exercise?: Exercise;
  /** Quiz items (quiz mode). */
  quiz?: QuizItem[];
  /** Answer assessment (assessment mode). */
  assessment?: Assessment;
  /** Recommended next topic (learning-path mode / teach). */
  recommendedNext?: RecommendedNext;
  /** Source citations — reuse the M4 Source shape. */
  sources: Source[];
  /** True when the response used Academy content. */
  grounded: boolean;
  /** True when Academy content was insufficient. */
  insufficientInfo: boolean;
  /** Suggested topics when insufficientInfo. */
  suggestedTopics?: string[];
}

// ============================================================
// Service dependencies
// ============================================================

/**
 * Minimal grounding contract. The existing M4 RAGService satisfies this
 * structurally — TutorService never modifies or bypasses it.
 */
export interface GroundingClient {
  answer(request: AskRequest): Promise<AskResponse>;
}

/** Internal context passed to mode handlers. */
export interface ModeHandlerContext {
  request: TutorRequest;
  intent: TutorIntent;
  /** Grounded result from RAGService (null when not applicable). */
  grounded: AskResponse | null;
  /** LLM provider for structured generation (via the M4 provider factory). */
  llm: {
    name: string;
    generate(prompt: string, systemPrompt: string): Promise<string>;
  };
}

export type ModeHandler = (context: ModeHandlerContext) => Promise<TutorResponse>;
