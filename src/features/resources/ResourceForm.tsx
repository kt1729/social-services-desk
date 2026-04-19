import { useState } from 'react';
import { addDoc, updateDoc, doc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { useAuth } from '../auth/useAuth';
import { useData } from '../../app/useData';
import Modal from '../../shared/components/Modal';
import RichTextEditor from '../../shared/components/RichTextEditor';
import TagMultiselect from '../../shared/components/TagMultiselect';
import OperatingHoursInput from '../../shared/components/OperatingHoursInput';
import { createEmptySchedule } from '../../shared/lib/operatingHours';
import { CATEGORIES } from '../../shared/lib/categories';
import { SUPPORTED_LANGUAGES } from '../../shared/lib/languages';
import { computeAllTranslationStatuses } from '../../shared/lib/translationUtils';
import type {
  Resource,
  Branch,
  TranslatedField,
  CategoryKey,
  LanguageCode,
  OperatingHours,
} from '../../shared/types';

interface ResourceFormProps {
  open: boolean;
  onClose: () => void;
  resource?: Resource;
}

function newBranch(): Branch {
  return { id: crypto.randomUUID(), label: '', address: '', phone: '', email: '', operatingHours: createEmptySchedule() };
}

export default function ResourceForm({ open, onClose, resource }: ResourceFormProps) {
  const { user } = useAuth();
  const { tags } = useData();
  const isEdit = !!resource;

  const [name, setName] = useState<TranslatedField>(resource?.name ?? { en: '' });
  const [description, setDescription] = useState<TranslatedField>(
    resource?.description ?? { en: '' },
  );
  const [category, setCategory] = useState<CategoryKey>(resource?.category ?? 'other');
  const [address, setAddress] = useState(resource?.address ?? '');
  const [phone, setPhone] = useState(resource?.phone ?? '');
  const [email, setEmail] = useState(resource?.email ?? '');
  const [website, setWebsite] = useState(resource?.website ?? '');
  const [operatingHours, setOperatingHours] = useState<OperatingHours>(
    resource?.operatingHours ?? createEmptySchedule(),
  );
  const [tagIds, setTagIds] = useState<string[]>(resource?.tagIds ?? []);
  const [branches, setBranches] = useState<Branch[]>(resource?.branches ?? []);
  const [activeLang, setActiveLang] = useState<LanguageCode>('en');
  const [saving, setSaving] = useState(false);

  const updateBranch = (id: string, patch: Partial<Branch>) =>
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const removeBranch = (id: string) =>
    setBranches((prev) => prev.filter((b) => b.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const translationStatus = computeAllTranslationStatuses([name, description]);

    try {
      if (isEdit && resource) {
        await updateDoc(doc(db, 'resources', resource.id), {
          name,
          description,
          category,
          address,
          phone,
          email,
          website,
          operatingHours,
          tagIds,
          branches,
          translationStatus,
          updatedAt: Timestamp.now(),
        });
      } else {
        await addDoc(collection(db, 'resources'), {
          name,
          description,
          category,
          address,
          phone,
          email,
          website,
          operatingHours,
          tagIds,
          branches,
          notes: [],
          feedbackSummary: { upvotes: 0, downvotes: 0 },
          linkedDocuments: [],
          translationStatus,
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
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Resource' : 'Add Resource'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryKey)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.icon} {c.labels.en}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1 border-b border-gray-200">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveLang(lang.code)}
              className={`px-3 py-2 text-sm ${
                activeLang === lang.code
                  ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name ({activeLang.toUpperCase()})
          </label>
          <input
            value={name[activeLang] ?? ''}
            onChange={(e) => setName({ ...name, [activeLang]: e.target.value })}
            required={activeLang === 'en'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder={`Resource name in ${activeLang.toUpperCase()}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description ({activeLang.toUpperCase()})
          </label>
          <RichTextEditor
            value={description[activeLang] ?? ''}
            onChange={(html) => setDescription({ ...description, [activeLang]: html })}
            placeholder={`Description in ${activeLang.toUpperCase()}`}
          />
        </div>

        {activeLang === 'en' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="contact@example.org"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <OperatingHoursInput value={operatingHours} onChange={setOperatingHours} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <TagMultiselect value={tagIds} onChange={setTagIds} tags={tags} />
            </div>

            {/* Branches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Branches / Locations</label>
                <button
                  type="button"
                  onClick={() => setBranches((prev) => [...prev, newBranch()])}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add Branch
                </button>
              </div>
              {branches.length === 0 && (
                <p className="text-xs text-gray-400">No branches. Click "+ Add Branch" to add a location.</p>
              )}
              <div className="space-y-3">
                {branches.map((branch, idx) => (
                  <div key={branch.id} className="border border-gray-200 rounded-md p-3 bg-gray-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Branch {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeBranch(branch.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-0.5">Label *</label>
                      <input
                        value={branch.label}
                        onChange={(e) => updateBranch(branch.id, { label: e.target.value })}
                        required
                        placeholder="e.g. Downtown, Eastside"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-0.5">Address</label>
                        <input
                          value={branch.address ?? ''}
                          onChange={(e) => updateBranch(branch.id, { address: e.target.value })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-0.5">Phone</label>
                        <input
                          value={branch.phone ?? ''}
                          onChange={(e) => updateBranch(branch.id, { phone: e.target.value })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-0.5">Email</label>
                      <input
                        type="email"
                        value={branch.email ?? ''}
                        onChange={(e) => updateBranch(branch.id, { email: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Hours</label>
                      <OperatingHoursInput
                        value={branch.operatingHours ?? createEmptySchedule()}
                        onChange={(hrs) => updateBranch(branch.id, { operatingHours: hrs })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

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
            {saving ? 'Saving...' : isEdit ? 'Save Resource' : 'Add Resource'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
