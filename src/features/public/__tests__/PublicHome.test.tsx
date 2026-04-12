import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PublicHome from '../PublicHome';
import { Timestamp } from 'firebase/firestore';
import type { Resource, ServiceDocument } from '../../../shared/types';

let outletContext = { lang: 'en' as const, search: '' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useOutletContext: () => outletContext,
  };
});

const mockPublicData = {
  resources: [] as Resource[],
  documents: [] as ServiceDocument[],
  loading: false,
  error: null as string | null,
};

vi.mock('../usePublicData', () => ({
  usePublicData: () => mockPublicData,
}));

function renderPublicHome() {
  return render(
    <MemoryRouter>
      <PublicHome />
    </MemoryRouter>,
  );
}

describe('PublicHome', () => {
  beforeEach(() => {
    const now = Timestamp.fromDate(new Date(0));

    outletContext = { lang: 'en', search: '' };
    mockPublicData.resources = [
      {
        id: 'r1',
        name: { en: 'Food Pantry' },
        description: { en: 'Free groceries weekly.' },
        category: 'food',
        address: '123 Main St',
        phone: '555-1111',
        website: 'https://example.org',
        operatingHours: [],
        tags: [],
        notes: [],
        feedbackSummary: { upvotes: 0, downvotes: 0 },
        linkedDocuments: [],
        translationStatus: {},
        createdBy: 'u1',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'r2',
        name: { en: 'Shelter' },
        description: { en: 'Overnight beds.' },
        category: 'housing',
        address: '456 Oak St',
        phone: '555-2222',
        website: '',
        operatingHours: [],
        tags: [],
        notes: [],
        feedbackSummary: { upvotes: 0, downvotes: 0 },
        linkedDocuments: [],
        translationStatus: {},
        createdBy: 'u1',
        createdAt: now,
        updatedAt: now,
      },
    ];
    mockPublicData.documents = [
      {
        id: 'd1',
        title: { en: 'Food Guide' },
        description: { en: 'How to access food support.' },
        category: 'food',
        type: 'pdf',
        source: { url: null, storagePath: 'docs/en.pdf', internalContent: null },
        tags: [],
        languages: { en: { available: true, storagePath: 'docs/en.pdf' } },
        linkedResources: [],
        translationStatus: {},
        printSettings: { paperSize: 'letter', orientation: 'portrait', showQRCode: false },
        createdBy: 'u1',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'd2',
        title: { en: 'Legal Aid' },
        description: { en: 'Know your rights.' },
        category: 'legal',
        type: 'pdf',
        source: { url: null, storagePath: 'docs/legal.pdf', internalContent: null },
        tags: [],
        languages: { en: { available: true, storagePath: 'docs/legal.pdf' } },
        linkedResources: [],
        translationStatus: {},
        printSettings: { paperSize: 'letter', orientation: 'portrait', showQRCode: false },
        createdBy: 'u1',
        createdAt: now,
        updatedAt: now,
      },
    ];
  });

  it('renders resources and documents when no search term', () => {
    renderPublicHome();
    expect(screen.getByText('Food Pantry')).toBeInTheDocument();
    expect(screen.getByText('Shelter')).toBeInTheDocument();
    expect(screen.getByText(/Food Guide/)).toBeInTheDocument();
    expect(screen.getByText(/Legal Aid/)).toBeInTheDocument();
  });

  it('filters resources and documents by search term', () => {
    outletContext = { lang: 'en', search: 'food' };
    renderPublicHome();

    expect(screen.getByText('Food Pantry')).toBeInTheDocument();
    expect(screen.getByText(/Food Guide/)).toBeInTheDocument();
    expect(screen.queryByText('Shelter')).not.toBeInTheDocument();
    expect(screen.queryByText(/Legal Aid/)).not.toBeInTheDocument();
  });

  it('matches search term case-insensitively', () => {
    outletContext = { lang: 'en', search: 'SHELTER' };
    renderPublicHome();

    expect(screen.getByText('Shelter')).toBeInTheDocument();
    expect(screen.queryByText('Food Pantry')).not.toBeInTheDocument();
  });
});
