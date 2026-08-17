// M7 — Content tools (delegate to the M5 topics map + M4 MarkdownParser)
// getChapter, getSection, getLearningPath, getProjectInstructions.
//
// Grounding rules:
// - Chapter/section/project paths resolve ONLY against the internal topics
//   map — user input never becomes a filesystem path or URL.
// - Nonexistent chapters/sections/projects return `found: false` /
//   `available: false` — never fabricated.

import { MarkdownParser } from '../../rag/ingestion/markdown-parser';
import type { AcademyTopic } from '../../tutor/topics';
import { CHAPTER_ORDER } from '../../tutor/topics';
import type { McpServices } from '../services';
import { invalidRequest, safeToolError, toolResult } from './errors';
import {
  INSTRUCTIONS_MAX,
  MAX_SECTIONS,
  SECTION_CONTENT_MAX,
} from './schemas';

const parser = new MarkdownParser();

// ============================================================
// Shared resolution helpers
// ============================================================

/** Map a real Academy URL to the project-relative markdown file candidates. */
export function urlToFileCandidates(url: string): string[] {
  const rest = url.replace(/^\/docs\//, '');
  return [`docs/${rest}.md`, `docs/${rest}/index.md`];
}

/**
 * Resolve a chapter input ("01"–"10", a known slug, or a known title) to a
 * real topics-map entry. Returns undefined when it does not clearly match —
 * the caller then reports `found: false` (never fabricates).
 */
export function resolveChapter(
  topics: AcademyTopic[],
  input: string
): AcademyTopic | undefined {
  const raw = input.trim();
  if (!raw) return undefined;
  const normalized = raw.toLowerCase();

  // Exact chapter number ("05").
  const exactChapter = topics.find(
    (t) => t.chapter && t.chapter.toLowerCase() === normalized
  );
  if (exactChapter) return exactChapter;

  // "chapter 05" / "chapter05" forms.
  const chapterMatch = normalized.match(/^chapter\s*(\d{1,2})$/);
  if (chapterMatch) {
    const padded = chapterMatch[1].padStart(2, '0');
    return topics.find((t) => t.chapter === padded);
  }

  // Known URL slug ("what-are-ai-coding-agents").
  const bySlug = topics.find(
    (t) => (t.url.split('/').pop() || '').toLowerCase() === normalized
  );
  if (bySlug) return bySlug;

  // Exact title match (case-insensitive).
  return topics.find((t) => t.title.toLowerCase() === normalized);
}

/** Try each candidate path until one reads successfully. */
async function readFirst(
  services: McpServices,
  candidates: string[]
): Promise<{ path: string; content: string } | null> {
  for (const candidate of candidates) {
    try {
      const content = await services.readFile(candidate);
      if (content.trim()) {
        return { path: candidate, content };
      }
    } catch {
      // Try the next candidate.
    }
  }
  return null;
}

/** Bound a parsed section's content so tool outputs stay small. */
function boundSection(section: {
  heading: string;
  headingLevel: number;
  content: string;
  startLine: number;
  endLine: number;
  hasCodeBlocks: boolean;
}, includeContent: boolean) {
  const content = includeContent
    ? section.content.slice(0, SECTION_CONTENT_MAX)
    : undefined;
  return {
    heading: section.heading,
    headingLevel: section.headingLevel,
    ...(content !== undefined ? { content } : {}),
    startLine: section.startLine,
    endLine: section.endLine,
    hasCodeBlocks: section.hasCodeBlocks,
  };
}

// ============================================================
// Tool 2 — getChapter
// ============================================================

export async function handleGetChapter(
  services: McpServices,
  args: { chapter: string; includeContent?: boolean }
) {
  const includeContent = args.includeContent ?? true;
  const entry = resolveChapter(services.topics, args.chapter);
  if (!entry) {
    return toolResult({
      requested: args.chapter,
      found: false,
      message: 'Chapter not found in the Academy content.',
    });
  }

  try {
    const file = await readFirst(services, urlToFileCandidates(entry.url));
    if (!file) {
      // The map points at a real doc — an unreadable file is an internal error.
      return safeToolError(
        new Error(`Could not read Academy document for chapter: ${entry.title}`)
      );
    }

    const document = parser.parse(file.content, {
      title: entry.title,
      module: entry.module,
      chapter: entry.chapter ?? '00',
      sourcePath: file.path,
      url: entry.url,
    });

    const title =
      parser.extractTitle(file.content) === 'Untitled'
        ? entry.title
        : parser.extractTitle(file.content);

    return toolResult({
      title,
      chapter: entry.chapter,
      module: entry.module,
      url: entry.url,
      sections: document.sections
        .slice(0, MAX_SECTIONS)
        .map((s) => boundSection(s, includeContent)),
      found: true,
    });
  } catch (error) {
    return safeToolError(error);
  }
}

// ============================================================
// Tool 3 — getSection
// ============================================================

export async function handleGetSection(
  services: McpServices,
  args: { chapter: string; section: string }
) {
  const entry = resolveChapter(services.topics, args.chapter);
  if (!entry) {
    return toolResult({
      requestedChapter: args.chapter,
      found: false,
      message: 'Chapter not found in the Academy content.',
    });
  }

  try {
    const file = await readFirst(services, urlToFileCandidates(entry.url));
    if (!file) {
      return safeToolError(
        new Error(`Could not read Academy document for chapter: ${entry.title}`)
      );
    }

    const document = parser.parse(file.content, {
      title: entry.title,
      module: entry.module,
      chapter: entry.chapter ?? '00',
      sourcePath: file.path,
      url: entry.url,
    });

    const wanted = args.section.trim().toLowerCase();
    const match = document.sections.find(
      (s) => s.heading.trim().toLowerCase() === wanted
    ) ?? document.sections.find(
      (s) => s.heading.trim().toLowerCase().includes(wanted)
    );

    if (!match) {
      return toolResult({
        title: entry.title,
        url: entry.url,
        requestedSection: args.section,
        found: false,
        message: 'Section not found in this chapter.',
      });
    }

    return toolResult({
      title: entry.title,
      url: entry.url,
      section: boundSection(match, true),
      found: true,
    });
  } catch (error) {
    return safeToolError(error);
  }
}

// ============================================================
// Tool 4 — getLearningPath
// ============================================================

export async function handleGetLearningPath(
  services: McpServices,
  args: { from?: string; max?: number }
) {
  const order = CHAPTER_ORDER.filter((t) => t.chapter);
  let startIndex = 0;

  if (args.from !== undefined && args.from.trim() !== '') {
    const fromEntry = resolveChapter(services.topics, args.from);
    if (!fromEntry || !fromEntry.chapter) {
      return invalidRequest(`Unknown chapter: ${args.from}`);
    }
    startIndex = order.findIndex((t) => t.chapter === fromEntry.chapter);
    if (startIndex === -1) {
      return invalidRequest(`Unknown chapter: ${args.from}`);
    }
  }

  const max = args.max ?? order.length;
  const path = order.slice(startIndex, startIndex + max).map((t, i) => ({
    position: startIndex + i + 1,
    title: t.title,
    chapter: t.chapter,
    module: t.module,
    url: t.url,
  }));

  const next = order[startIndex + path.length];
  const recommendedNext = next
    ? {
        topic: next.title,
        url: next.url,
        reason: 'Next chapter in the learning journey',
      }
    : undefined;

  return toolResult({ path, recommendedNext });
}

// ============================================================
// Tool 7 — getProjectInstructions
// ============================================================

export async function handleGetProjectInstructions(
  services: McpServices,
  args: { project?: string }
) {
  const projectsTopic = services.topics.find((t) => t.module === 'projects');
  if (!projectsTopic) {
    return safeToolError(new Error('Projects module is not configured in the topics map.'));
  }

  try {
    const file = await readFirst(services, urlToFileCandidates(projectsTopic.url));
    if (!file) {
      return safeToolError(new Error('Could not read the Academy projects document.'));
    }

    const document = parser.parse(file.content, {
      title: projectsTopic.title,
      module: 'projects',
      chapter: '00',
      sourcePath: file.path,
      url: projectsTopic.url,
    });

    const sectionHeadings = document.sections.map((s) => s.heading);

    // No specific project requested -> return the grounded overview.
    if (args.project === undefined || args.project.trim() === '') {
      return toolResult({
        instructions: document.fullContent.trim().slice(0, INSTRUCTIONS_MAX),
        url: projectsTopic.url,
        available: true,
        sections: sectionHeadings,
      });
    }

    // Specific project requested -> instructions exist only if the doc
    // actually contains a matching section (never invented).
    const wanted = args.project.trim().toLowerCase();
    const projectSection = document.sections.find(
      (s) => s.heading.trim().toLowerCase().includes(wanted)
    );

    if (!projectSection) {
      return toolResult({
        requestedProject: args.project,
        url: projectsTopic.url,
        available: false,
        message:
          'No instructions exist for this project in the Academy content yet.',
      });
    }

    return toolResult({
      instructions: projectSection.content.trim().slice(0, INSTRUCTIONS_MAX),
      url: projectsTopic.url,
      available: true,
      sections: [projectSection.heading],
    });
  } catch (error) {
    return safeToolError(error);
  }
}
