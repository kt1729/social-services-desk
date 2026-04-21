import DOMPurify from 'dompurify';
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
  const descriptionHtml = DOMPurify.sanitize(getTranslatedText(resource.description, lang));

  return (
    <div
      className="hidden print-block"
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

        {descriptionHtml && (
          <div
            className="text-sm mb-4 prose prose-sm max-w-none [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}

        {(resource.branches?.length ?? 0) > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">{headers.locations}</p>
            <div className="space-y-2">
              {resource.branches!.map((branch) => (
                <div key={branch.id} className="text-sm pl-2 border-l-2 border-gray-400">
                  <p className="font-medium">{branch.label}</p>
                  {branch.address && <p>📍 {branch.address}</p>}
                  {branch.phone && <p>📞 {branch.phone}</p>}
                  {formatOperatingHours(branch.operatingHours ?? []).map((line) => (
                    <p key={line}>🕐 {line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

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
