import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import SearchBar from '../features/search/SearchBar';

export default function Header() {
  const { volunteer, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between print:hidden">
      <Link to="/" className="text-xl font-bold text-blue-700 whitespace-nowrap">
        Social Service Desk
      </Link>

      <div className="flex-1 max-w-xl mx-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3">
        {volunteer && (
          <span className="text-sm text-gray-600 hidden sm:inline">
            {volunteer.name}
            {volunteer.role === 'admin' && (
              <span className="ml-1 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                Admin
              </span>
            )}
          </span>
        )}
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
