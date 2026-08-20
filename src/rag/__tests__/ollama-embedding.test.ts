// M4 — Ollama Embedding Provider Tests

import { OllamaEmbeddingProvider } from '../providers/embedding/ollama';

// Mock global fetch
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

describe('OllamaEmbeddingProvider', () => {
  let provider: OllamaEmbeddingProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new OllamaEmbeddingProvider({
      baseUrl: 'http://localhost:11434',
      model: 'nomic-embed-text',
    });
  });

  describe('name', () => {
    it('should be ollama', () => {
      expect(provider.name).toBe('ollama');
    });
  });

  describe('getDimensions', () => {
    it('should return 768 by default', () => {
      expect(provider.getDimensions()).toBe(768);
    });

    it('should return custom dimensions', () => {
      const custom = new OllamaEmbeddingProvider({ dimensions: 256 });
      expect(custom.getDimensions()).toBe(256);
    });
  });

  describe('constructor defaults', () => {
    it('should use localhost:11434 as default baseUrl', () => {
      const defaults = new OllamaEmbeddingProvider({});
      expect((defaults as any).baseUrl).toBe('http://localhost:11434');
    });

    it('should use nomic-embed-text as default model', () => {
      const defaults = new OllamaEmbeddingProvider({});
      expect((defaults as any).model).toBe('nomic-embed-text');
    });

    it('should strip trailing slashes from baseUrl', () => {
      const custom = new OllamaEmbeddingProvider({ baseUrl: 'http://localhost:11434/' });
      expect((custom as any).baseUrl).toBe('http://localhost:11434');
    });
  });

  describe('embed', () => {
    it('should embed a single text', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ embeddings: [[0.1, 0.2, 0.3]] }),
      });

      const result = await provider.embed('Hello world');

      expect(result).toEqual([0.1, 0.2, 0.3]);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/embed',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'nomic-embed-text', input: 'Hello world' }),
        })
      );
    });

    it('should throw on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      await expect(provider.embed('Hello')).rejects.toThrow(
        'Ollama embed request failed (500): Internal Server Error'
      );
    });

    it('should throw on empty embeddings', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ embeddings: [] }),
      });

      await expect(provider.embed('Hello')).rejects.toThrow('Ollama embedding returned no values');
    });
  });

  describe('embedBatch', () => {
    it('should embed multiple texts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          embeddings: [
            [0.1, 0.2],
            [0.3, 0.4],
          ],
        }),
      });

      const result = await provider.embedBatch(['Hello', 'World']);

      expect(result).toEqual([
        [0.1, 0.2],
        [0.3, 0.4],
      ]);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/embed',
        expect.objectContaining({
          body: JSON.stringify({ model: 'nomic-embed-text', input: ['Hello', 'World'] }),
        })
      );
    });

    it('should filter out empty texts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ embeddings: [[0.5, 0.6]] }),
      });

      const result = await provider.embedBatch(['Hello', '  ', 'World']);

      // Only non-empty texts should be sent
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/embed',
        expect.objectContaining({
          body: JSON.stringify({ model: 'nomic-embed-text', input: ['Hello', 'World'] }),
        })
      );
      expect(result).toEqual([[0.5, 0.6]]);
    });

    it('should return empty array for all-empty input', async () => {
      const result = await provider.embedBatch(['  ', '']);

      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
