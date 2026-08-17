// M7 — Content tool tests (getChapter, getSection, getLearningPath,
// getProjectInstructions) — all services mocked, zero real API calls.

import { setupMcp, teardownMcp, parseResult } from './helpers';

describe('getChapter', () => {
  it('returns a real chapter with parsed sections', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'getChapter',
          arguments: { chapter: '01' },
        })
      );
      expect(result.found).toBe(true);
      expect(result.chapter).toBe('01');
      expect(result.url).toBe('/docs/freelancing/what-is-freelancing');
      const sections = result.sections as Array<Record<string, unknown>>;
      expect(sections.some((s) => s.heading === 'Learning Objectives')).toBe(true);
      expect(sections.some((s) => s.heading === 'How It Works')).toBe(true);
      const howItWorks = sections.find((s) => s.heading === 'How It Works')!;
      expect(howItWorks.content).toContain('Freelancing means working independently');
    } finally {
      await teardownMcp(harness);
    }
  });

  it('resolves by slug and by title', async () => {
    const harness = await setupMcp();
    try {
      const bySlug = parseResult(
        await harness.client.callTool({
          name: 'getChapter',
          arguments: { chapter: 'what-is-freelancing' },
        })
      );
      expect(bySlug.found).toBe(true);

      const byTitle = parseResult(
        await harness.client.callTool({
          name: 'getChapter',
          arguments: { chapter: 'What Is Freelancing?' },
        })
      );
      expect(byTitle.found).toBe(true);
    } finally {
      await teardownMcp(harness);
    }
  });

  it('returns found: false for a nonexistent chapter — never fabricates', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'getChapter',
          arguments: { chapter: '99' },
        })
      );
      expect(result.found).toBe(false);
      expect(result).not.toHaveProperty('sections');
      expect(JSON.stringify(result)).not.toContain('Chapter 99');
    } finally {
      await teardownMcp(harness);
    }
  });

  it('omits content when includeContent is false', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'getChapter',
          arguments: { chapter: '01', includeContent: false },
        })
      );
      const sections = result.sections as Array<Record<string, unknown>>;
      expect(sections[0]).not.toHaveProperty('content');
    } finally {
      await teardownMcp(harness);
    }
  });
});

describe('getSection', () => {
  it('returns a real section with content', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'getSection',
          arguments: { chapter: '01', section: 'How It Works' },
        })
      );
      expect(result.found).toBe(true);
      const section = result.section as Record<string, unknown>;
      expect(section.heading).toBe('How It Works');
      expect(section.hasCodeBlocks).toBe(true);
    } finally {
      await teardownMcp(harness);
    }
  });

  it('matches headings case-insensitively', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'getSection',
          arguments: { chapter: '01', section: 'learning objectives' },
        })
      );
      expect(result.found).toBe(true);
    } finally {
      await teardownMcp(harness);
    }
  });

  it('returns found: false for a nonexistent section', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'getSection',
          arguments: { chapter: '01', section: 'Quantum Physics' },
        })
      );
      expect(result.found).toBe(false);
    } finally {
      await teardownMcp(harness);
    }
  });

  it('returns found: false for a nonexistent chapter', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'getSection',
          arguments: { chapter: '42', section: 'Anything' },
        })
      );
      expect(result.found).toBe(false);
    } finally {
      await teardownMcp(harness);
    }
  });
});

describe('getLearningPath', () => {
  it('returns the ordered path with real URLs', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({ name: 'getLearningPath', arguments: {} })
      );
      const path = result.path as Array<Record<string, unknown>>;
      expect(path.length).toBeGreaterThanOrEqual(10);
      expect(path[0].chapter).toBe('01');
      expect(path[0].url).toBe('/docs/freelancing/what-is-freelancing');
      for (const entry of path) {
        expect(String(entry.url)).toMatch(/^\/docs\//);
        expect(String(entry.chapter)).toMatch(/^\d{2}$/);
      }
    } finally {
      await teardownMcp(harness);
    }
  });

  it('honors from and max, with recommendedNext after the last entry', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'getLearningPath',
          arguments: { from: '04', max: 2 },
        })
      );
      const path = result.path as Array<Record<string, unknown>>;
      expect(path.length).toBe(2);
      expect(path[0].chapter).toBe('04');
      expect(path[1].chapter).toBe('05');
      const next = result.recommendedNext as Record<string, unknown>;
      expect(next.topic).toBeTruthy();
      expect(String(next.url)).toMatch(/^\/docs\//);
    } finally {
      await teardownMcp(harness);
    }
  });

  it('returns INVALID_REQUEST for an unknown from chapter', async () => {
    const harness = await setupMcp();
    try {
      const result = await harness.client.callTool({
        name: 'getLearningPath',
        arguments: { from: 'bogus-chapter' },
      });
      expect(result.isError).toBe(true);
      const parsed = parseResult(result);
      expect(parsed.code).toBe('INVALID_REQUEST');
    } finally {
      await teardownMcp(harness);
    }
  });
});

describe('getProjectInstructions', () => {
  it('returns the grounded overview when no project is requested', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({ name: 'getProjectInstructions', arguments: {} })
      );
      expect(result.available).toBe(true);
      expect(result.url).toBe('/docs/projects');
      expect(String(result.instructions)).toContain('Real-World Projects');
      expect(result.sections).toEqual(expect.arrayContaining(['Available Projects']));
    } finally {
      await teardownMcp(harness);
    }
  });

  it('returns available: false for a project with no instructions — never invents', async () => {
    const harness = await setupMcp();
    try {
      const result = parseResult(
        await harness.client.callTool({
          name: 'getProjectInstructions',
          arguments: { project: 'Build a Portfolio Website' },
        })
      );
      expect(result.available).toBe(false);
      expect(String(result.message)).toContain('No instructions');
    } finally {
      await teardownMcp(harness);
    }
  });
});
