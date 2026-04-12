import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import SearchBar from '../features/search/SearchBar';
import ResourceForm from '../features/resources/ResourceForm';
import GuestForm from '../features/guests/GuestForm';
import DocumentForm from '../features/documents/DocumentForm';

export default function Header() {
  const { volunteer, logout } = useAuth();
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowNewMenu(false);
      }
    }
    if (showNewMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNewMenu]);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between print-hidden">
        <Link to="/" className="text-xl font-bold text-blue-700 whitespace-nowrap">
          Social Service Desk
        </Link>

        <div className="flex-1 max-w-xl mx-4">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowNewMenu((v) => !v)}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              + New
            </button>
            {showNewMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    setShowNewMenu(false);
                    setShowResourceForm(true);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Resource
                </button>
                <button
                  onClick={() => {
                    setShowNewMenu(false);
                    setShowGuestForm(true);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Guest
                </button>
                <button
                  onClick={() => {
                    setShowNewMenu(false);
                    setShowDocumentForm(true);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Document
                </button>
              </div>
            )}
          </div>

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

      <ResourceForm open={showResourceForm} onClose={() => setShowResourceForm(false)} />
      <GuestForm open={showGuestForm} onClose={() => setShowGuestForm(false)} />
      <DocumentForm open={showDocumentForm} onClose={() => setShowDocumentForm(false)} />
    </>
  );
}
