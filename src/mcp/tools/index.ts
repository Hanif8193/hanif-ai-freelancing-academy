// M7 — Tool registration
// Registers all seven MCP tools with their advertised names, descriptions,
// and zod input schemas. Callbacks are thin delegates to the M4/M5/M6
// services in the provided context — no business logic lives here.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServices } from '../services';
import {
  handleGenerateQuiz,
  handleSearchAcademyContent,
  handleTranslateContent,
} from './ai';
import {
  handleGetChapter,
  handleGetLearningPath,
  handleGetProjectInstructions,
  handleGetSection,
} from './content';
import {
  generateQuizSchema,
  getChapterSchema,
  getLearningPathSchema,
  getProjectInstructionsSchema,
  getSectionSchema,
  searchAcademyContentSchema,
  translateContentSchema,
} from './schemas';

/** Register every Academy MCP tool on the given server. */
export function registerTools(server: McpServer, services: McpServices): void {
  server.registerTool(
    'searchAcademyContent',
    {
      title: 'Search Academy Content',
      description:
        'Answer a natural-language question with grounded Academy content. ' +
        'Searches the indexed Hanif AI Freelancing Academy material and returns ' +
        'a grounded answer with source citations. Never invents content.',
      inputSchema: searchAcademyContentSchema,
    },
    (args) => handleSearchAcademyContent(services, args as { question: string; maxSources?: number })
  );

  server.registerTool(
    'getChapter',
    {
      title: 'Get Chapter',
      description:
        'Retrieve a specific Academy chapter (by number, slug, or title) with its ' +
        'real content and parsed sections. Unknown chapters return found: false.',
      inputSchema: getChapterSchema,
    },
    (args) => handleGetChapter(services, args as { chapter: string; includeContent?: boolean })
  );

  server.registerTool(
    'getSection',
    {
      title: 'Get Section',
      description:
        'Retrieve a specific section (heading + content) from a real Academy chapter. ' +
        'Unknown chapters or sections return found: false — never fabricated.',
      inputSchema: getSectionSchema,
    },
    (args) => handleGetSection(services, args as { chapter: string; section: string })
  );

  server.registerTool(
    'getLearningPath',
    {
      title: 'Get Learning Path',
      description:
        'Return the ordered Academy learning path with real chapter URLs. Optionally ' +
        'start from a given chapter and limit the number of entries.',
      inputSchema: getLearningPathSchema,
    },
    (args) => handleGetLearningPath(services, args as { from?: string; max?: number })
  );

  server.registerTool(
    'generateQuiz',
    {
      title: 'Generate Quiz',
      description:
        'Generate a quiz grounded in Academy content for a topic, with source ' +
        'citations. English or Urdu, at a chosen learner level.',
      inputSchema: generateQuizSchema,
    },
    (args) =>
      handleGenerateQuiz(services, args as {
        topic: string;
        count?: number;
        language?: 'en' | 'ur';
        level?: 'beginner' | 'intermediate' | 'advanced';
      })
  );

  server.registerTool(
    'translateContent',
    {
      title: 'Translate Content',
      description:
        'Translate Academy content between English and Urdu, preserving technical ' +
        'terminology, code, URLs, commands, and Markdown structure.',
      inputSchema: translateContentSchema,
    },
    (args) =>
      handleTranslateContent(services, args as {
        text: string;
        targetLanguage: 'en' | 'ur';
        sourceLanguage?: 'en' | 'ur';
        preserveTerms?: boolean;
        preserveMarkdown?: boolean;
      })
  );

  server.registerTool(
    'getProjectInstructions',
    {
      title: 'Get Project Instructions',
      description:
        'Return project instructions only when they exist in the Academy content. ' +
        'Unknown projects return available: false — instructions are never invented.',
      inputSchema: getProjectInstructionsSchema,
    },
    (args) => handleGetProjectInstructions(services, args as { project?: string })
  );
}
