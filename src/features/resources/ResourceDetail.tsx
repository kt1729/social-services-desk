import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  addDoc,
  collection,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { useData } from '../../app/useData';
import { useAuth } from '../auth/useAuth';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import { formatOperatingHours } from '../../shared/lib/operatingHours';
import CategoryBadge from '../../shared/components/CategoryBadge';
import RichTextDisplay from '../../shared/components/RichTextDisplay';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import LanguageSelector from '../../shared/components/LanguageSelector';
import ResourceForm from './ResourceForm';
import AddNoteForm from '../notes/AddNoteForm';
import NoteItem from '../notes/NoteItem';
import PrintResourceCard from '../print/PrintResourceCard';
import type { LanguageCode } from '../../shared/types';

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resources, documents, notes, feedback, getVolunteerName } = useData();
  const { isAdmin, user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [printLang, setPrintLang] = useState<LanguageCode | null>(null);

  const resource = resources.find((r) => r.id === id);
  if (!resource) {
    return <div className="text-center py-12 text-gray-500">Resource not found.</div>;
  }

  const linkedDocs = documents.filter((d) => resource.linkedDocuments?.includes(d.id));
  const resourceNotes = notes.filter(
    (n) => n.parentType === 'resource' && n.parentId === resource.id,
  );
  const resourceFeedback = feedback.filter((f) => f.resourceId === resource.id);

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'resources', resource.id));
    navigate('/');
  };

  const handleFeedback = async (rating: 'up' | 'down') => {
    if (!user) return;
    await addDoc(collection(db, 'feedback'), {
      resourceId: resource.id,
      rating,
      comment: '',
      volunteerId: user.uid,
      createdAt: Timestamp.now(),
    });
    const field = rating === 'up' ? 'feedbackSummary.upvotes' : 'feedbackSummary.downvotes';
    const current =
      rating === 'up'
        ? (resource.feedbackSummary?.upvotes ?? 0)
        : (resource.feedbackSummary?.downvotes ?? 0);
    await updateDoc(doc(db, 'resources', resource.id), {
      [field]: current + 1,
    });
  };

  const handleLinkDocument = async (docId: string) => {
    await updateDoc(doc(db, 'resources', resource.id), {
      linkedDocuments: arrayUnion(docId),
    });
    await updateDoc(doc(db, 'documents', docId), {
      linkedResources: arrayUnion(resource.id),
    });
  };

  const handlePrint = (lang: LanguageCode) => {
    setPrintLang(lang);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div>
      {printLang && <PrintResourceCard resource={resource} lang={printLang} />}

      <div className="print-hidden">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-blue-600 hover:underline mb-4 inline-block"
        >
          &larr; Back to Resources
        </button>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getTranslatedText(resource.name, 'en')}
            </h1>
            <CategoryBadge category={resource.category} />
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
            {isAdmin && (
              <button
                onClick={() => setShowDelete(true)}
                className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm space-y-1">
          {resource.address && <p>📍 {resource.address}</p>}
          {resource.phone && <p>📞 {resource.phone}</p>}
          {resource.email && (
            <p>
              ✉️{' '}
              <a href={`mailto:${resource.email}`} className="text-blue-600 hover:underline">
                {resource.email}
              </a>
            </p>
          )}
          {resource.website && (
            <p>
              🌐{' '}
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {resource.website}
              </a>
            </p>
          )}
          {formatOperatingHours(resource.operatingHours ?? []).map((line) => (
            <p key={line}>🕐 {line}</p>
          ))}
        </div>

        <RichTextDisplay html={getTranslatedText(resource.description, 'en')} className="text-gray-700 mb-6" />

        {resource.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {resource.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => handleFeedback('up')}
            className="px-3 py-1.5 text-sm border rounded hover:bg-green-50"
          >
            👍 {resource.feedbackSummary?.upvotes ?? 0}
          </button>
          <button
            onClick={() => handleFeedback('down')}
            className="px-3 py-1.5 text-sm border rounded hover:bg-red-50"
          >
            👎 {resource.feedbackSummary?.downvotes ?? 0}
          </button>
        </div>

        {resourceFeedback.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Recent Feedback</h2>
            <div className="space-y-2">
              {resourceFeedback.slice(0, 5).map((fb) => (
                <div key={fb.id} className="text-sm text-gray-600">
                  {fb.rating === 'up' ? '👍' : '👎'} {fb.comment || '(no comment)'} —{' '}
                  {getVolunteerName(fb.volunteerId)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="font-semibold mb-2">📎 Linked Documents</h2>
          {linkedDocs.length === 0 ? (
            <p className="text-sm text-gray-500">No documents linked.</p>
          ) : (
            <div className="space-y-2">
              {linkedDocs.map((d) => (
                <a
                  key={d.id}
                  href={`/documents/${d.id}`}
                  className="block text-sm text-blue-600 hover:underline"
                >
                  📄 {getTranslatedText(d.title, 'en')}
                </a>
              ))}
            </div>
          )}
          <div className="mt-2">
            <AttachDocumentPicker
              existingIds={resource.linkedDocuments ?? []}
              onLink={handleLinkDocument}
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Notes</h2>
          <div className="space-y-2 mb-3">
            {resourceNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                volunteerName={getVolunteerName(note.volunteerId)}
              />
            ))}
          </div>
          <AddNoteForm parentType="resource" parentId={resource.id} />
        </div>
      </div>

      <ResourceForm open={showEdit} onClose={() => setShowEdit(false)} resource={resource} />
      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This cannot be undone."
      />
      <LanguageSelector
        open={showLangSelect}
        onClose={() => setShowLangSelect(false)}
        onSelect={handlePrint}
      />
    </div>
  );
}

function AttachDocumentPicker({
  existingIds,
  onLink,
}: {
  existingIds: string[];
  onLink: (docId: string) => void;
}) {
  const { documents } = useData();
  const [open, setOpen] = useState(false);
  const available = documents.filter((d) => !existingIds.includes(d.id));

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm text-blue-600 hover:underline">
        + Attach Document
      </button>
    );
  }

  return (
    <div className="border rounded p-3 bg-gray-50">
      <p className="text-sm font-medium mb-2">Select a document to link:</p>
      {available.length === 0 ? (
        <p className="text-xs text-gray-500">No documents available to link.</p>
      ) : (
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {available.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                onLink(d.id);
                setOpen(false);
              }}
              className="block w-full text-left text-sm px-2 py-1 rounded hover:bg-blue-50"
            >
              📄 {getTranslatedText(d.title, 'en')}
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(false)} className="text-xs text-gray-500 mt-2 hover:underline">
        Cancel
      </button>
    </div>
  );
}
