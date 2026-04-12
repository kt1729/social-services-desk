import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const DEBOUNCE_MS = 300;

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Debounced navigation — only when user types (onChange sets query, which triggers this)
  // Guard: skip if not on search page to prevent bouncing back after clicking a result
  useEffect(() => {
    clearTimer();

    if (query.trim() && isSearchPage) {
      timerRef.current = setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`, { replace: true });
      }, DEBOUNCE_MS);
    }

    return clearTimer;
  }, [query, navigate, isSearchPage, clearTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // If typing from a non-search page, navigate immediately (no debounce needed for first nav)
    if (!isSearchPage && value.trim()) {
      clearTimer();
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearTimer();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Show empty input when not on search page
  const displayValue = isSearchPage ? query : '';

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder="Search resources, documents, guests..."
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <svg
        className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </form>
  );
}
