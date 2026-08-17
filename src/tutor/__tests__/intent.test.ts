// M5 — Intent detection tests

import {
  detectIntent,
  detectLanguage,
  detectLevel,
  detectMode,
  isLanguage,
  isLevel,
  isTutorMode,
} from '../intent';
import type { TutorMode } from '../types';

describe('detectMode', () => {
  it.each<[string, TutorMode]>([
    ['Translate this into Urdu', 'translation'],
    ['Can you translate this paragraph to urdu?', 'translation'],
    ['Check my answer', 'assessment'],
    ['Please grade my answer', 'assessment'],
    ['Give me a quiz about Chapter 5', 'quiz'],
    ['Quiz me on Git', 'quiz'],
    ['Give me an exercise', 'practice'],
    ['Give me a practice drill on VS Code', 'practice'],
    ['Teach me freelancing from beginner level', 'teach'],
    ['Explain RAG simply', 'explain'],
    ['What should I learn next?', 'learning-path'],
    ['Recommend the next chapter', 'learning-path'],
    ['What is freelancing?', 'ask'],
    ['How do AI coding agents work?', 'ask'],
  ])('detects %p as %p', (question, expected) => {
    expect(detectMode(question)).toBe(expected);
  });

  it('applies the approved priority order on conflicts', () => {
    // Translation marker wins over quiz/explain markers.
    expect(detectMode('Translate this quiz explanation into Urdu')).toBe('translation');
    // Assessment wins over quiz.
    expect(detectMode('Check my answer for this quiz')).toBe('assessment');
    // Quiz wins over teach.
    expect(detectMode('Quiz me on what you taught me')).toBe('quiz');
    // Practice wins over explain.
    expect(detectMode('Give me an exercise to practice what I learned')).toBe('practice');
    // Teach wins over explain.
    expect(detectMode('Teach me how to explain RAG')).toBe('teach');
  });

  it('keeps the documented Urdu deviation: urdu marker alone does not force translation', () => {
    // Matches the spec example "Explain RAG in Urdu for a beginner" → Explain mode.
    expect(detectMode('Explain RAG in Urdu for a beginner')).toBe('explain');
  });
});

describe('detectLanguage', () => {
  it('detects Urdu', () => {
    expect(detectLanguage('Explain freelancing in urdu')).toBe('ur');
    expect(detectLanguage('براہ کرم اردو میں جواب دیں')).toBe('ur');
  });

  it('defaults to English', () => {
    expect(detectLanguage('What is freelancing?')).toBe('en');
  });
});

describe('detectLevel', () => {
  it('detects beginner', () => {
    expect(detectLevel('Explain RAG for a beginner')).toBe('beginner');
    expect(detectLevel('Explain RAG simply')).toBe('beginner');
  });

  it('detects intermediate and advanced', () => {
    expect(detectLevel('Explain at intermediate level')).toBe('intermediate');
    expect(detectLevel('Explain this for advanced learners')).toBe('advanced');
  });

  it('defaults to beginner', () => {
    expect(detectLevel('What is freelancing?')).toBe('beginner');
  });
});

describe('detectIntent', () => {
  it('resolves mode, language, and level together', () => {
    const intent = detectIntent('Explain RAG in Urdu for a beginner');
    expect(intent).toEqual({ mode: 'explain', language: 'ur', level: 'beginner' });
  });

  it('lets explicit request fields override detection', () => {
    expect(
      detectIntent('What is freelancing?', { mode: 'teach', language: 'en', level: 'advanced' })
    ).toEqual({ mode: 'teach', language: 'en', level: 'advanced' });
  });

  it('does not flip the mode when only language is overridden', () => {
    expect(detectIntent('What is freelancing?', { language: 'ur' })).toEqual({
      mode: 'ask',
      language: 'ur',
      level: 'beginner',
    });
  });
});

describe('validators', () => {
  it('isTutorMode accepts known modes and rejects others', () => {
    expect(isTutorMode('quiz')).toBe(true);
    expect(isTutorMode('learning-path')).toBe(true);
    expect(isTutorMode('bogus')).toBe(false);
    expect(isTutorMode(42)).toBe(false);
  });

  it('isLanguage / isLevel validate enums', () => {
    expect(isLanguage('en')).toBe(true);
    expect(isLanguage('ur')).toBe(true);
    expect(isLanguage('fr')).toBe(false);
    expect(isLevel('beginner')).toBe(true);
    expect(isLevel('expert')).toBe(false);
  });
});
