// M4 P0 — Ask the Book API endpoint tests (mocked service, no real API calls)

import { createAskEndpointWithService } from '../api/ask-endpoint';

function makeRes() {
  const res: {
    status: jest.Mock;
    json: jest.Mock;
  } = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  // Cast to any so tests can assert on the mocks while the handler accepts it as
  // an express Response.
  return res as any;
}

function makeReq(overrides: Record<string, unknown> = {}) {
  return {
    method: 'POST',
    body: { question: 'What is freelancing?' },
    ...overrides,
  } as any;
}

function makeService(answer: jest.Mock) {
  return { answer } as any;
}

describe('createAskEndpointWithService', () => {
  it('returns a successful RAG response (answer + sources + insufficientInfo)', async () => {
    const res = makeRes();
    const answer = jest.fn().mockResolvedValue({
      answer: 'A grounded answer.',
      sources: [{ title: 'Chapter 01', section: 'Intro', url: '/docs/freelancing' }],
      insufficientInfo: false,
      suggestedTopics: ['What is freelancing?'],
    });
    const handler = createAskEndpointWithService(async () => makeService(answer));

    await handler(makeReq(), res);

    expect(answer).toHaveBeenCalledWith({
      question: 'What is freelancing?',
      maxSources: undefined,
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: 'A grounded answer.',
        insufficientInfo: false,
        sources: expect.any(Array),
        suggestedTopics: expect.any(Array),
      })
    );
  });

  it('returns HTTP 429 + AI_QUOTA_EXCEEDED for quota-exhausted errors', async () => {
    const res = makeRes();
    const answer = jest.fn().mockRejectedValue({
      status: 429,
      message: 'You exceeded your current quota. status RESOURCE_EXHAUSTED',
    });
    const handler = createAskEndpointWithService(async () => makeService(answer));

    await handler(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(429);
    const payload = res.json.mock.calls[0][0];
    expect(payload.code).toBe('AI_QUOTA_EXCEEDED');
    expect(payload.error).toBe('AI service temporarily unavailable');
    // Raw provider internals must not reach the browser.
    expect(JSON.stringify(payload)).not.toContain('RESOURCE_EXHAUSTED');
    expect(JSON.stringify(payload)).not.toContain('quota exceeded');
  });

  it('maps provider 400 to AI_BAD_REQUEST', async () => {
    const res = makeRes();
    const answer = jest.fn().mockRejectedValue({ status: 400, message: 'invalid argument' });
    const handler = createAskEndpointWithService(async () => makeService(answer));

    await handler(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].code).toBe('AI_BAD_REQUEST');
  });

  it('maps provider 401 to AI_AUTH_ERROR', async () => {
    const res = makeRes();
    const answer = jest.fn().mockRejectedValue({ status: 401, message: 'unauthorized' });
    const handler = createAskEndpointWithService(async () => makeService(answer));

    await handler(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json.mock.calls[0][0].code).toBe('AI_AUTH_ERROR');
  });

  it('maps provider 503 to AI_PROVIDER_ERROR', async () => {
    const res = makeRes();
    const answer = jest.fn().mockRejectedValue({ status: 503, message: 'upstream failure' });
    const handler = createAskEndpointWithService(async () => makeService(answer));

    await handler(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json.mock.calls[0][0].code).toBe('AI_PROVIDER_ERROR');
  });

  it('never leaks internal error details to the browser', async () => {
    const res = makeRes();
    const answer = jest.fn().mockRejectedValue(new Error('secret internal stack'));
    const handler = createAskEndpointWithService(async () => makeService(answer));

    await handler(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
    const payload = res.json.mock.calls[0][0];
    expect(payload.code).toBe('INTERNAL_ERROR');
    expect(JSON.stringify(payload)).not.toContain('secret internal stack');
  });

  it('rejects requests without a question (400 INVALID_REQUEST)', async () => {
    const res = makeRes();
    const handler = createAskEndpointWithService(async () => makeService(jest.fn()));

    await handler(makeReq({ body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].code).toBe('INVALID_REQUEST');
  });

  it('rejects non-POST methods (405 METHOD_NOT_ALLOWED)', async () => {
    const res = makeRes();
    const handler = createAskEndpointWithService(async () => makeService(jest.fn()));

    await handler(makeReq({ method: 'GET' }), res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json.mock.calls[0][0].code).toBe('METHOD_NOT_ALLOWED');
  });
});
