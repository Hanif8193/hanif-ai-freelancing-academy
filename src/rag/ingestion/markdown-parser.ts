// M4 — Markdown Parser
// Parses markdown content into structured sections

import { marked } from 'marked';

export interface ParsedSection {
  heading: string;
  headingLevel: number;
  content: string;
  startLine: number;
  endLine: number;
  hasCodeBlocks: boolean;
}

export interface ParsedDocument {
  title: string;
  module: string;
  chapter: string;
  sourcePath: string;
  url: string;
  sections: ParsedSection[];
  fullContent: string;
}

export class MarkdownParser {
  private headingRegex = /^(#{1,6})\s+(.+)$/;

  parse(
    content: string,
    metadata: {
      title: string;
      module: string;
      chapter: string;
      sourcePath: string;
      url: string;
    }
  ): ParsedDocument {
    const lines = content.split('\n');
    const sections: ParsedSection[] = [];
    let currentSection: ParsedSection | null = null;
    let lineNumber = 1;

    for (const line of lines) {
      const headingMatch = line.match(this.headingRegex);

      if (headingMatch) {
        // Save previous section if exists
        if (currentSection) {
          currentSection.endLine = lineNumber - 1;
          sections.push(currentSection);
        }

        // Start new section
        const headingLevel = headingMatch[1].length;
        const heading = headingMatch[2].trim();

        currentSection = {
          heading,
          headingLevel,
          content: '',
          startLine: lineNumber,
          endLine: lineNumber,
          hasCodeBlocks: false,
        };
      } else if (currentSection) {
        // Add line to current section
        if (currentSection.content) {
          currentSection.content += '\n';
        }
        currentSection.content += line;

        // Check for code blocks
        if (line.trim().startsWith('```')) {
          currentSection.hasCodeBlocks = true;
        }
      }

      lineNumber++;
    }

    // Don't forget the last section
    if (currentSection) {
      currentSection.endLine = lines.length;
      sections.push(currentSection);
    }

    // If no sections found, create one from the entire content
    if (sections.length === 0 && content.trim()) {
      sections.push({
        heading: metadata.title,
        headingLevel: 1,
        content: content.trim(),
        startLine: 1,
        endLine: lines.length,
        hasCodeBlocks: content.includes('```'),
      });
    }

    return {
      ...metadata,
      sections,
      fullContent: content,
    };
  }

  extractTitle(content: string): string {
    const lines = content.split('\n');
    
    for (const line of lines) {
      const match = line.match(this.headingRegex);
      if (match) {
        return match[2].trim();
      }
    }
    
    return 'Untitled';
  }

  extractModule(sourcePath: string): string {
    // docs/freelancing/what-is-freelancing.md -> freelancing
    // Normalize to forward slashes for cross-platform compatibility
    const normalized = sourcePath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    const docsIndex = parts.indexOf('docs');
    
    if (docsIndex >= 0 && docsIndex < parts.length - 1) {
      return parts[docsIndex + 1];
    }
    
    return 'unknown';
  }

  extractChapter(sourcePath: string, title?: string): string {
    // Extract chapter number from filename
    // Normalize to forward slashes for cross-platform compatibility
    const normalized = sourcePath.replace(/\\/g, '/');
    const filename = normalized.split('/').pop() || '';
    const match = filename.match(/ch(\d+)/i);
    
    if (match) {
      return match[1];
    }
    
    // Try to extract from filename
    const titleMatch = filename.match(/chapter[_-]?(\d+)/i);
    if (titleMatch) {
      return titleMatch[1];
    }
    
    // Fall back to the document title, e.g. "Chapter 02: How Freelancers Make Money"
    if (title) {
      const chapterInTitle = title.match(/chapter\s+(\d+)/i);
      if (chapterInTitle) {
        return chapterInTitle[1];
      }
    }
    
    return '00';
  }
}
