// M4 P0 — Ask the Book client error handling
// Maps fetch failures/timeouts/API error codes to user-friendly messages.
// Raw server/provider errors are never shown to the user.

export const ASK_TIMEOUT_MS = 25000;

export const ERROR_MESSAGES = {
  timeout: 'The AI service is taking too long to respond. Please try again.',
  quota: 'AI service quota is temporarily unavailable. Please try again later.',
  generic: 'Unable to process your question right now. Please try again.',
} as const;

export function getFriendlyErrorMessage(
  error: unknown,
  httpStatus?: number,
  apiCode?: string
): string {
  // Client-side abort (our timeout) — not a server error.
  if (error && typeof error === 'object' && (error as { name?: string }).name === 'AbortError') {
    return ERROR_MESSAGES.timeout;
  }

  // HTTP 429 / AI_QUOTA_EXCEEDED — quota or rate limit.
  if (httpStatus === 429 || apiCode === 'AI_QUOTA_EXCEEDED') {
    return ERROR_MESSAGES.quota;
  }

  return ERROR_MESSAGES.generic;
}
