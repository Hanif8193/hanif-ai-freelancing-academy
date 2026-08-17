// M8 — Adapter tests (mocked req/res, no API calls)

import type { IncomingMessage, ServerResponse } from 'http';
import {
  handleVercelRequest,
  MAX_BODY_BYTES,
  type AdapterResponse,
} from '../adapter';
import { createFixedWindowLimiter } from '../rate-limit';

// ============================================================
// Mock req/res helpers
// ============================================================

interface MockRes {
  statusCode: number;
  headersSent: boolean;
  headers: Record<string, string>;
  body: unknown;
  setHeader(name: string, value: string): void;
  end(payload?: unknown): void;
}

function makeRes(): MockRes {
  const res: MockRes = {
    statusCode: 200,
    headersSent: false,
    headers: {},
    body: undefined,
    setHeader(name: string, value: string) {
      res.headers[name] = value;
    },
    end(payload?: unknown) {
      res.body = payload;
    },
  };
  return res;
}

/** Request where the body arrives via the request stream (plain Node path). */
function makeStreamingReq(body: string, overrides: Record<string, unknown> = {}): never {
  let sent = false;
  const req = {
    method: 'POST',
    url: '/api/ask',
    headers: {},
    socket: { remoteAddress: '127.0.0.1' },
    [Symbol.asyncIterator]() {
      return {
        next: async () => {
          if (sent) return { done: true, value: undefined };
          sent = true;
          return { done: false, value: Buffer.from(body) };
        },
      };
    },
    ...overrides,
  };
  return req as never;
}

/** Request where the body is pre-parsed by the host runtime (Vercel path). */
function makePreParsedReq(body: unknown, overrides: Record<string, unknown> = {}): never {
  return {
    method: 'POST',
    url: '/api/ask',
    headers: {},
    socket: { remoteAddress: '127.0.0.1' },
    body,
    ...overrides,
  } as never;
}

function parseBody(res: MockRes): Record<string, unknown> {
  return JSON.parse(String(res.body)) as Record<string, unknown>;
}

// ============================================================
// Tests
// ============================================================

describe('handleVercelRequest', () => {
  it('parses the JSON body and delegates to the handler', async () => {
    const res = makeRes();
    const handler = jest.fn();
    await handleVercelRequest(
      makeStreamingReq(JSON.stringify({ question: 'What is freelancing?' })),
      res as unknown as ServerResponse,
      handler,
      { rateLimit: false }
    );
    expect(handler).toHaveBeenCalledTimes(1);
    const req = handler.mock.calls[0][0];
    expect(req.body).toEqual({ question: 'What is freelancing?' });
  });

  it('uses the host pre-parsed body when present', async () => {
    const res = makeRes();
    const handler = jest.fn();
    await handleVercelRequest(
      makePreParsedReq({ question: 'Hello' }),
      res as unknown as ServerResponse,
      handler,
      { rateLimit: false }
    );
    expect(handler.mock.calls[0][0].body).toEqual({ question: 'Hello' });
  });

  it('rejects disallowed methods with 405 METHOD_NOT_ALLOWED', async () => {
    const res = makeRes();
    const handler = jest.fn();
    await handleVercelRequest(
      makeStreamingReq('', { method: 'GET' }),
      res as unknown as ServerResponse,
      handler,
      { allowedMethods: ['POST'], rateLimit: false }
    );
    expect(handler).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(405);
    expect(parseBody(res).code).toBe('METHOD_NOT_ALLOWED');
  });

  it('rejects invalid JSON with 400 INVALID_JSON', async () => {
    const res = makeRes();
    const handler = jest.fn();
    await handleVercelRequest(
      makeStreamingReq('{not json'),
      res as unknown as ServerResponse,
      handler,
      { rateLimit: false }
    );
    expect(handler).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(parseBody(res).code).toBe('INVALID_JSON');
  });

  it('rejects an oversized streaming body with 413 PAYLOAD_TOO_LARGE', async () => {
    const res = makeRes();
    const handler = jest.fn();
    await handleVercelRequest(
      makeStreamingReq('x'.repeat(MAX_BODY_BYTES + 1)),
      res as unknown as ServerResponse,
      handler,
      { rateLimit: false }
    );
    expect(handler).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(413);
    expect(parseBody(res).code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('rejects an oversized pre-parsed body with 413', async () => {
    const res = makeRes();
    const handler = jest.fn();
    await handleVercelRequest(
      makePreParsedReq({ text: 'y'.repeat(MAX_BODY_BYTES + 1) }),
      res as unknown as ServerResponse,
      handler,
      { rateLimit: false }
    );
    expect(handler).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(413);
    expect(parseBody(res).code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('rate limits with 429 RATE_LIMITED + Retry-After and does not call the handler', async () => {
    const res = makeRes();
    const handler = jest.fn();
    const limiter = createFixedWindowLimiter({ max: 1, windowMs: 60_000 });
    const config = { rateLimit: { key: 'ask', limiter } };

    await handleVercelRequest(
      makeStreamingReq(JSON.stringify({ question: 'one' })),
      res as unknown as ServerResponse,
      handler,
      config
    );
    expect(res.statusCode).toBe(200);

    await handleVercelRequest(
      makeStreamingReq(JSON.stringify({ question: 'two' })),
      res as unknown as ServerResponse,
      handler,
      config
    );
    expect(res.statusCode).toBe(429);
    expect(parseBody(res).code).toBe('RATE_LIMITED');
    expect(res.headers['Retry-After']).toBeDefined();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('maps unexpected handler failures to a safe 500 with no stack leakage', async () => {
    const res = makeRes();
    const handler = jest.fn(async () => {
      throw new Error('secret internal detail with stack');
    });
    await handleVercelRequest(
      makePreParsedReq({}),
      res as unknown as ServerResponse,
      handler,
      { rateLimit: false }
    );
    expect(res.statusCode).toBe(500);
    const body = parseBody(res);
    expect(body.code).toBe('INTERNAL_ERROR');
    expect(JSON.stringify(body)).not.toContain('secret internal detail');
    expect(JSON.stringify(body)).not.toContain('stack');
  });

  it('skips body parsing when parseBody is false', async () => {
    const res = makeRes();
    const handler = jest.fn();
    await handleVercelRequest(
      makeStreamingReq(JSON.stringify({ question: 'x' })),
      res as unknown as ServerResponse,
      handler,
      { parseBody: false, rateLimit: false }
    );
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].body).toBeUndefined();
  });

  it('provides the Express-style status().json() shim to handlers', async () => {
    const res = makeRes();
    const handler = jest.fn(async (_req: unknown, out: AdapterResponse) => {
      out.status(200).json({ answer: 'ok', sources: [] });
    });
    await handleVercelRequest(
      makePreParsedReq({}),
      res as unknown as ServerResponse,
      handler,
      { rateLimit: false }
    );
    expect(res.statusCode).toBe(200);
    expect(parseBody(res)).toEqual({ answer: 'ok', sources: [] });
  });
});
