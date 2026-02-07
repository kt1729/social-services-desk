import { useState } from 'react';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { useAuth } from '../auth/useAuth';
import { useData } from '../../app/useData';
import Modal from '../../shared/components/Modal';
import { getTranslatedText } from '../../shared/lib/translationUtils';

interface LogVisitFormProps {
  open: boolean;
  onClose: () => void;
  guestId: string;
}

export default function LogVisitForm({ open, onClose, guestId }: LogVisitFormProps) {
  const { user } = useAuth();
  const { resources, documents } = useData();
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      await updateDoc(doc(db, 'guests', guestId), {
        visitLog: arrayUnion({
          date: Timestamp.now(),
          purpose,
          volunteerId: user.uid,
          notes,
          resourcesReferred: selectedResources,
          documentsGiven: selectedDocs,
        }),
        updatedAt: Timestamp.now(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const toggleResource = (id: string) => {
    setSelectedResources((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleDoc = (id: string) => {
    setSelectedDocs((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  return (
    <Modal open={open} onClose={onClose} title="Log Visit">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
          <input
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Housing assistance, food help, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Any details about this visit..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resources Referred</label>
          <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2">
            {resources.map((r) => (
              <label key={r.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedResources.includes(r.id)}
                  onChange={() => toggleResource(r.id)}
                />
                {getTranslatedText(r.name, 'en')}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Documents Given</label>
          <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2">
            {documents.map((d) => (
              <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(d.id)}
                  onChange={() => toggleDoc(d.id)}
                />
                {getTranslatedText(d.title, 'en')}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Log Visit'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
