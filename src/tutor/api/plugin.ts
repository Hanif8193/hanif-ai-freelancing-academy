// M5 — Tutor Plugin for Docusaurus
// Registers POST /api/tutor via the dev-server middleware, following the same
// pattern as the M4 RAG plugin (src/rag/api/plugin.ts).

import type { LoadContext } from '@docusaurus/types';
import { createTutorEndpoint } from './tutor-endpoint';

export default function tutorPlugin(
  _context: LoadContext,
  _options: unknown
) {
  const tutorHandler = createTutorEndpoint();

  return {
    name: 'hanif-academy-tutor',

    configureWebpack() {
      return {
        devServer: {
          setupMiddlewares: (middlewares: any[], _devServer: any) => {
            middlewares.unshift((req: any, res: any, next: any) => {
              if (req.path === '/api/tutor' && req.method === 'POST') {
                let body = '';
                req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
                req.on('end', () => {
                  try { req.body = JSON.parse(body); } catch { req.body = {}; }
                  tutorHandler(req, res);
                });
              } else {
                next();
              }
            });

            return middlewares;
          },
        },
      } as Record<string, unknown>;
    },
  };
}
