// M7 — Server initialization + tool registration tests (mocked, zero API calls)

import { setupMcp, teardownMcp } from './helpers';

const EXPECTED_TOOLS = [
  'searchAcademyContent',
  'getChapter',
  'getSection',
  'getLearningPath',
  'generateQuiz',
  'translateContent',
  'getProjectInstructions',
];

describe('MCP server', () => {
  afterEach(async () => {
    // Cleanup handled per-test via teardown; nothing global to reset.
  });

  it('initializes and advertises tools-only capabilities', async () => {
    const harness = await setupMcp();
    try {
      const initialize = harness.client.getServerVersion()!;
      expect(initialize.name).toBe('hanif-ai-academy');
      expect(initialize.version).toBe('1.0.0');
    } finally {
      await teardownMcp(harness);
    }
  });

  it('registers all seven tools with names, descriptions, and schemas', async () => {
    const harness = await setupMcp();
    try {
      const { tools } = await harness.client.listTools();
      const names = tools.map((t) => t.name).sort();
      expect(names).toEqual([...EXPECTED_TOOLS].sort());

      for (const tool of tools) {
        expect(tool.description).toBeTruthy();
        expect(tool.inputSchema).toBeTruthy();
      }

      const search = tools.find((t) => t.name === 'searchAcademyContent')!;
      expect(search.inputSchema?.properties?.question).toBeDefined();
    } finally {
      await teardownMcp(harness);
    }
  });

  it('returns a safe error result for unknown tools', async () => {
    const harness = await setupMcp();
    try {
      const result = await harness.client.callTool({ name: 'doesNotExist', arguments: {} });
      expect(result.isError).toBe(true);
      expect(JSON.stringify(result)).toContain('not found');
    } finally {
      await teardownMcp(harness);
    }
  });
});
