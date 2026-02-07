import { useState } from 'react';
import { useData } from '../../app/useData';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import {
  NON_EN_LANGUAGES,
  LANGUAGE_LABELS,
  type NonEnLanguageCode,
} from '../../shared/lib/languages';

function statusIcon(status: string | undefined): string {
  switch (status) {
    case 'complete':
      return '✅';
    case 'partial':
      return '⚠️';
    default:
      return '❌';
  }
}

export default function TranslationDashboard() {
  const { resources, documents } = useData();
  const [missingOnly, setMissingOnly] = useState(false);

  const allItems = [
    ...resources.map((r) => ({
      id: r.id,
      type: 'Resource' as const,
      name: getTranslatedText(r.name, 'en'),
      status: r.translationStatus,
    })),
    ...documents.map((d) => ({
      id: d.id,
      type: 'Document' as const,
      name: getTranslatedText(d.title, 'en'),
      status: d.translationStatus,
    })),
  ];

  const filtered = missingOnly
    ? allItems.filter((item) =>
        NON_EN_LANGUAGES.some(
          (lang) => (item.status as Record<NonEnLanguageCode, string>)?.[lang] !== 'complete',
        ),
      )
    : allItems;

  const percentages = NON_EN_LANGUAGES.map((lang) => {
    const total = allItems.length;
    if (total === 0) return { lang, pct: 0 };
    const complete = allItems.filter(
      (i) => (i.status as Record<NonEnLanguageCode, string>)?.[lang] === 'complete',
    ).length;
    return { lang, pct: Math.round((complete / total) * 100) };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Translation Status</h1>

      <div className="flex items-center gap-6 mb-6">
        {percentages.map(({ lang, pct }) => (
          <div key={lang} className="text-center">
            <div className="text-2xl font-bold">{pct}%</div>
            <div className="text-xs text-gray-500">{LANGUAGE_LABELS[lang]}</div>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2 mb-4 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={missingOnly}
          onChange={(e) => setMissingOnly(e.target.checked)}
        />
        Missing translations only
      </label>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4">Item</th>
              <th className="text-left py-2 pr-4">Type</th>
              {NON_EN_LANGUAGES.map((lang) => (
                <th key={lang} className="text-center py-2 px-2">
                  {LANGUAGE_LABELS[lang]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={`${item.type}-${item.id}`} className="border-b">
                <td className="py-2 pr-4">{item.name || '(untitled)'}</td>
                <td className="py-2 pr-4 text-gray-500">{item.type}</td>
                {NON_EN_LANGUAGES.map((lang) => (
                  <td key={lang} className="text-center py-2 px-2">
                    {statusIcon((item.status as Record<NonEnLanguageCode, string>)?.[lang])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          {missingOnly ? 'All translations are complete!' : 'No items yet.'}
        </p>
      )}
    </div>
  );
}
