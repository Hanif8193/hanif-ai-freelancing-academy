// M7 — Safe tool-result helpers
// Tool outputs are JSON-serialized text results. Errors are mapped through
// the M4 P0 `mapProviderError` layer — no raw provider errors, stack traces,
// or secrets ever reach an MCP client. Errors are surfaced as `isError: true`
// tool results with stable codes, never as thrown exceptions.

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { mapProviderError } from '../../rag/errors';

/** Serialize a successful tool result as JSON text. */
export function toolResult(data: unknown): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data) }],
  };
}

/** Serialize a user-facing invalid-input result (code INVALID_REQUEST). */
export function invalidRequest(message: string): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          error: 'Invalid request',
          code: 'INVALID_REQUEST',
          message,
        }),
      },
    ],
    isError: true,
  };
}

/**
 * Map an unknown thrown error to a safe tool result using the M4 P0 mapping.
 * Diagnostics are logged server-side only; the client sees only the safe
 * `{ error, code, message }` shape.
 */
export function safeToolError(error: unknown): CallToolResult {
  // Server-side diagnostics only — never sent to the client.
  console.error('MCP tool error:', error);
  const mapped = mapProviderError(error);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          error: mapped.error,
          code: mapped.code,
          message: mapped.message,
        }),
      },
    ],
    isError: true,
  };
}
