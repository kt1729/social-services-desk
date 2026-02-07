import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import type { CategoryKey } from '../shared/types';

export type CategoryFilter = CategoryKey | null;

export default function Layout() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(null);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <Outlet context={{ selectedCategory, setSelectedCategory }} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
