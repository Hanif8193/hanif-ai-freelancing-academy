// M8 — Vercel function rate limiter (re-export)
// Implementation lives in src/vercel/rate-limit.ts (jest-testable).
export {
  createFixedWindowLimiter,
  getDefaultRateLimiter,
  resetDefaultRateLimiter,
  clientKey,
} from '../../src/vercel/rate-limit';
export type {
  RateLimiter,
  RateLimitResult,
  RateLimiterOptions,
} from '../../src/vercel/rate-limit';
