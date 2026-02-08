import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../shared/lib/firebase';
import { useData } from '../../app/useData';
import { useAuth } from '../auth/useAuth';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from '../../shared/lib/languages';
import CategoryBadge from '../../shared/components/CategoryBadge';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import LanguageSelector from '../../shared/components/LanguageSelector';
import PrintDocumentCard from '../print/PrintDocumentCard';
import DocumentForm from './DocumentForm';
import NoteItem from '../notes/NoteItem';
import AddNoteForm from '../notes/AddNoteForm';
import type { LanguageCode } from '../../shared/types';

function typeIcon(type: string): string {
  switch (type) {
    case 'pdf':
      return '📄';
    case 'link':
      return '🔗';
    case 'internal':
      return '📝';
    case 'image':
      return '🖼️';
    default:
      return '📄';
  }
}

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents, resources, notes, getVolunteerName } = useData();
  const { isAdmin } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [printLang, setPrintLang] = useState<LanguageCode | null>(null);

  const document = documents.find((d) => d.id === id);
  if (!document) {
    return <div className="text-center py-12 text-gray-500">Document not found.</div>;
  }

  const linkedResources = (document.linkedResources ?? [])
    .map((rid) => resources.find((r) => r.id === rid))
    .filter(Boolean);

  const documentNotes = notes.filter(
    (n) => n.parentType === 'document' && n.parentId === document.id,
  );

  const handleDelete = async () => {
    // Delete storage files
    for (const lang of SUPPORTED_LANGUAGES) {
      const langInfo = document.languages?.[lang.code];
      if (langInfo?.storagePath) {
        try {
          const storageRef = ref(storage, langInfo.storagePath);
          await deleteObject(storageRef);
        } catch {
          // File may not exist, continue
        }
      }
    }
    await deleteDoc(doc(db, 'documents', document.id));
    navigate('/documents');
  };

  const handlePrint = (lang: LanguageCode) => {
    setPrintLang(lang);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div>
      {printLang && <PrintDocumentCard document={document} lang={printLang} />}

      <div className="print:hidden">
        <button
          onClick={() => navigate('/documents')}
          className="text-sm text-blue-600 hover:underline mb-4 inline-block"
        >
          &larr; Back to Documents
        </button>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {typeIcon(document.type)} {getTranslatedText(document.title, 'en')}
            </h1>
            <CategoryBadge category={document.category} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLangSelect(true)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Print
            </button>
            <button
              onClick={() => setShowEdit(true)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Edit
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

        {getTranslatedText(document.description, 'en') && (
          <p className="text-gray-700 mb-6">{getTranslatedText(document.description, 'en')}</p>
        )}

        {document.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {document.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Document Preview */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Preview</h2>
          <DocumentPreview document={document} />
        </div>

        {/* Language Availability */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Language Availability</h2>
          <div className="flex gap-3">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const langInfo = document.languages?.[lang.code];
              const available = langInfo?.available;
              return (
                <div
                  key={lang.code}
                  className={`px-3 py-2 rounded border text-sm ${
                    available
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  {lang.flag} {LANGUAGE_LABELS[lang.code]}
                  {available && langInfo?.storagePath && (
                    <a
                      href={langInfo.storagePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-xs underline"
                    >
                      View
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Linked Resources */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Linked Resources</h2>
          {linkedResources.length === 0 ? (
            <p className="text-sm text-gray-500">No resources linked.</p>
          ) : (
            <div className="space-y-1">
              {linkedResources.map((r) => (
                <Link
                  key={r!.id}
                  to={`/resources/${r!.id}`}
                  className="block text-sm text-blue-600 hover:underline"
                >
                  {getTranslatedText(r!.name, 'en')}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Notes</h2>
          <div className="space-y-2 mb-3">
            {documentNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                volunteerName={getVolunteerName(note.volunteerId)}
              />
            ))}
          </div>
          <AddNoteForm parentType="document" parentId={document.id} />
        </div>
      </div>

      <DocumentForm open={showEdit} onClose={() => setShowEdit(false)} document={document} />
      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This will also remove uploaded files. This cannot be undone."
      />
      <LanguageSelector
        open={showLangSelect}
        onClose={() => setShowLangSelect(false)}
        onSelect={handlePrint}
      />
    </div>
  );
}

function DocumentPreview({
  document: doc,
}: {
  document: import('../../shared/types').ServiceDocument;
}) {
  if (doc.type === 'link' && doc.source?.url) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm mb-2">External link:</p>
        <a
          href={doc.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {doc.source.url}
        </a>
      </div>
    );
  }

  if (doc.type === 'internal' && doc.source?.internalContent?.en) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
        {doc.source.internalContent.en}
      </div>
    );
  }

  if (doc.type === 'pdf') {
    const enFile = doc.languages?.en;
    if (enFile?.available && enFile.storagePath) {
      return (
        <iframe
          src={enFile.storagePath}
          className="w-full h-96 border rounded"
          title="PDF Preview"
        />
      );
    }
    return <p className="text-sm text-gray-500">No PDF uploaded yet.</p>;
  }

  if (doc.type === 'image') {
    const enFile = doc.languages?.en;
    if (enFile?.available && enFile.storagePath) {
      return (
        <img
          src={enFile.storagePath}
          alt={getTranslatedText(doc.title, 'en')}
          className="max-w-full max-h-96 rounded border"
        />
      );
    }
    return <p className="text-sm text-gray-500">No image uploaded yet.</p>;
  }

  return <p className="text-sm text-gray-500">No preview available.</p>;
}
