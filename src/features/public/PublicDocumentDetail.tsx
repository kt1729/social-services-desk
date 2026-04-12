import { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { usePublicData } from './usePublicData';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import { getFileUrl } from '../../shared/lib/storageService';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from '../../shared/lib/languages';
import CategoryBadge from '../../shared/components/CategoryBadge';
import type { LanguageCode, ServiceDocument } from '../../shared/types';

function typeIcon(type: string): string {
  switch (type) {
    case 'pdf':
      return '\uD83D\uDCC4';
    case 'link':
      return '\uD83D\uDD17';
    case 'internal':
      return '\uD83D\uDCDD';
    case 'image':
      return '\uD83D\uDDBC\uFE0F';
    default:
      return '\uD83D\uDCC4';
  }
}

export default function PublicDocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useOutletContext<{ lang: LanguageCode }>();
  const { documents, resources, loading } = usePublicData();
  const [signedPreview, setSignedPreview] = useState<{ path: string | null; url: string | null }>({
    path: null,
    url: null,
  });

  const document = documents.find((d) => d.id === id);

  const langFile = document?.languages?.[lang];
  const langStoragePath = langFile?.available ? langFile.storagePath : null;
  const enFile = document?.languages?.en;
  const enStoragePath = enFile?.available ? enFile.storagePath : null;
  const storagePath = langStoragePath ?? enStoragePath;

  const previewUrl =
    document?.type === 'link'
      ? (document.source?.url ?? null)
      : document?.type === 'internal'
        ? null
        : storagePath && signedPreview.path === storagePath
          ? signedPreview.url
          : null;

  useEffect(() => {
    let cancelled = false;

    if (!document || document.type === 'link' || document.type === 'internal' || !storagePath) {
      return undefined;
    }

    getFileUrl(storagePath).then((url) => {
      if (!cancelled) {
        setSignedPreview({ path: storagePath, url });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [document, storagePath]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (!document) {
    return (
      <div className="text-center py-12 text-gray-500">
        {lang === 'en'
          ? 'Document not found.'
          : lang === 'es'
            ? 'Documento no encontrado.'
            : lang === 'zh'
              ? '\u627E\u4E0D\u5230\u8BE5\u6587\u6863\u3002'
              : 'Dokiman pa jwenn.'}
      </div>
    );
  }

  const linkedResources = (document.linkedResources ?? [])
    .map((rid) => resources.find((r) => r.id === rid))
    .filter(Boolean);

  return (
    <div>
      <Link to="/public" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        &larr;{' '}
        {lang === 'en'
          ? 'Back'
          : lang === 'es'
            ? 'Volver'
            : lang === 'zh'
              ? '\u8FD4\u56DE'
              : 'Retounen'}
      </Link>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {typeIcon(document.type)} {getTranslatedText(document.title, lang)}
          </h1>
          <CategoryBadge category={document.category} lang={lang} />
        </div>
      </div>

      {getTranslatedText(document.description, lang) && (
        <p className="text-gray-700 mb-6">{getTranslatedText(document.description, lang)}</p>
      )}

      {/* Document Preview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">
            {lang === 'en'
              ? 'Preview'
              : lang === 'es'
                ? 'Vista previa'
                : lang === 'zh'
                  ? '\u9884\u89C8'
                  : 'Apèsi'}
          </h2>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              {lang === 'en'
                ? 'View Document'
                : lang === 'es'
                  ? 'Ver documento'
                  : lang === 'zh'
                    ? '\u67E5\u770B\u6587\u6863'
                    : 'Gade dokiman an'}
            </a>
          )}
        </div>
        <PublicDocumentPreview document={document} lang={lang} />
      </div>

      {/* Language Availability */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">
          {lang === 'en'
            ? 'Available Languages'
            : lang === 'es'
              ? 'Idiomas Disponibles'
              : lang === 'zh'
                ? '\u53EF\u7528\u8BED\u8A00'
                : 'Lang ki disponib'}
        </h2>
        <div className="flex gap-3">
          {SUPPORTED_LANGUAGES.map((l) => {
            const langInfo = document.languages?.[l.code];
            const available = langInfo?.available;
            return (
              <div
                key={l.code}
                className={`px-3 py-2 rounded border text-sm ${
                  available
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                {l.flag} {LANGUAGE_LABELS[l.code]}
                {available && langInfo?.storagePath && (
                  <PublicSignedLink storagePath={langInfo.storagePath} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Linked Resources */}
      {linkedResources.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">
            {lang === 'en'
              ? 'Related Resources'
              : lang === 'es'
                ? 'Recursos Relacionados'
                : lang === 'zh'
                  ? '\u76F8\u5173\u8D44\u6E90'
                  : 'Resous ki gen rapò'}
          </h2>
          <div className="space-y-1">
            {linkedResources.map((r) => (
              <Link
                key={r!.id}
                to={`/public/resources/${r!.id}`}
                className="block text-sm text-blue-600 hover:underline"
              >
                {getTranslatedText(r!.name, lang)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PublicSignedLink({ storagePath }: { storagePath: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getFileUrl(storagePath).then((signedUrl) => {
      if (!cancelled) setUrl(signedUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [storagePath]);

  if (!url) return null;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs underline">
      View
    </a>
  );
}

function PublicDocumentPreview({
  document: doc,
  lang,
}: {
  document: ServiceDocument;
  lang: LanguageCode;
}) {
  const langFile = doc.languages?.[lang];
  const langStoragePath = langFile?.available ? langFile.storagePath : null;
  const enFile = doc.languages?.en;
  const enStoragePath = enFile?.available ? enFile.storagePath : null;
  const storagePath = langStoragePath ?? enStoragePath;

  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!storagePath || doc.type === 'link' || doc.type === 'internal') return;

    let cancelled = false;
    getFileUrl(storagePath).then((url) => {
      if (!cancelled) setSignedUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [storagePath, doc.type]);

  if (doc.type === 'link' && doc.source?.url) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
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

  if (doc.type === 'internal') {
    const content = getTranslatedText(doc.source?.internalContent ?? {}, lang);
    if (content) {
      return <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">{content}</div>;
    }
    return <p className="text-sm text-gray-500">No content available.</p>;
  }

  if (doc.type === 'pdf') {
    if (signedUrl) {
      return <iframe src={signedUrl} className="w-full h-96 border rounded" title="PDF Preview" />;
    }
    if (storagePath) {
      return <p className="text-sm text-gray-500">Loading preview...</p>;
    }
    return <p className="text-sm text-gray-500">No PDF available.</p>;
  }

  if (doc.type === 'image') {
    if (signedUrl) {
      return (
        <img
          src={signedUrl}
          alt={getTranslatedText(doc.title, lang)}
          className="max-w-full max-h-96 rounded border"
        />
      );
    }
    if (storagePath) {
      return <p className="text-sm text-gray-500">Loading preview...</p>;
    }
    return <p className="text-sm text-gray-500">No image available.</p>;
  }

  return <p className="text-sm text-gray-500">No preview available.</p>;
}
