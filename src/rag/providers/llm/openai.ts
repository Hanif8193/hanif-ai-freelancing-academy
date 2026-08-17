// M4 — OpenAI LLM Provider

import OpenAI from 'openai';
import type { LLMProvider } from './interface';

export interface OpenAILLMConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class OpenAILLMProvider implements LLMProvider {
  name = 'openai';
  private client: OpenAI;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: OpenAILLMConfig) {
    this.client = new OpenAI({ apiKey: config.apiKey });
    this.model = config.model || 'gpt-4o-mini';
    this.temperature = config.temperature || 0.3;
    this.maxTokens = config.maxTokens || 1000;
  }

  async generate(prompt: string, systemPrompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    });

    return response.choices[0]?.message?.content || '';
  }
}
