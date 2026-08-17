// M8 — Per-instance rate limiting
//
// Conservative protection for the Vercel function edge. This is a simple
// fixed-window, in-memory limiter scoped to ONE serverless instance — it is
// NOT a distributed limiter. The `RateLimiter` interface is the seam: a
// hosted limiter (e.g. Upstash Redis) can replace `createFixedWindowLimiter`
// later without touching the adapter or the API routes.

import type { IncomingMessage } from 'http';

// ============================================================
// Interface (replaceable)
// ============================================================

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds the client should wait before retrying (set when denied). */
  retryAfterSeconds?: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
  /** Test hook: clear all buckets. */
  reset(): void;
}

export interface RateLimiterOptions {
  /** Maximum requests per window per key (default 30). */
  max?: number;
  /** Window length in milliseconds (default 60_000). */
  windowMs?: number;
}

// ============================================================
// Fixed-window implementation
// ============================================================

export function createFixedWindowLimiter(options: RateLimiterOptions = {}): RateLimiter {
  const max = options.max ?? 30;
  const windowMs = options.windowMs ?? 60_000;
  const buckets = new Map<string, { count: number; windowStart: number }>();

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const bucket = buckets.get(key);

      if (!bucket || now - bucket.windowStart >= windowMs) {
        buckets.set(key, { count: 1, windowStart: now });
        return { allowed: true };
      }

      if (bucket.count >= max) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil((bucket.windowStart + windowMs - now) / 1000)
        );
        return { allowed: false, retryAfterSeconds };
      }

      bucket.count += 1;
      return { allowed: true };
    },

    reset(): void {
      buckets.clear();
    },
  };
}

// ============================================================
// Shared instance + env configuration
// ============================================================

const DEFAULT_MAX = 30;
const DEFAULT_WINDOW_MS = 60_000;

let sharedLimiter: RateLimiter | null = null;

/**
 * The shared limiter used by every API route unless a route supplies its own.
 * Configured via API_RATE_LIMIT_MAX / API_RATE_LIMIT_WINDOW_MS.
 */
export function getDefaultRateLimiter(): RateLimiter {
  if (!sharedLimiter) {
    const max = Number(process.env.API_RATE_LIMIT_MAX) || DEFAULT_MAX;
    const windowMs = Number(process.env.API_RATE_LIMIT_WINDOW_MS) || DEFAULT_WINDOW_MS;
    sharedLimiter = createFixedWindowLimiter({ max, windowMs });
  }
  return sharedLimiter;
}

/** Test hook: reset the shared limiter (e.g. when env changes between tests). */
export function resetDefaultRateLimiter(): void {
  sharedLimiter = null;
}

/**
 * Best-effort client identifier: first X-Forwarded-For value (Vercel sets
 * this) with a fallback to the socket address.
 */
export function clientKey(req: IncomingMessage): string {
  const xff = req.headers['x-forwarded-for'];
  const first = Array.isArray(xff) ? xff[0] : xff?.split(',')[0]?.trim();
  return first || req.socket.remoteAddress || 'unknown';
}
