// M7 — MCP tool input schemas and shared bounds
// Every tool input is validated: strings length-bounded, numbers bounded,
// enums validated. The SDK advertises these schemas to MCP clients and
// rejects invalid arguments before the tool callback runs.

import { z } from 'zod';

// ============================================================
// Shared bounds (mirror the web endpoints' limits)
// ============================================================

export const QUESTION_MAX = 500;
export const TEXT_MAX = 2000;
export const TOPIC_MAX = 300;
export const SECTION_MAX = 200;
export const PROJECT_MAX = 200;
export const MAX_SOURCES = 5;
export const MAX_QUIZ_ITEMS = 5;
export const MAX_PATH_ITEMS = 14;
export const MAX_SECTIONS = 50;
export const SECTION_CONTENT_MAX = 4000;
export const INSTRUCTIONS_MAX = 6000;

export const languageSchema = z.enum(['en', 'ur']);
export const levelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

// ============================================================
// Per-tool input schemas
// ============================================================

export const searchAcademyContentSchema = {
  question: z.string().min(1).max(QUESTION_MAX),
  maxSources: z.number().int().min(1).max(MAX_SOURCES).optional(),
};

export const getChapterSchema = {
  chapter: z.string().min(1).max(QUESTION_MAX),
  includeContent: z.boolean().optional(),
};

export const getSectionSchema = {
  chapter: z.string().min(1).max(QUESTION_MAX),
  section: z.string().min(1).max(SECTION_MAX),
};

export const getLearningPathSchema = {
  from: z.string().min(1).max(QUESTION_MAX).optional(),
  max: z.number().int().min(1).max(MAX_PATH_ITEMS).optional(),
};

export const generateQuizSchema = {
  topic: z.string().min(1).max(TOPIC_MAX),
  count: z.number().int().min(1).max(MAX_QUIZ_ITEMS).optional(),
  language: languageSchema.optional(),
  level: levelSchema.optional(),
};

export const translateContentSchema = {
  text: z.string().min(1).max(TEXT_MAX),
  targetLanguage: languageSchema,
  sourceLanguage: languageSchema.optional(),
  preserveTerms: z.boolean().optional(),
  preserveMarkdown: z.boolean().optional(),
};

export const getProjectInstructionsSchema = {
  project: z.string().min(1).max(PROJECT_MAX).optional(),
};
