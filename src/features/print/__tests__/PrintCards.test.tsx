import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';
import type { Resource, ServiceDocument } from '../../../shared/types';
import PrintResourceCard from '../PrintResourceCard';
import PrintDocumentCard from '../PrintDocumentCard';

vi.mock('firebase/firestore', () => ({
  Timestamp: { now: vi.fn(() => ({ seconds: 0, nanoseconds: 0 })) },
}));

// DOMPurify is a no-op in jsdom but strips script/event handlers
vi.mock('dompurify', () => ({
  default: { sanitize: (html: string) => html },
}));

const now = { seconds: 0, nanoseconds: 0 } as unknown as Timestamp;

function makeResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 'r1',
    name: { en: 'Food Pantry' },
    description: { en: '' },
    category: 'food',
    address: '123 Main St',
    phone: '555-0100',
    website: '',
    operatingHours: [],
    tags: [],
    tagIds: [],
    notes: [],
    feedbackSummary: { upvotes: 0, downvotes: 0 },
    linkedDocuments: [],
    translationStatus: {},
    createdBy: 'u1',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function makeDocument(overrides: Partial<ServiceDocument> = {}): ServiceDocument {
  return {
    id: 'd1',
    title: { en: 'Housing Guide' },
    description: { en: '' },
    type: 'link',
    source: { url: 'https://example.com', storagePath: null, internalContent: null },
    category: 'housing',
    tags: [],
    tagIds: [],
    linkedResources: [],
    languages: {},
    translationStatus: {},
    printSettings: { paperSize: 'letter', orientation: 'portrait', showQRCode: false },
    createdBy: 'u1',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('PrintResourceCard', () => {
  it('renders HTML description without exposing raw tags', () => {
    render(
      <PrintResourceCard
        resource={makeResource({ description: { en: '<p><strong>Bold text</strong></p>' } })}
        lang="en"
      />,
    );
    expect(screen.queryByText(/<p>/)).not.toBeInTheDocument();
    expect(screen.queryByText(/<strong>/)).not.toBeInTheDocument();
    expect(screen.getByText('Bold text')).toBeInTheDocument();
  });

  it('renders branch label and address when branches are present', () => {
    render(
      <PrintResourceCard
        resource={makeResource({
          branches: [
            { id: 'b1', label: 'Downtown', address: '1 Main St', phone: '555-1111' },
            { id: 'b2', label: 'Eastside', address: '2 Oak Ave' },
          ],
        })}
        lang="en"
      />,
    );
    expect(screen.getByText('Locations:')).toBeInTheDocument();
    expect(screen.getByText('Downtown')).toBeInTheDocument();
    expect(screen.getByText(/1 Main St/)).toBeInTheDocument();
    expect(screen.getByText('Eastside')).toBeInTheDocument();
    expect(screen.getByText(/2 Oak Ave/)).toBeInTheDocument();
  });

  it('does not render Locations section when branches is empty', () => {
    render(<PrintResourceCard resource={makeResource({ branches: [] })} lang="en" />);
    expect(screen.queryByText('Locations:')).not.toBeInTheDocument();
  });

  it('does not render Locations section when branches is undefined', () => {
    render(<PrintResourceCard resource={makeResource({ branches: undefined })} lang="en" />);
    expect(screen.queryByText('Locations:')).not.toBeInTheDocument();
  });
});

describe('PrintDocumentCard', () => {
  it('renders HTML description without exposing raw tags', () => {
    render(
      <PrintDocumentCard
        document={makeDocument({
          description: { en: '<ul><li>Step one</li><li>Step two</li></ul>' },
        })}
        lang="en"
      />,
    );
    expect(screen.queryByText(/<ul>/)).not.toBeInTheDocument();
    expect(screen.queryByText(/<li>/)).not.toBeInTheDocument();
    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('Step two')).toBeInTheDocument();
  });
});
