import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PublicDataProvider } from '../PublicDataProvider';
import { usePublicData } from '../usePublicData';

function Consumer() {
  const { resources, documents, tags, loading } = usePublicData();
  if (loading) return <div>Loading</div>;
  return (
    <div>
      <span data-testid="resources">{resources.length}</span>
      <span data-testid="documents">{documents.length}</span>
      <span data-testid="tags">{Array.isArray(tags) ? 'array' : 'missing'}</span>
    </div>
  );
}

describe('PublicDataProvider (local mode)', () => {
  it('provides mock data when local mode is enabled', () => {
    const original = import.meta.env.VITE_LOCAL_MODE;
    import.meta.env.VITE_LOCAL_MODE = 'true';

    render(
      <PublicDataProvider>
        <Consumer />
      </PublicDataProvider>,
    );

    expect(screen.getByTestId('resources').textContent).not.toBe('0');
    expect(screen.getByTestId('documents').textContent).not.toBe('0');

    import.meta.env.VITE_LOCAL_MODE = original;
  });

  it('exposes tags as an array in local mode context value', () => {
    render(
      <PublicDataProvider>
        <Consumer />
      </PublicDataProvider>,
    );

    expect(screen.getByTestId('tags').textContent).toBe('array');
  });
});
