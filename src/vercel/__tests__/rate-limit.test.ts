// M8 — Rate limiter tests (pure logic, no API calls)

import {
  clientKey,
  createFixedWindowLimiter,
  getDefaultRateLimiter,
  resetDefaultRateLimiter,
} from '../rate-limit';

describe('createFixedWindowLimiter', () => {
  it('allows requests under the max', () => {
    const limiter = createFixedWindowLimiter({ max: 2, windowMs: 60_000 });
    expect(limiter.check('a').allowed).toBe(true);
    expect(limiter.check('a').allowed).toBe(true);
  });

  it('denies requests over the max with retryAfterSeconds', () => {
    const limiter = createFixedWindowLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check('a').allowed).toBe(true);
    const denied = limiter.check('a');
    expect(denied.allowed).toBe(false);
    expect(denied.retryAfterSeconds).toBeGreaterThanOrEqual(1);
  });

  it('tracks keys independently', () => {
    const limiter = createFixedWindowLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check('a').allowed).toBe(true);
    expect(limiter.check('a').allowed).toBe(false);
    expect(limiter.check('b').allowed).toBe(true);
  });

  it('resets the window after windowMs', () => {
    jest.useFakeTimers();
    try {
      const limiter = createFixedWindowLimiter({ max: 1, windowMs: 1000 });
      expect(limiter.check('a').allowed).toBe(true);
      expect(limiter.check('a').allowed).toBe(false);
      jest.advanceTimersByTime(1001);
      expect(limiter.check('a').allowed).toBe(true);
    } finally {
      jest.useRealTimers();
    }
  });

  it('reset() clears all buckets', () => {
    const limiter = createFixedWindowLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check('a').allowed).toBe(true);
    expect(limiter.check('a').allowed).toBe(false);
    limiter.reset();
    expect(limiter.check('a').allowed).toBe(true);
  });
});

describe('getDefaultRateLimiter', () => {
  afterEach(() => {
    delete process.env.API_RATE_LIMIT_MAX;
    delete process.env.API_RATE_LIMIT_WINDOW_MS;
    resetDefaultRateLimiter();
  });

  it('uses env-configured limits', () => {
    process.env.API_RATE_LIMIT_MAX = '1';
    process.env.API_RATE_LIMIT_WINDOW_MS = '60000';
    resetDefaultRateLimiter();

    const limiter = getDefaultRateLimiter();
    expect(limiter.check('k').allowed).toBe(true);
    expect(limiter.check('k').allowed).toBe(false);
  });

  it('defaults to conservative limits without env', () => {
    const limiter = getDefaultRateLimiter();
    for (let i = 0; i < 30; i += 1) {
      expect(limiter.check(`default-${i}`).allowed).toBe(true);
    }
  });
});

describe('clientKey', () => {
  it('prefers the first X-Forwarded-For value', () => {
    const req = {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
      socket: { remoteAddress: '127.0.0.1' },
    } as never;
    expect(clientKey(req)).toBe('1.2.3.4');
  });

  it('falls back to the socket address', () => {
    const req = {
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    } as never;
    expect(clientKey(req)).toBe('127.0.0.1');
  });
});
