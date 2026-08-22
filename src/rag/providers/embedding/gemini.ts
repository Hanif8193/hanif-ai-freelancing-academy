// M4 — Gemini Embedding Provider
// M4 P0 — Quota-exhausted (RESOURCE_EXHAUSTED) errors fail fast without retries;
// transient rate limits get a conservative limited retry.

import { GoogleGenAI } from '@google/genai';
import { isQuotaExceededError } from '../../errors';
import type { EmbeddingProvider } from './interface';

export interface GeminiEmbeddingConfig {
  apiKey: string;
  model?: string;
  dimensions?: number;
  /** Max retries for transient rate limits (default 3, conservative). */
  maxRetries?: number;
  /** Base delay in ms for exponential backoff (default 65000 — one quota window). */
  retryBaseDelayMs?: number;
}

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  name = 'gemini';
  private client: GoogleGenAI;
  private model: string;
  private dimensions: number;
  private maxRetries: number;
  private baseDelayMs: number;

  constructor(config: GeminiEmbeddingConfig) {
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
    this.model = config.model || 'gemini-embedding-001';
    this.dimensions = config.dimensions || 768;
    this.maxRetries = config.maxRetries ?? 3;
    this.baseDelayMs = config.retryBaseDelayMs ?? 65_000;
  }

  private async retryWithBackoff<T>(fn: () => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        // Account quota exhausted (RESOURCE_EXHAUSTED / "exceeded your current
        // quota"): fail fast — retrying only makes the user wait ~1 minute for
        // an error that will not clear in seconds.
        if (isQuotaExceededError(error)) {
          throw error;
        }
        const isRateLimit = error?.status === 429 || error?.message?.includes('429');
        if (!isRateLimit || attempt === this.maxRetries) {
          throw error;
        }
        const delay = this.baseDelayMs * Math.pow(2, attempt);
        console.log(`  Rate limited, retrying in ${delay / 1000}s (attempt ${attempt + 1}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  async embed(text: string): Promise<number[]> {
    const response = await this.retryWithBackoff(() =>
      this.client.models.embedContent({
        model: this.model,
        contents: text,
        config: {
          outputDimensionality: this.dimensions,
        },
      })
    );

    const embedding = response.embeddings?.[0]?.values;
    if (!embedding) {
      throw new Error('Gemini embedding returned no values');
    }
    return embedding;
  }

  /** Gemini free-tier batch limit is 100 requests per call. */
  private static readonly BATCH_SIZE = 10;

  /** Delay between batches to avoid per-minute rate limits. */
  private static readonly BATCH_DELAY_MS = 10000;

  async embedBatch(texts: string[]): Promise<number[][]> {
    const filteredTexts = texts.filter(t => t.trim().length > 0);
    if (filteredTexts.length === 0) {
      return [];
    }

    // Split into chunks that respect Gemini's 100-request batch limit.
    const allEmbeddings: number[][] = [];
    for (let i = 0; i < filteredTexts.length; i += GeminiEmbeddingProvider.BATCH_SIZE) {
      const batch = filteredTexts.slice(i, i + GeminiEmbeddingProvider.BATCH_SIZE);

      if (i > 0) {
        // Pause between batches to stay within the per-minute quota.
        await new Promise(resolve => setTimeout(resolve, GeminiEmbeddingProvider.BATCH_DELAY_MS));
      }

      const response = await this.retryWithBackoff(() =>
        this.client.models.embedContent({
          model: this.model,
          contents: batch,
          config: {
            outputDimensionality: this.dimensions,
          },
        })
      );

      const embeddings = response.embeddings;
      if (!embeddings || embeddings.length === 0) {
        throw new Error('Gemini embedding batch returned no values');
      }
      allEmbeddings.push(...embeddings.map(e => e.values || []));
    }

    return allEmbeddings;
  }

  getDimensions(): number {
    return this.dimensions;
  }
}
