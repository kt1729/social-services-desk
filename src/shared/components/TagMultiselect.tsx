import { useState, useRef, useEffect } from 'react';
import type { Tag } from '../types';

interface TagMultiselectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  tags: Tag[];
  tagsLoading?: boolean;
  placeholder?: string;
}

export default function TagMultiselect({
  value,
  onChange,
  tags,
  tagsLoading = false,
  placeholder = 'Select tags…',
}: TagMultiselectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedTags = value
    .map((id) => tags.find((t) => t.id === id))
    .filter((t): t is Tag => t !== undefined);

  const filtered = tags.filter((t) => t.label.toLowerCase().includes(search.toLowerCase()));

  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  function remove(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(value.filter((v) => v !== id));
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSearch('');
        }}
        className="w-full min-h-[38px] flex flex-wrap items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedTags.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
            >
              {tag.label}
              <span
                role="button"
                tabIndex={0}
                aria-label={`Remove ${tag.label}`}
                onClick={(e) => remove(tag.id, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(value.filter((v) => v !== tag.id));
                  }
                }}
                className="cursor-pointer hover:text-blue-600 leading-none"
              >
                ×
              </span>
            </span>
          ))
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 flex flex-col">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags…"
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {tagsLoading ? (
              <div className="p-3 text-center text-sm text-gray-500">Loading…</div>
            ) : filtered.length === 0 && tags.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500">
                No tags yet.{' '}
                <a href="/tags" className="text-blue-600 hover:underline">
                  Create tags in Settings → Tags.
                </a>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500">No matching tags.</div>
            ) : (
              filtered.map((tag) => {
                const selected = value.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggle(tag.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 ${
                      selected ? 'text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="w-4 text-center">{selected ? '✓' : ''}</span>
                    {tag.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
