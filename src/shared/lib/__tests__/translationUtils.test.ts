import { describe, it, expect } from 'vitest';
import {
  computeTranslationStatus,
  computeAllTranslationStatuses,
  getTranslatedText,
} from '../translationUtils';

describe('computeTranslationStatus', () => {
  it('returns "missing" when no translatable fields provided', () => {
    expect(computeTranslationStatus([], 'es')).toBe('missing');
  });

  it('returns "missing" when target language has no translations', () => {
    const fields = [{ en: 'Hello' }, { en: 'World' }];
    expect(computeTranslationStatus(fields, 'es')).toBe('missing');
  });

  it('returns "complete" when all fields have target language translation', () => {
    const fields = [
      { en: 'Hello', es: 'Hola' },
      { en: 'World', es: 'Mundo' },
    ];
    expect(computeTranslationStatus(fields, 'es')).toBe('complete');
  });

  it('returns "partial" when some fields have target language translation', () => {
    const fields = [{ en: 'Hello', es: 'Hola' }, { en: 'World' }];
    expect(computeTranslationStatus(fields, 'es')).toBe('partial');
  });

  it('ignores whitespace-only translations', () => {
    const fields = [
      { en: 'Hello', es: '  ' },
      { en: 'World', es: 'Mundo' },
    ];
    expect(computeTranslationStatus(fields, 'es')).toBe('partial');
  });

  it('treats empty string as missing', () => {
    const fields = [{ en: 'Hello', zh: '' }];
    expect(computeTranslationStatus(fields, 'zh')).toBe('missing');
  });
});

describe('computeAllTranslationStatuses', () => {
  it('returns status for all non-English languages', () => {
    const fields = [
      { en: 'Hello', es: 'Hola', zh: '你好' },
      { en: 'World', es: 'Mundo' },
    ];
    const statuses = computeAllTranslationStatuses(fields);
    expect(statuses.es).toBe('complete');
    expect(statuses.zh).toBe('partial');
    expect(statuses.ht).toBe('missing');
  });

  it('returns all missing for English-only fields', () => {
    const fields = [{ en: 'Hello' }, { en: 'World' }];
    const statuses = computeAllTranslationStatuses(fields);
    expect(statuses.es).toBe('missing');
    expect(statuses.zh).toBe('missing');
    expect(statuses.ht).toBe('missing');
  });
});

describe('getTranslatedText', () => {
  it('returns text in the requested language', () => {
    const field = { en: 'Hello', es: 'Hola', zh: '你好', ht: 'Bonjou' };
    expect(getTranslatedText(field, 'es')).toBe('Hola');
    expect(getTranslatedText(field, 'zh')).toBe('你好');
  });

  it('falls back to English when target language is missing', () => {
    const field = { en: 'Hello' };
    expect(getTranslatedText(field, 'es')).toBe('Hello');
  });

  it('returns empty string for undefined field', () => {
    expect(getTranslatedText(undefined, 'en')).toBe('');
  });

  it('returns English text when requested', () => {
    const field = { en: 'Hello', es: 'Hola' };
    expect(getTranslatedText(field, 'en')).toBe('Hello');
  });
});
