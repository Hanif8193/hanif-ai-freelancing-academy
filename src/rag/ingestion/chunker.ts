// M4 — Content Chunker
// Splits parsed content into chunks with stable IDs

import crypto from 'crypto';
import type { Chunk, ChunkMetadata } from '../types';
import type { ParsedDocument, ParsedSection } from './markdown-parser';

export interface ChunkerConfig {
  chunkSize: number;      // Target chunk size in characters
  chunkOverlap: number;   // Overlap between chunks in characters
  minChunkSize: number;   // Minimum chunk size to keep
}

const DEFAULT_CONFIG: ChunkerConfig = {
  chunkSize: 500,
  chunkOverlap: 100,
  minChunkSize: 50,
};

export class Chunker {
  private config: ChunkerConfig;

  constructor(config: Partial<ChunkerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  chunkDocument(doc: ParsedDocument): Chunk[] {
    const chunks: Chunk[] = [];
    
    for (const section of doc.sections) {
      const sectionChunks = this.chunkSection(section, doc);
      chunks.push(...sectionChunks);
    }
    
    return chunks;
  }

  private chunkSection(section: ParsedSection, doc: ParsedDocument): Chunk[] {
    // If section is small enough, return as single chunk
    if (section.content.length <= this.config.chunkSize) {
      return [this.createChunk(section, doc, 0, section.content)];
    }
    
    // Split section into chunks
    const chunks: Chunk[] = [];
    const sentences = this.splitIntoSentences(section.content);
    let currentChunk = '';
    let chunkIndex = 0;
    
    for (const sentence of sentences) {
      // Check if adding this sentence would exceed chunk size
      if (currentChunk.length + sentence.length > this.config.chunkSize && currentChunk.length > 0) {
        // Save current chunk
        chunks.push(this.createChunk(section, doc, chunkIndex, currentChunk.trim()));
        chunkIndex++;
        
        // Start new chunk with overlap
        currentChunk = this.getOverlapText(currentChunk) + ' ' + sentence;
      } else {
        // Add sentence to current chunk
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }
    
    // Don't forget the last chunk
    if (currentChunk.trim().length >= this.config.minChunkSize) {
      chunks.push(this.createChunk(section, doc, chunkIndex, currentChunk.trim()));
    }
    
    return chunks;
  }

  private createChunk(
    section: ParsedSection,
    doc: ParsedDocument,
    chunkIndex: number,
    content: string
  ): Chunk {
    const id = this.generateStableId(doc.sourcePath, section.heading, chunkIndex);
    
    const metadata: ChunkMetadata = {
      title: doc.title,
      module: doc.module,
      chapter: doc.chapter,
      section: section.heading,
      sourcePath: doc.sourcePath,
      url: doc.url,
      contentType: this.detectContentType(content),
      headingLevel: section.headingLevel,
      chunkIndex,
      startLine: section.startLine,
      endLine: section.endLine,
      hasCodeBlocks: section.hasCodeBlocks,
    };
    
    return {
      id,
      content,
      metadata,
    };
  }

  generateStableId(sourcePath: string, section: string, chunkIndex: number): string {
    // Create a stable ID based on source path, section, and chunk index
    const key = `${sourcePath}::${section}::${chunkIndex}`;
    return crypto.createHash('sha256').update(key).digest('hex').substring(0, 16);
  }

  private splitIntoSentences(text: string): string[] {
    // Split by sentence boundaries, keeping the delimiter
    const sentences: string[] = [];
    let current = '';
    
    for (let i = 0; i < text.length; i++) {
      current += text[i];
      
      // Check for sentence boundaries
      if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
        // Check if this is really a sentence end (not an abbreviation)
        const nextChar = text[i + 1];
        if (!nextChar || nextChar === ' ' || nextChar === '\n' || nextChar === '\r') {
          sentences.push(current.trim());
          current = '';
        }
      }
    }
    
    // Don't forget the last sentence
    if (current.trim()) {
      sentences.push(current.trim());
    }
    
    return sentences;
  }

  private getOverlapText(text: string): string {
    if (text.length <= this.config.chunkOverlap) {
      return text;
    }
    
    // Get the last N characters, trying to break at a sentence boundary
    const overlapStart = Math.max(0, text.length - this.config.chunkOverlap);
    let overlap = text.substring(overlapStart);
    
    // Try to find a sentence boundary
    const sentenceBoundary = overlap.indexOf('. ');
    if (sentenceBoundary > 0 && sentenceBoundary < overlap.length - 1) {
      overlap = overlap.substring(sentenceBoundary + 2);
    }
    
    return overlap;
  }

  private detectContentType(content: string): ChunkMetadata['contentType'] {
    // Detect content type based on characteristics
    const trimmed = content.trim();
    
    // Code blocks
    if (trimmed.startsWith('```') || trimmed.startsWith('    ')) {
      return 'code';
    }
    
    // Examples
    if (trimmed.toLowerCase().startsWith('example') || 
        trimmed.toLowerCase().includes('for example') ||
        trimmed.toLowerCase().includes('such as')) {
      return 'example';
    }
    
    // Exercises
    if (trimmed.toLowerCase().startsWith('exercise') ||
        trimmed.toLowerCase().includes('try it') ||
        trimmed.toLowerCase().includes('hands-on')) {
      return 'exercise';
    }
    
    // Summary
    if (trimmed.toLowerCase().startsWith('summary') ||
        trimmed.toLowerCase().includes('key takeaways') ||
        trimmed.toLowerCase().includes('in summary')) {
      return 'summary';
    }
    
    // Default to text
    return 'text';
  }
}
