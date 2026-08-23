import {
  activities as staticActivities,
  events as staticEvents,
  galleryImages as staticGallery,
  impactStats as staticImpact,
  sevaCategories as staticSeva,
} from '@/data';
import type {
  Activity,
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
} as const;

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
