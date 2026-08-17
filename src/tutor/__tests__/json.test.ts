// M5 — JSON extraction helper tests

import { extractJsonObject, extractJsonObjectStrict } from '../json';

describe('extractJsonObject', () => {
  it('parses plain JSON', () => {
    expect(extractJsonObject('{"a":1}')).toEqual({ a: 1 });
  });

  it('parses JSON wrapped in prose', () => {
    const text = 'Here is your answer: {"explanation":"simple","example":"demo"} — hope that helps!';
    expect(extractJsonObject(text)).toEqual({ explanation: 'simple', example: 'demo' });
  });

  it('parses JSON inside markdown code fences', () => {
    const text = '```json\n{"quiz":[{"question":"q"}]}\n```';
    expect(extractJsonObject(text)).toEqual({ quiz: [{ question: 'q' }] });
  });

  it('handles strings containing braces and quotes', () => {
    const text = 'Result: {"feedback":"say \\"hi\\" {not json}"}';
    expect(extractJsonObject(text)).toEqual({ feedback: 'say "hi" {not json}' });
  });

  it('returns null for garbage', () => {
    expect(extractJsonObject('no json here')).toBeNull();
    expect(extractJsonObject('')).toBeNull();
    expect(extractJsonObject('{"broken": }')).toBeNull();
  });

  it('parses arrays', () => {
    expect(extractJsonObject('[1,2,3]')).toEqual([1, 2, 3]);
  });
});

describe('extractJsonObjectStrict', () => {
  it('returns only plain objects', () => {
    expect(extractJsonObjectStrict('{"a":1}')).toEqual({ a: 1 });
    expect(extractJsonObjectStrict('[1,2]')).toBeNull();
    expect(extractJsonObjectStrict('"string"')).toBeNull();
  });
});
