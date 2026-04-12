import { useState } from 'react';
import {
  addDoc,
  updateDoc,
  doc,
  collection,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { uploadFile } from '../../shared/lib/storageService';
import { useAuth } from '../auth/useAuth';
import { useData } from '../../app/useData';
import Modal from '../../shared/components/Modal';
import TranslationTabs from '../../shared/components/TranslationTabs';
import TagInput from '../../shared/components/TagInput';
import FileUpload from '../../shared/components/FileUpload';
import { CATEGORIES } from '../../shared/lib/categories';
import { SUPPORTED_LANGUAGES } from '../../shared/lib/languages';
import {
  computeAllTranslationStatuses,
  getTranslatedText,
} from '../../shared/lib/translationUtils';
import type {
  ServiceDocument,
  DocumentType,
  TranslatedField,
  CategoryKey,
  LanguageCode,
} from '../../shared/types';

interface DocumentFormProps {
  open: boolean;
  onClose: () => void;
  document?: ServiceDocument;
}

export default function DocumentForm({ open, onClose, document: existingDoc }: DocumentFormProps) {
  const { user } = useAuth();
  const { resources } = useData();
  const isEdit = !!existingDoc;

  const [title, setTitle] = useState<TranslatedField>(existingDoc?.title ?? { en: '' });
  const [description, setDescription] = useState<TranslatedField>(
    existingDoc?.description ?? { en: '' },
  );
  const [docType, setDocType] = useState<DocumentType>(existingDoc?.type ?? 'link');
  const [category, setCategory] = useState<CategoryKey>(existingDoc?.category ?? 'other');
  const [tags, setTags] = useState<string[]>(existingDoc?.tags ?? []);
  const [url, setUrl] = useState(existingDoc?.source?.url ?? '');
  const [internalContent, setInternalContent] = useState<TranslatedField>(
    existingDoc?.source?.internalContent ?? { en: '' },
  );
  const [linkedResourceIds, setLinkedResourceIds] = useState<string[]>(
    existingDoc?.linkedResources ?? [],
  );
  const [activeLang, setActiveLang] = useState<LanguageCode>('en');

  // Per-language file uploads
  const [langFiles, setLangFiles] = useState<Partial<Record<LanguageCode, File | null>>>({});

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setLangFile = (lang: LanguageCode, file: File | null) => {
    setLangFiles((prev) => ({ ...prev, [lang]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.en?.trim()) {
      setError('English title is required.');
      return;
    }
    setError('');
    setSaving(true);

    try {
      const translationFields: TranslatedField[] = [title, description];
      if (docType === 'internal') {
        translationFields.push(internalContent);
      }
      const translationStatus = computeAllTranslationStatuses(translationFields);

      // Build source object
      const source: Record<string, unknown> = {
        url: docType === 'link' ? url : null,
        storagePath: null,
        internalContent: docType === 'internal' ? internalContent : null,
      };

      // Build languages info from existing + new uploads
      const languages: Record<string, { available: boolean; storagePath: string | null }> = {};
      for (const lang of SUPPORTED_LANGUAGES) {
        const existingLangInfo = existingDoc?.languages?.[lang.code];
        languages[lang.code] = {
          available: existingLangInfo?.available ?? false,
          storagePath: existingLangInfo?.storagePath ?? null,
        };
      }

      if (isEdit && existingDoc) {
        // Upload new files
        for (const lang of SUPPORTED_LANGUAGES) {
          const file = langFiles[lang.code];
          if (file) {
            const path = await uploadFile(file, existingDoc.id, lang.code, category);
            languages[lang.code] = { available: true, storagePath: path };
          }
        }

        await updateDoc(doc(db, 'documents', existingDoc.id), {
          title,
          description,
          type: docType,
          source,
          category,
          tags,
          languages,
          translationStatus,
          linkedResources: linkedResourceIds,
          updatedAt: Timestamp.now(),
        });

        // Sync linkedResources on both sides
        const oldLinked = existingDoc.linkedResources ?? [];
        const added = linkedResourceIds.filter((id) => !oldLinked.includes(id));
        const removed = oldLinked.filter((id) => !linkedResourceIds.includes(id));
        for (const rid of added) {
          await updateDoc(doc(db, 'resources', rid), {
            linkedDocuments: arrayUnion(existingDoc.id),
          });
        }
        for (const rid of removed) {
          await updateDoc(doc(db, 'resources', rid), {
            linkedDocuments: arrayRemove(existingDoc.id),
          });
        }
      } else {
        // Create new document
        const docRef = await addDoc(collection(db, 'documents'), {
          title,
          description,
          type: docType,
          source,
          category,
          tags,
          linkedResources: linkedResourceIds,
          languages,
          translationStatus,
          printSettings: { paperSize: 'letter', orientation: 'portrait', showQRCode: true },
          createdBy: user.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        // Upload files for new doc
        let hasUploads = false;
        for (const lang of SUPPORTED_LANGUAGES) {
          const file = langFiles[lang.code];
          if (file) {
            const path = await uploadFile(file, docRef.id, lang.code, category);
            languages[lang.code] = { available: true, storagePath: path };
            hasUploads = true;
          }
        }
        if (hasUploads) {
          await updateDoc(doc(db, 'documents', docRef.id), { languages });
        }

        // Update linked resources
        for (const rid of linkedResourceIds) {
          await updateDoc(doc(db, 'resources', rid), {
            linkedDocuments: arrayUnion(docRef.id),
          });
        }
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Document' : 'Add Document'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="pdf">📄 PDF</option>
              <option value="link">🔗 Link</option>
              <option value="internal">📝 Internal</option>
              <option value="image">🖼️ Image</option>
            </select>
          </div>
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
        </div>

        <TranslationTabs activeLang={activeLang} onChange={setActiveLang} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title ({activeLang.toUpperCase()})
          </label>
          <input
            value={title[activeLang] ?? ''}
            onChange={(e) => setTitle({ ...title, [activeLang]: e.target.value })}
            required={activeLang === 'en'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder={`Document title in ${activeLang.toUpperCase()}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description ({activeLang.toUpperCase()})
          </label>
          <textarea
            value={description[activeLang] ?? ''}
            onChange={(e) => setDescription({ ...description, [activeLang]: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder={`Description in ${activeLang.toUpperCase()}`}
          />
        </div>

        {docType === 'link' && activeLang === 'en' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="https://..."
              required
            />
          </div>
        )}

        {docType === 'internal' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content ({activeLang.toUpperCase()})
            </label>
            <textarea
              value={internalContent[activeLang] ?? ''}
              onChange={(e) =>
                setInternalContent({ ...internalContent, [activeLang]: e.target.value })
              }
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder={`Document content in ${activeLang.toUpperCase()}`}
            />
          </div>
        )}

        {(docType === 'pdf' || docType === 'image') && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              File Uploads ({docType === 'pdf' ? 'PDF' : 'Image'})
            </h3>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const existingPath = existingDoc?.languages?.[lang.code]?.storagePath;
              return (
                <FileUpload
                  key={lang.code}
                  label={`${lang.flag} ${lang.label}`}
                  accept={docType === 'pdf' ? '.pdf' : 'image/*'}
                  file={langFiles[lang.code] ?? null}
                  onChange={(file) => setLangFile(lang.code, file)}
                  existingFileName={existingPath ? `(uploaded)` : undefined}
                />
              );
            })}
          </div>
        )}

        {activeLang === 'en' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <TagInput value={tags} onChange={setTags} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Linked Resources
              </label>
              {linkedResourceIds.length > 0 && (
                <div className="space-y-1 mb-2">
                  {linkedResourceIds.map((rid) => {
                    const r = resources.find((res) => res.id === rid);
                    return (
                      <div
                        key={rid}
                        className="flex items-center justify-between bg-gray-50 rounded px-3 py-1.5 text-sm"
                      >
                        <span>{r ? getTranslatedText(r.name, 'en') : rid}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setLinkedResourceIds((prev) => prev.filter((id) => id !== rid))
                          }
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <ResourcePicker
                excludeIds={linkedResourceIds}
                onSelect={(rid) => setLinkedResourceIds((prev) => [...prev, rid])}
              />
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
            {saving ? 'Saving...' : isEdit ? 'Save Document' : 'Add Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ResourcePicker({
  excludeIds,
  onSelect,
}: {
  excludeIds: string[];
  onSelect: (id: string) => void;
}) {
  const { resources } = useData();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const available = resources.filter(
    (r) =>
      !excludeIds.includes(r.id) &&
      (!search || getTranslatedText(r.name, 'en').toLowerCase().includes(search.toLowerCase())),
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        + Link Resource
      </button>
    );
  }

  return (
    <div className="border rounded p-3 bg-gray-50">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search resources..."
        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm mb-2"
      />
      <div className="max-h-32 overflow-y-auto space-y-1">
        {available.length === 0 ? (
          <p className="text-xs text-gray-500">No resources found.</p>
        ) : (
          available.slice(0, 10).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                onSelect(r.id);
                setOpen(false);
                setSearch('');
              }}
              className="block w-full text-left text-sm px-2 py-1 rounded hover:bg-blue-50"
            >
              {getTranslatedText(r.name, 'en')}
            </button>
          ))
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setSearch('');
        }}
        className="text-xs text-gray-500 mt-2 hover:underline"
      >
        Cancel
      </button>
    </div>
  );
}
