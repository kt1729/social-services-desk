import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockUpload, mockCreateSignedUrl, mockRemove, mockFrom } = vi.hoisted(() => {
  const mockUpload = vi.fn();
  const mockCreateSignedUrl = vi.fn();
  const mockRemove = vi.fn();
  const mockFrom = vi.fn(() => ({
    upload: mockUpload,
    createSignedUrl: mockCreateSignedUrl,
    remove: mockRemove,
  }));
  return { mockUpload, mockCreateSignedUrl, mockRemove, mockFrom };
});

vi.mock('../supabase', () => ({
  supabase: {
    storage: {
      from: mockFrom,
    },
  },
  STORAGE_BUCKET: 'test-bucket',
}));

import { uploadFile, getFileUrl, deleteFile } from '../storageService';

beforeEach(() => {
  vi.clearAllMocks();
  import.meta.env.VITE_LOCAL_MODE = 'false';
});

describe('uploadFile', () => {
  it('uploads a file and returns the logical storage path', async () => {
    mockUpload.mockResolvedValue({ error: null });

    const file = new File(['hello'], 'guide.pdf', { type: 'application/pdf' });
    const result = await uploadFile(file, 'doc123', 'en', 'housing');

    expect(mockFrom).toHaveBeenCalledWith('test-bucket');
    expect(mockUpload).toHaveBeenCalledWith('housing/en/doc123/guide.pdf', file, { upsert: true });
    expect(result).toBe('housing/en/doc123/guide.pdf');
  });

  it('throws on upload error', async () => {
    mockUpload.mockResolvedValue({ error: { message: 'Bucket not found' } });

    const file = new File(['data'], 'img.png', { type: 'image/png' });
    await expect(uploadFile(file, 'doc456', 'es', 'food')).rejects.toThrow(
      'Upload failed: Bucket not found',
    );
  });
});

describe('getFileUrl', () => {
  it('returns a signed URL for the given path', async () => {
    mockCreateSignedUrl.mockResolvedValue({
      data: { signedUrl: 'https://supabase.co/storage/v1/sign/documents/doc123/en/guide.pdf' },
      error: null,
    });

    const url = await getFileUrl('doc123/en/guide.pdf');

    expect(mockFrom).toHaveBeenCalledWith('test-bucket');
    expect(mockCreateSignedUrl).toHaveBeenCalledWith('doc123/en/guide.pdf', 3600);
    expect(url).toBe('https://supabase.co/storage/v1/sign/documents/doc123/en/guide.pdf');
  });

  it('throws when createSignedUrl returns an error', async () => {
    mockCreateSignedUrl.mockResolvedValue({
      data: null,
      error: { message: 'Object not found' },
    });

    await expect(getFileUrl('missing/path.pdf')).rejects.toThrow(
      'Failed to get file URL: Object not found',
    );
  });

  it('throws when no signed URL is returned', async () => {
    mockCreateSignedUrl.mockResolvedValue({
      data: { signedUrl: null },
      error: null,
    });

    await expect(getFileUrl('bad/path.pdf')).rejects.toThrow(
      'Failed to get file URL: No signed URL returned',
    );
  });
});

describe('deleteFile', () => {
  it('deletes a file by storage path', async () => {
    mockRemove.mockResolvedValue({ error: null });

    await deleteFile('doc123/en/guide.pdf');

    expect(mockFrom).toHaveBeenCalledWith('test-bucket');
    expect(mockRemove).toHaveBeenCalledWith(['doc123/en/guide.pdf']);
  });

  it('throws on delete error', async () => {
    mockRemove.mockResolvedValue({ error: { message: 'Permission denied' } });

    await expect(deleteFile('doc123/en/guide.pdf')).rejects.toThrow(
      'Delete failed: Permission denied',
    );
  });
});
