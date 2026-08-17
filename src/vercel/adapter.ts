// M8 — Shared Vercel function adapter
//
// A thin, transport-agnostic edge for the EXISTING Express-style handlers
// (createAskEndpoint / createHealthEndpoint / createTutorEndpoint). It
// provides:
//   - HTTP method enforcement            (405 METHOD_NOT_ALLOWED)
//   - per-instance rate limiting         (429 RATE_LIMITED + Retry-After)
//   - JSON body parsing with a 16 KB cap (413 PAYLOAD_TOO_LARGE)
//   - invalid-JSON handling              (400 INVALID_JSON)
//   - safe error fallback                (500 INTERNAL_ERROR — no stack traces)
//
// It never exposes provider internals, stack traces, or secrets. Provider
// errors keep flowing through the existing M4 P0 `mapProviderError` inside
// the handlers.

import type { IncomingMessage, ServerResponse } from 'http';
import { clientKey, getDefaultRateLimiter, type RateLimiter } from './rate-limit';

// ============================================================
// Types
// ============================================================

/** Request shape the handlers receive (Vercel pre-parses JSON bodies). */
export interface AdapterRequest extends IncomingMessage {
  body?: unknown;
}

/** Response shim exposing the Express-style status().json() used by handlers. */
export interface AdapterResponse extends ServerResponse {
  status(code: number): AdapterResponse;
  json(payload: unknown): void;
}

export type RouteHandler = (req: AdapterRequest, res: AdapterResponse) => Promise<void> | void;

export interface RouteRateLimit {
  /** Bucket key prefix for this route (defaults to the request path). */
  key?: string;
  /** Custom limiter (default: the shared env-configured limiter). */
  limiter?: RateLimiter;
}

export interface RouteConfig {
  /** Allowed HTTP methods (default ['POST']). */
  allowedMethods?: string[];
  /** Rate limiting for the route (default: enabled with the shared limiter). */
  rateLimit?: RouteRateLimit | false;
  /** Parse the JSON body before calling the handler (default true). */
  parseBody?: boolean;
}

export interface BodyError {
  statusCode: number;
  code: string;
  error: string;
  message: string;
}

export type BodyParseResult =
  | { ok: true; body: unknown }
  | { ok: false; error: BodyError };

// ============================================================
// Constants
// ============================================================

/** Maximum accepted JSON request body (bytes). */
export const MAX_BODY_BYTES = 16 * 1024;

export const METHOD_NOT_ALLOWED: BodyError = {
  statusCode: 405,
  code: 'METHOD_NOT_ALLOWED',
  error: 'Method not allowed',
  message: 'This endpoint does not accept this HTTP method.',
};

export const INVALID_JSON: BodyError = {
  statusCode: 400,
  code: 'INVALID_JSON',
  error: 'Invalid JSON body',
  message: 'The request body is not valid JSON.',
};

export const PAYLOAD_TOO_LARGE: BodyError = {
  statusCode: 413,
  code: 'PAYLOAD_TOO_LARGE',
  error: 'Request body too large',
  message: `The request body must be ${MAX_BODY_BYTES} bytes or less.`,
};

export const RATE_LIMITED: BodyError = {
  statusCode: 429,
  code: 'RATE_LIMITED',
  error: 'Too many requests',
  message: 'Too many requests. Please try again later.',
};

export const INTERNAL_ERROR: BodyError = {
  statusCode: 500,
  code: 'INTERNAL_ERROR',
  error: 'Internal error',
  message: 'Something went wrong. Please try again.',
};

// ============================================================
// Response shim
// ============================================================

export function createAdapterResponse(res: ServerResponse): AdapterResponse {
  const adapter = res as AdapterResponse;
  adapter.status = (code: number) => {
    adapter.statusCode = code;
    return adapter;
  };
  adapter.json = (payload: unknown) => {
    if (!adapter.headersSent) {
      adapter.setHeader('Content-Type', 'application/json');
    }
    adapter.end(JSON.stringify(payload));
  };
  return adapter;
}

// ============================================================
// Body parsing
// ============================================================

/**
 * Read and parse the JSON request body with a hard size cap.
 * - Vercel's Node runtime pre-parses JSON into req.body; when present, we
 *   use it (still enforcing the size cap on the serialized size).
 * - Otherwise (local dev / plain Node), stream the request body with a cap.
 */
export async function readJsonBody(req: IncomingMessage): Promise<BodyParseResult> {
  const preParsed = (req as AdapterRequest).body;
  if (preParsed !== undefined) {
    const size = JSON.stringify(preParsed)?.length ?? 0;
    if (size > MAX_BODY_BYTES) {
      return { ok: false, error: PAYLOAD_TOO_LARGE };
    }
    return { ok: true, body: preParsed };
  }

  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
    total += buf.length;
    if (total > MAX_BODY_BYTES) {
      return { ok: false, error: PAYLOAD_TOO_LARGE };
    }
    chunks.push(buf);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) {
    return { ok: true, body: {} };
  }
  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, error: INVALID_JSON };
  }
}

// ============================================================
// Route entry
// ============================================================

/**
 * Wrap a route handler with method checks, rate limiting, body parsing, and
 * safe error handling. Errors thrown by the handler (unexpected failures)
 * become a safe 500 — provider errors are already mapped by the handlers.
 */
export async function handleVercelRequest(
  req: IncomingMessage,
  res: ServerResponse,
  handler: RouteHandler,
  config: RouteConfig = {}
): Promise<void> {
  const response = createAdapterResponse(res);
  const methods = config.allowedMethods ?? ['POST'];

  // 1. Method check
  const method = req.method ?? '';
  if (!methods.includes(method)) {
    sendBodyError(response, METHOD_NOT_ALLOWED);
    return;
  }

  // 2. Rate limit (before body parsing so limited clients cost nothing)
  if (config.rateLimit !== false) {
    const limiter = config.rateLimit?.limiter ?? getDefaultRateLimiter();
    const key = `${config.rateLimit?.key ?? req.url ?? 'default'}:${clientKey(req)}`;
    const result = limiter.check(key);
    if (!result.allowed) {
      if (!res.headersSent) {
        res.setHeader('Retry-After', String(result.retryAfterSeconds ?? 1));
      }
      sendBodyError(response, RATE_LIMITED);
      return;
    }
  }

  // 3. Body parsing
  if (config.parseBody !== false) {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) {
      sendBodyError(response, parsed.error);
      return;
    }
    (req as AdapterRequest).body = parsed.body;
  }

  // 4. Delegate to the existing handler; unexpected failures -> safe 500.
  try {
    await handler(req as AdapterRequest, response);
  } catch (error) {
    // Server-side diagnostics only — never sent to the client.
    console.error('API route error:', error);
    sendBodyError(response, INTERNAL_ERROR);
  }
}

function sendBodyError(res: AdapterResponse, error: BodyError): void {
  if (!res.headersSent) {
    res.setHeader('Content-Type', 'application/json');
  }
  res.statusCode = error.statusCode;
  res.end(JSON.stringify({ error: error.error, code: error.code, message: error.message }));
}
