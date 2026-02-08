import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

const mockLogout = vi.fn();

vi.mock('../../features/auth/useAuth', () => ({
  useAuth: () => ({
    volunteer: { name: 'Test User', email: 'test@example.com', role: 'admin' },
    logout: mockLogout,
    user: { uid: 'u1' },
    isAdmin: true,
    loading: false,
    login: vi.fn(),
  }),
}));

vi.mock('../../app/useData', () => ({
  useData: () => ({
    resources: [],
    documents: [],
    guests: [],
    feedback: [],
    notes: [],
    volunteers: [],
    loading: false,
    getVolunteerName: () => 'Test User',
  }),
}));

// Mock the form modals to avoid rendering full forms
vi.mock('../../features/resources/ResourceForm', () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="resource-form">ResourceForm</div> : null,
}));

vi.mock('../../features/guests/GuestForm', () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="guest-form">GuestForm</div> : null,
}));

vi.mock('../../features/documents/DocumentForm', () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="document-form">DocumentForm</div> : null,
}));

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders app title', () => {
    renderHeader();
    expect(screen.getByText('Social Service Desk')).toBeInTheDocument();
  });

  it('renders search bar', () => {
    renderHeader();
    expect(
      screen.getByPlaceholderText('Search resources, documents, guests...'),
    ).toBeInTheDocument();
  });

  it('renders "+ New" button', () => {
    renderHeader();
    expect(screen.getByText('+ New')).toBeInTheDocument();
  });

  it('shows dropdown menu when clicking "+ New"', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByText('+ New'));

    expect(screen.getByText('Resource')).toBeInTheDocument();
    expect(screen.getByText('Guest')).toBeInTheDocument();
    expect(screen.getByText('Document')).toBeInTheDocument();
  });

  it('opens ResourceForm when clicking Resource option', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByText('+ New'));
    await user.click(screen.getByText('Resource'));

    expect(screen.getByTestId('resource-form')).toBeInTheDocument();
  });

  it('opens GuestForm when clicking Guest option', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByText('+ New'));
    await user.click(screen.getByText('Guest'));

    expect(screen.getByTestId('guest-form')).toBeInTheDocument();
  });

  it('opens DocumentForm when clicking Document option', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByText('+ New'));
    await user.click(screen.getByText('Document'));

    expect(screen.getByTestId('document-form')).toBeInTheDocument();
  });

  it('displays volunteer name', () => {
    renderHeader();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows Admin badge for admin users', () => {
    renderHeader();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('calls logout when clicking Logout button', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
