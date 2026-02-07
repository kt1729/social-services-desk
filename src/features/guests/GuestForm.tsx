import { useState } from 'react';
import { addDoc, updateDoc, doc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { useAuth } from '../auth/useAuth';
import Modal from '../../shared/components/Modal';
import { SUPPORTED_LANGUAGES } from '../../shared/lib/languages';
import { CATEGORIES } from '../../shared/lib/categories';
import type { Guest, CategoryKey, LanguageCode } from '../../shared/types';

interface GuestFormProps {
  open: boolean;
  onClose: () => void;
  guest?: Guest;
}

export default function GuestForm({ open, onClose, guest }: GuestFormProps) {
  const { user } = useAuth();
  const isEdit = !!guest;

  const [firstName, setFirstName] = useState(guest?.firstName ?? '');
  const [lastInitial, setLastInitial] = useState(guest?.lastInitial ?? '');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(
    guest?.preferredLanguage ?? 'en',
  );
  const [needs, setNeeds] = useState<CategoryKey[]>(guest?.needs ?? []);
  const [saving, setSaving] = useState(false);

  const toggleNeed = (key: CategoryKey) => {
    setNeeds((prev) => (prev.includes(key) ? prev.filter((n) => n !== key) : [...prev, key]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      if (isEdit && guest) {
        await updateDoc(doc(db, 'guests', guest.id), {
          firstName,
          lastInitial: lastInitial.charAt(0).toUpperCase(),
          preferredLanguage,
          needs,
          updatedAt: Timestamp.now(),
        });
      } else {
        await addDoc(collection(db, 'guests'), {
          firstName,
          lastInitial: lastInitial.charAt(0).toUpperCase(),
          preferredLanguage,
          needs,
          quickNotes: [],
          visitLog: [],
          createdBy: user.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Guest' : 'Add Guest'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Initial</label>
            <input
              value={lastInitial}
              onChange={(e) => setLastInitial(e.target.value.slice(0, 1))}
              required
              maxLength={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="G"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Needs</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => toggleNeed(cat.key)}
                className={`px-3 py-1.5 text-xs rounded-full border ${
                  needs.includes(cat.key)
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.icon} {cat.labels.en}
              </button>
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
            {saving ? 'Saving...' : isEdit ? 'Save Guest' : 'Add Guest'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
