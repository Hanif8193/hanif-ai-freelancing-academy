// M5 — TutorService
// A teaching/orchestration layer ABOVE the existing M4 RAG architecture.
// - Detects intent (mode/language/level).
// - Grounds Academy-related questions through the existing RAGService
//   (never bypasses or modifies it).
// - Dispatches to mode handlers and assembles a structured TutorResponse.
// - Routes Translation mode through the M6 TranslatorAgent boundary.
// - Preserves M4 source citations and insufficient-information behavior.

import { detectIntent } from './intent';
import { modeHandlers, translationBoundaryResponse } from './modes';
import type { TranslatorAgent } from './translator';
import type {
  GroundingClient,
  TutorIntent,
  TutorRequest,
  TutorResponse,
} from './types';

export interface TutorServiceDeps {
  /** Existing M4 RAGService (or a structurally compatible client). */
  grounding: GroundingClient;
  /** LLM provider via the M4 provider factory. */
  llm: {
    name: string;
    generate(prompt: string, systemPrompt: string): Promise<string>;
  };
  /** Optional TranslatorAgent (M6). When absent, Translation mode returns a boundary response. */
  translator?: TranslatorAgent;
}

const INSUFFICIENT_MESSAGE =
  'The Academy content does not contain enough information to answer that question. ' +
  'The topic might not be covered in the current curriculum.';

export class TutorService {
  constructor(private deps: TutorServiceDeps) {}

  async answer(request: TutorRequest): Promise<TutorResponse> {
    const intent = detectIntent(request.question, {
      mode: request.mode,
      language: request.language,
      level: request.level,
    });

    if (intent.mode === 'translation') {
      return this.handleTranslation(request, intent);
    }

    // Ground through the existing M4 RAG pipeline.
    const grounded = await this.deps.grounding.answer({
      question: request.question,
      maxSources: request.maxSources ?? 5,
    });

    const base: TutorResponse = {
      mode: intent.mode,
      language: intent.language,
      level: intent.level,
      sources: [],
      grounded: false,
      insufficientInfo: false,
    };

    if (grounded.insufficientInfo) {
      return {
        ...base,
        directAnswer: INSUFFICIENT_MESSAGE,
        insufficientInfo: true,
        suggestedTopics: grounded.suggestedTopics,
      };
    }

    const handler = modeHandlers[intent.mode];
    return handler({ request, intent, grounded, llm: this.deps.llm });
  }

  private async handleTranslation(request: TutorRequest, intent: TutorIntent): Promise<TutorResponse> {
    // Route through the TranslatorAgent interface (M6 implementation).
    if (this.deps.translator) {
      const result = await this.deps.translator.translate(request.question, 'en', 'ur', {
        preserveTerms: true,
        preserveMarkdown: true,
        level: intent.level,
      });
      return {
        mode: 'translation',
        language: 'ur',
        level: intent.level,
        directAnswer: result.translatedText,
        sources: [],
        grounded: false,
        insufficientInfo: false,
      };
    }

    // No translator wired — return a clear fallback response.
    return translationBoundaryResponse(intent.language, intent.level);
  }
}
