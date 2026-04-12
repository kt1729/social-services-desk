import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../shared/lib/categories';
import { useData } from './useData';
import { NON_EN_LANGUAGES, LANGUAGE_LABELS, type NonEnLanguageCode } from '../shared/lib/languages';
import type { CategoryKey } from '../shared/types';
import type { ViewMode } from './Layout';

interface SidebarProps {
  selectedCategory: CategoryKey | null;
  onCategorySelect: (category: CategoryKey | null) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function Sidebar({
  selectedCategory,
  onCategorySelect,
  viewMode,
  onViewModeChange,
}: SidebarProps) {
  const location = useLocation();
  const { resources, documents } = useData();
  const isResourcesPage = location.pathname === '/' || location.pathname.startsWith('/resources');

  const translationPercentages = NON_EN_LANGUAGES.map((lang) => {
    const allItems = [...resources, ...documents];
    const total = allItems.length;
    if (total === 0) return { lang, pct: 0 };
    const complete = allItems.filter(
      (i) =>
        (i.translationStatus as Record<NonEnLanguageCode, string> | undefined)?.[lang] ===
        'complete',
    ).length;
    return { lang, pct: Math.round((complete / total) * 100) };
  });

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0 print-hidden">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Show</h3>
        <div className="flex gap-1 mb-4">
          <button
            onClick={() => onViewModeChange('all')}
            className={`flex-1 px-3 py-1.5 rounded text-sm text-center ${
              viewMode === 'all'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onViewModeChange('recent')}
            className={`flex-1 px-3 py-1.5 rounded text-sm text-center ${
              viewMode === 'recent'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            Recent
          </button>
        </div>

        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Views</h3>
        <nav className="space-y-1 mb-6">
          <Link
            to="/"
            className={`block px-3 py-2 rounded text-sm ${
              location.pathname === '/'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Resources
          </Link>
          <Link
            to="/guests"
            className={`block px-3 py-2 rounded text-sm ${
              location.pathname.startsWith('/guests')
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Guests
          </Link>
          <Link
            to="/documents"
            className={`block px-3 py-2 rounded text-sm ${
              location.pathname.startsWith('/documents')
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Documents
          </Link>
          <Link
            to="/notes"
            className={`block px-3 py-2 rounded text-sm ${
              location.pathname === '/notes'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Notes
          </Link>
        </nav>

        {isResourcesPage && (
          <>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Filter by Category
            </h3>
            <nav className="space-y-0.5 mb-6">
              <button
                onClick={() => onCategorySelect(null)}
                className={`block w-full text-left px-3 py-1.5 rounded text-sm ${
                  selectedCategory === null
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => onCategorySelect(cat.key)}
                  className={`block w-full text-left px-3 py-1.5 rounded text-sm ${
                    selectedCategory === cat.key
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.icon} {cat.labels.en}
                </button>
              ))}
            </nav>
          </>
        )}

        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Translation
        </h3>
        <div className="mb-2">
          <div className="flex gap-2 mb-2">
            {translationPercentages.map(({ lang, pct }) => (
              <div key={lang} className="text-center flex-1">
                <div
                  className={`text-sm font-bold ${pct === 100 ? 'text-green-600' : pct > 50 ? 'text-yellow-600' : 'text-red-600'}`}
                >
                  {pct}%
                </div>
                <div className="text-[10px] text-gray-500">{LANGUAGE_LABELS[lang]}</div>
              </div>
            ))}
          </div>
        </div>
        <nav>
          <Link
            to="/translation"
            className={`block px-3 py-2 rounded text-sm ${
              location.pathname === '/translation'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            View Dashboard
          </Link>
        </nav>
      </div>
    </aside>
  );
}
