import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Timestamp } from 'firebase/firestore';
import type { Tag, Resource, ServiceDocument } from '../../../shared/types';

// Mock firebase/firestore before importing the component
const mockAddDoc = vi.fn().mockResolvedValue({ id: 'new-tag-id' });
const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
const mockDeleteDoc = vi.fn().mockResolvedValue(undefined);
const mockDoc = vi.fn(() => ({ _type: 'doc-ref' }));
const mockCollection = vi.fn(() => ({ _type: 'collection-ref' }));

vi.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  Timestamp: { now: vi.fn(() => ({ seconds: 0, nanoseconds: 0 })) },
}));

vi.mock('../../../shared/lib/firebase', () => ({ db: {} }));

const mockData = {
  tags: [] as Tag[],
  resources: [] as Resource[],
  documents: [] as ServiceDocument[],
  guests: [],
  feedback: [],
  notes: [],
  volunteers: [],
  loading: false,
  getVolunteerName: () => 'Volunteer',
};

vi.mock('../../../app/useData', () => ({
  useData: () => mockData,
}));

// Import component after mocks
import TagsPage from '../TagsPage';

const now = { seconds: 0, nanoseconds: 0 } as unknown as Timestamp;

function makeTag(id: string, label: string): Tag {
  return { id, label, slug: label.toLowerCase().replace(/\s+/g, '-'), createdAt: now };
}

function makeResource(id: string, tagIds: string[] = []): Resource {
  return {
    id,
    name: { en: `Resource ${id}` },
    description: {},
    category: 'other',
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

function makeDocument(id: string, tagIds: string[] = []): ServiceDocument {
  return {
    id,
    title: { en: `Document ${id}` },
    description: {},
    type: 'pdf',
    source: { url: null, storagePath: null, internalContent: null },
    category: 'other',
    tags: [],
    tagIds,
    linkedResources: [],
    languages: {},
    translationStatus: {},
    printSettings: { paperSize: 'letter', orientation: 'portrait', showQRCode: false },
    createdBy: 'u1',
    createdAt: now,
    updatedAt: now,
  };
}

describe('TagsPage', () => {
  beforeEach(() => {
    mockAddDoc.mockClear();
    mockUpdateDoc.mockClear();
    mockDeleteDoc.mockClear();
    mockDoc.mockClear();
    mockCollection.mockClear();
    mockData.tags = [];
    mockData.resources = [];
    mockData.documents = [];
  });

  it('renders tags sorted alphabetically', () => {
    mockData.tags = [makeTag('t1', 'Shelter'), makeTag('t2', 'Food')];
    render(<TagsPage />);

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Food');
    expect(items[1]).toHaveTextContent('Shelter');
  });

  it('shows per-tag usage count from resources and documents', () => {
    mockData.tags = [makeTag('t1', 'Housing')];
    mockData.resources = [makeResource('r1', ['t1']), makeResource('r2', ['t1'])];
    mockData.documents = [makeDocument('d1', ['t1'])];
    render(<TagsPage />);

    expect(screen.getByText('3 items')).toBeInTheDocument();
  });

  it('shows empty state when tags array is empty', () => {
    mockData.tags = [];
    render(<TagsPage />);

    expect(screen.getByText('No tags yet.')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('"+ Add Tag" button opens the Add Tag modal', async () => {
    const user = userEvent.setup();
    render(<TagsPage />);

    await user.click(screen.getByRole('button', { name: '+ Add Tag' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Emergency Housing')).toBeInTheDocument();
  });

  it('submitting a valid label calls addDoc with label and slug', async () => {
    const user = userEvent.setup();
    render(<TagsPage />);

    await user.click(screen.getByRole('button', { name: '+ Add Tag' }));
    await user.type(screen.getByPlaceholderText('e.g. Emergency Housing'), 'New Tag');
    await user.click(screen.getByRole('button', { name: 'Add Tag' }));

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledOnce();
      const [, payload] = mockAddDoc.mock.calls[0];
      expect(payload).toMatchObject({ label: 'New Tag', slug: 'new-tag' });
    });
  });

  it('duplicate label shows error and does not call addDoc', async () => {
    const user = userEvent.setup();
    mockData.tags = [makeTag('t1', 'Existing Tag')];
    render(<TagsPage />);

    await user.click(screen.getByRole('button', { name: '+ Add Tag' }));
    await user.type(screen.getByPlaceholderText('e.g. Emergency Housing'), 'existing tag');
    await user.click(screen.getByRole('button', { name: 'Add Tag' }));

    expect(screen.getByText('A tag with this name already exists.')).toBeInTheDocument();
    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it('clicking Rename makes the row editable with pre-filled input', async () => {
    const user = userEvent.setup();
    mockData.tags = [makeTag('t1', 'Old Label')];
    render(<TagsPage />);

    await user.click(screen.getByRole('button', { name: 'Rename' }));
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Old Label');
  });

  it('saving rename calls updateDoc with new label and slug', async () => {
    const user = userEvent.setup();
    mockData.tags = [makeTag('t1', 'Old Label')];
    render(<TagsPage />);

    await user.click(screen.getByRole('button', { name: 'Rename' }));
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'New Label');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalledOnce();
      const [, payload] = mockUpdateDoc.mock.calls[0];
      expect(payload).toMatchObject({ label: 'New Label', slug: 'new-label' });
    });
  });

  it('pressing Escape cancels rename and restores original label', async () => {
    const user = userEvent.setup();
    mockData.tags = [makeTag('t1', 'Original')];
    render(<TagsPage />);

    await user.click(screen.getByRole('button', { name: 'Rename' }));
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Original')).toBeInTheDocument();
  });

  it('delete on unused tag shows generic confirm dialog', async () => {
    const user = userEvent.setup();
    mockData.tags = [makeTag('t1', 'Unused Tag')];
    render(<TagsPage />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Delete the tag "Unused Tag"/)).toBeInTheDocument();
  });

  it('delete on in-use tag shows usage count in dialog', async () => {
    const user = userEvent.setup();
    mockData.tags = [makeTag('t1', 'Used Tag')];
    mockData.resources = [makeResource('r1', ['t1']), makeResource('r2', ['t1'])];
    mockData.documents = [makeDocument('d1', ['t1'])];
    render(<TagsPage />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/3 items/)).toBeInTheDocument();
  });

  it('confirming delete calls deleteDoc with correct ref', async () => {
    const user = userEvent.setup();
    mockData.tags = [makeTag('t1', 'To Delete')];
    render(<TagsPage />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Delete Tag' }));

    await waitFor(() => {
      expect(mockDeleteDoc).toHaveBeenCalledOnce();
      expect(mockDoc).toHaveBeenCalledWith({}, 'tags', 't1');
    });
  });
});
