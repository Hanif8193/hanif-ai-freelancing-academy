// M8 — Vercel Function: POST /api/tutor
// Thin production adapter over the EXISTING M5 handler (createTutorEndpoint).
// The dev-server middleware (src/tutor/api/plugin.ts) continues to serve the
// same route locally; this function serves it in production. No M5 logic is
// duplicated or modified.

import type { IncomingMessage, ServerResponse } from 'http';
import { createTutorEndpoint } from '../src/tutor/api/tutor-endpoint';
import { handleVercelRequest } from './_lib/adapter';

const handler = createTutorEndpoint();

export default async function tutor(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await handleVercelRequest(req, res, (r, s) => {
    const expressReq = r as unknown as Parameters<typeof handler>[0];
    const expressRes = s as unknown as Parameters<typeof handler>[1];
    return handler(expressReq, expressRes);
  }, {
    allowedMethods: ['POST'],
    rateLimit: { key: 'tutor' },
  });
}
