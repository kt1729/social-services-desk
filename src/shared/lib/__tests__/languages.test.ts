import { describe, it, expect } from 'vitest';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, NON_EN_LANGUAGES } from '../languages';

describe('SUPPORTED_LANGUAGES', () => {
  it('contains exactly 4 languages', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(4);
  });

  it('includes English, Spanish, Mandarin, and Haitian Creole', () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toEqual(['en', 'es', 'zh', 'ht']);
  });

  it('has a label and flag for each language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang.label).toBeTruthy();
      expect(lang.flag).toBeTruthy();
    }
  });
});

describe('LANGUAGE_LABELS', () => {
  it('maps all 4 language codes to labels', () => {
    expect(LANGUAGE_LABELS.en).toBe('English');
    expect(LANGUAGE_LABELS.es).toBe('Spanish');
    expect(LANGUAGE_LABELS.zh).toBe('Mandarin');
    expect(LANGUAGE_LABELS.ht).toBe('Haitian Creole');
  });
});

describe('NON_EN_LANGUAGES', () => {
  it('contains exactly 3 languages (excludes English)', () => {
    expect(NON_EN_LANGUAGES).toHaveLength(3);
  });

  it('does not include English', () => {
    expect(NON_EN_LANGUAGES).not.toContain('en');
  });

  it('includes es, zh, ht', () => {
    expect(NON_EN_LANGUAGES).toEqual(['es', 'zh', 'ht']);
  });
});
