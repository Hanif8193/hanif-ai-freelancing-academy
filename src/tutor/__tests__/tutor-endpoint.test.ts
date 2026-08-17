// M5 — /api/tutor endpoint tests (mocked TutorService, no real API calls)

import { createTutorEndpointWithService } from '../api/tutor-endpoint';
import type { TutorService } from '../TutorService';
import type { TutorResponse } from '../types';

function makeRes() {
  const res: { status: jest.Mock; json: jest.Mock } = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res as any;
}

function makeReq(overrides: Record<string, unknown> = {}) {
  return {
    method: 'POST',
    body: { question: 'What is freelancing?' },
    ...overrides,
  } as any;
}

const successResponse: TutorResponse = {
  mode: 'ask',
  language: 'en',
  level: 'beginner',
  directAnswer: 'A grounded answer.',
  sources: [{ title: 'Chapter 01', section: 'Intro', url: '/docs/freelancing' }],
  grounded: true,
  insufficientInfo: false,
};

function makeService(answer: jest.Mock): TutorService {
  return { answer } as unknown as TutorService;
}

describe('createTutorEndpointWithService', () => {
  it('returns a successful TutorResponse', async () => {
    const res = makeRes();
    const answer = jest.fn().mockResolvedValue(successResponse);
    const handler = createTutorEndpointWithService(async () => makeService(answer));

    await handler(makeReq(), res);

    expect(answer).toHaveBeenCalledWith(
      expect.objectContaining({ question: 'What is freelancing?', mode: undefined })
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ mode: 'ask', grounded: true }));
  });

  it('forwards explicit mode/language/level/context/history', async () => {
    const res = makeRes();
    const answer = jest.fn().mockResolvedValue(successResponse);
    const handler = createTutorEndpointWithService(async () => makeService(answer));

    await handler(
      makeReq({
        body: {
          question: 'Check my answer',
          mode: 'assessment',
          language: 'ur',
          level: 'intermediate',
          context: { learnerAnswer: 'My answer' },
          history: [{ role: 'user', content: 'hi' }],
        },
      }),
      res
    );

    expect(answer).toHaveBeenCalledWith(
      expect.objectContaining({
        question: 'Check my answer',
        mode: 'assessment',
        language: 'ur',
        level: 'intermediate',
        context: { learnerAnswer: 'My answer' },
        history: [{ role: 'user', content: 'hi' }],
      })
    );
  });

  it('returns HTTP 429 + AI_QUOTA_EXCEEDED for quota errors without leaking details', async () => {
    const res = makeRes();
    const answer = jest.fn().mockRejectedValue({
      status: 429,
      message: 'You exceeded your current quota. status RESOURCE_EXHAUSTED',
    });
    const handler = createTutorEndpointWithService(async () => makeService(answer));

    await handler(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(429);
    const payload = res.json.mock.calls[0][0];
    expect(payload.code).toBe('AI_QUOTA_EXCEEDED');
    expect(JSON.stringify(payload)).not.toContain('RESOURCE_EXHAUSTED');
    expect(JSON.stringify(payload)).not.toContain('quota exceeded');
  });

  it('maps provider 503 to AI_PROVIDER_ERROR', async () => {
    const res = makeRes();
    const answer = jest.fn().mockRejectedValue({ status: 503, message: 'upstream failure' });
    const handler = createTutorEndpointWithService(async () => makeService(answer));

    await handler(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json.mock.calls[0][0].code).toBe('AI_PROVIDER_ERROR');
  });

  it('never leaks internal error details', async () => {
    const res = makeRes();
    const answer = jest.fn().mockRejectedValue(new Error('secret internal stack'));
    const handler = createTutorEndpointWithService(async () => makeService(answer));

    await handler(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(JSON.stringify(res.json.mock.calls[0][0])).not.toContain('secret internal stack');
  });

  it('rejects empty questions (400 INVALID_REQUEST)', async () => {
    const res = makeRes();
    const handler = createTutorEndpointWithService(async () => makeService(jest.fn()));

    await handler(makeReq({ body: { question: '   ' } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].code).toBe('INVALID_REQUEST');
  });

  it('rejects questions longer than 500 characters', async () => {
    const res = makeRes();
    const handler = createTutorEndpointWithService(async () => makeService(jest.fn()));

    await handler(makeReq({ body: { question: 'a'.repeat(501) } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].code).toBe('INVALID_REQUEST');
  });

  it('rejects invalid mode/language/level enums', async () => {
    const handler = createTutorEndpointWithService(async () => makeService(jest.fn()));
    for (const body of [
      { question: 'q', mode: 'bogus' },
      { question: 'q', language: 'fr' },
      { question: 'q', level: 'expert' },
    ]) {
      const res = makeRes();
      await handler(makeReq({ body }), res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json.mock.calls[0][0].code).toBe('INVALID_REQUEST');
    }
  });

  it('rejects non-POST methods (405)', async () => {
    const res = makeRes();
    const handler = createTutorEndpointWithService(async () => makeService(jest.fn()));

    await handler(makeReq({ method: 'GET' }), res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json.mock.calls[0][0].code).toBe('METHOD_NOT_ALLOWED');
  });
});
