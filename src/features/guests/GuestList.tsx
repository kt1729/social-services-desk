import { useState } from 'react';
import { useData } from '../../app/useData';
import GuestCard from './GuestCard';
import GuestForm from './GuestForm';

export default function GuestList() {
  const { guests, loading } = useData();
  const [showForm, setShowForm] = useState(false);

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

      {guests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No guests found</p>
          <p className="text-sm">Add your first guest profile to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guests.map((guest) => (
            <GuestCard key={guest.id} guest={guest} />
          ))}
        </div>
      )}

      <GuestForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
