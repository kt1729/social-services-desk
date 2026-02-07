import type { Note } from '../../shared/types';

interface NoteItemProps {
  note: Note;
  volunteerName: string;
}

export default function NoteItem({ note, volunteerName }: NoteItemProps) {
  const date = note.createdAt?.toDate?.() ? note.createdAt.toDate().toLocaleDateString() : '';

  return (
    <div className="bg-gray-50 rounded p-3 text-sm">
      <p className="text-gray-700">{note.text}</p>
      <p className="text-xs text-gray-400 mt-1">
        — {volunteerName}, {date}
      </p>
    </div>
  );
}
