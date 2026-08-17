// M4 P0 — Error classification & mapping tests

import { isQuotaExceededError, mapProviderError } from '../errors';

describe('isQuotaExceededError', () => {
  it('detects Gemini RESOURCE_EXHAUSTED quota errors', () => {
    const error = {
      status: 429,
      message: 'You exceeded your current quota. status RESOURCE_EXHAUSTED',
    };
    expect(isQuotaExceededError(error)).toBe(true);
  });

  it('detects nested provider error bodies', () => {
    const error = {
      error: {
        code: 429,
        status: 'RESOURCE_EXHAUSTED',
        message: 'Quota exceeded for metric: embed_content_free_tier_requests',
      },
    };
    expect(isQuotaExceededError(error)).toBe(true);
  });

  it('does not flag transient rate limits as quota', () => {
    const error = { status: 429, message: 'RATE_LIMIT_EXCEEDED, please retry in 30s' };
    expect(isQuotaExceededError(error)).toBe(false);
  });

  it('does not flag unrelated errors', () => {
    expect(isQuotaExceededError(new Error('boom'))).toBe(false);
    expect(isQuotaExceededError(undefined)).toBe(false);
  });
});

describe('mapProviderError', () => {
  it('maps quota exceeded to HTTP 429 + AI_QUOTA_EXCEEDED', () => {
    const mapped = mapProviderError({
      status: 429,
      message: 'Quota exceeded for metric: embed_content_free_tier_requests, status RESOURCE_EXHAUSTED',
    });
    expect(mapped.statusCode).toBe(429);
    expect(mapped.code).toBe('AI_QUOTA_EXCEEDED');
    expect(mapped.error).toBe('AI service temporarily unavailable');
    expect(mapped.message).toContain('try again later');
  });

  it('maps provider 400 to AI_BAD_REQUEST', () => {
    const mapped = mapProviderError({ status: 400, message: 'invalid argument' });
    expect(mapped.statusCode).toBe(400);
    expect(mapped.code).toBe('AI_BAD_REQUEST');
  });

  it('maps provider 401 to AI_AUTH_ERROR', () => {
    const mapped = mapProviderError({ status: 401, message: 'unauthorized' });
    expect(mapped.code).toBe('AI_AUTH_ERROR');
    expect(mapped.statusCode).toBe(502);
  });

  it('maps provider 403 to AI_AUTH_ERROR', () => {
    const mapped = mapProviderError({ status: 403, message: 'forbidden' });
    expect(mapped.code).toBe('AI_AUTH_ERROR');
    expect(mapped.statusCode).toBe(502);
  });

  it('maps transient 429 (after retries) to AI_QUOTA_EXCEEDED', () => {
    const mapped = mapProviderError({ status: 429, message: 'RATE_LIMIT_EXCEEDED' });
    expect(mapped.code).toBe('AI_QUOTA_EXCEEDED');
    expect(mapped.statusCode).toBe(429);
  });

  it('maps provider 5xx to AI_PROVIDER_ERROR', () => {
    for (const status of [500, 502, 503, 504]) {
      const mapped = mapProviderError({ status, message: 'upstream failure' });
      expect(mapped.code).toBe('AI_PROVIDER_ERROR');
      expect(mapped.statusCode).toBe(502);
    }
  });

  it('maps unknown errors to INTERNAL_ERROR without leaking details', () => {
    const mapped = mapProviderError(new Error('secret internal stack'));
    expect(mapped.code).toBe('INTERNAL_ERROR');
    expect(mapped.statusCode).toBe(500);
    expect(JSON.stringify(mapped)).not.toContain('secret internal stack');
  });

  it('never leaks raw provider messages in any mapping', () => {
    const mapped = mapProviderError({ status: 503, message: 'secret provider internals stack=xyz' });
    expect(JSON.stringify(mapped)).not.toContain('secret provider internals');
  });
});
