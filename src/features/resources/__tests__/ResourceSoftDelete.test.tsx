import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import type { Resource } from '../../../shared/types';

// --- Firestore mock ---
const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
const mockGetDocs = vi.fn();
const mockDoc = vi.fn((..._args: unknown[]) => ({ _type: 'doc-ref' }));
const mockCollection = vi.fn((..._args: unknown[]) => ({ _type: 'col-ref' }));
const mockQuery = vi.fn((...args: unknown[]) => args[0]);
const mockWhere = vi.fn((..._args: unknown[]) => ({ _type: 'where' }));
const mockDeleteField = vi.fn(() => ({ _type: 'deleteField' }));

vi.mock('firebase/firestore', () => ({
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  getDocs: (a: unknown) => mockGetDocs(a),
  doc: (...args: unknown[]) => mockDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  deleteField: () => mockDeleteField(),
  Timestamp: { now: vi.fn(() => ({ seconds: 1, nanoseconds: 0 })) },
  arrayUnion: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'new' }),
}));

vi.mock('../../../shared/lib/firebase', () => ({ db: {} }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

let mockIsAdmin = true;
vi.mock('../../auth/useAuth', () => ({ useAuth: () => ({ isAdmin: mockIsAdmin, user: { uid: 'u1' } }) }));

const mockResource: Resource = {
  id: 'r1',
  name: { en: 'Food Pantry' },
  description: { en: 'Weekly food.' },
  category: 'food',
  address: '123 Main',
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
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

vi.mock('../../../app/useData', () => ({
  useData: () => ({
    resources: [mockResource],
    feedback: [],
    documents: [],
    notes: [],
    tags: [],
    loading: false,
    getVolunteerName: () => 'Vol',
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'r1' }),
    useOutletContext: () => ({ selectedCategory: null, viewMode: 'all' }),
  };
});

import ResourceDetail from '../ResourceDetail';
import ResourceList from '../ResourceList';

const now = { seconds: 0, nanoseconds: 0 } as unknown as Timestamp;

function makeDeletedResource(id: string): Resource {
  return { ...mockResource, id, name: { en: `Deleted Resource ${id}` }, active: false, deletedAt: now };
}

// --- ResourceDetail soft-delete tests ---

describe('ResourceDetail soft-delete', () => {
  beforeEach(() => {
    mockUpdateDoc.mockClear();
    mockNavigate.mockClear();
    mockIsAdmin = true;
  });

  it('delete calls updateDoc with active:false and deletedAt, not deleteDoc', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/resources/r1']}>
        <Routes>
          <Route path="/resources/:id" element={<ResourceDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    // Confirm dialog default button label is "Delete"
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    await user.click(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalledOnce();
      const [, payload] = mockUpdateDoc.mock.calls[0];
      expect(payload).toMatchObject({ active: false });
      expect(payload).toHaveProperty('deletedAt');
    });
  });
});

// --- ResourceList Show deleted / Restore tests ---

describe('ResourceList Show deleted and Restore', () => {
  beforeEach(() => {
    mockUpdateDoc.mockClear();
    mockGetDocs.mockClear();
    mockIsAdmin = true;
  });

  it('"Show deleted" button is visible to admins', () => {
    render(
      <MemoryRouter>
        <ResourceList />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Show deleted' })).toBeInTheDocument();
  });

  it('"Show deleted" button is hidden for non-admins', () => {
    mockIsAdmin = false;
    render(
      <MemoryRouter>
        <ResourceList />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'Show deleted' })).not.toBeInTheDocument();
  });

  it('clicking "Show deleted" fetches and displays deleted resources', async () => {
    const user = userEvent.setup();
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: 'r-del', data: () => ({ ...makeDeletedResource('r-del'), id: undefined }) },
      ],
    });

    render(
      <MemoryRouter>
        <ResourceList />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Show deleted' }));

    await waitFor(() => {
      expect(screen.getByText('Deleted Resources')).toBeInTheDocument();
      expect(mockGetDocs).toHaveBeenCalledOnce();
    });
  });

  it('Restore button calls updateDoc with active:true and deleteField for deletedAt', async () => {
    const user = userEvent.setup();
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: 'r-del', data: () => ({ ...makeDeletedResource('r-del'), id: undefined }) },
      ],
    });

    render(
      <MemoryRouter>
        <ResourceList />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Show deleted' }));
    await waitFor(() => screen.getByRole('button', { name: 'Restore' }));
    await user.click(screen.getByRole('button', { name: 'Restore' }));

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalledOnce();
      const [, payload] = mockUpdateDoc.mock.calls[0];
      expect(payload).toMatchObject({ active: true });
      expect(payload).toHaveProperty('deletedAt');
    });
  });
});
