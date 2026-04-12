import { useParams, Link, useOutletContext } from 'react-router-dom';
import { usePublicData } from './usePublicData';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import { formatOperatingHours } from '../../shared/lib/operatingHours';
import CategoryBadge from '../../shared/components/CategoryBadge';
import type { LanguageCode } from '../../shared/types';

export default function PublicResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useOutletContext<{ lang: LanguageCode }>();
  const { resources, documents, loading } = usePublicData();

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  const resource = resources.find((r) => r.id === id);
  if (!resource) {
    return (
      <div className="text-center py-12 text-gray-500">
        {lang === 'en'
          ? 'Resource not found.'
          : lang === 'es'
            ? 'Recurso no encontrado.'
            : lang === 'zh'
              ? '\u627E\u4E0D\u5230\u8BE5\u8D44\u6E90\u3002'
              : 'Resous pa jwenn.'}
      </div>
    );
  }

  const linkedDocs = documents.filter((d) => resource.linkedDocuments?.includes(d.id));

  return (
    <div>
      <Link to="/public" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        &larr;{' '}
        {lang === 'en'
          ? 'Back'
          : lang === 'es'
            ? 'Volver'
            : lang === 'zh'
              ? '\u8FD4\u56DE'
              : 'Retounen'}
      </Link>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getTranslatedText(resource.name, lang)}
          </h1>
          <CategoryBadge category={resource.category} lang={lang} />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm space-y-1">
        {resource.address && <p>{resource.address}</p>}
        {resource.phone && (
          <p>
            <a href={`tel:${resource.phone}`} className="text-blue-600 hover:underline">
              {resource.phone}
            </a>
          </p>
        )}
        {resource.website && (
          <p>
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {resource.website}
            </a>
          </p>
        )}
        {formatOperatingHours(resource.operatingHours ?? []).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      {getTranslatedText(resource.description, lang) && (
        <p className="text-gray-700 mb-6">{getTranslatedText(resource.description, lang)}</p>
      )}

      {linkedDocs.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">
            {lang === 'en'
              ? 'Related Documents'
              : lang === 'es'
                ? 'Documentos Relacionados'
                : lang === 'zh'
                  ? '\u76F8\u5173\u6587\u4EF6'
                  : 'Dokiman ki gen rapò'}
          </h2>
          <div className="space-y-2">
            {linkedDocs.map((d) => (
              <Link
                key={d.id}
                to={`/public/documents/${d.id}`}
                className="block text-sm text-blue-600 hover:underline"
              >
                {getTranslatedText(d.title, lang)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
