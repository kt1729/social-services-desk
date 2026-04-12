import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import type { CategoryKey } from '../../shared/types';

vi.mock('../useData', () => ({
  useData: () => ({
    resources: [
      { id: 'r1', translationStatus: { es: 'complete', zh: 'complete', ht: 'complete' } },
      { id: 'r2', translationStatus: { es: 'complete', zh: 'missing', ht: 'missing' } },
    ],
    documents: [
      { id: 'd1', translationStatus: { es: 'complete', zh: 'complete', ht: 'complete' } },
    ],
  }),
}));

function renderSidebar(
  props: {
    viewMode?: 'all' | 'recent';
    selectedCategory?: CategoryKey | null;
    route?: string;
  } = {},
) {
  const { viewMode = 'all', selectedCategory = null, route = '/' } = props;
  const onCategorySelect = vi.fn();
  const onViewModeChange = vi.fn();
  return {
    onCategorySelect,
    onViewModeChange,
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <Sidebar
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </MemoryRouter>,
    ),
  };
}

describe('Sidebar', () => {
  it('renders navigation links', () => {
    renderSidebar();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Guests')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('renders All/Recent view toggle buttons', () => {
    renderSidebar();
    // "All" appears as both view toggle and category filter; just check at least one exists
    const allButtons = screen.getAllByRole('button', { name: 'All' });
    expect(allButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: 'Recent' })).toBeInTheDocument();
  });

  it('highlights "All" button when viewMode is all', () => {
    renderSidebar({ viewMode: 'all' });
    const allButtons = screen.getAllByRole('button', { name: 'All' });
    // First "All" button is the view mode toggle
    expect(allButtons[0].className).toContain('bg-blue-600');
  });

  it('highlights "Recent" button when viewMode is recent', () => {
    renderSidebar({ viewMode: 'recent' });
    const recentBtn = screen.getByRole('button', { name: 'Recent' });
    expect(recentBtn.className).toContain('bg-blue-600');
  });

  it('calls onViewModeChange when clicking view toggle', async () => {
    const user = userEvent.setup();
    const { onViewModeChange } = renderSidebar({ viewMode: 'all' });

    await user.click(screen.getByRole('button', { name: 'Recent' }));
    expect(onViewModeChange).toHaveBeenCalledWith('recent');
  });

  it('shows category filters on resources page', () => {
    renderSidebar({ route: '/' });
    expect(screen.getByText('Filter by Category')).toBeInTheDocument();
  });

  it('hides category filters on non-resources pages', () => {
    renderSidebar({ route: '/guests' });
    expect(screen.queryByText('Filter by Category')).not.toBeInTheDocument();
  });

  it('renders translation percentage summary', () => {
    renderSidebar();
    // With 3 items: es: 3/3=100%, zh: 2/3=67%, ht: 2/3=67%
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders "View Dashboard" link to translation page', () => {
    renderSidebar();
    const link = screen.getByText('View Dashboard');
    expect(link).toHaveAttribute('href', '/translation');
  });

  it('calls onCategorySelect when clicking a category', async () => {
    const user = userEvent.setup();
    const { onCategorySelect } = renderSidebar({ route: '/' });

    // Find the Housing category button (has emoji + text)
    const housingBtn = screen.getByText(/Housing/);
    await user.click(housingBtn);

    expect(onCategorySelect).toHaveBeenCalledWith('housing');
  });
});
