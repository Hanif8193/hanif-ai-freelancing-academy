// M5 — JSON extraction helper
// LLMs sometimes wrap JSON in prose or code fences. This extracts the first
// balanced JSON value from model output and parses it defensively.

export function extractJsonObject<T = object>(text: string): T | null {
  if (!text) return null;

  const trimmed = text.trim();

  // Direct parse first.
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // fall through
  }

  // Strip common code fences.
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim()) as T;
    } catch {
      // fall through
    }
  }

  // Extract the first balanced { ... } or [ ... ] block.
  const start = trimmed.search(/[\[{]/);
  if (start === -1) return null;

  const openChar = trimmed[start];
  const closeChar = openChar === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === openChar) {
      depth++;
    } else if (ch === closeChar) {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(trimmed.slice(start, i + 1)) as T;
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

/** Convenience: parse and validate that the result is an object. */
export function extractJsonObjectStrict<T extends object>(text: string): T | null {
  const parsed = extractJsonObject<T>(text);
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
}
