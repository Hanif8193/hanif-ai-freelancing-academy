// M7 — Test harness
// Boots the real MCP server over an in-memory transport and drives it with a
// real MCP client. All M4/M5/M6 services are mocked — zero real API calls.

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import type { AskResponse } from '../../rag/types';
import type { Language, Level } from '../../tutor/types';
import type { TutorRequest, TutorResponse } from '../../tutor/types';
import type { TranslateOptions, TranslationResult } from '../../tutor/translator';
import { ACADEMY_TOPICS } from '../../tutor/topics';
import { buildMcpServer } from '../index';
import type { McpServices } from '../services';

// ============================================================
// Fixtures (real Academy shapes, fake content)
// ============================================================

export const CHAPTER_01_FIXTURE = `---
sidebar_position: 1
title: "Chapter 01: What Is Freelancing?"
---

# Chapter 01: What Is Freelancing?

## Learning Objectives

- Understand freelancing
- Find clients

## How It Works

Freelancing means working independently for clients.

\`\`\`text
client -> freelancer -> deliverable
\`\`\`

## Summary

You now know the basics of freelancing.
`;

export const PROJECTS_FIXTURE = `---
sidebar_position: 1
---

# Real-World Projects

Apply your skills to real-world freelancing projects.

## Available Projects

*Projects will be added in future milestones.*
`;

const TOPICS_WITH_FIXTURES = ACADEMY_TOPICS.map((t) =>
  t.chapter === '01' ? { ...t, title: 'What Is Freelancing?' } : t
);

// ============================================================
// Default mocked services
// ============================================================

function defaultServices(): McpServices {
  return {
    rag: {
      answer: jest.fn(
        async (request: { question: string; maxSources?: number }): Promise<AskResponse> => ({
          answer: `Grounded answer about: ${request.question}`,
          sources: [
            {
              title: 'Chapter 01: What Is Freelancing?',
              section: 'How It Works',
              url: '/docs/freelancing/what-is-freelancing',
              excerpt: 'Freelancing means working independently for clients.',
            },
          ],
          insufficientInfo: false,
        })
      ),
    },
    tutor: {
      answer: jest.fn(
        async (_request: TutorRequest): Promise<TutorResponse> => ({
          mode: 'quiz',
          language: 'en',
          level: 'beginner',
          quiz: [
            {
              question: 'What is freelancing?',
              options: ['Working for one employer', 'Working independently for clients', 'A type of tax', 'A programming language'],
              correctIndex: 1,
              explanation: 'Freelancers work independently for clients.',
              source: {
                title: 'Chapter 01: What Is Freelancing?',
                section: 'How It Works',
                url: '/docs/freelancing/what-is-freelancing',
              },
            },
          ],
          sources: [
            {
              title: 'Chapter 01: What Is Freelancing?',
              section: 'How It Works',
              url: '/docs/freelancing/what-is-freelancing',
            },
          ],
          grounded: true,
          insufficientInfo: false,
        })
      ),
    },
    translator: {
      name: 'mock-translator',
      translate: jest.fn(
        async (
          text: string,
          from: Language,
          to: Language,
          _options?: TranslateOptions
        ): Promise<TranslationResult> => ({
          translatedText: `ترجمہ: ${text}`,
          sourceLanguage: from,
          targetLanguage: to,
          preservedTerms: ['Freelancing', 'clients'],
        })
      ),
      explain: jest.fn(
        async (_text: string, _target: Language, _level?: Level): Promise<TranslationResult> => ({
          translatedText: 'explanation',
          sourceLanguage: 'en',
          targetLanguage: 'ur',
          preservedTerms: [],
        })
      ),
    },
    topics: TOPICS_WITH_FIXTURES,
    readFile: jest.fn(async (relativePath: string): Promise<string> => {
      const fixtures: Record<string, string> = {
        'docs/freelancing/what-is-freelancing.md': CHAPTER_01_FIXTURE,
        'docs/freelancing/what-is-freelancing/index.md': CHAPTER_01_FIXTURE,
        'docs/projects.md': PROJECTS_FIXTURE,
        'docs/projects/index.md': PROJECTS_FIXTURE,
      };
      const content = fixtures[relativePath.replace(/\\/g, '/')];
      if (content === undefined) {
        throw new Error(`ENOENT: no such file ${relativePath}`);
      }
      return content;
    }),
  };
}

// ============================================================
// Harness
// ============================================================

export interface McpTestHarness {
  client: Client;
  server: ReturnType<typeof buildMcpServer>;
  services: McpServices;
}

export async function setupMcp(overrides: Partial<McpServices> = {}): Promise<McpTestHarness> {
  const services: McpServices = { ...defaultServices(), ...overrides };
  const server = buildMcpServer(services);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: 'mcp-test-client', version: '1.0.0' });
  await client.connect(clientTransport);
  return { client, server, services };
}

export async function teardownMcp(harness: McpTestHarness): Promise<void> {
  await harness.client.close();
  await harness.server.close();
}

/**
 * Parse the JSON text of a tool result (safe for success and error results).
 * Accepts the zod-inferred shape returned by Client.callTool.
 */
export function parseResult(result: unknown): Record<string, unknown> {
  const content = (result as { content?: ReadonlyArray<{ type?: string; text?: string }> })
    .content ?? [];
  const text = content[0]?.text ?? '';
  return JSON.parse(text) as Record<string, unknown>;
}
