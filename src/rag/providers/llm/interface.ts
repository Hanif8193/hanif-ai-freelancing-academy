// M4 — LLM Provider Interface

export interface LLMProvider {
  name: string;
  generate(prompt: string, systemPrompt: string): Promise<string>;
}
