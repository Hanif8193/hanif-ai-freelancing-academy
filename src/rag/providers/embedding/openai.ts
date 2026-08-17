// M4 — OpenAI Embedding Provider

import OpenAI from 'openai';
import type { EmbeddingProvider } from './interface';

export interface OpenAIEmbeddingConfig {
  apiKey: string;
  model?: string;
  dimensions?: number;
}

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  name = 'openai';
  private client: OpenAI;
  private model: string;
  private dimensions: number;

  constructor(config: OpenAIEmbeddingConfig) {
    this.client = new OpenAI({ apiKey: config.apiKey });
    this.model = config.model || 'text-embedding-3-small';
    this.dimensions = config.dimensions || 1536;
  }

  async embed(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: this.model,
      input: text,
      dimensions: this.dimensions,
    });

    return response.data[0].embedding;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    // OpenAI supports batch embedding
    const response = await this.client.embeddings.create({
      model: this.model,
      input: texts,
      dimensions: this.dimensions,
    });

    // Sort by index to ensure correct order
    return response.data
      .sort((a, b) => a.index - b.index)
      .map(item => item.embedding);
  }

  getDimensions(): number {
    return this.dimensions;
  }
}
