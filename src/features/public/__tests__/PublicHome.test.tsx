import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import PublicHome from '../PublicHome';
import type { Resource, ServiceDocument, Tag } from '../../../shared/types';

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
  tags: [] as Tag[],
  loading: false,
  error: null as string | null,
};

vi.mock('../usePublicData', () => ({
  usePublicData: () => mockPublicData,
}));

const now = Timestamp.fromDate(new Date(0));

function makeResource(
  id: string,
  name: string,
  category: Resource['category'] = 'other',
  tagIds: string[] = [],
): Resource {
  return {
    id,
    name: { en: name },
    description: { en: '' },
    category,
    address: '',
    phone: '',
    website: '',
    operatingHours: [],
    tags: [],
    tagIds,
    notes: [],
    feedbackSummary: { upvotes: 0, downvotes: 0 },
    linkedDocuments: [],
    translationStatus: {},
    createdBy: 'u1',
    createdAt: now,
    updatedAt: now,
  };
}

function makeDocument(
  id: string,
  title: string,
  category: ServiceDocument['category'] = 'other',
  tagIds: string[] = [],
): ServiceDocument {
  return {
    id,
    title: { en: title },
    description: { en: '' },
    category,
    type: 'pdf',
    source: { url: null, storagePath: null, internalContent: null },
    tags: [],
    tagIds,
    languages: { en: { available: true, storagePath: null } },
    linkedResources: [],
    translationStatus: {},
    printSettings: { paperSize: 'letter', orientation: 'portrait', showQRCode: false },
    createdBy: 'u1',
    createdAt: now,
    updatedAt: now,
  };
}

function makeTag(id: string, label: string): Tag {
  return { id, label, slug: label.toLowerCase(), createdAt: now };
}

function makeResourceWithBranches(
  id: string,
  name: string,
  branches: Resource['branches'],
): Resource {
  return {
    ...makeResource(id, name),
    branches,
  };
}

function renderPublicHome() {
  return render(
    <MemoryRouter>
      <PublicHome />
    </MemoryRouter>,
  );
}

describe('PublicHome — existing behaviour', () => {
  beforeEach(() => {
    outletContext = { lang: 'en', search: '' };
    mockPublicData.tags = [];
    mockPublicData.resources = [
      makeResource('r1', 'Food Pantry', 'food'),
      makeResource('r2', 'Shelter', 'housing'),
    ];
    mockPublicData.documents = [
      makeDocument('d1', 'Food Guide', 'food'),
      makeDocument('d2', 'Legal Aid', 'legal'),
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

describe('PublicHome — branch search', () => {
  beforeEach(() => {
    mockPublicData.tags = [];
    mockPublicData.documents = [];
  });

  it('matches resource by branch label', () => {
    mockPublicData.resources = [
      makeResourceWithBranches('r1', 'Legal Aid', [
        { id: 'b1', label: 'Downtown Office', address: '1 Court St' },
      ]),
    ];
    outletContext = { lang: 'en', search: 'Downtown Office' };
    renderPublicHome();
    expect(screen.getByText('Legal Aid')).toBeInTheDocument();
  });

  it('matches resource by branch address', () => {
    mockPublicData.resources = [
      makeResourceWithBranches('r1', 'Health Clinic', [
        { id: 'b1', label: 'East Branch', address: '99 Elm Street' },
      ]),
    ];
    outletContext = { lang: 'en', search: 'elm street' };
    renderPublicHome();
    expect(screen.getByText('Health Clinic')).toBeInTheDocument();
  });

  it('matches resource by branch phone', () => {
    mockPublicData.resources = [
      makeResourceWithBranches('r1', 'Health Clinic', [
        { id: 'b1', label: 'Branch', phone: '617-555-9999' },
      ]),
    ];
    outletContext = { lang: 'en', search: '617-555-9999' };
    renderPublicHome();
    expect(screen.getByText('Health Clinic')).toBeInTheDocument();
  });

  it('matches resource by branch email', () => {
    mockPublicData.resources = [
      makeResourceWithBranches('r1', 'Health Clinic', [
        { id: 'b1', label: 'Branch', email: 'east@clinic.org' },
      ]),
    ];
    outletContext = { lang: 'en', search: 'east@clinic.org' };
    renderPublicHome();
    expect(screen.getByText('Health Clinic')).toBeInTheDocument();
  });

  it('does not match resource when branch fields do not match query', () => {
    mockPublicData.resources = [
      makeResourceWithBranches('r1', 'Health Clinic', [
        { id: 'b1', label: 'Main Branch', address: '1 Oak St' },
      ]),
    ];
    outletContext = { lang: 'en', search: 'xyznotfound' };
    renderPublicHome();
    expect(screen.queryByText('Health Clinic')).not.toBeInTheDocument();
  });
});

describe('PublicHome — tag filter', () => {
  beforeEach(() => {
    outletContext = { lang: 'en', search: '' };
    mockPublicData.tags = [makeTag('t1', 'Emergency'), makeTag('t2', 'Long-Term')];
    mockPublicData.resources = [
      makeResource('r1', 'Crisis Center', 'housing', ['t1']),
      makeResource('r2', 'Job Training', 'employment', ['t2']),
      makeResource('r3', 'Food Bank', 'food', []),
    ];
    mockPublicData.documents = [
      makeDocument('d1', 'Emergency Guide', 'other', ['t1']),
      makeDocument('d2', 'Long-Term Plan', 'other', ['t2']),
    ];
  });

  it('renders tag filter pills when tags exist', () => {
    renderPublicHome();
    expect(screen.getByRole('button', { name: 'Emergency' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Long-Term' })).toBeInTheDocument();
  });

  it('does not render tag filter section when tags array is empty', () => {
    mockPublicData.tags = [];
    renderPublicHome();
    expect(screen.queryByRole('button', { name: 'Emergency' })).not.toBeInTheDocument();
  });

  it('selecting a tag filters resources to those with matching tagId', async () => {
    const user = userEvent.setup();
    renderPublicHome();

    await user.click(screen.getByRole('button', { name: 'Emergency' }));

    expect(screen.getByText('Crisis Center')).toBeInTheDocument();
    expect(screen.queryByText('Job Training')).not.toBeInTheDocument();
    expect(screen.queryByText('Food Bank')).not.toBeInTheDocument();
  });

  it('selecting a tag filters documents to those with matching tagId', async () => {
    const user = userEvent.setup();
    renderPublicHome();

    await user.click(screen.getByRole('button', { name: 'Emergency' }));

    expect(screen.getByText(/Emergency Guide/)).toBeInTheDocument();
    expect(screen.queryByText(/Long-Term Plan/)).not.toBeInTheDocument();
  });

  it('selecting two tag pills shows items matching either tag (OR logic)', async () => {
    const user = userEvent.setup();
    renderPublicHome();

    await user.click(screen.getByRole('button', { name: 'Emergency' }));
    await user.click(screen.getByRole('button', { name: 'Long-Term' }));

    expect(screen.getByText('Crisis Center')).toBeInTheDocument();
    expect(screen.getByText('Job Training')).toBeInTheDocument();
    expect(screen.queryByText('Food Bank')).not.toBeInTheDocument();
  });

  it('deselecting a tag pill restores unfiltered results', async () => {
    const user = userEvent.setup();
    renderPublicHome();

    await user.click(screen.getByRole('button', { name: 'Emergency' }));
    expect(screen.queryByText('Job Training')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Emergency' }));
    expect(screen.getByText('Crisis Center')).toBeInTheDocument();
    expect(screen.getByText('Job Training')).toBeInTheDocument();
    expect(screen.getByText('Food Bank')).toBeInTheDocument();
  });

  it('tag filter and category filter combine with AND logic', async () => {
    const user = userEvent.setup();
    // r1: housing + t1, r2: employment + t2, r3: food + none
    // Select category "Housing & Shelter" and tag "Long-Term"
    // → no items should match (r1 is housing but has t1, not t2)
    renderPublicHome();

    await user.click(screen.getByRole('button', { name: /Housing & Shelter/i }));
    await user.click(screen.getByRole('button', { name: 'Long-Term' }));

    expect(screen.queryByText('Crisis Center')).not.toBeInTheDocument();
    expect(screen.queryByText('Job Training')).not.toBeInTheDocument();
  });
});
