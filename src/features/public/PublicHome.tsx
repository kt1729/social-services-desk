import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { usePublicData } from './usePublicData';
import { CATEGORIES } from '../../shared/lib/categories';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import { formatOperatingHours } from '../../shared/lib/operatingHours';
import CategoryBadge from '../../shared/components/CategoryBadge';
import type { LanguageCode, CategoryKey } from '../../shared/types';

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function typeIcon(type: string): string {
  switch (type) {
    case 'pdf':
      return '\uD83D\uDCC4';
    case 'link':
      return '\uD83D\uDD17';
    case 'internal':
      return '\uD83D\uDCDD';
    case 'image':
      return '\uD83D\uDDBC\uFE0F';
    default:
      return '\uD83D\uDCC4';
  }
}

export default function PublicHome() {
  const { lang, search } = useOutletContext<{ lang: LanguageCode; search: string }>();
  const { resources, documents, tags, loading, error } = usePublicData();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  const searchTerm = search.trim().toLowerCase();

  const filteredResources = resources.filter((r) => {
    if (selectedCategory && r.category !== selectedCategory) return false;
    if (selectedTagIds.length > 0 && !selectedTagIds.some((tid) => (r.tagIds ?? []).includes(tid)))
      return false;
    if (!searchTerm) return true;
    const name = getTranslatedText(r.name, lang);
    const description = stripHtml(getTranslatedText(r.description, lang));
    const branchFields = (r.branches ?? []).flatMap((b) =>
      [b.label, b.address, b.phone, b.email].filter(Boolean),
    );
    const haystack = [name, description, r.address, r.phone, r.website, ...branchFields]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(searchTerm);
  });

  const filteredDocuments = documents.filter((d) => {
    if (selectedCategory && d.category !== selectedCategory) return false;
    if (selectedTagIds.length > 0 && !selectedTagIds.some((tid) => (d.tagIds ?? []).includes(tid)))
      return false;
    if (!searchTerm) return true;
    const title = getTranslatedText(d.title, lang);
    const description = stripHtml(getTranslatedText(d.description, lang));
    const haystack = [title, description].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(searchTerm);
  });

  function toggleTag(id: string) {
    setSelectedTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  const sortedTags = [...tags].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          {lang === 'en'
            ? 'All'
            : lang === 'es'
              ? 'Todos'
              : lang === 'zh'
                ? '\u5168\u90E8'
                : 'Tout'}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              selectedCategory === cat.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {cat.icon} {cat.labels[lang] || cat.labels.en}
          </button>
        ))}
      </div>

      {/* Tag Filter Pills */}
      {sortedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {sortedTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                selectedTagIds.includes(tag.id)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      {/* Resources Section */}
      {filteredResources.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {lang === 'en'
              ? 'Resources'
              : lang === 'es'
                ? 'Recursos'
                : lang === 'zh'
                  ? '\u8D44\u6E90'
                  : 'Resous'}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                to={`/public/resources/${resource.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {getTranslatedText(resource.name, lang)}
                  </h3>
                  <CategoryBadge category={resource.category} lang={lang} />
                </div>
                <div className="text-sm text-gray-500 space-y-1 mb-2">
                  {resource.address && <p>{resource.address}</p>}
                  {resource.phone && <p>{resource.phone}</p>}
                  {formatOperatingHours(resource.operatingHours ?? []).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                {getTranslatedText(resource.description, lang) && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {stripHtml(getTranslatedText(resource.description, lang))}
                  </p>
                )}
                {(resource.tagIds ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(resource.tagIds ?? [])
                      .map((tid) => tags.find((t) => t.id === tid))
                      .filter((t): t is NonNullable<typeof t> => t !== undefined)
                      .map((t) => (
                        <span
                          key={t.id}
                          className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs"
                        >
                          {t.label}
                        </span>
                      ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Documents Section */}
      {filteredDocuments.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {lang === 'en'
              ? 'Documents'
              : lang === 'es'
                ? 'Documentos'
                : lang === 'zh'
                  ? '\u6587\u4EF6'
                  : 'Dokiman'}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredDocuments.map((doc) => (
              <Link
                key={doc.id}
                to={`/public/documents/${doc.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {typeIcon(doc.type)} {getTranslatedText(doc.title, lang)}
                  </h3>
                  <CategoryBadge category={doc.category} lang={lang} />
                </div>
                {getTranslatedText(doc.description, lang) && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {stripHtml(getTranslatedText(doc.description, lang))}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {doc.languages?.en?.available && <span>EN</span>}
                  {doc.languages?.es?.available && <span>ES</span>}
                  {doc.languages?.zh?.available && <span>ZH</span>}
                  {doc.languages?.ht?.available && <span>HT</span>}
                </div>
                {(doc.tagIds ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(doc.tagIds ?? [])
                      .map((tid) => tags.find((t) => t.id === tid))
                      .filter((t): t is NonNullable<typeof t> => t !== undefined)
                      .map((t) => (
                        <span
                          key={t.id}
                          className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs"
                        >
                          {t.label}
                        </span>
                      ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {filteredResources.length === 0 && filteredDocuments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {lang === 'en'
            ? 'No items found for this category.'
            : lang === 'es'
              ? 'No se encontraron elementos para esta categor\u00EDa.'
              : lang === 'zh'
                ? '\u672A\u627E\u5230\u8BE5\u7C7B\u522B\u7684\u9879\u76EE\u3002'
                : 'Pa gen atik ki jwenn pou kategori sa a.'}
        </div>
      )}
    </div>
  );
}
