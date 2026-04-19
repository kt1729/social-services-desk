import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import type { ServiceDocument } from '../../../shared/types';

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
}));

vi.mock('../../../shared/lib/firebase', () => ({ db: {} }));
vi.mock('../../../shared/lib/storageService', () => ({
  deleteFile: vi.fn().mockResolvedValue(undefined),
  getFileUrl: vi.fn().mockResolvedValue('http://example.com/file.pdf'),
}));

const mockNavigate = vi.fn();

let mockIsAdmin = true;
vi.mock('../../auth/useAuth', () => ({ useAuth: () => ({ isAdmin: mockIsAdmin }) }));

const now = { seconds: 0, nanoseconds: 0 } as unknown as Timestamp;

const mockDocument: ServiceDocument = {
  id: 'd1',
  title: { en: 'Housing Guide' },
  description: { en: 'A guide.' },
  type: 'pdf',
  source: { url: null, storagePath: null, internalContent: null },
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
};

vi.mock('../../../app/useData', () => ({
  useData: () => ({
    documents: [mockDocument],
    resources: [],
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
    useParams: () => ({ id: 'd1' }),
    useOutletContext: () => ({ viewMode: 'all' }),
  };
});

import DocumentDetail from '../DocumentDetail';
import DocumentList from '../DocumentList';

function makeDeletedDoc(id: string): ServiceDocument {
  return { ...mockDocument, id, title: { en: `Deleted Doc ${id}` }, active: false, deletedAt: now };
}

// --- DocumentDetail soft-delete tests ---

describe('DocumentDetail soft-delete', () => {
  beforeEach(() => {
    mockUpdateDoc.mockClear();
    mockNavigate.mockClear();
    mockIsAdmin = true;
  });

  it('delete calls updateDoc with active:false and deletedAt, not deleteDoc', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/documents/d1']}>
        <Routes>
          <Route path="/documents/:id" element={<DocumentDetail />} />
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

// --- DocumentList Show deleted / Restore tests ---

describe('DocumentList Show deleted and Restore', () => {
  beforeEach(() => {
    mockUpdateDoc.mockClear();
    mockGetDocs.mockClear();
    mockIsAdmin = true;
  });

  it('"Show deleted" button is visible to admins', () => {
    render(
      <MemoryRouter>
        <DocumentList />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Show deleted' })).toBeInTheDocument();
  });

  it('"Show deleted" button is hidden for non-admins', () => {
    mockIsAdmin = false;
    render(
      <MemoryRouter>
        <DocumentList />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'Show deleted' })).not.toBeInTheDocument();
  });

  it('clicking "Show deleted" fetches and displays deleted documents', async () => {
    const user = userEvent.setup();
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: 'd-del', data: () => ({ ...makeDeletedDoc('d-del'), id: undefined }) },
      ],
    });

    render(
      <MemoryRouter>
        <DocumentList />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Show deleted' }));

    await waitFor(() => {
      expect(screen.getByText('Deleted Documents')).toBeInTheDocument();
      expect(mockGetDocs).toHaveBeenCalledOnce();
    });
  });

  it('Restore button calls updateDoc with active:true and deleteField for deletedAt', async () => {
    const user = userEvent.setup();
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: 'd-del', data: () => ({ ...makeDeletedDoc('d-del'), id: undefined }) },
      ],
    });

    render(
      <MemoryRouter>
        <DocumentList />
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
