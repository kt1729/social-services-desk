import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../app/useData';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import CategoryBadge from '../../shared/components/CategoryBadge';

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents } = useData();

  const document = documents.find((d) => d.id === id);
  if (!document) {
    return <div className="text-center py-12 text-gray-500">Document not found.</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/documents')}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Back to Documents
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {getTranslatedText(document.title, 'en')}
      </h1>
      <CategoryBadge category={document.category} />

      <p className="text-gray-700 mt-4">{getTranslatedText(document.description, 'en')}</p>

      {document.type === 'link' && document.source?.url && (
        <p className="mt-4">
          🔗{' '}
          <a
            href={document.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {document.source.url}
          </a>
        </p>
      )}

      {document.type === 'internal' && document.source?.internalContent?.en && (
        <div className="mt-4 bg-gray-50 rounded p-4 text-sm whitespace-pre-wrap">
          {document.source.internalContent.en}
        </div>
      )}
    </div>
  );
}
