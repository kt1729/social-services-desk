import type { CategoryKey, LanguageCode } from '../types';

export interface CategoryInfo {
  key: CategoryKey;
  icon: string;
  labels: Record<LanguageCode, string>;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    key: 'housing',
    icon: '🏠',
    labels: {
      en: 'Housing & Shelter',
      es: 'Vivienda y Refugio',
      zh: '住房与庇护',
      ht: 'Lojman ak Abri',
    },
  },
  {
    key: 'food',
    icon: '🍽️',
    labels: {
      en: 'Food & Meals',
      es: 'Alimentos y Comidas',
      zh: '食物与餐食',
      ht: 'Manje ak Repa',
    },
  },
  {
    key: 'medical',
    icon: '🏥',
    labels: {
      en: 'Medical & Health',
      es: 'Médico y Salud',
      zh: '医疗与健康',
      ht: 'Medikal ak Sante',
    },
  },
  {
    key: 'mental_health',
    icon: '🧠',
    labels: { en: 'Mental Health', es: 'Salud Mental', zh: '心理健康', ht: 'Sante Mantal' },
  },
  {
    key: 'legal',
    icon: '⚖️',
    labels: { en: 'Legal', es: 'Legal', zh: '法律', ht: 'Legal' },
  },
  {
    key: 'employment',
    icon: '💼',
    labels: { en: 'Employment', es: 'Empleo', zh: '就业', ht: 'Travay' },
  },
  {
    key: 'financial',
    icon: '💰',
    labels: {
      en: 'Financial Assistance',
      es: 'Asistencia Financiera',
      zh: '经济援助',
      ht: 'Asistans Finansye',
    },
  },
  {
    key: 'transportation',
    icon: '🚌',
    labels: { en: 'Transportation', es: 'Transporte', zh: '交通', ht: 'Transpò' },
  },
  {
    key: 'clothing',
    icon: '👕',
    labels: {
      en: 'Clothing & Essentials',
      es: 'Ropa y Artículos Esenciales',
      zh: '服装与必需品',
      ht: 'Rad ak Bagay Esansyèl',
    },
  },
  {
    key: 'other',
    icon: '📋',
    labels: { en: 'Other', es: 'Otro', zh: '其他', ht: 'Lòt' },
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<
  CategoryKey,
  CategoryInfo
>;

export function getCategoryLabel(key: CategoryKey, lang: LanguageCode = 'en'): string {
  return CATEGORY_MAP[key]?.labels[lang] ?? CATEGORY_MAP[key]?.labels.en ?? key;
}

export function getCategoryIcon(key: CategoryKey): string {
  return CATEGORY_MAP[key]?.icon ?? '📋';
}
