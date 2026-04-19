import { Link } from 'react-router-dom';
import { useData } from '../../app/useData';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import CategoryBadge from '../../shared/components/CategoryBadge';
import type { ServiceDocument } from '../../shared/types';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

interface DocumentCardProps {
  document: ServiceDocument;
}

function typeIcon(type: string): string {
  switch (type) {
    case 'pdf':
      return '📄';
    case 'link':
      return '🔗';
    case 'internal':
      return '📝';
    case 'image':
      return '🖼️';
    default:
      return '📄';
  }
}

export default function DocumentCard({ document: doc }: DocumentCardProps) {
  const { resources } = useData();
  const linkedResources = (doc.linkedResources ?? [])
    .map((rid) => resources.find((r) => r.id === rid))
    .filter(Boolean);

  return (
    <Link
      to={`/documents/${doc.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">
          {typeIcon(doc.type)} {getTranslatedText(doc.title, 'en')}
        </h3>
        <CategoryBadge category={doc.category} />
      </div>

      {getTranslatedText(doc.description, 'en') && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {stripHtml(getTranslatedText(doc.description, 'en'))}
        </p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
        {doc.languages?.en?.available && <span title="English">🇺🇸 EN</span>}
        {doc.languages?.es?.available && <span title="Spanish">🇪🇸 ES</span>}
        {doc.languages?.zh?.available && <span title="Chinese">🇨🇳 ZH</span>}
        {doc.languages?.ht?.available && <span title="Haitian Creole">🇭🇹 HT</span>}
      </div>

      {linkedResources.length > 0 && (
        <p className="text-xs text-gray-500">
          📎 Linked to {linkedResources.length} resource{linkedResources.length !== 1 ? 's' : ''}
        </p>
      )}
    </Link>
  );
}
