// M4 — RAG Plugin for Docusaurus
// Registers API endpoints via configureWebpack devServer hook

import type { LoadContext } from '@docusaurus/types';
import { createAskEndpoint, createHealthEndpoint } from './ask-endpoint';

export default function ragPlugin(
  _context: LoadContext,
  _options: unknown
) {
  const askHandler = createAskEndpoint();
  const healthHandler = createHealthEndpoint();

  return {
    name: 'hanif-academy-rag',

    configureWebpack() {
      return {
        devServer: {
          setupMiddlewares: (middlewares: any[], _devServer: any) => {
            middlewares.unshift((req: any, res: any, next: any) => {
              if (req.path === '/api/ask/health' && req.method === 'GET') {
                healthHandler(req, res);
              } else if (req.path === '/api/ask' && req.method === 'POST') {
                let body = '';
                req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
                req.on('end', () => {
                  try { req.body = JSON.parse(body); } catch { req.body = {}; }
                  askHandler(req, res);
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
