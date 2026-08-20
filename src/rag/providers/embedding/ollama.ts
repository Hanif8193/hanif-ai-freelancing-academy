// M4 — Ollama Embedding Provider
// Uses the Ollama /api/embed REST endpoint (no API key required).

import type { EmbeddingProvider } from './interface';

export interface OllamaEmbeddingConfig {
  /** Ollama server base URL (default: http://localhost:11434). */
  baseUrl?: string;
  /** Model name to use for embeddings (default: nomic-embed-text). */
  model?: string;
  /** Expected embedding dimensions (default: 768 for nomic-embed-text). */
  dimensions?: number;
}

interface OllamaEmbedResponse {
  embeddings: number[][];
}

export class OllamaEmbeddingProvider implements EmbeddingProvider {
  name = 'ollama';
  private baseUrl: string;
  private model: string;
  private dimensions: number;

  constructor(config: OllamaEmbeddingConfig) {
    this.baseUrl = (config.baseUrl || 'http://localhost:11434').replace(/\/+$/, '');
    this.model = config.model || 'nomic-embed-text';
    this.dimensions = config.dimensions || 768;
  }

  private async requestEmbed(input: string | string[]): Promise<number[][]> {
    const response = await fetch(`${this.baseUrl}/api/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        input,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Ollama embed request failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as OllamaEmbedResponse;

    if (!data.embeddings || data.embeddings.length === 0) {
      throw new Error('Ollama embedding returned no values');
    }

    return data.embeddings;
  }

  async embed(text: string): Promise<number[]> {
    const embeddings = await this.requestEmbed(text);
    return embeddings[0];
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const filteredTexts = texts.filter(t => t.trim().length > 0);
    if (filteredTexts.length === 0) {
      return [];
    }

    return this.requestEmbed(filteredTexts);
  }

  getDimensions(): number {
    return this.dimensions;
  }
}
