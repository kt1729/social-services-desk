import { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { useAuth } from '../auth/useAuth';
import type { NoteParentType } from '../../shared/types';

interface AddNoteFormProps {
  parentType: NoteParentType;
  parentId: string | null;
}

export default function AddNoteForm({ parentType, parentId }: AddNoteFormProps) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'notes'), {
        parentType,
        parentId,
        text: text.trim(),
        volunteerId: user.uid,
        createdAt: Timestamp.now(),
      });
      setText('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a note..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
      />
      <button
        type="submit"
        disabled={saving || !text.trim()}
        className="px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? '...' : 'Add'}
      </button>
    </form>
  );
}
