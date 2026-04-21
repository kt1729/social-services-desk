import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import type { CategoryKey } from '../shared/types';

export type CategoryFilter = CategoryKey | null;
export type ViewMode = 'all' | 'recent';

export default function Layout() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  return (
    <div className="h-screen flex flex-col print:h-auto print:block">
      <Header />
      <div className="flex flex-1 overflow-hidden print:overflow-visible print:h-auto print:block">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-white print:overflow-visible print:h-auto">
          <Outlet context={{ selectedCategory, setSelectedCategory, viewMode, setViewMode }} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
