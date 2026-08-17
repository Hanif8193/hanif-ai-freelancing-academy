// M7 — MCP server builder
// Constructs an McpServer (official @modelcontextprotocol/sdk) with all seven
// Academy tools registered. Tests import this builder and connect it to an
// in-memory transport; the stdio CLI entry lives in server.ts.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServices } from './services';
import { registerTools } from './tools';

export const MCP_SERVER_INFO = {
  name: 'hanif-ai-academy',
  version: '1.0.0',
} as const;

/** Build the MCP server with tools-only capabilities and all tools registered. */
export function buildMcpServer(services: McpServices): McpServer {
  const server = new McpServer(MCP_SERVER_INFO, {
    capabilities: { tools: {} },
  });
  registerTools(server, services);
  return server;
}

export { registerTools } from './tools';
export type { McpServices } from './services';
export { createMcpServices, resetMcpServicesCache } from './services';
