import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import DocumentCard from '../DocumentCard';
import type { ServiceDocument } from '../../../shared/types';

vi.mock('../../../app/useData', () => ({
  useData: () => ({
    resources: [
      { id: 'r1', name: { en: 'Food Bank' } },
      { id: 'r2', name: { en: 'Shelter' } },
    ],
  }),
}));

function makeDoc(overrides: Partial<ServiceDocument> = {}): ServiceDocument {
  return {
    id: 'doc1',
    title: { en: 'Test Document' },
    description: { en: 'A test document description' },
    type: 'pdf',
    source: { url: null, storagePath: null, internalContent: null },
    category: 'food',
    tags: [],
    tagIds: [],
    linkedResources: [],
    languages: {},
    translationStatus: {},
    printSettings: { paperSize: 'letter', orientation: 'portrait', showQRCode: true },
    createdBy: 'vol1',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    ...overrides,
  };
}

function renderCard(doc: ServiceDocument) {
  return render(
    <MemoryRouter>
      <DocumentCard document={doc} />
    </MemoryRouter>,
  );
}

describe('DocumentCard', () => {
  it('renders document title', () => {
    renderCard(makeDoc());
    expect(screen.getByText(/Test Document/)).toBeInTheDocument();
  });

  it('renders document description', () => {
    renderCard(makeDoc());
    expect(screen.getByText('A test document description')).toBeInTheDocument();
  });

  it('strips HTML tags from description excerpt', () => {
    renderCard(makeDoc({ description: { en: '<p><strong>Important</strong> guide for access.</p>' } }));
    expect(screen.queryByText(/<strong>/)).not.toBeInTheDocument();
    expect(screen.getByText(/Important/)).toBeInTheDocument();
  });

  it('does not render raw HTML list tags in description', () => {
    renderCard(makeDoc({ description: { en: '<ul><li>Step one</li></ul>' } }));
    expect(screen.queryByText(/<ul>/)).not.toBeInTheDocument();
    expect(screen.getByText(/Step one/)).toBeInTheDocument();
  });

  it('renders type icon for PDF', () => {
    renderCard(makeDoc({ type: 'pdf' }));
    expect(screen.getByText(/📄/)).toBeInTheDocument();
  });

  it('renders type icon for link', () => {
    renderCard(makeDoc({ type: 'link' }));
    expect(screen.getByText(/🔗/)).toBeInTheDocument();
  });

  it('renders type icon for internal', () => {
    renderCard(makeDoc({ type: 'internal' }));
    expect(screen.getByText(/📝/)).toBeInTheDocument();
  });

  it('renders type icon for image', () => {
    renderCard(makeDoc({ type: 'image' }));
    expect(screen.getByText(/🖼️/)).toBeInTheDocument();
  });

  it('renders category badge', () => {
    renderCard(makeDoc({ category: 'food' }));
    expect(screen.getByText(/🍽️/)).toBeInTheDocument();
  });

  it('renders language availability flags', () => {
    renderCard(
      makeDoc({
        languages: {
          en: { available: true, storagePath: null },
          es: { available: true, storagePath: null },
          zh: { available: false, storagePath: null },
        },
      }),
    );
    expect(screen.getByText(/EN/)).toBeInTheDocument();
    expect(screen.getByText(/ES/)).toBeInTheDocument();
    expect(screen.queryByText(/ZH/)).not.toBeInTheDocument();
  });

  it('renders linked resources count', () => {
    renderCard(makeDoc({ linkedResources: ['r1', 'r2'] }));
    expect(screen.getByText(/Linked to 2 resources/)).toBeInTheDocument();
  });

  it('does not render linked resources text when none', () => {
    renderCard(makeDoc({ linkedResources: [] }));
    expect(screen.queryByText(/Linked to/)).not.toBeInTheDocument();
  });

  it('links to the document detail page', () => {
    renderCard(makeDoc({ id: 'abc123' }));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/documents/abc123');
  });
});
