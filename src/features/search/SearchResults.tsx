import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../../app/useData';
import { getTranslatedText } from '../../shared/lib/translationUtils';
function searchMultilingual(field: Record<string, string> | undefined, query: string): boolean {
  if (!field) return false;
  const q = query.toLowerCase();
  return Object.values(field).some((val) => val?.toLowerCase().includes(q));
}

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const { resources, documents, guests } = useData();

  const results = useMemo(() => {
    if (!query.trim()) return { resources: [], documents: [], guests: [] };
    const q = query.toLowerCase();

    const matchedResources = resources.filter(
      (r) =>
        searchMultilingual(r.name as Record<string, string>, query) ||
        searchMultilingual(r.description as Record<string, string>, query) ||
        r.category?.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q)) ||
        r.address?.toLowerCase().includes(q),
    );

    const matchedDocuments = documents.filter(
      (d) =>
        searchMultilingual(d.title as Record<string, string>, query) ||
        searchMultilingual(d.description as Record<string, string>, query) ||
        d.category?.toLowerCase().includes(q) ||
        d.tags?.some((t) => t.toLowerCase().includes(q)),
    );

    const matchedGuests = guests.filter(
      (g) =>
        g.firstName?.toLowerCase().includes(q) ||
        g.lastInitial?.toLowerCase().includes(q) ||
        g.needs?.some((n) => n.toLowerCase().includes(q)) ||
        g.quickNotes?.some((n) => n.text?.toLowerCase().includes(q)),
    );

    return { resources: matchedResources, documents: matchedDocuments, guests: matchedGuests };
  }, [query, resources, documents, guests]);

  const totalResults = results.resources.length + results.documents.length + results.guests.length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h1>
      <p className="text-sm text-gray-500 mb-6">
        {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
      </p>

      {totalResults === 0 && <p className="text-center py-12 text-gray-500">No results found.</p>}

      {results.resources.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-2">
            Resources ({results.resources.length})
          </h2>
          <div className="space-y-2">
            {results.resources.map((r) => (
              <Link
                key={r.id}
                to={`/resources/${r.id}`}
                className="block p-3 border rounded hover:bg-gray-50 text-sm"
              >
                🏠 {getTranslatedText(r.name, 'en')}
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.documents.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-2">
            Documents ({results.documents.length})
          </h2>
          <div className="space-y-2">
            {results.documents.map((d) => (
              <Link
                key={d.id}
                to={`/documents/${d.id}`}
                className="block p-3 border rounded hover:bg-gray-50 text-sm"
              >
                📄 {getTranslatedText(d.title, 'en')}
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.guests.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-2">Guests ({results.guests.length})</h2>
          <div className="space-y-2">
            {results.guests.map((g) => (
              <Link
                key={g.id}
                to={`/guests/${g.id}`}
                className="block p-3 border rounded hover:bg-gray-50 text-sm"
              >
                👤 {g.firstName} {g.lastInitial}.
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
