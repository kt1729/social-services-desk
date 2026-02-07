import type {
  TranslatedField,
  TranslationStatus,
  TranslationStatusValue,
  LanguageCode,
} from '../types';
import { NON_EN_LANGUAGES } from './languages';

export function computeTranslationStatus(
  translatableFields: TranslatedField[],
  lang: Exclude<LanguageCode, 'en'>,
): TranslationStatusValue {
  if (translatableFields.length === 0) return 'missing';

  const filled = translatableFields.filter((f) => f[lang]?.trim());
  if (filled.length === 0) return 'missing';
  if (filled.length === translatableFields.length) return 'complete';
  return 'partial';
}

export function computeAllTranslationStatuses(
  translatableFields: TranslatedField[],
): TranslationStatus {
  const status: TranslationStatus = {};
  for (const lang of NON_EN_LANGUAGES) {
    status[lang] = computeTranslationStatus(translatableFields, lang);
  }
  return status;
}

export function getTranslatedText(field: TranslatedField | undefined, lang: LanguageCode): string {
  if (!field) return '';
  return field[lang] || field.en || '';
}
