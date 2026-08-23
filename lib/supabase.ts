import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Public storage bucket used for all uploaded images. */
export const MEDIA_BUCKET = 'media';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && serviceRoleKey);
}

let client: SupabaseClient | null = null;

/**
 * Service-role client. Server-only: never import this from a Client
 * Component — the service role key bypasses row level security.
 */
export function getSupabase(): SupabaseClient {
  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }
  if (!client) {
    client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
