// M4 P0 — Ask the Book client error handling tests

import {
  ASK_TIMEOUT_MS,
  ERROR_MESSAGES,
  getFriendlyErrorMessage,
} from '../ask-the-book-errors';

describe('getFriendlyErrorMessage', () => {
  it('returns the timeout message for an AbortError', () => {
    // Matches the shape of a DOMException thrown by AbortController.abort().
    expect(getFriendlyErrorMessage({ name: 'AbortError' })).toBe(ERROR_MESSAGES.timeout);
  });

  it('returns the quota message for HTTP 429', () => {
    expect(getFriendlyErrorMessage(null, 429)).toBe(ERROR_MESSAGES.quota);
  });

  it('returns the quota message for the AI_QUOTA_EXCEEDED code', () => {
    expect(getFriendlyErrorMessage(null, 500, 'AI_QUOTA_EXCEEDED')).toBe(ERROR_MESSAGES.quota);
  });

  it('returns the generic message for other server errors', () => {
    expect(getFriendlyErrorMessage(null, 500)).toBe(ERROR_MESSAGES.generic);
    expect(getFriendlyErrorMessage(null, 502, 'AI_PROVIDER_ERROR')).toBe(ERROR_MESSAGES.generic);
  });

  it('never surfaces raw server/provider error text', () => {
    const message = getFriendlyErrorMessage(new Error('secret provider internals'));
    expect(message).not.toContain('secret provider internals');
    expect(message).toBe(ERROR_MESSAGES.generic);
  });
});

describe('ASK_TIMEOUT_MS', () => {
  it('is 25 seconds (20–30s target)', () => {
    expect(ASK_TIMEOUT_MS).toBe(25000);
  });
});
