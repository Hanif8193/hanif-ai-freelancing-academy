// M8 — Vercel function adapter (re-export)
// Implementation lives in src/vercel/adapter.ts so it can be unit-tested by
// the project's jest setup (roots: src). This file keeps the api/ tree
// self-contained for the Vercel bundler.
export {
  handleVercelRequest,
  readJsonBody,
  createAdapterResponse,
  MAX_BODY_BYTES,
} from '../../src/vercel/adapter';
export type {
  AdapterRequest,
  AdapterResponse,
  RouteHandler,
  RouteConfig,
  BodyParseResult,
} from '../../src/vercel/adapter';
