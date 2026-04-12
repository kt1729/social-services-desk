import { useData } from '../../app/useData';
import NoteItem from './NoteItem';
import AddNoteForm from './AddNoteForm';
import { getTranslatedText } from '../../shared/lib/translationUtils';

export default function NotesPage() {
  const { notes, resources, guests, documents, getVolunteerName } = useData();

  const sortedNotes = [...notes].sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });

  const getParentLabel = (parentType: string, parentId: string | null): string => {
    if (!parentId) return 'General';
    if (parentType === 'resource') {
      const r = resources.find((res) => res.id === parentId);
      return r ? `Resource: ${getTranslatedText(r.name, 'en')}` : 'Resource (deleted)';
    }
    if (parentType === 'guest') {
      const g = guests.find((guest) => guest.id === parentId);
      return g ? `Guest: ${g.firstName} ${g.lastInitial}.` : 'Guest (deleted)';
    }
    if (parentType === 'document') {
      const d = documents.find((doc) => doc.id === parentId);
      return d ? `Document: ${getTranslatedText(d.title, 'en')}` : 'Document (deleted)';
    }
    return parentType;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notes</h1>

      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Add General Note</h2>
        <AddNoteForm parentType="general" parentId={null} />
      </div>

      {sortedNotes.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No notes yet.</p>
      ) : (
        <div className="space-y-3">
          {sortedNotes.map((note) => (
            <div key={note.id}>
              <p className="text-xs text-gray-400 mb-1">
                {getParentLabel(note.parentType, note.parentId)}
              </p>
              <NoteItem note={note} volunteerName={getVolunteerName(note.volunteerId)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
