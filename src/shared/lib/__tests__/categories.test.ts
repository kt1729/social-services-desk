import { describe, it, expect } from 'vitest';
import { CATEGORIES, CATEGORY_MAP, getCategoryLabel, getCategoryIcon } from '../categories';

describe('CATEGORIES', () => {
  it('contains exactly 10 categories', () => {
    expect(CATEGORIES).toHaveLength(10);
  });

  it('includes all expected category keys', () => {
    const keys = CATEGORIES.map((c) => c.key);
    expect(keys).toEqual([
      'housing',
      'food',
      'medical',
      'mental_health',
      'legal',
      'employment',
      'financial',
      'transportation',
      'clothing',
      'other',
    ]);
  });

  it('has translations for all 4 languages in every category', () => {
    for (const cat of CATEGORIES) {
      expect(cat.labels.en).toBeTruthy();
      expect(cat.labels.es).toBeTruthy();
      expect(cat.labels.zh).toBeTruthy();
      expect(cat.labels.ht).toBeTruthy();
    }
  });

  it('has an icon for every category', () => {
    for (const cat of CATEGORIES) {
      expect(cat.icon).toBeTruthy();
    }
  });
});

describe('CATEGORY_MAP', () => {
  it('maps all category keys', () => {
    expect(CATEGORY_MAP.housing.labels.en).toBe('Housing & Shelter');
    expect(CATEGORY_MAP.food.labels.en).toBe('Food & Meals');
    expect(CATEGORY_MAP.other.labels.en).toBe('Other');
  });
});

describe('getCategoryLabel', () => {
  it('returns English label by default', () => {
    expect(getCategoryLabel('housing')).toBe('Housing & Shelter');
  });

  it('returns translated label for specified language', () => {
    expect(getCategoryLabel('food', 'es')).toBe('Alimentos y Comidas');
    expect(getCategoryLabel('medical', 'zh')).toBe('医疗与健康');
    expect(getCategoryLabel('legal', 'ht')).toBe('Legal');
  });
});

describe('getCategoryIcon', () => {
  it('returns correct icon for known categories', () => {
    expect(getCategoryIcon('housing')).toBe('🏠');
    expect(getCategoryIcon('food')).toBe('🍽️');
    expect(getCategoryIcon('medical')).toBe('🏥');
  });

  it('returns fallback icon for unknown category', () => {
    expect(getCategoryIcon('nonexistent' as never)).toBe('📋');
  });
});
