import { PRINT_HEADERS } from '../../shared/lib/printHeaders';
import { LANGUAGE_LABELS } from '../../shared/lib/languages';
import { getCategoryLabel } from '../../shared/lib/categories';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import type { Guest, LanguageCode, Resource, ServiceDocument } from '../../shared/types';

interface PrintGuestSummaryProps {
  guest: Guest;
  lang: LanguageCode;
  resources: Resource[];
  documents: ServiceDocument[];
}

export default function PrintGuestSummary({
  guest,
  lang,
  resources,
  documents,
}: PrintGuestSummaryProps) {
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
        <hr className="border-gray-800 mb-4 mt-2" />

        <h2 className="text-base font-bold mb-1">
          {guest.firstName} {guest.lastInitial}.
        </h2>
        <p className="text-sm mb-1">Language: {LANGUAGE_LABELS[guest.preferredLanguage]}</p>
        <p className="text-sm mb-3">
          Needs: {guest.needs?.map((n) => getCategoryLabel(n, lang)).join(', ')}
        </p>

        {guest.visitLog?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Recent Visits:</p>
            {guest.visitLog.slice(-3).map((visit, i) => {
              const date = visit.date?.toDate?.()?.toLocaleDateString() ?? '';
              const referredResources = (visit.resourcesReferred ?? [])
                .map((rid) => resources.find((r) => r.id === rid))
                .filter(Boolean)
                .map((r) => getTranslatedText(r!.name, lang));
              const givenDocs = (visit.documentsGiven ?? [])
                .map((did) => documents.find((d) => d.id === did))
                .filter(Boolean)
                .map((d) => getTranslatedText(d!.title, lang));

              return (
                <div key={i} className="text-xs mb-2 border-l-2 border-gray-300 pl-2">
                  <p className="font-medium">
                    {date} — {visit.purpose}
                  </p>
                  {visit.notes && <p>{visit.notes}</p>}
                  {referredResources.length > 0 && <p>Resources: {referredResources.join(', ')}</p>}
                  {givenDocs.length > 0 && <p>Documents: {givenDocs.join(', ')}</p>}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-sm font-medium mb-2">{headers.notes}</p>
        <div className="space-y-3 mb-4">
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
