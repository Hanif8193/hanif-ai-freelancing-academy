// M7 — MCP server CLI entry (stdio transport)
// Run with: npm run mcp  (tsx src/mcp/server.ts)
//
// Registers the Academy's AI capabilities as MCP tools for local
// MCP-compatible clients (Claude Desktop, Cursor, VS Code, custom agents).
// Local development transport: stdio. Streamable HTTP is future work
// (deployment/monetization milestone) — intentionally not implemented here.

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { buildMcpServer, createMcpServices } from './index';

async function main(): Promise<void> {
  const services = await createMcpServices();
  const server = buildMcpServer(services);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  // Server-side diagnostics only; stdio carries no error channel to the client.
  console.error('MCP server failed to start:', error);
  process.exit(1);
});
