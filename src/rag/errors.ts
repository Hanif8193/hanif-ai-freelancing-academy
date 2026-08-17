// M4 P0 — Provider error classification and API error mapping
// Maps provider errors (Gemini/OpenAI) to stable, user-safe API responses.
// Never expose raw provider messages, stack traces, or API keys to the browser.

export type AIErrorCode =
  | 'AI_QUOTA_EXCEEDED'
  | 'AI_BAD_REQUEST'
  | 'AI_AUTH_ERROR'
  | 'AI_PROVIDER_ERROR'
  | 'INTERNAL_ERROR';

export interface MappedError {
  statusCode: number;
  code: AIErrorCode;
  /** Short human-readable label for the response `error` field. */
  error: string;
  /** User-safe message that can be shown in the UI. */
  message: string;
}

// ============================================================
// Error classification
// ============================================================

const QUOTA_PATTERN = /quota|resource_exhausted|billing/i;

function readMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>;
    const parts: string[] = [];
    for (const key of ['message', 'status']) {
      const value = e[key];
      if (typeof value === 'string') {
        parts.push(value);
      }
    }
    const nested = e.error;
    if (nested && typeof nested === 'object') {
      parts.push(JSON.stringify(nested));
    }
    return parts.join(' ');
  }
  return '';
}

function readProviderStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }
  const e = error as Record<string, unknown>;
  for (const key of ['status', 'statusCode', 'code']) {
    const value = e[key];
    if (typeof value === 'number' && value >= 100 && value <= 599) {
      return value;
    }
    if (typeof value === 'string' && /^\d{3}$/.test(value)) {
      return Number(value);
    }
  }
  // Some SDKs nest the provider status, e.g. { error: { code: 429 } }
  const nested = e.error;
  if (nested && typeof nested === 'object') {
    const n = nested as Record<string, unknown>;
    if (typeof n.code === 'number' && n.code >= 100 && n.code <= 599) {
      return n.code;
    }
    if (typeof n.status === 'number' && n.status >= 100 && n.status <= 599) {
      return n.status;
    }
  }
  return undefined;
}

/**
 * True when the provider reported an exhausted account quota
 * (Gemini RESOURCE_EXHAUSTED / "You exceeded your current quota").
 * These errors will NOT recover within seconds, so callers should fail fast
 * instead of retrying.
 */
export function isQuotaExceededError(error: unknown): boolean {
  return QUOTA_PATTERN.test(readMessage(error));
}

// ============================================================
// API error mapping
// ============================================================

export function mapProviderError(error: unknown): MappedError {
  const status = readProviderStatus(error);

  // Quota exhausted / RESOURCE_EXHAUSTED — fail fast, always surface as 429.
  if (isQuotaExceededError(error)) {
    return {
      statusCode: 429,
      code: 'AI_QUOTA_EXCEEDED',
      error: 'AI service temporarily unavailable',
      message: 'The AI service quota is temporarily unavailable. Please try again later.',
    };
  }

  switch (status) {
    case 400:
      return {
        statusCode: 400,
        code: 'AI_BAD_REQUEST',
        error: 'Invalid AI request',
        message: 'The AI service rejected the request. Please try rephrasing your question.',
      };
    case 401:
    case 403:
      return {
        statusCode: 502,
        code: 'AI_AUTH_ERROR',
        error: 'AI service authentication failed',
        message: 'The AI service could not be authenticated. Please try again later.',
      };
    case 429:
      // Transient rate limit that survived retries — still surfaced as quota/rate limit.
      return {
        statusCode: 429,
        code: 'AI_QUOTA_EXCEEDED',
        error: 'AI service temporarily unavailable',
        message: 'The AI service quota is temporarily unavailable. Please try again later.',
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        statusCode: 502,
        code: 'AI_PROVIDER_ERROR',
        error: 'AI service error',
        message: 'The AI service is temporarily unavailable. Please try again later.',
      };
    default:
      // Non-provider error (bug, internal failure). Never leak details.
      return {
        statusCode: 500,
        code: 'INTERNAL_ERROR',
        error: 'Internal error',
        message: 'Something went wrong. Please try again.',
      };
  }
}
