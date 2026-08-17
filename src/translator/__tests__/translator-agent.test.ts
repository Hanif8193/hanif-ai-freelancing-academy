// M6 — TranslatorAgentImpl tests (mocked provider, zero real API calls)

import { TranslatorAgentImpl } from '../TranslatorAgentImpl';
import type { TranslationProvider } from '../providers/interface';

function makeProvider(overrides: Partial<TranslationProvider> = {}): TranslationProvider & { translate: jest.Mock } {
  const translate = jest.fn().mockResolvedValue({
    translatedText: 'فری لانسنگ کیا ہے؟',
    preservedTerms: ['Freelancing'],
  });
  return {
    name: 'mock-translation',
    translate,
    ...overrides,
  } as TranslationProvider & { translate: jest.Mock };
}

describe('TranslatorAgentImpl', () => {
  it('exposes the provider name as the agent name', () => {
    const agent = new TranslatorAgentImpl(makeProvider());
    expect(agent.name).toBe('mock-translation');
  });

  it('translate: maps options onto the provider request and returns the M6 contract', async () => {
    const provider = makeProvider();
    const agent = new TranslatorAgentImpl(provider);

    const result = await agent.translate('What is freelancing?', 'en', 'ur', {
      preserveTerms: true,
      preserveMarkdown: true,
      level: 'beginner',
      context: 'Academy chapter on freelancing.',
    });

    expect(provider.translate).toHaveBeenCalledWith({
      text: 'What is freelancing?',
      sourceLanguage: 'en',
      targetLanguage: 'ur',
      preserveTechnicalTerms: true,
      preserveMarkdown: true,
      level: 'beginner',
      context: 'Academy chapter on freelancing.',
    });
    expect(result.translatedText).toBe('فری لانسنگ کیا ہے؟');
    expect(result.sourceLanguage).toBe('en');
    expect(result.targetLanguage).toBe('ur');
    expect(result.preservedTerms).toEqual(['Freelancing']);
  });

  it('translate: defaults preservation flags to true when options are omitted', async () => {
    const provider = makeProvider();
    const agent = new TranslatorAgentImpl(provider);

    await agent.translate('Hello', 'en', 'ur');

    expect(provider.translate).toHaveBeenCalledWith(
      expect.objectContaining({
        preserveTechnicalTerms: true,
        preserveMarkdown: true,
        level: undefined,
        context: undefined,
      })
    );
  });

  it('translate: supports Urdu → English', async () => {
    const provider = makeProvider();
    provider.translate.mockResolvedValueOnce({
      translatedText: 'What is freelancing?',
      preservedTerms: [],
    });
    const agent = new TranslatorAgentImpl(provider);

    const result = await agent.translate('فری لانسنگ کیا ہے؟', 'ur', 'en');

    expect(provider.translate).toHaveBeenCalledWith(
      expect.objectContaining({ sourceLanguage: 'ur', targetLanguage: 'en' })
    );
    expect(result.translatedText).toBe('What is freelancing?');
  });

  it('explain: requests an explanation for the learner level', async () => {
    const provider = makeProvider();
    const agent = new TranslatorAgentImpl(provider);

    await agent.explain('RAG is retrieval.', 'ur', 'beginner');

    expect(provider.translate).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'RAG is retrieval.',
        sourceLanguage: 'en',
        targetLanguage: 'ur',
        explain: true,
        level: 'beginner',
      })
    );
  });

  it('propagates provider errors (mapped by the endpoint with M4 P0 rules)', async () => {
    const provider = makeProvider();
    const quotaError = { status: 429, message: 'You exceeded your current quota. RESOURCE_EXHAUSTED' };
    provider.translate.mockRejectedValueOnce(quotaError);
    const agent = new TranslatorAgentImpl(provider);

    await expect(agent.translate('Hello', 'en', 'ur')).rejects.toMatchObject({ status: 429 });
  });
});
