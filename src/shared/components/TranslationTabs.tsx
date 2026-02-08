import { SUPPORTED_LANGUAGES } from '../lib/languages';
import type { LanguageCode } from '../types';

interface TranslationTabsProps {
  activeLang: LanguageCode;
  onChange: (lang: LanguageCode) => void;
}

export default function TranslationTabs({ activeLang, onChange }: TranslationTabsProps) {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onChange(lang.code)}
          className={`px-3 py-2 text-sm ${
            activeLang === lang.code
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  );
}
