import Modal from './Modal';
import { SUPPORTED_LANGUAGES } from '../lib/languages';
import type { LanguageCode } from '../types';

interface LanguageSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (lang: LanguageCode) => void;
  defaultLang?: LanguageCode;
}

export default function LanguageSelector({
  open,
  onClose,
  onSelect,
  defaultLang = 'en',
}: LanguageSelectorProps) {
  return (
    <Modal open={open} onClose={onClose} title="Select Print Language">
      <div className="space-y-2">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              onSelect(lang.code);
              onClose();
            }}
            className={`w-full text-left px-4 py-3 rounded-md border text-sm ${
              lang.code === defaultLang
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            {lang.flag} {lang.label}
            {lang.code === defaultLang && ' (Default)'}
          </button>
        ))}
      </div>
    </Modal>
  );
}
