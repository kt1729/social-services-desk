import { supabase, STORAGE_BUCKET } from './supabase';
import { isLocalMode } from './localMode';
import type { CategoryKey, LanguageCode } from '../types';

/**
 * Upload a file to Supabase Storage.
 * Path: <category>/<lang>/<docId>/<filename>
 * Returns the logical storage path (not a URL).
 */
export async function uploadFile(
  file: File,
  docId: string,
  lang: LanguageCode,
  category: CategoryKey,
): Promise<string> {
  if (isLocalMode() || !supabase) {
    throw new Error('Upload disabled in local mode.');
  }
  const storagePath = `${category}/${lang}/${docId}/${file.name}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(storagePath, file, {
    upsert: true,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return storagePath;
}

/**
 * Get a signed URL for a file in Supabase Storage.
 * The URL expires after 1 hour (3600 seconds).
 */
export async function getFileUrl(storagePath: string): Promise<string> {
  if (isLocalMode() || !supabase) {
    return '#';
  }
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, 3600);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to get file URL: ${error?.message ?? 'No signed URL returned'}`);
  }

  return data.signedUrl;
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFile(storagePath: string): Promise<void> {
  if (isLocalMode() || !supabase) {
    return;
  }
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}
