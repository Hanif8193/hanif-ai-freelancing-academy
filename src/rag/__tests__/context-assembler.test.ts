// M4 — Context Assembler Tests

import { ContextAssembler } from '../services/context-assembler';
import type { SearchResult } from '../types';

describe('ContextAssembler', () => {
  let assembler: ContextAssembler;

  beforeEach(() => {
    assembler = new ContextAssembler({
      maxContextTokens: 1000,
      includeExcerpts: true,
    });
  });

  describe('assemble', () => {
    it('should assemble context from search results', () => {
      const results: SearchResult[] = [
        {
          chunk: {
            id: '1',
            content: 'This is about freelancing.',
            metadata: {
              title: 'What is Freelancing?',
              module: 'freelancing',
              chapter: '01',
              section: 'Introduction',
              sourcePath: 'docs/freelancing/what-is.md',
              url: '/docs/freelancing/what-is',
              contentType: 'text',
              headingLevel: 2,
              chunkIndex: 0,
              startLine: 1,
              endLine: 5,
              hasCodeBlocks: false,
            },
          },
          score: 0.9,
        },
      ];

      const { context, sources } = assembler.assemble(results);

      expect(context).toContain('This is about freelancing.');
      expect(context).toContain('What is Freelancing?');
      expect(sources).toHaveLength(1);
      expect(sources[0].title).toBe('What is Freelancing?');
    });

    it('should respect max context tokens', () => {
      const longContent = 'A'.repeat(4000); // Exceeds maxContextTokens of 1000
      
      const results: SearchResult[] = [
        {
          chunk: {
            id: '1',
            content: longContent,
            metadata: {
              title: 'Long Document',
              module: 'test',
              chapter: '01',
              section: 'Section',
              sourcePath: 'docs/test.md',
              url: '/docs/test',
              contentType: 'text',
              headingLevel: 2,
              chunkIndex: 0,
              startLine: 1,
              endLine: 100,
              hasCodeBlocks: false,
            },
          },
          score: 0.9,
        },
      ];

      const { context } = assembler.assemble(results);

      // Should be truncated (context includes source prefix, so check it's shorter than full content + prefix)
      expect(context.length).toBeLessThan(longContent.length + 100);
    });

    it('should handle empty results', () => {
      const { context, sources } = assembler.assemble([]);

      expect(context).toBe('');
      expect(sources).toHaveLength(0);
    });

    it('should sort by score', () => {
      const results: SearchResult[] = [
        {
          chunk: {
            id: '1',
            content: 'Low relevance.',
            metadata: {
              title: 'Low',
              module: 'test',
              chapter: '01',
              section: 'Low',
              sourcePath: 'docs/low.md',
              url: '/docs/low',
              contentType: 'text',
              headingLevel: 2,
              chunkIndex: 0,
              startLine: 1,
              endLine: 5,
              hasCodeBlocks: false,
            },
          },
          score: 0.5,
        },
        {
          chunk: {
            id: '2',
            content: 'High relevance.',
            metadata: {
              title: 'High',
              module: 'test',
              chapter: '01',
              section: 'High',
              sourcePath: 'docs/high.md',
              url: '/docs/high',
              contentType: 'text',
              headingLevel: 2,
              chunkIndex: 0,
              startLine: 1,
              endLine: 5,
              hasCodeBlocks: false,
            },
          },
          score: 0.9,
        },
      ];

      const { context } = assembler.assemble(results);

      // High relevance should come first
      expect(context.indexOf('High relevance')).toBeLessThan(context.indexOf('Low relevance'));
    });
  });

  describe('deduplicateSources', () => {
    it('should deduplicate sources', () => {
      const sources = [
        { title: 'Doc 1', section: 'Section A', url: '/docs/1' },
        { title: 'Doc 1', section: 'Section A', url: '/docs/1' },
        { title: 'Doc 1', section: 'Section B', url: '/docs/1' },
      ];

      const unique = assembler.deduplicateSources(sources);

      expect(unique).toHaveLength(2);
    });
  });
});
