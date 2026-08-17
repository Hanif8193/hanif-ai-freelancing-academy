// M4 — Context Assembler Service
// Assembles retrieved chunks into context for the LLM

import type { SearchResult, Source } from '../types';

export interface ContextAssemblerConfig {
  maxContextTokens: number;
  includeExcerpts: boolean;
}

const DEFAULT_CONFIG: ContextAssemblerConfig = {
  maxContextTokens: 4000,
  includeExcerpts: true,
};

export class ContextAssembler {
  private config: ContextAssemblerConfig;

  constructor(config: Partial<ContextAssemblerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  assemble(results: SearchResult[]): {
    context: string;
    sources: Source[];
  } {
    if (results.length === 0) {
      return {
        context: '',
        sources: [],
      };
    }

    // Sort by score (best first)
    const sorted = [...results].sort((a, b) => b.score - a.score);
    
    // Build context and sources
    const contextParts: string[] = [];
    const sources: Source[] = [];
    let tokenEstimate = 0;
    
    for (const result of sorted) {
      const { chunk, score } = result;
      
      // Estimate tokens (rough: 1 token ≈ 4 characters)
      const chunkTokens = Math.ceil(chunk.content.length / 4);
      
      // Check if adding this chunk would exceed limit
      if (tokenEstimate + chunkTokens > this.config.maxContextTokens) {
        // Try to add a truncated version
        const remainingTokens = this.config.maxContextTokens - tokenEstimate;
        const maxChars = remainingTokens * 4;
        
        if (maxChars > 100) {
          const truncated = chunk.content.substring(0, maxChars) + '...';
          contextParts.push(`[Source: ${chunk.metadata.title} - ${chunk.metadata.section}]\n${truncated}`);
          tokenEstimate += remainingTokens;
        }
        
        break;
      }
      
      // Add full chunk
      contextParts.push(`[Source: ${chunk.metadata.title} - ${chunk.metadata.section}]\n${chunk.content}`);
      tokenEstimate += chunkTokens;
      
      // Add to sources
      sources.push({
        title: chunk.metadata.title,
        section: chunk.metadata.section,
        url: chunk.metadata.url,
        excerpt: this.config.includeExcerpts
          ? chunk.content.substring(0, 200) + (chunk.content.length > 200 ? '...' : '')
          : undefined,
      });
    }
    
    return {
      context: contextParts.join('\n\n'),
      sources,
    };
  }

  deduplicateSources(sources: Source[]): Source[] {
    const seen = new Set<string>();
    const unique: Source[] = [];
    
    for (const source of sources) {
      const key = `${source.title}::${source.section}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(source);
      }
    }
    
    return unique;
  }
}
