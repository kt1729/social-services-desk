import { useState } from 'react';
import { addDoc, updateDoc, deleteDoc, doc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { useData } from '../../app/useData';
import Modal from '../../shared/components/Modal';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import type { Tag } from '../../shared/types';

function slugify(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function AddTagModal({
  open,
  onClose,
  existingLabels,
}: {
  open: boolean;
  onClose: () => void;
  existingLabels: string[];
}) {
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    if (existingLabels.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
      setError('A tag with this name already exists.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await addDoc(collection(db, 'tags'), {
        label: trimmed,
        slug: slugify(trimmed),
        createdAt: Timestamp.now(),
      });
      setLabel('');
      onClose();
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setLabel('');
    setError('');
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Tag">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
          <input
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              setError('');
            }}
            placeholder="e.g. Emergency Housing"
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !label.trim()}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Adding…' : 'Add Tag'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function TagsPage() {
  const { tags, resources, documents } = useData();
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null);
  const [deleteUsageCount, setDeleteUsageCount] = useState(0);

  const sorted = [...tags].sort((a, b) => a.label.localeCompare(b.label));

  function getUsageCount(tagId: string): number {
    const rCount = resources.filter((r) => (r.tagIds ?? []).includes(tagId)).length;
    const dCount = documents.filter((d) => (d.tagIds ?? []).includes(tagId)).length;
    return rCount + dCount;
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id);
    setEditLabel(tag.label);
    setEditError('');
  }

  async function handleRename(tag: Tag) {
    const trimmed = editLabel.trim();
    if (!trimmed) return;
    if (trimmed === tag.label) {
      setEditingId(null);
      return;
    }
    const duplicate = tags.some(
      (t) => t.id !== tag.id && t.label.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      setEditError('A tag with this name already exists.');
      return;
    }
    setEditError('');
    setSaving(true);
    try {
      await updateDoc(doc(db, 'tags', tag.id), {
        label: trimmed,
        slug: slugify(trimmed),
      });
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  function initiateDelete(tag: Tag) {
    setDeleteUsageCount(getUsageCount(tag.id));
    setDeleteTarget(tag);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteDoc(doc(db, 'tags', deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Add Tag
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No tags yet.</p>
          <p className="text-sm">Create your first tag to start organizing resources and documents.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {sorted.map((tag) => {
            const usageCount = getUsageCount(tag.id);
            const isEditing = editingId === tag.id;
            return (
              <li key={tag.id} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50">
                {isEditing ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      value={editLabel}
                      onChange={(e) => {
                        setEditLabel(e.target.value);
                        setEditError('');
                      }}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(tag);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    {editError && <span className="text-xs text-red-600">{editError}</span>}
                    <button
                      onClick={() => handleRename(tag)}
                      disabled={saving}
                      className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-900">{tag.label}</span>
                    <span className="text-xs text-gray-400">
                      {usageCount} {usageCount === 1 ? 'item' : 'items'}
                    </span>
                    <button
                      onClick={() => startEdit(tag)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => initiateDelete(tag)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <AddTagModal
        open={showForm}
        onClose={() => setShowForm(false)}
        existingLabels={tags.map((t) => t.label)}
      />

      {deleteTarget && (
        <ConfirmDialog
          open={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Tag"
          message={
            deleteUsageCount > 0
              ? `This tag is used by ${deleteUsageCount} ${deleteUsageCount === 1 ? 'item' : 'items'}. Deleting it will remove it from filters but will not update those items.`
              : `Delete the tag "${deleteTarget.label}"? This cannot be undone.`
          }
          confirmLabel="Delete Tag"
        />
      )}
    </div>
  );
}
