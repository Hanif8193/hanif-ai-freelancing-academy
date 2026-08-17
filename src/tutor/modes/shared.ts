// M5 — Shared mode handler helpers

import type { AskResponse } from '../../rag/types';
import { extractJsonObjectStrict } from '../json';
import { buildGroundedModePrompt, buildModeSystemPrompt } from '../prompts';
import type { ModeHandlerContext, TutorResponse } from '../types';

/** Guard: every structured mode requires a grounded, non-empty retrieval. */
export function groundedOrInsufficient(
  context: ModeHandlerContext,
  fallbackAnswer: string
): TutorResponse | null {
  const { grounded, intent } = context;
  if (!grounded || grounded.insufficientInfo) {
    return {
      mode: intent.mode,
      language: intent.language,
      level: intent.level,
      directAnswer: fallbackAnswer,
      sources: [],
      grounded: false,
      insufficientInfo: true,
      suggestedTopics: grounded?.suggestedTopics,
    };
  }
  return null;
}

/** Run a structured LLM generation for a mode and parse its JSON output. */
export async function generateStructured<T extends object>(
  context: ModeHandlerContext,
  mode: ModeHandlerContext['intent']['mode'],
  fallback: T
): Promise<T> {
  const { llm, intent, request, grounded } = context;
  const systemPrompt = buildModeSystemPrompt(mode, intent.language, intent.level);
  const userPrompt = buildGroundedModePrompt(mode, grounded as AskResponse, request.question, request.context?.learnerAnswer);
  const raw = await llm.generate(userPrompt, systemPrompt);
  return extractJsonObjectStrict<T>(raw) ?? fallback;
}
