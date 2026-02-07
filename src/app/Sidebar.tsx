import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../shared/lib/categories';
import type { CategoryKey } from '../shared/types';

interface SidebarProps {
  selectedCategory: CategoryKey | null;
  onCategorySelect: (category: CategoryKey | null) => void;
}

export default function Sidebar({ selectedCategory, onCategorySelect }: SidebarProps) {
  const location = useLocation();
  const isResourcesPage = location.pathname === '/' || location.pathname.startsWith('/resources');

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0 print:hidden">
      <div className="p-4">
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
        <nav>
          <Link
            to="/translation"
            className={`block px-3 py-2 rounded text-sm ${
              location.pathname === '/translation'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Translation Status
          </Link>
        </nav>
      </div>
    </aside>
  );
}
