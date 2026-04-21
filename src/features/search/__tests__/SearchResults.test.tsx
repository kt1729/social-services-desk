import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Timestamp } from 'firebase/firestore';
import type { Resource, ServiceDocument, Guest, Tag } from '../../../shared/types';

vi.mock('firebase/firestore', () => ({
  Timestamp: { now: vi.fn(() => ({ seconds: 0, nanoseconds: 0 })) },
}));

const mockData = {
  resources: [] as Resource[],
  documents: [] as ServiceDocument[],
  guests: [] as Guest[],
  tags: [] as Tag[],
  feedback: [],
  notes: [],
  volunteers: [],
  loading: false,
  getVolunteerName: () => 'Volunteer',
};

vi.mock('../../../app/useData', () => ({
  useData: () => mockData,
}));

import SearchResults from '../SearchResults';

const now = { seconds: 0, nanoseconds: 0 } as unknown as Timestamp;

function makeResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 'r1',
    name: { en: 'Test Resource' },
    description: { en: '' },
    category: 'food',
    address: '1 Main St',
    phone: '555-0100',
    website: '',
    operatingHours: [],
    branches: [],
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
    title: { en: 'Test Document' },
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

function makeGuest(overrides: Partial<Guest> = {}): Guest {
  return {
    id: 'g1',
    firstName: 'Maria',
    lastInitial: 'S',
    preferredLanguage: 'en',
    needs: [],
    quickNotes: [],
    visitLog: [],
    createdBy: 'u1',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function makeTag(overrides: Partial<Tag> = {}): Tag {
  return {
    id: 'tag1',
    label: 'walk-in',
    slug: 'walk-in',
    createdAt: now,
    ...overrides,
  };
}

function renderWithQuery(query: string) {
  return render(
    <MemoryRouter initialEntries={[`/search?q=${encodeURIComponent(query)}`]}>
      <SearchResults />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockData.resources = [];
  mockData.documents = [];
  mockData.guests = [];
  mockData.tags = [];
});

// --- Resource: existing fields ---

describe('SearchResults — resource name and address', () => {
  it('matches resource by English name', () => {
    mockData.resources = [makeResource({ id: 'r1', name: { en: 'Food Pantry' } })];
    renderWithQuery('pantry');
    expect(screen.getByRole('link', { name: /Food Pantry/ })).toBeInTheDocument();
  });

  it('matches resource by address', () => {
    mockData.resources = [
      makeResource({ id: 'r1', name: { en: 'Shelter' }, address: '42 Oak Ave' }),
    ];
    renderWithQuery('oak ave');
    expect(screen.getByRole('link', { name: /Shelter/ })).toBeInTheDocument();
  });

  it('matches resource by plain tags array', () => {
    mockData.resources = [makeResource({ id: 'r1', name: { en: 'Shelter' }, tags: ['emergency'] })];
    renderWithQuery('emergency');
    expect(screen.getByRole('link', { name: /Shelter/ })).toBeInTheDocument();
  });

  it('returns no results when query does not match anything', () => {
    mockData.resources = [makeResource({ id: 'r1', name: { en: 'Shelter' } })];
    renderWithQuery('xyznotfound');
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});

// --- Resource: tagIds resolved to labels ---

describe('SearchResults — resource tagIds', () => {
  it('matches resource when query matches a linked tag label', () => {
    mockData.tags = [makeTag({ id: 'tag1', label: 'walk-in' })];
    mockData.resources = [
      makeResource({ id: 'r1', name: { en: 'Community Center' }, tagIds: ['tag1'] }),
    ];
    renderWithQuery('walk-in');
    expect(screen.getByRole('link', { name: /Community Center/ })).toBeInTheDocument();
  });

  it('matches resource on partial tag label', () => {
    mockData.tags = [makeTag({ id: 'tag1', label: 'appointment required' })];
    mockData.resources = [makeResource({ id: 'r1', name: { en: 'Clinic' }, tagIds: ['tag1'] })];
    renderWithQuery('appointment');
    expect(screen.getByRole('link', { name: /Clinic/ })).toBeInTheDocument();
  });

  it('does not match resource when tag label does not match query', () => {
    mockData.tags = [makeTag({ id: 'tag1', label: 'walk-in' })];
    mockData.resources = [makeResource({ id: 'r1', name: { en: 'Clinic' }, tagIds: ['tag1'] })];
    renderWithQuery('appointment');
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('does not match resource when tagId references a tag not in the tags collection', () => {
    mockData.tags = [];
    mockData.resources = [
      makeResource({ id: 'r1', name: { en: 'Clinic' }, tagIds: ['missing-tag'] }),
    ];
    renderWithQuery('walk-in');
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});

// --- Resource: branch sub-fields ---

describe('SearchResults — resource branches', () => {
  it('matches resource by branch label', () => {
    mockData.resources = [
      makeResource({
        id: 'r1',
        name: { en: 'Legal Aid' },
        branches: [{ id: 'b1', label: 'Downtown Office', address: '1 Court St' }],
      }),
    ];
    renderWithQuery('downtown office');
    expect(screen.getByRole('link', { name: /Legal Aid/ })).toBeInTheDocument();
  });

  it('matches resource by branch address', () => {
    mockData.resources = [
      makeResource({
        id: 'r1',
        name: { en: 'Legal Aid' },
        branches: [{ id: 'b1', label: 'Branch', address: '99 Elm Street' }],
      }),
    ];
    renderWithQuery('elm street');
    expect(screen.getByRole('link', { name: /Legal Aid/ })).toBeInTheDocument();
  });

  it('matches resource by branch phone', () => {
    mockData.resources = [
      makeResource({
        id: 'r1',
        name: { en: 'Health Clinic' },
        branches: [{ id: 'b1', label: 'Branch', phone: '617-555-9999' }],
      }),
    ];
    renderWithQuery('617-555-9999');
    expect(screen.getByRole('link', { name: /Health Clinic/ })).toBeInTheDocument();
  });

  it('matches resource by branch email', () => {
    mockData.resources = [
      makeResource({
        id: 'r1',
        name: { en: 'Health Clinic' },
        branches: [{ id: 'b1', label: 'Branch', email: 'east@clinic.org' }],
      }),
    ];
    renderWithQuery('east@clinic.org');
    expect(screen.getByRole('link', { name: /Health Clinic/ })).toBeInTheDocument();
  });

  it('does not match resource when branch fields do not match query', () => {
    mockData.resources = [
      makeResource({
        id: 'r1',
        name: { en: 'Health Clinic' },
        branches: [{ id: 'b1', label: 'Main Branch', address: '1 Oak St' }],
      }),
    ];
    renderWithQuery('xyznotfound');
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});

// --- Document: tagIds resolved to labels ---

describe('SearchResults — document tagIds', () => {
  it('matches document when query matches a linked tag label', () => {
    mockData.tags = [makeTag({ id: 'tag2', label: 'printable' })];
    mockData.documents = [
      makeDocument({ id: 'd1', title: { en: 'SNAP Guide' }, tagIds: ['tag2'] }),
    ];
    renderWithQuery('printable');
    expect(screen.getByRole('link', { name: /SNAP Guide/ })).toBeInTheDocument();
  });

  it('does not match document when tag label does not match query', () => {
    mockData.tags = [makeTag({ id: 'tag2', label: 'printable' })];
    mockData.documents = [
      makeDocument({ id: 'd1', title: { en: 'SNAP Guide' }, tagIds: ['tag2'] }),
    ];
    renderWithQuery('digital');
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});

// --- Guest search (unchanged behaviour) ---

describe('SearchResults — guest fields', () => {
  it('matches guest by first name', () => {
    mockData.guests = [makeGuest({ id: 'g1', firstName: 'Maria' })];
    renderWithQuery('maria');
    expect(screen.getByText(/Maria S\./)).toBeInTheDocument();
  });

  it('matches guest by quick note text', () => {
    mockData.guests = [
      makeGuest({
        id: 'g1',
        quickNotes: [{ text: 'needs interpreter', volunteerId: 'u1', timestamp: now }],
      }),
    ];
    renderWithQuery('interpreter');
    expect(screen.getByText(/Maria S\./)).toBeInTheDocument();
  });
});
