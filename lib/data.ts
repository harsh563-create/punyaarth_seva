import {
  activities as staticActivities,
  events as staticEvents,
  galleryImages as staticGallery,
  impactStats as staticImpact,
  sevaCategories as staticSeva,
} from '@/data';
import type {
  Activity,
  Donation,
  DonationSettings,
  Event,
  GalleryImage,
  ImpactStat,
  SevaCategory,
} from '@/types';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Server-side content access. Reads from Supabase when configured and falls
 * back to the bundled static data otherwise (or if a query fails), so the
 * site keeps rendering during setup or outages.
 */

const TABLES = {
  events: 'events',
  activities: 'activities',
  sevaCategories: 'seva_categories',
  galleryImages: 'gallery_images',
  impactStats: 'impact_stats',
  donations: 'donations',
} as const;

/** Empty defaults — real UPI/QR values are set from the admin panel only. */
export const DEFAULT_DONATION_SETTINGS: DonationSettings = {
  upiId: '',
  payeeName: '',
  qrImage: '',
  orgName: 'Punyaarth Seva Samiti',
  registrationDetails: '',
  taxExemptionDetails: '',
  contactEmail: '',
  contactPhone: '',
};

let warned = false;

function warnOnce(message: string): void {
  if (warned) return;
  warned = true;
  console.warn(`[data] ${message} Falling back to bundled demo data.`);
}

async function fetchTable<T>(
  table: string,
  fallback: T[]
): Promise<T[]> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const { data, error } = await getSupabase()
      .from(table)
      .select('*')
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return fallback;
    return data as T[];
  } catch (error) {
    console.error(`[data] Failed to load "${table}" from Supabase:`, error);
    warnOnce(`Supabase query for "${table}" failed.`);
    return fallback;
  }
}

export function getEvents(): Promise<Event[]> {
  return fetchTable<Event>(TABLES.events, staticEvents);
}

export function getActivities(): Promise<Activity[]> {
  return fetchTable<Activity>(TABLES.activities, staticActivities);
}

export function getSevaCategories(): Promise<SevaCategory[]> {
  return fetchTable<SevaCategory>(TABLES.sevaCategories, staticSeva);
}

export function getGalleryImages(): Promise<GalleryImage[]> {
  return fetchTable<GalleryImage>(TABLES.galleryImages, staticGallery);
}

export function getImpactStats(): Promise<ImpactStat[]> {
  return fetchTable<ImpactStat>(TABLES.impactStats, staticImpact);
}

/** Donation page configuration; empty strings mean "not configured yet". */
export async function getDonationSettings(): Promise<DonationSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_DONATION_SETTINGS;
  try {
    const { data } = await getSupabase()
      .from('donation_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();
    if (!data) return DEFAULT_DONATION_SETTINGS;
    const { created_at: _created, id: _id, ...rest } = data;
    void _created;
    void _id;
    return { ...DEFAULT_DONATION_SETTINGS, ...(rest as Partial<DonationSettings>) };
  } catch (error) {
    console.error('[data] Failed to load donation settings:', error);
    return DEFAULT_DONATION_SETTINGS;
  }
}

/** Donor submissions, newest first. Admin-only consumers. */
export async function getDonations(): Promise<Donation[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await getSupabase()
      .from(TABLES.donations)
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      ...row,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('[data] Failed to load donations:', error);
    return [];
  }
}
