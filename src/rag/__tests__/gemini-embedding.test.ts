// M4 — Gemini Embedding Provider Tests

import { GeminiEmbeddingProvider } from '../providers/embedding/gemini';

// Mock @google/genai
jest.mock('@google/genai', () => {
  const mockEmbedContent = jest.fn();
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        embedContent: mockEmbedContent,
      },
    })),
    __mockEmbedContent: mockEmbedContent,
  };
});

describe('GeminiEmbeddingProvider', () => {
  let provider: GeminiEmbeddingProvider;
  let mockEmbedContent: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const { __mockEmbedContent } = require('@google/genai') as { __mockEmbedContent: jest.Mock };
    mockEmbedContent = __mockEmbedContent;
    provider = new GeminiEmbeddingProvider({
      apiKey: 'test-key',
      model: 'gemini-embedding-001',
    });
  });

  describe('embed', () => {
    it('should embed a single text', async () => {
      mockEmbedContent.mockResolvedValueOnce({
        embeddings: [{ values: [0.1, 0.2, 0.3] }],
      });

      const result = await provider.embed('Hello world');

      expect(result).toEqual([0.1, 0.2, 0.3]);
      expect(mockEmbedContent).toHaveBeenCalledWith({
        model: 'gemini-embedding-001',
        contents: 'Hello world',
        config: {
          outputDimensionality: 768,
        },
      });
    });

    it('should throw on empty response', async () => {
      mockEmbedContent.mockResolvedValueOnce({ embeddings: [] });

      await expect(provider.embed('Hello')).rejects.toThrow('Gemini embedding returned no values');
    });
  });

  describe('embedBatch', () => {
    it('should embed multiple texts', async () => {
      mockEmbedContent.mockResolvedValueOnce({
        embeddings: [
          { values: [0.1, 0.2] },
          { values: [0.3, 0.4] },
        ],
      });

      const result = await provider.embedBatch(['Hello', 'World']);

      expect(result).toEqual([[0.1, 0.2], [0.3, 0.4]]);
      expect(mockEmbedContent).toHaveBeenCalledWith({
        model: 'gemini-embedding-001',
        contents: ['Hello', 'World'],
        config: {
          outputDimensionality: 768,
        },
      });
    });

    it('should throw on empty batch response', async () => {
      mockEmbedContent.mockResolvedValueOnce({ embeddings: [] });

      await expect(provider.embedBatch(['Hello'])).rejects.toThrow('Gemini embedding batch returned no values');
    });
  });

  describe('rate limit / quota handling', () => {
    it('should fail fast on quota-exhausted errors without retrying', async () => {
      const quotaProvider = new GeminiEmbeddingProvider({
        apiKey: 'test-key',
        retryBaseDelayMs: 1,
      });
      mockEmbedContent.mockRejectedValueOnce({
        status: 429,
        message: 'You exceeded your current quota. status RESOURCE_EXHAUSTED',
      });

      await expect(quotaProvider.embed('hello')).rejects.toMatchObject({ status: 429 });
      expect(mockEmbedContent).toHaveBeenCalledTimes(1);
    });

    it('should fail fast on quota-exhausted errors in embedBatch', async () => {
      const quotaProvider = new GeminiEmbeddingProvider({
        apiKey: 'test-key',
        retryBaseDelayMs: 1,
      });
      mockEmbedContent.mockRejectedValueOnce({
        status: 429,
        message: 'Quota exceeded for metric, RESOURCE_EXHAUSTED',
      });

      await expect(quotaProvider.embedBatch(['a', 'b'])).rejects.toMatchObject({ status: 429 });
      expect(mockEmbedContent).toHaveBeenCalledTimes(1);
    });

    it('should retry transient rate limits (limited) then succeed', async () => {
      const retryProvider = new GeminiEmbeddingProvider({
        apiKey: 'test-key',
        maxRetries: 3,
        retryBaseDelayMs: 1,
      });
      mockEmbedContent
        .mockRejectedValueOnce({ status: 429, message: 'RATE_LIMIT_EXCEEDED, retry later' })
        .mockRejectedValueOnce({ status: 429, message: 'RATE_LIMIT_EXCEEDED, retry later' })
        .mockResolvedValueOnce({ embeddings: [{ values: [0.5] }] });

      const result = await retryProvider.embed('hello');

      expect(result).toEqual([0.5]);
      expect(mockEmbedContent).toHaveBeenCalledTimes(3);
    });
  });

  describe('getDimensions', () => {
    it('should return 768 by default', () => {
      expect(provider.getDimensions()).toBe(768);
    });

    it('should return custom dimensions', () => {
      const custom = new GeminiEmbeddingProvider({
        apiKey: 'test-key',
        dimensions: 256,
      });
      expect(custom.getDimensions()).toBe(256);
    });
  });

  describe('name', () => {
    it('should be gemini', () => {
      expect(provider.name).toBe('gemini');
    });
  });
});
