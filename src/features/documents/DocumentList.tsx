import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../../app/useData';
import { CATEGORIES } from '../../shared/lib/categories';
import DocumentCard from './DocumentCard';
import DocumentForm from './DocumentForm';
import type { ViewMode } from '../../app/Layout';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function DocumentList() {
  const { documents, loading } = useData();
  const { viewMode } = useOutletContext<{ viewMode: ViewMode }>();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [recentCutoff] = useState(() => Date.now() - SEVEN_DAYS_MS);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      if (typeFilter !== 'all' && d.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
      if (viewMode === 'recent' && !(d.updatedAt?.toMillis?.() > recentCutoff)) return false;
      return true;
    });
  }, [documents, typeFilter, categoryFilter, viewMode, recentCutoff]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Add Document
        </button>
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
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.icon} {c.labels.en}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No documents found</p>
          <p className="text-sm">Add your first document to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}

      <DocumentForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
