import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Mock firebase/firestore before importing the component
const mockGetDocs = vi.fn();
const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn().mockResolvedValue(undefined);
const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
const mockDeleteDoc = vi.fn().mockResolvedValue(undefined);
const mockDoc = vi.fn((..._args: unknown[]) => ({ _type: 'doc-ref' }));
const mockCollection = vi.fn((..._args: unknown[]) => ({ _type: 'collection-ref' }));

vi.mock('firebase/firestore', () => ({
  getDocs: (a: unknown) => mockGetDocs(a),
  getDoc: (a: unknown) => mockGetDoc(a),
  setDoc: (a: unknown, b: unknown) => mockSetDoc(a, b),
  updateDoc: (a: unknown, b: unknown) => mockUpdateDoc(a, b),
  deleteDoc: (a: unknown) => mockDeleteDoc(a),
  doc: (...args: unknown[]) => mockDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  Timestamp: { now: vi.fn(() => ({ seconds: 0, nanoseconds: 0 })) },
}));

vi.mock('../../../shared/lib/firebase', () => ({ db: {} }));

// Default: admin user
let mockIsAdmin = true;

vi.mock('../../auth/useAuth', () => ({
  useAuth: () => ({ isAdmin: mockIsAdmin }),
}));

import VolunteersPage from '../VolunteersPage';

interface FakeVolunteer {
  uid: string;
  name: string;
  email: string;
  role: 'volunteer' | 'admin';
}

function makeSnapshot(volunteers: FakeVolunteer[]) {
  return {
    docs: volunteers.map((v) => ({
      id: v.uid,
      data: () => ({ name: v.name, email: v.email, role: v.role }),
    })),
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <VolunteersPage />
    </MemoryRouter>,
  );
}

describe('VolunteersPage', () => {
  beforeEach(() => {
    mockIsAdmin = true;
    mockGetDocs.mockResolvedValue(makeSnapshot([]));
    mockGetDoc.mockResolvedValue({ exists: () => false });
    mockSetDoc.mockReset().mockResolvedValue(undefined);
    mockUpdateDoc.mockReset().mockResolvedValue(undefined);
    mockDeleteDoc.mockReset().mockResolvedValue(undefined);
    mockDoc.mockClear();
    mockCollection.mockClear();
  });

  it('shows loading state initially', () => {
    // getDocs never resolves during this test
    mockGetDocs.mockReturnValue(new Promise(() => undefined));
    renderPage();
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('renders volunteer list after loading', async () => {
    mockGetDocs.mockResolvedValue(
      makeSnapshot([
        { uid: 'u1', name: 'Alice Smith', email: 'alice@example.com', role: 'volunteer' },
        { uid: 'u2', name: 'Bob Jones', email: 'bob@example.com', role: 'admin' },
      ]),
    );
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });
  });

  it('shows empty-state message when no volunteers exist', async () => {
    mockGetDocs.mockResolvedValue(makeSnapshot([]));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('No volunteers yet.')).toBeInTheDocument();
    });
  });

  it('"+ Add Volunteer" button opens the modal', async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: '+ Add Volunteer' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
  });

  it('add form requires name, email, and uid to enable submit', async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: '+ Add Volunteer' }));

    const submit = screen.getByRole('button', { name: 'Add Volunteer' });
    expect(submit).toBeDisabled();

    await user.type(screen.getByPlaceholderText('Full name'), 'Test User');
    await user.type(screen.getByPlaceholderText('volunteer@example.com'), 'test@example.com');
    expect(submit).toBeDisabled(); // uid still empty

    await user.type(screen.getByPlaceholderText('Paste UID here'), 'uid-abc');
    expect(submit).not.toBeDisabled();
  });

  it('submitting add form calls setDoc with correct data', async () => {
    const user = userEvent.setup();
    mockGetDoc.mockResolvedValue({ exists: () => false });
    renderPage();

    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: '+ Add Volunteer' }));

    await user.type(screen.getByPlaceholderText('Full name'), 'Jane Doe');
    await user.type(screen.getByPlaceholderText('volunteer@example.com'), 'jane@example.com');
    await user.type(screen.getByPlaceholderText('Paste UID here'), 'uid-jane');
    await user.click(screen.getByRole('button', { name: 'Add Volunteer' }));

    await waitFor(() => {
      expect(mockSetDoc).toHaveBeenCalledOnce();
      const [, payload] = mockSetDoc.mock.calls[0];
      expect(payload).toMatchObject({ name: 'Jane Doe', email: 'jane@example.com', role: 'volunteer' });
    });
  });

  it('shows error when duplicate UID is submitted', async () => {
    const user = userEvent.setup();
    mockGetDoc.mockResolvedValue({ exists: () => true });
    renderPage();

    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: '+ Add Volunteer' }));

    await user.type(screen.getByPlaceholderText('Full name'), 'Dup User');
    await user.type(screen.getByPlaceholderText('volunteer@example.com'), 'dup@example.com');
    await user.type(screen.getByPlaceholderText('Paste UID here'), 'existing-uid');
    await user.click(screen.getByRole('button', { name: 'Add Volunteer' }));

    await waitFor(() => {
      expect(screen.getByText('A volunteer with this UID already exists.')).toBeInTheDocument();
    });
    expect(mockSetDoc).not.toHaveBeenCalled();
  });

  it('changing role select calls updateDoc immediately', async () => {
    const user = userEvent.setup();
    mockGetDocs.mockResolvedValue(
      makeSnapshot([{ uid: 'u1', name: 'Alice', email: 'alice@example.com', role: 'volunteer' }]),
    );
    renderPage();

    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'admin');

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalledOnce();
      const [, payload] = mockUpdateDoc.mock.calls[0];
      expect(payload).toEqual({ role: 'admin' });
    });
  });

  it('delete button opens confirmation dialog', async () => {
    const user = userEvent.setup();
    mockGetDocs.mockResolvedValue(
      makeSnapshot([{ uid: 'u1', name: 'Bob', email: 'bob@example.com', role: 'volunteer' }]),
    );
    renderPage();

    await waitFor(() => expect(screen.getByText('Bob')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Remove Bob from the volunteers list/)).toBeInTheDocument();
  });

  it('confirming delete calls deleteDoc', async () => {
    const user = userEvent.setup();
    mockGetDocs.mockResolvedValue(
      makeSnapshot([{ uid: 'u1', name: 'Bob', email: 'bob@example.com', role: 'volunteer' }]),
    );
    renderPage();

    await waitFor(() => expect(screen.getByText('Bob')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Delete Volunteer' }));

    await waitFor(() => {
      expect(mockDeleteDoc).toHaveBeenCalledOnce();
    });
  });

  it('cancelling delete dialog does not call deleteDoc', async () => {
    const user = userEvent.setup();
    mockGetDocs.mockResolvedValue(
      makeSnapshot([{ uid: 'u1', name: 'Carol', email: 'carol@example.com', role: 'volunteer' }]),
    );
    renderPage();

    await waitFor(() => expect(screen.getByText('Carol')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockDeleteDoc).not.toHaveBeenCalled();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('non-admin is redirected to /', () => {
    mockIsAdmin = false;
    renderPage();
    // MemoryRouter will navigate — the page content should not render
    expect(screen.queryByText('Volunteers')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '+ Add Volunteer' })).not.toBeInTheDocument();
  });
});
