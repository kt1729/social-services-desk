import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { useData } from '../../app/useData';
import { useAuth } from '../auth/useAuth';
import { LANGUAGE_LABELS } from '../../shared/lib/languages';
import { getCategoryLabel } from '../../shared/lib/categories';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import LanguageSelector from '../../shared/components/LanguageSelector';
import GuestForm from './GuestForm';
import LogVisitForm from './LogVisitForm';
import NoteItem from '../notes/NoteItem';
import AddNoteForm from '../notes/AddNoteForm';
import PrintGuestSummary from '../print/PrintGuestSummary';
import type { LanguageCode } from '../../shared/types';

export default function GuestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { guests, resources, documents, notes, getVolunteerName } = useData();
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [printLang, setPrintLang] = useState<LanguageCode | null>(null);

  const guest = guests.find((g) => g.id === id);
  if (!guest) {
    return <div className="text-center py-12 text-gray-500">Guest not found.</div>;
  }

  const guestNotes = notes.filter((n) => n.parentType === 'guest' && n.parentId === guest.id);

  const handleAddQuickNote = async (text: string) => {
    if (!user) return;
    await updateDoc(doc(db, 'guests', guest.id), {
      quickNotes: arrayUnion({
        text,
        volunteerId: user.uid,
        timestamp: Timestamp.now(),
      }),
      updatedAt: Timestamp.now(),
    });
  };

  const handlePrint = (lang: LanguageCode) => {
    setPrintLang(lang);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div>
      {printLang && (
        <PrintGuestSummary
          guest={guest}
          lang={printLang}
          resources={resources}
          documents={documents}
        />
      )}

      <div className="print:hidden">
        <button
          onClick={() => navigate('/guests')}
          className="text-sm text-blue-600 hover:underline mb-4 inline-block"
        >
          &larr; Back to Guests
        </button>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              👤 {guest.firstName} {guest.lastInitial}.
            </h1>
            <p className="text-sm text-gray-500">
              Preferred Language: {LANGUAGE_LABELS[guest.preferredLanguage]}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLangSelect(true)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              🖨️ Print
            </button>
            <button
              onClick={() => setShowEdit(true)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              ✏️ Edit
            </button>
          </div>
        </div>

        {guest.needs?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Needs</h2>
            <div className="flex flex-wrap gap-2">
              {guest.needs.map((need) => (
                <span key={need} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {getCategoryLabel(need)}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Visit Log ({guest.visitLog?.length ?? 0} visits)</h2>
            <button
              onClick={() => setShowVisitForm(true)}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              📋 Log Visit
            </button>
          </div>
          {!guest.visitLog || guest.visitLog.length === 0 ? (
            <p className="text-sm text-gray-500">No visits logged yet.</p>
          ) : (
            <div className="space-y-3">
              {[...guest.visitLog].reverse().map((visit, i) => {
                const date = visit.date?.toDate?.()?.toLocaleDateString() ?? '';
                return (
                  <div key={i} className="border-l-2 border-blue-300 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{visit.purpose}</span>
                      <span className="text-xs text-gray-400">{date}</span>
                    </div>
                    {visit.notes && <p className="text-sm text-gray-600">{visit.notes}</p>}
                    <p className="text-xs text-gray-400">— {getVolunteerName(visit.volunteerId)}</p>
                    {visit.resourcesReferred?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Resources:{' '}
                        {visit.resourcesReferred
                          .map((rid) => {
                            const r = resources.find((res) => res.id === rid);
                            return r ? getTranslatedText(r.name, 'en') : rid;
                          })
                          .join(', ')}
                      </p>
                    )}
                    {visit.documentsGiven?.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Documents:{' '}
                        {visit.documentsGiven
                          .map((did) => {
                            const d = documents.find((doc) => doc.id === did);
                            return d ? getTranslatedText(d.title, 'en') : did;
                          })
                          .join(', ')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Quick Notes</h2>
          {guest.quickNotes?.length > 0 && (
            <div className="space-y-2 mb-3">
              {[...guest.quickNotes].reverse().map((qn, i) => {
                const date = qn.timestamp?.toDate?.()?.toLocaleDateString() ?? '';
                return (
                  <div key={i} className="bg-gray-50 rounded p-3 text-sm">
                    <p className="text-gray-700">{qn.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      — {getVolunteerName(qn.volunteerId)}, {date}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          <QuickNoteInput onAdd={handleAddQuickNote} />
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Notes</h2>
          <div className="space-y-2 mb-3">
            {guestNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                volunteerName={getVolunteerName(note.volunteerId)}
              />
            ))}
          </div>
          <AddNoteForm parentType="guest" parentId={guest.id} />
        </div>
      </div>

      <GuestForm open={showEdit} onClose={() => setShowEdit(false)} guest={guest} />
      <LogVisitForm
        open={showVisitForm}
        onClose={() => setShowVisitForm(false)}
        guestId={guest.id}
      />
      <LanguageSelector
        open={showLangSelect}
        onClose={() => setShowLangSelect(false)}
        onSelect={handlePrint}
        defaultLang={guest.preferredLanguage}
      />
    </div>
  );
}

function QuickNoteInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a quick note..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        Add
      </button>
    </form>
  );
}
