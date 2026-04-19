import { getTranslatedText } from '../../shared/lib/translationUtils';
import { getCategoryLabel } from '../../shared/lib/categories';
import { PRINT_HEADERS } from '../../shared/lib/printHeaders';
import { formatOperatingHours } from '../../shared/lib/operatingHours';
import type { Resource, LanguageCode } from '../../shared/types';

interface PrintResourceCardProps {
  resource: Resource;
  lang: LanguageCode;
}

export default function PrintResourceCard({ resource, lang }: PrintResourceCardProps) {
  const headers = PRINT_HEADERS[lang];
  const today = new Date().toLocaleDateString();

  return (
    <div
      className="hidden print-block max-w-md mx-auto p-8"
      data-lang={lang}
      style={{ fontFamily: lang === 'zh' ? "'Noto Sans SC', sans-serif" : 'inherit' }}
    >
      <div className="border-2 border-gray-800 p-6">
        <h1 className="text-lg font-bold text-center">{headers.title}</h1>
        <p className="text-sm text-center mb-4">{headers.subtitle}</p>
        <hr className="border-gray-800 mb-4" />

        <h2 className="text-base font-bold mb-1">{getTranslatedText(resource.name, lang)}</h2>
        <p className="text-sm mb-3">{getCategoryLabel(resource.category, lang)}</p>

        <div className="text-sm space-y-1 mb-4">
          {resource.address && <p>📍 {resource.address}</p>}
          {resource.phone && <p>📞 {resource.phone}</p>}
          {resource.email && <p>✉️ {resource.email}</p>}
          {resource.website && <p>🌐 {resource.website}</p>}
          {formatOperatingHours(resource.operatingHours ?? []).map((line) => (
            <p key={line}>🕐 {line}</p>
          ))}
        </div>

        <p className="text-sm mb-4">{getTranslatedText(resource.description, lang)}</p>

        <p className="text-sm font-medium mb-2">{headers.notes}</p>
        <div className="space-y-3 mb-4">
          <div className="border-b border-gray-400" />
          <div className="border-b border-gray-400" />
          <div className="border-b border-gray-400" />
        </div>

        <p className="text-xs text-right">
          {headers.date} {today}
        </p>
      </div>
    </div>
  );
}
