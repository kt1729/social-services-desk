import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategoryBadge from '../CategoryBadge';

describe('CategoryBadge', () => {
  it('renders category icon and English label by default', () => {
    render(<CategoryBadge category="housing" />);
    expect(screen.getByText(/🏠/)).toBeInTheDocument();
    expect(screen.getByText(/Housing & Shelter/)).toBeInTheDocument();
  });

  it('renders translated label for specified language', () => {
    render(<CategoryBadge category="food" lang="es" />);
    expect(screen.getByText(/Alimentos y Comidas/)).toBeInTheDocument();
  });

  it('renders Chinese label correctly', () => {
    render(<CategoryBadge category="medical" lang="zh" />);
    expect(screen.getByText(/医疗与健康/)).toBeInTheDocument();
  });

  it('renders Haitian Creole label correctly', () => {
    render(<CategoryBadge category="employment" lang="ht" />);
    expect(screen.getByText(/Travay/)).toBeInTheDocument();
  });

  it('renders with correct icon for each category', () => {
    const { rerender } = render(<CategoryBadge category="food" />);
    expect(screen.getByText(/🍽️/)).toBeInTheDocument();

    rerender(<CategoryBadge category="legal" />);
    expect(screen.getByText(/⚖️/)).toBeInTheDocument();
  });
});
