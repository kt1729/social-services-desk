import { useState } from 'react';
import { useData } from '../../app/useData';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import CategoryBadge from '../../shared/components/CategoryBadge';
import { Link } from 'react-router-dom';
import type { ServiceDocument } from '../../shared/types';

export default function DocumentList() {
  const { documents, loading } = useData();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = documents.filter((d) => {
    if (typeFilter !== 'all' && d.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const typeIcon = (type: string) => {
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
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <Link
          to="/documents/new"
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Add Document
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 border rounded text-sm"
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="link">Link</option>
          <option value="internal">Internal</option>
          <option value="image">Image</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 border rounded text-sm"
        >
          <option value="all">All Categories</option>
          {[
            'housing',
            'food',
            'medical',
            'mental_health',
            'legal',
            'employment',
            'financial',
            'transportation',
            'clothing',
            'other',
          ].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No documents found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d: ServiceDocument) => (
            <Link
              key={d.id}
              to={`/documents/${d.id}`}
              className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">
                    {typeIcon(d.type)} {getTranslatedText(d.title, 'en')}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {getTranslatedText(d.description, 'en')}
                  </p>
                </div>
                <CategoryBadge category={d.category} />
              </div>
              <div className="flex gap-2 mt-2 text-xs text-gray-400">
                {d.languages?.en?.available && <span>🇺🇸</span>}
                {d.languages?.es?.available && <span>🇪🇸</span>}
                {d.languages?.zh?.available && <span>🇨🇳</span>}
                {d.languages?.ht?.available && <span>🇭🇹</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
