// M8 — Vercel Function: POST /api/ask
// Thin production adapter over the EXISTING M4 handler (createAskEndpoint).
// The dev-server middleware (src/rag/api/plugin.ts) continues to serve the
// same route locally; this function serves it in production. No M4 logic is
// duplicated or modified.

import type { IncomingMessage, ServerResponse } from 'http';
import { createAskEndpoint } from '../src/rag/api/ask-endpoint';
import { handleVercelRequest } from './_lib/adapter';

const handler = createAskEndpoint();

export default async function ask(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await handleVercelRequest(req, res, (r, s) => {
    const expressReq = r as unknown as Parameters<typeof handler>[0];
    const expressRes = s as unknown as Parameters<typeof handler>[1];
    return handler(expressReq, expressRes);
  }, {
    allowedMethods: ['POST'],
    rateLimit: { key: 'ask' },
  });
}
