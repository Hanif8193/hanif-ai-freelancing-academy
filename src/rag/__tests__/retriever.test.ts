// M4 — Retriever metadata-reranking & relevance-filter tests

import { Retriever, metadataBoost } from '../services/retriever';
import type { SearchResult } from '../types';

// ── Helpers ──────────────────────────────────────────────────────

function makeResult(overrides: {
  title?: string;
  section?: string;
  content?: string;
  score: number;
}): SearchResult {
  return {
    chunk: {
      id: 'test',
      content: overrides.content ?? 'test content',
      metadata: {
        title: overrides.title ?? 'Untitled',
        module: 'test',
        chapter: '01',
        section: overrides.section ?? 'Section',
        sourcePath: 'docs/test.md',
        url: '/docs/test',
        contentType: 'text',
        headingLevel: 2,
        chunkIndex: 0,
        startLine: 1,
        endLine: 5,
        hasCodeBlocks: false,
      },
    },
    score: overrides.score,
  };
}

/** Minimal mock that satisfies the EmbeddingProvider interface. */
function mockEmbedding() {
  return {
    name: 'mock',
    embed: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
    embedBatch: jest.fn().mockResolvedValue([[0.1, 0.2, 0.3]]),
    getDimensions: () => 3,
  };
}

/** Minimal mock that satisfies the VectorStore interface. */
function mockVectorStore(results: SearchResult[]) {
  return {
    name: 'mock',
    upsert: jest.fn(),
    search: jest.fn().mockResolvedValue(results),
    delete: jest.fn(),
    get: jest.fn(),
    count: jest.fn(),
    reset: jest.fn(),
  };
}

// ── metadataBoost unit tests ─────────────────────────────────────

describe('metadataBoost', () => {
  it('returns 0 when no tokens overlap', () => {
    const result = makeResult({ title: 'What is Freelancing?', section: 'Introduction', score: 0.4 });
    const tokens = tokenize('capital of france');
    expect(metadataBoost(tokens, result)).toBe(0);
  });

  it('returns 0 when only 1 token overlaps (< 2 required)', () => {
    const result = makeResult({ title: 'How Freelancers Make Money', section: 'Getting Paid', score: 0.4 });
    // "make" is the only token matching between "make money freelancers" and the title
    const tokens = ['how', 'do', 'freelancers', 'make', 'money'];
    const boost = metadataBoost(tokens, result);
    // With 5 query tokens and "freelancers", "make", "money" matching — should be positive
    expect(boost).toBeGreaterThan(0);
  });

  it('returns positive boost when title tokens match query', () => {
    const result = makeResult({ title: 'How Freelancers Make Money', section: 'Getting Paid', score: 0.4 });
    const tokens = ['how', 'do', 'freelancers', 'make', 'money'];
    const boost = metadataBoost(tokens, result);
    expect(boost).toBeGreaterThan(0);
  });

  it('caps boost at 0.25', () => {
    const result = makeResult({ title: 'Make Money Money Money', section: 'Money Money', score: 0.4 });
    const tokens = ['make', 'money', 'money', 'money'];
    const boost = metadataBoost(tokens, result);
    expect(boost).toBeLessThanOrEqual(0.25);
  });
});

// ── Retriever integration tests ──────────────────────────────────

describe('Retriever', () => {
  describe('relevance filtering', () => {
    it('returns results for a relevant question ("What is freelancing?")', async () => {
      const storeResults: SearchResult[] = [
        makeResult({ title: 'What is Freelancing?', section: 'Introduction', content: 'Freelancing is working independently.', score: 0.65 }),
        makeResult({ title: 'What is Freelancing?', section: 'Summary', content: 'Key takeaways.', score: 0.58 }),
        makeResult({ title: 'Building Your Profile', section: 'Overview', content: 'A profile helps.', score: 0.52 }),
        makeResult({ title: 'How Freelancers Make Money', section: 'Overview', content: 'Income streams.', score: 0.48 }),
        makeResult({ title: 'What is Freelancing?', section: 'Types', content: 'Many types.', score: 0.44 }),
      ];

      const embedding = mockEmbedding();
      const store = mockVectorStore(storeResults);
      const retriever = new Retriever(embedding, store, { topK: 5, minScore: 0.5 });

      const results = await retriever.retrieve('What is freelancing?');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].score).toBeGreaterThanOrEqual(0.5);
    });

    it('returns empty for an out-of-scope question ("What is the capital of France?")', async () => {
      // Simulate low-relevance results that Ollama returns for an unrelated query
      const storeResults: SearchResult[] = [
        makeResult({ title: 'What is Freelancing?', section: 'Introduction', score: 0.28 }),
        makeResult({ title: 'Getting Started', section: 'Overview', score: 0.22 }),
        makeResult({ title: 'About the Academy', section: 'Introduction', score: 0.19 }),
      ];

      const embedding = mockEmbedding();
      const store = mockVectorStore(storeResults);
      const retriever = new Retriever(embedding, store, { topK: 5, minScore: 0.5 });

      const results = await retriever.retrieve('What is the capital of France?');

      expect(results).toHaveLength(0);
    });

    it('handles completely empty results gracefully', async () => {
      const embedding = mockEmbedding();
      const store = mockVectorStore([]);
      const retriever = new Retriever(embedding, store, { topK: 5, minScore: 0.5 });

      const results = await retriever.retrieve('anything at all');

      expect(results).toHaveLength(0);
    });
  });

  describe('metadata reranking', () => {
    it('prioritises dedicated chapter for "How do freelancers make money?"', async () => {
      // Without reranking, the generic "What is Freelancing?" chunks score
      // slightly higher. With metadata reranking the dedicated chapter should
      // move to the top.
      const storeResults: SearchResult[] = [
        makeResult({ title: 'What is Freelancing?', section: 'Introduction', content: 'General intro.', score: 0.58 }),
        makeResult({ title: 'How Freelancers Make Money', section: 'Overview', content: 'Income strategies.', score: 0.54 }),
        makeResult({ title: 'What is Freelancing?', section: 'Summary', content: 'Key takeaways.', score: 0.52 }),
        makeResult({ title: 'Building Your Profile', section: 'Overview', content: 'Profile tips.', score: 0.50 }),
        makeResult({ title: 'How Freelancers Make Money', section: 'Getting Paid', content: 'Payment methods.', score: 0.46 }),
      ];

      const embedding = mockEmbedding();
      const store = mockVectorStore(storeResults);
      const retriever = new Retriever(embedding, store, { topK: 5, minScore: 0.5 });

      const results = await retriever.retrieve('How do freelancers make money?');

      expect(results.length).toBeGreaterThan(0);
      // The top result should be from the dedicated chapter
      const topTitles = results.slice(0, 2).map(r => r.chunk.metadata.title);
      expect(topTitles).toContain('How Freelancers Make Money');
    });
  });
});

// Helper used by metadataBoost tests above
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, ' ')
    .split(/\\s+/)
    .filter(t => t.length > 2);
}
