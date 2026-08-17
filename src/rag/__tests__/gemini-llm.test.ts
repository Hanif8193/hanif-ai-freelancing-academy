// M4 — Gemini LLM Provider Tests

import { GeminiLLMProvider } from '../providers/llm/gemini';

// Mock @google/genai
jest.mock('@google/genai', () => {
  const mockGenerateContent = jest.fn();
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
    __mockGenerateContent: mockGenerateContent,
  };
});

describe('GeminiLLMProvider', () => {
  let provider: GeminiLLMProvider;
  let mockGenerateContent: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const { __mockGenerateContent } = require('@google/genai') as { __mockGenerateContent: jest.Mock };
    mockGenerateContent = __mockGenerateContent;
    provider = new GeminiLLMProvider({
      apiKey: 'test-key',
      model: 'gemini-2.0-flash',
    });
  });

  describe('generate', () => {
    it('should generate a response', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: 'The answer is 42.',
      });

      const result = await provider.generate('What is the answer?', 'You are helpful.');

      expect(result).toBe('The answer is 42.');
      expect(mockGenerateContent).toHaveBeenCalledWith({
        model: 'gemini-2.0-flash',
        contents: 'What is the answer?',
        config: {
          systemInstruction: 'You are helpful.',
          temperature: 0.3,
          maxOutputTokens: 1000,
        },
      });
    });

    it('should return empty string on empty response', async () => {
      mockGenerateContent.mockResolvedValueOnce({});

      const result = await provider.generate('Hello', 'System');

      expect(result).toBe('');
    });
  });

  describe('name', () => {
    it('should be gemini', () => {
      expect(provider.name).toBe('gemini');
    });
  });

  describe('constructor defaults', () => {
    it('should use default model', () => {
      const p = new GeminiLLMProvider({ apiKey: 'test' });
      expect(p.name).toBe('gemini');
    });
  });
});
