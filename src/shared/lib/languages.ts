import type { LanguageCode } from '../types';

export type NonEnLanguageCode = Exclude<LanguageCode, 'en'>;

export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'zh', label: 'Mandarin', flag: '🇨🇳' },
  { code: 'ht', label: 'Haitian Creole', flag: '🇭🇹' },
];

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'English',
  es: 'Spanish',
  zh: 'Mandarin',
  ht: 'Haitian Creole',
};

export const NON_EN_LANGUAGES: NonEnLanguageCode[] = ['es', 'zh', 'ht'];
