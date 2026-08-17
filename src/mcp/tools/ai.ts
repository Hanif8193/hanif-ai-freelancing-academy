// M7 — AI tools (delegate to M4 RAGService, M5 TutorService, M6 TranslatorAgent)
// searchAcademyContent, generateQuiz, translateContent.
//
// These tools consume AI quota exactly like the web features — no retry
// loops, and quota/provider errors fail fast through the M4 P0 mapping
// (`safeToolError`). Grounding is enforced by the delegated services.

import type { McpServices } from '../services';
import { safeToolError, toolResult } from './errors';

// ============================================================
// Tool 1 — searchAcademyContent
// ============================================================

export async function handleSearchAcademyContent(
  services: McpServices,
  args: { question: string; maxSources?: number }
) {
  try {
    const result = await services.rag.answer({
      question: args.question,
      maxSources: args.maxSources ?? 5,
    });
    return toolResult({
      answer: result.answer,
      sources: result.sources,
      grounded: !result.insufficientInfo,
      insufficientInfo: result.insufficientInfo,
      suggestedTopics: result.suggestedTopics,
    });
  } catch (error) {
    return safeToolError(error);
  }
}

// ============================================================
// Tool 5 — generateQuiz
// ============================================================

export async function handleGenerateQuiz(
  services: McpServices,
  args: {
    topic: string;
    count?: number;
    language?: 'en' | 'ur';
    level?: 'beginner' | 'intermediate' | 'advanced';
  }
) {
  try {
    const response = await services.tutor.answer({
      question: args.topic,
      mode: 'quiz',
      language: args.language ?? 'en',
      level: args.level ?? 'beginner',
      maxSources: 3,
    });

    const items = (response.quiz ?? []).slice(0, args.count ?? 3);

    return toolResult({
      quiz: items,
      sources: response.sources,
      grounded: !response.insufficientInfo && items.length > 0,
      insufficientInfo: response.insufficientInfo,
    });
  } catch (error) {
    return safeToolError(error);
  }
}

// ============================================================
// Tool 6 — translateContent
// ============================================================

export async function handleTranslateContent(
  services: McpServices,
  args: {
    text: string;
    targetLanguage: 'en' | 'ur';
    sourceLanguage?: 'en' | 'ur';
    preserveTerms?: boolean;
    preserveMarkdown?: boolean;
  }
) {
  const from = args.sourceLanguage ?? 'en';
  const to = args.targetLanguage;

  // Zero-cost no-op: same-language "translation" needs no provider call.
  if (from === to) {
    return toolResult({
      translatedText: args.text,
      sourceLanguage: from,
      targetLanguage: to,
      preservedTerms: [],
    });
  }

  try {
    const result = await services.translator.translate(args.text, from, to, {
      preserveTerms: args.preserveTerms ?? true,
      preserveMarkdown: args.preserveMarkdown ?? true,
    });
    return toolResult(result);
  } catch (error) {
    return safeToolError(error);
  }
}
