// M8 — Route wiring tests
// Proves the production pattern: the Vercel adapter + the EXISTING M4/M5
// endpoint handlers (via their testable WithService variants) produce the
// documented contracts. No real services, no API calls.

import type { IncomingMessage, ServerResponse } from 'http';
import { createAskEndpointWithService, createHealthEndpoint } from '../../rag/api/ask-endpoint';
import { createTutorEndpointWithService } from '../../tutor/api/tutor-endpoint';
import { handleVercelRequest, type RouteHandler } from '../adapter';

// ============================================================
// Helpers
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

function makeReq(body: unknown, method = 'POST'): never {
  return {
    method,
    url: '/api/ask',
    headers: {},
    socket: { remoteAddress: '127.0.0.1' },
    body,
  } as never;
}

function parseBody(res: MockRes): Record<string, unknown> {
  return JSON.parse(String(res.body)) as Record<string, unknown>;
}

type ExpressHandler = (req: never, res: never) => Promise<void>;

type Config = Parameters<typeof handleVercelRequest>[3];

async function run(handler: ExpressHandler, req: never, res: MockRes, config: Config = {}) {
  await handleVercelRequest(
    req as unknown as IncomingMessage,
    res as unknown as ServerResponse,
    handler as unknown as RouteHandler,
    { rateLimit: false, ...config }
  );
}

// ============================================================
// /api/ask (M4 handler + adapter)
// ============================================================

describe('/api/ask route', () => {
  it('returns a grounded answer with sources on a valid question', async () => {
    const res = makeRes();
    const service = {
      answer: jest.fn().mockResolvedValue({
        answer: 'Freelancing is working for clients.',
        sources: [{ title: 'Chapter 01', section: 'Intro', url: '/docs/freelancing' }],
        insufficientInfo: false,
      }),
    };
    const handler = createAskEndpointWithService(async () => service as never);
    await run(handler, makeReq({ question: 'What is freelancing?' }), res);

    expect(res.statusCode).toBe(200);
    const body = parseBody(res);
    expect(body.answer).toContain('Freelancing');
    expect(body.sources).toHaveLength(1);
    expect(body.insufficientInfo).toBe(false);
  });

  it('returns 400 INVALID_REQUEST for a missing question', async () => {
    const res = makeRes();
    const handler = createAskEndpointWithService(
      async () => ({ answer: jest.fn() }) as never
    );
    await run(handler, makeReq({}), res);

    expect(res.statusCode).toBe(400);
    expect(parseBody(res).code).toBe('INVALID_REQUEST');
  });

  it('returns 429 AI_QUOTA_EXCEEDED for quota errors (M4 P0 mapping preserved)', async () => {
    const res = makeRes();
    const service = {
      answer: jest.fn().mockRejectedValue({
        status: 429,
        message: 'You exceeded your current quota. RESOURCE_EXHAUSTED',
      }),
    };
    const handler = createAskEndpointWithService(async () => service as never);
    await run(handler, makeReq({ question: 'RAG?' }), res);

    expect(res.statusCode).toBe(429);
    const body = parseBody(res);
    expect(body.code).toBe('AI_QUOTA_EXCEEDED');
    expect(JSON.stringify(body)).not.toContain('RESOURCE_EXHAUSTED');
  });

  it('returns 502 AI_PROVIDER_ERROR for provider 503s', async () => {
    const res = makeRes();
    const service = {
      answer: jest.fn().mockRejectedValue({ status: 503, message: 'upstream failure' }),
    };
    const handler = createAskEndpointWithService(async () => service as never);
    await run(handler, makeReq({ question: 'X?' }), res);

    expect(res.statusCode).toBe(502);
    expect(parseBody(res).code).toBe('AI_PROVIDER_ERROR');
  });

  it('returns 500 INTERNAL_ERROR without leaking internals', async () => {
    const res = makeRes();
    const service = {
      answer: jest.fn().mockRejectedValue(new Error('internal secret')),
    };
    const handler = createAskEndpointWithService(async () => service as never);
    await run(handler, makeReq({ question: 'X?' }), res);

    expect(res.statusCode).toBe(500);
    const body = parseBody(res);
    expect(body.code).toBe('INTERNAL_ERROR');
    expect(JSON.stringify(body)).not.toContain('internal secret');
  });

  it('returns 405 for non-POST methods', async () => {
    const res = makeRes();
    const handler = createAskEndpointWithService(
      async () => ({ answer: jest.fn() }) as never
    );
    await run(handler, makeReq({}, 'GET'), res);

    expect(res.statusCode).toBe(405);
    expect(parseBody(res).code).toBe('METHOD_NOT_ALLOWED');
  });
});

// ============================================================
// /api/ask/health (no AI calls)
// ============================================================

describe('/api/ask/health route', () => {
  it('returns configuration status without making AI calls', async () => {
    const res = makeRes();
    const handler = createHealthEndpoint();
    await run(handler, makeReq(undefined, 'GET'), res, {
      allowedMethods: ['GET'],
      parseBody: false,
    });

    expect(res.statusCode).toBe(200);
    const body = parseBody(res);
    expect(['configured', 'not_initialized']).toContain(body.status);
    expect(body.embeddingProvider).toBeDefined();
    expect(body.llmProvider).toBeDefined();
  });

  it('returns 405 for non-GET methods', async () => {
    const res = makeRes();
    const handler = createHealthEndpoint();
    await run(handler, makeReq({}, 'POST'), res, {
      allowedMethods: ['GET'],
      parseBody: false,
    });

    expect(res.statusCode).toBe(405);
    expect(parseBody(res).code).toBe('METHOD_NOT_ALLOWED');
  });
});

// ============================================================
// /api/tutor (M5 handler + adapter)
// ============================================================

describe('/api/tutor route', () => {
  it('returns a structured tutor response on a valid question', async () => {
    const res = makeRes();
    const service = {
      answer: jest.fn().mockResolvedValue({
        mode: 'ask',
        language: 'en',
        level: 'beginner',
        directAnswer: 'A grounded tutor answer.',
        sources: [],
        grounded: true,
        insufficientInfo: false,
      }),
    };
    const handler = createTutorEndpointWithService(async () => service as never);
    await run(handler, makeReq({ question: 'Teach me freelancing' }), res);

    expect(res.statusCode).toBe(200);
    const body = parseBody(res);
    expect(body.mode).toBe('ask');
    expect(body.directAnswer).toContain('tutor answer');
  });

  it('returns 400 INVALID_REQUEST for an oversized question', async () => {
    const res = makeRes();
    const handler = createTutorEndpointWithService(
      async () => ({ answer: jest.fn() }) as never
    );
    await run(handler, makeReq({ question: 'x'.repeat(501) }), res);

    expect(res.statusCode).toBe(400);
    expect(parseBody(res).code).toBe('INVALID_REQUEST');
  });

  it('returns 429 AI_QUOTA_EXCEEDED for quota errors', async () => {
    const res = makeRes();
    const service = {
      answer: jest.fn().mockRejectedValue({
        status: 429,
        message: 'quota exceeded',
      }),
    };
    const handler = createTutorEndpointWithService(async () => service as never);
    await run(handler, makeReq({ question: 'Quiz about RAG' }), res);

    expect(res.statusCode).toBe(429);
    expect(parseBody(res).code).toBe('AI_QUOTA_EXCEEDED');
  });
});
