import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../../app/useData';
import GuestCard from './GuestCard';
import GuestForm from './GuestForm';
import type { ViewMode } from '../../app/Layout';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function GuestList() {
  const { guests, loading } = useData();
  const { viewMode } = useOutletContext<{ viewMode: ViewMode }>();
  const [showForm, setShowForm] = useState(false);
  const [recentCutoff] = useState(() => Date.now() - SEVEN_DAYS_MS);

  const filtered = useMemo(() => {
    if (viewMode === 'recent') {
      return guests.filter((g) => g.updatedAt?.toMillis?.() > recentCutoff);
    }
    return guests;
  }, [guests, viewMode, recentCutoff]);

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
        <h1 className="text-2xl font-bold text-gray-900">Guests</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Add Guest
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No guests found</p>
          <p className="text-sm">
            {viewMode === 'recent'
              ? 'No guests updated in the last 7 days.'
              : 'Add your first guest profile to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guest) => (
            <GuestCard key={guest.id} guest={guest} />
          ))}
        </div>
      )}

      <GuestForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
