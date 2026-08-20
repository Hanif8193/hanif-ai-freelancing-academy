// M4 — Gemini LLM Provider

import { GoogleGenAI } from '@google/genai';
import type { LLMProvider } from './interface';

export interface GeminiLLMConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class GeminiLLMProvider implements LLMProvider {
  name = 'gemini';
  private client: GoogleGenAI;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: GeminiLLMConfig) {
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
    this.model = config.model || 'gemini-3.6-flash';
    this.temperature = config.temperature ?? 0.3;
    this.maxTokens = config.maxTokens || 1000;
  }

  async generate(prompt: string, systemPrompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: this.temperature,
        maxOutputTokens: this.maxTokens,
      },
    });

    return response.text || '';
  }
}
