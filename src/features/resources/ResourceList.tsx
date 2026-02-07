import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../../app/useData';
import ResourceCard from './ResourceCard';
import ResourceForm from './ResourceForm';
import type { CategoryKey } from '../../shared/types';

export default function ResourceList() {
  const { resources, loading } = useData();
  const { selectedCategory } = useOutletContext<{ selectedCategory: CategoryKey | null }>();
  const [showForm, setShowForm] = useState(false);

  const filtered = selectedCategory
    ? resources.filter((r) => r.category === selectedCategory)
    : resources;

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
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Add Resource
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No resources found</p>
          <p className="text-sm">Add your first resource to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      <ResourceForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
