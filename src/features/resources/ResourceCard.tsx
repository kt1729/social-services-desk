import { Link } from 'react-router-dom';
import type { Resource } from '../../shared/types';
import CategoryBadge from '../../shared/components/CategoryBadge';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import { formatOperatingHours } from '../../shared/lib/operatingHours';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const name = getTranslatedText(resource.name, 'en');
  const description = stripHtml(getTranslatedText(resource.description, 'en'));

  return (
    <Link
      to={`/resources/${resource.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <CategoryBadge category={resource.category} />
      </div>

      <div className="text-sm text-gray-500 space-y-1 mb-3">
        {resource.address && <p>📍 {resource.address}</p>}
        {resource.phone && <p>📞 {resource.phone}</p>}
        {resource.email && <p>✉️ {resource.email}</p>}
        {formatOperatingHours(resource.operatingHours ?? []).map((line) => (
          <p key={line}>🕐 {line}</p>
        ))}
      </div>

      {description && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>}

      {(resource.branches?.length ?? 0) > 0 && (
        <p className="text-xs text-indigo-600 font-medium mb-2">
          📍 {resource.branches!.length} location{resource.branches!.length !== 1 ? 's' : ''}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>👍 {resource.feedbackSummary?.upvotes ?? 0}</span>
        <span>👎 {resource.feedbackSummary?.downvotes ?? 0}</span>
        {resource.linkedDocuments?.length > 0 && (
          <span>
            📎 {resource.linkedDocuments.length} doc
            {resource.linkedDocuments.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </Link>
  );
}
