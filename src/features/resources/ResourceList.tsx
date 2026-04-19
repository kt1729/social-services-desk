import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { collection, getDocs, query, updateDoc, doc, where, deleteField } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { useData } from '../../app/useData';
import { useAuth } from '../auth/useAuth';
import ResourceCard from './ResourceCard';
import ResourceForm from './ResourceForm';
import type { CategoryKey, Resource } from '../../shared/types';
import type { ViewMode } from '../../app/Layout';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function ResourceList() {
  const { resources, loading } = useData();
  const { isAdmin } = useAuth();
  const { selectedCategory, viewMode } = useOutletContext<{
    selectedCategory: CategoryKey | null;
    viewMode: ViewMode;
  }>();
  const [showForm, setShowForm] = useState(false);
  const [recentCutoff] = useState(() => Date.now() - SEVEN_DAYS_MS);
  const [showDeleted, setShowDeleted] = useState(false);
  const [deletedResources, setDeletedResources] = useState<Resource[]>([]);
  const [loadingDeleted, setLoadingDeleted] = useState(false);

  async function handleToggleDeleted() {
    if (!showDeleted && deletedResources.length === 0) {
      setLoadingDeleted(true);
      const snap = await getDocs(
        query(collection(db, 'resources'), where('active', '==', false)),
      );
      setDeletedResources(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Resource, 'id'>) })),
      );
      setLoadingDeleted(false);
    }
    setShowDeleted((prev) => !prev);
  }

  async function handleRestore(id: string) {
    await updateDoc(doc(db, 'resources', id), {
      active: true,
      deletedAt: deleteField(),
    });
    setDeletedResources((prev) => prev.filter((r) => r.id !== id));
  }

  const filtered = useMemo(() => {
    let result = selectedCategory
      ? resources.filter((r) => r.category === selectedCategory)
      : resources;

    if (viewMode === 'recent') {
      result = result.filter((r) => r.updatedAt?.toMillis?.() > recentCutoff);
    }

    return result;
  }, [resources, selectedCategory, viewMode, recentCutoff]);

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
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={handleToggleDeleted}
              className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {showDeleted ? 'Hide deleted' : 'Show deleted'}
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + Add Resource
          </button>
        </div>
      </div>

      {showDeleted && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Deleted Resources
          </h2>
          {loadingDeleted ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : deletedResources.length === 0 ? (
            <p className="text-sm text-gray-400">No deleted resources.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deletedResources.map((resource) => (
                <div key={resource.id} className="opacity-50 relative">
                  <ResourceCard resource={resource} />
                  <div className="absolute inset-0 flex items-end justify-center pb-3 bg-transparent">
                    <button
                      onClick={() => handleRestore(resource.id)}
                      className="px-3 py-1.5 text-xs text-white bg-green-600 rounded-md hover:bg-green-700 shadow"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
