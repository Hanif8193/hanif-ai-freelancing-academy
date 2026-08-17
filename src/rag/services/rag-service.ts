// M4 — RAG Service
// Orchestrates retrieval, context assembly, and LLM generation

import type { AskRequest, AskResponse, SearchResult } from '../types';
import type { EmbeddingProvider, VectorStore, LLMProvider } from '../providers';
import { Retriever } from './retriever';
import { ContextAssembler } from './context-assembler';

export interface RAGServiceConfig {
  topK: number;
  maxContextTokens: number;
  minScore: number;
}

const DEFAULT_CONFIG: RAGServiceConfig = {
  topK: 5,
  maxContextTokens: 4000,
  minScore: 0.3,
};

const SYSTEM_PROMPT = `You are an AI assistant for the Hanif AI Freelancing Academy. Your role is to answer questions about freelancing, AI development tools, and spec-driven development based on the provided course content.

Guidelines:
- Only answer based on the provided context. If the context doesn't contain enough information, say so.
- Be concise and direct. Use short paragraphs and bullet points.
- Reference sources when possible (e.g., "According to Chapter X...").
- If the question is unclear, ask for clarification.
- If the question is about topics not covered in the course, suggest relevant topics from the course.
- Never make up information that isn't in the provided context.
- Use a friendly, educational tone.`;

export class RAGService {
  private retriever: Retriever;
  private contextAssembler: ContextAssembler;
  private llmProvider: LLMProvider;
  private config: RAGServiceConfig;

  constructor(
    embeddingProvider: EmbeddingProvider,
    vectorStore: VectorStore,
    llmProvider: LLMProvider,
    config: Partial<RAGServiceConfig> = {}
  ) {
    this.retriever = new Retriever(embeddingProvider, vectorStore, {
      topK: config.topK || DEFAULT_CONFIG.topK,
      minScore: config.minScore || DEFAULT_CONFIG.minScore,
    });
    this.contextAssembler = new ContextAssembler({
      maxContextTokens: config.maxContextTokens || DEFAULT_CONFIG.maxContextTokens,
    });
    this.llmProvider = llmProvider;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async answer(request: AskRequest): Promise<AskResponse> {
    const { question, maxSources = 5 } = request;
    
    // Retrieve relevant chunks
    const results = await this.retriever.retrieve(question);
    
    // Check if we have enough information
    if (results.length === 0 || results[0].score < this.config.minScore) {
      return {
        answer: "I don't have enough information in the course content to answer this question. The topic might not be covered in the current curriculum.",
        sources: [],
        insufficientInfo: true,
        suggestedTopics: this.getSuggestedTopics(question),
      };
    }
    
    // Assemble context
    const { context, sources } = this.contextAssembler.assemble(results);
    
    // Generate answer
    const prompt = `Based on the following context from the Hanif AI Freelancing Academy course content, answer the question below.

Context:
${context}

Question: ${question}

Please provide a clear, concise answer based on the context above.`;
    
    const answer = await this.llmProvider.generate(prompt, SYSTEM_PROMPT);
    
    // Deduplicate sources
    const uniqueSources = this.contextAssembler.deduplicateSources(sources).slice(0, maxSources);
    
    return {
      answer,
      sources: uniqueSources,
      insufficientInfo: false,
    };
  }

  private getSuggestedTopics(question: string): string[] {
    // Simple keyword-based suggestions
    const keywords = question.toLowerCase();
    const suggestions: string[] = [];
    
    if (keywords.includes('freelanc') || keywords.includes('client') || keywords.includes('project')) {
      suggestions.push('What is Freelancing?');
      suggestions.push('How Freelancers Make Money');
      suggestions.push('Building Your Profile');
    }
    
    if (keywords.includes('ai') || keywords.includes('coding') || keywords.includes('agent')) {
      suggestions.push('What are AI Coding Agents?');
      suggestions.push('Setting Up VS Code');
      suggestions.push('AI-Assisted vs Agentic Development');
    }
    
    if (keywords.includes('spec') || keywords.includes('specification') || keywords.includes('design')) {
      suggestions.push('What is Spec-Driven Development?');
      suggestions.push('Your First Spec Kit Project');
    }
    
    if (keywords.includes('git') || keywords.includes('github') || keywords.includes('version')) {
      suggestions.push('Git and GitHub');
      suggestions.push('Setting Up VS Code');
    }
    
    // Default suggestions if no keywords matched
    if (suggestions.length === 0) {
      suggestions.push('What is Freelancing?');
      suggestions.push('What are AI Coding Agents?');
      suggestions.push('What is Spec-Driven Development?');
    }
    
    return suggestions;
  }
}
