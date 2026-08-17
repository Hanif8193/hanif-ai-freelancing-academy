// M4 — In-Memory Vector Store Tests

import { InMemoryVectorStore } from '../providers/vector-store/memory';
import type { Chunk } from '../types';

describe('InMemoryVectorStore', () => {
  let store: InMemoryVectorStore;

  beforeEach(() => {
    store = new InMemoryVectorStore();
  });

  describe('upsert', () => {
    it('should store chunks', async () => {
      const chunks: Chunk[] = [
        {
          id: '1',
          content: 'Test content 1',
          metadata: {
            title: 'Test',
            module: 'test',
            chapter: '01',
            section: 'Section 1',
            sourcePath: 'docs/test.md',
            url: '/docs/test',
            contentType: 'text',
            headingLevel: 2,
            chunkIndex: 0,
            startLine: 1,
            endLine: 5,
            hasCodeBlocks: false,
          },
          embedding: [1, 0, 0],
        },
      ];

      await store.upsert(chunks);
      const count = await store.count();

      expect(count).toBe(1);
    });

    it(' should update existing chunks', async () => {
      const chunk: Chunk = {
        id: '1',
        content: 'Original content',
        metadata: {
          title: 'Test',
          module: 'test',
          chapter: '01',
          section: 'Section 1',
          sourcePath: 'docs/test.md',
          url: '/docs/test',
          contentType: 'text',
          headingLevel: 2,
          chunkIndex: 0,
          startLine: 1,
          endLine: 5,
          hasCodeBlocks: false,
        },
        embedding: [1, 0, 0],
      };

      await store.upsert([chunk]);
      
      // Update the chunk
      const updatedChunk = { ...chunk, content: 'Updated content' };
      await store.upsert([updatedChunk]);
      
      const count = await store.count();
      expect(count).toBe(1);
      
      const chunks = await store.get({});
      expect(chunks[0].content).toBe('Updated content');
    });
  });

  describe('search', () => {
    it('should find similar chunks', async () => {
      const chunks: Chunk[] = [
        {
          id: '1',
          content: 'Content about cats',
          metadata: {
            title: 'Cats',
            module: 'animals',
            chapter: '01',
            section: 'Section 1',
            sourcePath: 'docs/cats.md',
            url: '/docs/cats',
            contentType: 'text',
            headingLevel: 2,
            chunkIndex: 0,
            startLine: 1,
            endLine: 5,
            hasCodeBlocks: false,
          },
          embedding: [1, 0, 0],
        },
        {
          id: '2',
          content: 'Content about dogs',
          metadata: {
            title: 'Dogs',
            module: 'animals',
            chapter: '02',
            section: 'Section 1',
            sourcePath: 'docs/dogs.md',
            url: '/docs/dogs',
            contentType: 'text',
            headingLevel: 2,
            chunkIndex: 0,
            startLine: 1,
            endLine: 5,
            hasCodeBlocks: false,
          },
          embedding: [0, 1, 0],
        },
      ];

      await store.upsert(chunks);

      // Search for cats (should find chunk 1 first)
      const results = await store.search([1, 0, 0], 2);

      expect(results).toHaveLength(2);
      expect(results[0].chunk.id).toBe('1');
      expect(results[0].score).toBeGreaterThan(results[1].score);
    });

    it('should filter by module', async () => {
      const chunks: Chunk[] = [
        {
          id: '1',
          content: 'Cats content',
          metadata: {
            title: 'Cats',
            module: 'cats',
            chapter: '01',
            section: 'Section 1',
            sourcePath: 'docs/cats.md',
            url: '/docs/cats',
            contentType: 'text',
            headingLevel: 2,
            chunkIndex: 0,
            startLine: 1,
            endLine: 5,
            hasCodeBlocks: false,
          },
          embedding: [1, 0, 0],
        },
        {
          id: '2',
          content: 'Dogs content',
          metadata: {
            title: 'Dogs',
            module: 'dogs',
            chapter: '01',
            section: 'Section 1',
            sourcePath: 'docs/dogs.md',
            url: '/docs/dogs',
            contentType: 'text',
            headingLevel: 2,
            chunkIndex: 0,
            startLine: 1,
            endLine: 5,
            hasCodeBlocks: false,
          },
          embedding: [1, 0, 0],
        },
      ];

      await store.upsert(chunks);

      // Search with module filter
      const results = await store.search([1, 0, 0], 10, { module: 'cats' });

      expect(results).toHaveLength(1);
      expect(results[0].chunk.metadata.module).toBe('cats');
    });
  });

  describe('delete', () => {
    it('should delete chunks by filter', async () => {
      const chunks: Chunk[] = [
        {
          id: '1',
          content: 'Content 1',
          metadata: {
            title: 'Test',
            module: 'test',
            chapter: '01',
            section: 'Section 1',
            sourcePath: 'docs/test.md',
            url: '/docs/test',
            contentType: 'text',
            headingLevel: 2,
            chunkIndex: 0,
            startLine: 1,
            endLine: 5,
            hasCodeBlocks: false,
          },
          embedding: [1, 0, 0],
        },
        {
          id: '2',
          content: 'Content 2',
          metadata: {
            title: 'Test',
            module: 'test',
            chapter: '02',
            section: 'Section 1',
            sourcePath: 'docs/test2.md',
            url: '/docs/test2',
            contentType: 'text',
            headingLevel: 2,
            chunkIndex: 0,
            startLine: 1,
            endLine: 5,
            hasCodeBlocks: false,
          },
          embedding: [0, 1, 0],
        },
      ];

      await store.upsert(chunks);
      await store.delete({ chapter: '01' });

      const count = await store.count();
      expect(count).toBe(1);
    });
  });

  describe('reset', () => {
    it('should clear all chunks', async () => {
      const chunks: Chunk[] = [
        {
          id: '1',
          content: 'Content',
          metadata: {
            title: 'Test',
            module: 'test',
            chapter: '01',
            section: 'Section 1',
            sourcePath: 'docs/test.md',
            url: '/docs/test',
            contentType: 'text',
            headingLevel: 2,
            chunkIndex: 0,
            startLine: 1,
            endLine: 5,
            hasCodeBlocks: false,
          },
          embedding: [1, 0, 0],
        },
      ];

      await store.upsert(chunks);
      await store.reset();

      const count = await store.count();
      expect(count).toBe(0);
    });
  });
});
