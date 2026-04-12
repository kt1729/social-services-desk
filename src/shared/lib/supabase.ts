import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isLocalMode } from './localMode';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET;

if (!isLocalMode() && (!supabaseUrl || !supabaseAnonKey || !supabaseBucket)) {
  throw new Error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_SUPABASE_BUCKET.',
  );
}

export const supabase: SupabaseClient | null = isLocalMode()
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);
export const STORAGE_BUCKET = supabaseBucket ?? 'local-bucket';
