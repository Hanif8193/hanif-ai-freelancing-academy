// M5 — TranslatorAgent boundary tests (M6-ready contract)

import {
  GLOSSARY,
  TECHNICAL_TERMS,
  TRANSLATOR_NOT_IMPLEMENTED_MESSAGE,
} from '../translator';
import type { TranslatorAgent } from '../translator';

describe('glossary', () => {
  const REQUIRED_TERMS = [
    'Freelancing',
    'AI Agent',
    'AI Coding Agent',
    'Agentic AI',
    'RAG',
    'MCP',
    'API',
    'SDK',
    'GitHub',
    'Git',
    'Repository',
    'Specification',
    'Implementation',
    'Verification',
    'Vector Database',
    'React',
    'Next.js',
    'TypeScript',
    'Python',
    'JavaScript',
    'Node.js',
    'npm',
    'Docusaurus',
    'OpenAI',
    'Gemini',
    'Claude',
    'ChromaDB',
  ];

  it.each(REQUIRED_TERMS)('defines the technical term "%s"', (term) => {
    const entry = GLOSSARY.find((g) => g.term === term);
    expect(entry).toBeDefined();
    expect(entry!.urdu.length).toBeGreaterThan(0);
    expect(entry!.explanation.length).toBeGreaterThan(0);
  });

  it('exposes the terms list for prompts', () => {
    expect(TECHNICAL_TERMS).toContain('RAG');
    expect(TECHNICAL_TERMS).toContain('MCP');
  });
});

describe('TranslatorAgent interface contract (M6-ready)', () => {
  it('can be satisfied by a stub implementation', async () => {
    const stub: TranslatorAgent = {
      name: 'stub-translator',
      async translate(text, from, to) {
        return { translatedText: `[${from}->${to}] ${text}`, sourceLanguage: from, targetLanguage: to, preservedTerms: ['RAG'] };
      },
      async explain(text, targetLanguage) {
        return { translatedText: `[${targetLanguage}] ${text}`, sourceLanguage: 'en', targetLanguage, preservedTerms: [] };
      },
    };

    const result = await stub.translate('Hello', 'en', 'ur', { preserveTerms: true });
    expect(result.targetLanguage).toBe('ur');
    expect(result.preservedTerms).toContain('RAG');
    expect(result.translatedText).toContain('Hello');

    const explained = await stub.explain('RAG', 'ur', 'beginner');
    expect(explained.translatedText).toContain('RAG');
  });
});

describe('boundary message', () => {
  it('clearly states translation is not available when no translator is wired', () => {
    expect(TRANSLATOR_NOT_IMPLEMENTED_MESSAGE).toMatch(/not available/i);
    expect(TRANSLATOR_NOT_IMPLEMENTED_MESSAGE).not.toMatch(/translated successfully/i);
  });
});
