import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import ResourceCard from '../ResourceCard';
import type { Resource } from '../../../shared/types';

function makeResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 'res-1',
    name: { en: 'Food Pantry' },
    description: { en: 'Weekly groceries.' },
    category: 'food',
    address: '123 Main St',
    phone: '555-0100',
    website: '',
    operatingHours: [],
    tags: [],
    tagIds: [],
    notes: [],
    feedbackSummary: { upvotes: 3, downvotes: 1 },
    linkedDocuments: [],
    translationStatus: {},
    createdBy: 'vol1',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    ...overrides,
  };
}

function renderCard(resource: Resource) {
  return render(
    <MemoryRouter>
      <ResourceCard resource={resource} />
    </MemoryRouter>,
  );
}

describe('ResourceCard', () => {
  it('renders resource name', () => {
    renderCard(makeResource());
    expect(screen.getByText('Food Pantry')).toBeInTheDocument();
  });

  it('renders plain-text description', () => {
    renderCard(makeResource({ description: { en: 'Weekly groceries.' } }));
    expect(screen.getByText('Weekly groceries.')).toBeInTheDocument();
  });

  it('strips HTML tags from description excerpt', () => {
    renderCard(
      makeResource({
        description: { en: '<p><strong>Bold meal service</strong> available daily.</p>' },
      }),
    );
    // HTML tags must not appear as raw text
    expect(screen.queryByText(/<strong>/)).not.toBeInTheDocument();
    // Visible text content should be present
    expect(screen.getByText(/Bold meal service/)).toBeInTheDocument();
  });

  it('does not render raw HTML entities from description', () => {
    renderCard(
      makeResource({ description: { en: '<ul><li>Item 1</li><li>Item 2</li></ul>' } }),
    );
    expect(screen.queryByText(/<ul>/)).not.toBeInTheDocument();
    expect(screen.getByText(/Item 1/)).toBeInTheDocument();
  });

  it('renders address', () => {
    renderCard(makeResource());
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
  });

  it('renders phone number', () => {
    renderCard(makeResource());
    expect(screen.getByText(/555-0100/)).toBeInTheDocument();
  });

  it('renders feedback counts', () => {
    renderCard(makeResource({ feedbackSummary: { upvotes: 5, downvotes: 2 }, phone: '' }));
    expect(screen.getByText(/👍\s*5/)).toBeInTheDocument();
    expect(screen.getByText(/👎\s*2/)).toBeInTheDocument();
  });

  it('links to the resource detail page', () => {
    renderCard(makeResource({ id: 'abc123' }));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/resources/abc123');
  });
});
