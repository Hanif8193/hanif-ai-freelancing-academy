// M4 — Chunker Tests

import { Chunker } from '../ingestion/chunker';
import type { ParsedDocument } from '../ingestion/markdown-parser';

describe('Chunker', () => {
  let chunker: Chunker;

  beforeEach(() => {
    chunker = new Chunker({
      chunkSize: 200,
      chunkOverlap: 50,
      minChunkSize: 20,
    });
  });

  describe('chunkDocument', () => {
    it('should chunk a simple document', () => {
      const doc: ParsedDocument = {
        title: 'Test Document',
        module: 'test',
        chapter: '01',
        sourcePath: 'docs/test.md',
        url: '/docs/test',
        fullContent: 'Content here.',
        sections: [
          {
            heading: 'Section 1',
            headingLevel: 2,
            content: 'This is a short section.',
            startLine: 1,
            endLine: 3,
            hasCodeBlocks: false,
          },
        ],
      };

      const chunks = chunker.chunkDocument(doc);

      expect(chunks).toHaveLength(1);
      expect(chunks[0].content).toBe('This is a short section.');
      expect(chunks[0].metadata.title).toBe('Test Document');
      expect(chunks[0].metadata.section).toBe('Section 1');
    });

    it('should split long sections into multiple chunks', () => {
      const longContent = 'This is sentence one. '.repeat(20); // Exceeds chunkSize of 200
      
      const doc: ParsedDocument = {
        title: 'Test',
        module: 'test',
        chapter: '01',
        sourcePath: 'docs/test.md',
        url: '/docs/test',
        fullContent: longContent,
        sections: [
          {
            heading: 'Long Section',
            headingLevel: 2,
            content: longContent,
            startLine: 1,
            endLine: 10,
            hasCodeBlocks: false,
          },
        ],
      };

      const chunks = chunker.chunkDocument(doc);

      expect(chunks.length).toBeGreaterThan(1);
    });

    it('should generate stable IDs', () => {
      const doc: ParsedDocument = {
        title: 'Test',
        module: 'test',
        chapter: '01',
        sourcePath: 'docs/test.md',
        url: '/docs/test',
        fullContent: 'Content.',
        sections: [
          {
            heading: 'Section',
            headingLevel: 2,
            content: 'Content here.',
            startLine: 1,
            endLine: 2,
            hasCodeBlocks: false,
          },
        ],
      };

      const chunks1 = chunker.chunkDocument(doc);
      const chunks2 = chunker.chunkDocument(doc);

      expect(chunks1[0].id).toBe(chunks2[0].id);
    });
  });

  describe('generateStableId', () => {
    it('should generate consistent IDs', () => {
      const id1 = chunker.generateStableId('docs/test.md', 'Section', 0);
      const id2 = chunker.generateStableId('docs/test.md', 'Section', 0);

      expect(id1).toBe(id2);
    });

    it('should generate different IDs for different inputs', () => {
      const id1 = chunker.generateStableId('docs/test.md', 'Section 1', 0);
      const id2 = chunker.generateStableId('docs/test.md', 'Section 2', 0);

      expect(id1).not.toBe(id2);
    });
  });
});
