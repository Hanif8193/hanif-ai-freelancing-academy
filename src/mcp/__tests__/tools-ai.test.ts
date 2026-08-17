// M7 — AI tool tests (searchAcademyContent, generateQuiz, translateContent)
// All services mocked — zero real API calls, no quota consumed.

import type { TutorRequest, TutorResponse } from '../../tutor/types';
import { setupMcp, teardownMcp, parseResult } from './helpers';

describe('searchAcademyContent', () => {
  it('returns a grounded answer with sources and delegates to RAGService', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'searchAcademyContent',
          arguments: { question: 'What is freelancing?' },
        })
      );
      expect(result.grounded).toBe(true);
      expect(result.insufficientInfo).toBe(false);
      expect(String(result.answer)).toContain('What is freelancing?');
      const sources = result.sources as Array<Record<string, unknown>>;
      expect(sources[0].url).toBe('/docs/freelancing/what-is-freelancing');

      // Delegation: the tool calls the M4 RAGService with the question.
      expect(harness.services.rag.answer).toHaveBeenCalledWith({
        question: 'What is freelancing?',
        maxSources: 5,
      });
    } finally {
      await teardownMcp(harness);
    }
  });

  it('surfaces insufficient information with suggested topics', async () => {
    const harness = await setupMcp({
      rag: {
        answer: jest.fn(async () => ({
          answer: "I don't have enough information in the course content.",
          sources: [],
          insufficientInfo: true,
          suggestedTopics: ['What is Freelancing?', 'What are AI Coding Agents?'],
        })),
      },
    });
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'searchAcademyContent',
          arguments: { question: 'Quantum physics?' },
        })
      );
      expect(result.grounded).toBe(false);
      expect(result.insufficientInfo).toBe(true);
      expect(result.suggestedTopics).toEqual([
        'What is Freelancing?',
        'What are AI Coding Agents?',
      ]);
    } finally {
      await teardownMcp(harness);
    }
  });

  it('maps quota errors to a safe AI_QUOTA_EXCEEDED result', async () => {
    const harness = await setupMcp({
      rag: {
        answer: jest.fn(async () => {
          throw new Error('429 RESOURCE_EXHAUSTED: quota exceeded for embed_content');
        }),
      },
    });
    try {
      const result = await harness.client.callTool({
        name: 'searchAcademyContent',
        arguments: { question: 'What is RAG?' },
      });
      expect(result.isError).toBe(true);
      const parsed = parseResult(result);
      expect(parsed.code).toBe('AI_QUOTA_EXCEEDED');
      expect(JSON.stringify(parsed)).not.toContain('RESOURCE_EXHAUSTED');
      expect(JSON.stringify(parsed)).not.toContain('embed_content');
    } finally {
      await teardownMcp(harness);
    }
  });

  it('maps provider errors to AI_PROVIDER_ERROR without leaking details', async () => {
    const harness = await setupMcp({
      rag: {
        answer: jest.fn(async () => {
          throw Object.assign(
            new Error('Gemini internal error: upstream failure trace=abc123'),
            { status: 503 }
          );
        }),
      },
    });
    try {
      const result = await harness.client.callTool({
        name: 'searchAcademyContent',
        arguments: { question: 'How do AI agents work?' },
      });
      expect(result.isError).toBe(true);
      const parsed = parseResult(result);
      expect(parsed.code).toBe('AI_PROVIDER_ERROR');
      expect(JSON.stringify(parsed)).not.toContain('trace=abc123');
      expect(JSON.stringify(parsed)).not.toContain('upstream');
    } finally {
      await teardownMcp(harness);
    }
  });
});

describe('generateQuiz', () => {
  it('generates grounded quiz items with sources and delegates to TutorService', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'generateQuiz',
          arguments: { topic: 'freelancing', count: 2, language: 'en', level: 'beginner' },
        })
      );
      expect(result.grounded).toBe(true);
      expect(result.insufficientInfo).toBe(false);
      const quiz = result.quiz as Array<Record<string, unknown>>;
      expect(quiz.length).toBe(1); // mocked service returns 1 item
      expect(quiz[0].options).toHaveLength(4);
      expect((result.sources as Array<Record<string, unknown>>)[0].url).toBe(
        '/docs/freelancing/what-is-freelancing'
      );

      // Delegation: mode forced to quiz with the topic as the question.
      const call = (harness.services.tutor.answer as jest.Mock).mock.calls[0][0];
      expect(call.mode).toBe('quiz');
      expect(call.question).toBe('freelancing');
      expect(call.language).toBe('en');
      expect(call.level).toBe('beginner');
    } finally {
      await teardownMcp(harness);
    }
  });

  it('reports insufficientInfo when the tutor cannot ground the topic', async () => {
    const harness = await setupMcp({
      tutor: {
        answer: jest.fn(async (_request: TutorRequest): Promise<TutorResponse> => ({
          mode: 'quiz',
          language: 'en',
          level: 'beginner',
          quiz: [],
          sources: [],
          grounded: false,
          insufficientInfo: true,
          suggestedTopics: ['What is Freelancing?'],
        })),
      },
    });
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'generateQuiz',
          arguments: { topic: 'unknown topic' },
        })
      );
      expect(result.insufficientInfo).toBe(true);
      expect(result.grounded).toBe(false);
    } finally {
      await teardownMcp(harness);
    }
  });
});

describe('translateContent', () => {
  it('translates EN -> UR through the M6 TranslatorAgent', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'translateContent',
          arguments: {
            text: 'Freelancing is working for clients.',
            targetLanguage: 'ur',
          },
        })
      );
      expect(result.sourceLanguage).toBe('en');
      expect(result.targetLanguage).toBe('ur');
      expect(String(result.translatedText)).toContain('Freelancing');
      expect(result.preservedTerms).toEqual(['Freelancing', 'clients']);

      expect(harness.services.translator.translate).toHaveBeenCalledWith(
        'Freelancing is working for clients.',
        'en',
        'ur',
        { preserveTerms: true, preserveMarkdown: true }
      );
    } finally {
      await teardownMcp(harness);
    }
  });

  it('translates UR -> EN with an explicit source language', async () => {
    const harness = await setupMcp();
    try {
      await harness.client.callTool({
        name: 'translateContent',
        arguments: {
          text: 'فری لانسنگ ایک پیشہ ہے۔',
          targetLanguage: 'en',
          sourceLanguage: 'ur',
          preserveTerms: false,
        },
      });
      expect(harness.services.translator.translate).toHaveBeenCalledWith(
        'فری لانسنگ ایک پیشہ ہے۔',
        'ur',
        'en',
        { preserveTerms: false, preserveMarkdown: true }
      );
    } finally {
      await teardownMcp(harness);
    }
  });

  it('returns a zero-cost no-op for same-language input (no provider call)', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'translateContent',
          arguments: { text: 'Same language text', targetLanguage: 'en' },
        })
      );
      expect(result.translatedText).toBe('Same language text');
      expect(result.preservedTerms).toEqual([]);
      expect(harness.services.translator.translate).not.toHaveBeenCalled();
    } finally {
      await teardownMcp(harness);
    }
  });

  it('maps quota errors to a safe AI_QUOTA_EXCEEDED result', async () => {
    const harness = await setupMcp({
      translator: {
        name: 'mock-translator',
        translate: jest.fn(async () => {
          throw new Error('You exceeded your current quota: 429');
        }),
        explain: jest.fn(),
      },
    });
    try {
      const result = await harness.client.callTool({
        name: 'translateContent',
        arguments: { text: 'Hello world', targetLanguage: 'ur' },
      });
      expect(result.isError).toBe(true);
      const parsed = parseResult(result);
      expect(parsed.code).toBe('AI_QUOTA_EXCEEDED');
      expect(JSON.stringify(parsed)).not.toContain('You exceeded');
    } finally {
      await teardownMcp(harness);
    }
  });
});
