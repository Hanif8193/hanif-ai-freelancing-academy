// M8 — Vercel Function: GET /api/ask/health
// Thin production adapter over the EXISTING M4 health handler
// (createHealthEndpoint). The health endpoint NEVER makes AI calls — it
// reports configuration/initialization state only.

import type { IncomingMessage, ServerResponse } from 'http';
import { createHealthEndpoint } from '../../src/rag/api/ask-endpoint';
import { handleVercelRequest } from '../_lib/adapter';

const handler = createHealthEndpoint();

export default async function health(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await handleVercelRequest(req, res, (r, s) => {
    const expressReq = r as unknown as Parameters<typeof handler>[0];
    const expressRes = s as unknown as Parameters<typeof handler>[1];
    return handler(expressReq, expressRes);
  }, {
    allowedMethods: ['GET'],
    rateLimit: { key: 'health' },
    parseBody: false,
  });
}
