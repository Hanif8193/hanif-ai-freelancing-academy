// M4 — Markdown Parser Tests

import { MarkdownParser } from '../ingestion/markdown-parser';

describe('MarkdownParser', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  describe('parse', () => {
    it('should parse a simple markdown document', () => {
      const content = `# Title

## Section 1

This is section 1 content.

## Section 2

This is section 2 content.
`;

      const result = parser.parse(content, {
        title: 'Test Document',
        module: 'test',
        chapter: '01',
        sourcePath: 'docs/test.md',
        url: '/docs/test',
      });

      expect(result.title).toBe('Test Document');
      expect(result.module).toBe('test');
      expect(result.chapter).toBe('01');
      expect(result.sections).toHaveLength(3);
      expect(result.sections[0].heading).toBe('Title');
      expect(result.sections[1].heading).toBe('Section 1');
      expect(result.sections[2].heading).toBe('Section 2');
    });

    it('should detect code blocks', () => {
      const content = `# Title

## Code Section

Here is some code:

\`\`\`javascript
const x = 1;
\`\`\`
`;

      const result = parser.parse(content, {
        title: 'Test',
        module: 'test',
        chapter: '01',
        sourcePath: 'docs/test.md',
        url: '/docs/test',
      });

      expect(result.sections[1].hasCodeBlocks).toBe(true);
    });

    it('should handle documents with no headings', () => {
      const content = 'Just some plain text without any headings.';

      const result = parser.parse(content, {
        title: 'Test',
        module: 'test',
        chapter: '01',
        sourcePath: 'docs/test.md',
        url: '/docs/test',
      });

      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].heading).toBe('Test');
    });
  });

  describe('extractTitle', () => {
    it('should extract the first heading as title', () => {
      const content = '# My Title\n\nSome content here.';
      expect(parser.extractTitle(content)).toBe('My Title');
    });

    it('should return Untitled if no heading found', () => {
      const content = 'No headings here.';
      expect(parser.extractTitle(content)).toBe('Untitled');
    });
  });

  describe('extractModule', () => {
    it('should extract module from path', () => {
      expect(parser.extractModule('docs/freelancing/what-is.md')).toBe('freelancing');
      expect(parser.extractModule('docs/ai-development/setup.md')).toBe('ai-development');
    });

    it('should return unknown for invalid paths', () => {
      expect(parser.extractModule('invalid/path')).toBe('unknown');
    });
  });

  describe('extractChapter', () => {
    it('should extract chapter from filename when present', () => {
      expect(parser.extractChapter('docs/ai-development/ch05-agents.md')).toBe('05');
    });

    it('should fall back to chapter in the document title', () => {
      expect(
        parser.extractChapter(
          'docs/freelancing/how-freelancers-make-money.md',
          'Chapter 02: How Freelancers Make Money'
        )
      ).toBe('02');
      expect(
        parser.extractChapter(
          'docs/spec-driven-development/your-first-spec-kit-project.md',
          'Chapter 10: Your First Spec-Kit Project'
        )
      ).toBe('10');
    });

    it('should return 00 when no chapter can be found', () => {
      expect(parser.extractChapter('docs/about/index.md', 'About')).toBe('00');
    });
  });
});
