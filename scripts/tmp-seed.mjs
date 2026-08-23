/**
 * One-off: apply supabase/seed.sql content to the configured Supabase project.
 * Mirrors scripts/generate-seed.mjs data loading; upserts are idempotent.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function loadCollection(file) {
  let src = readFileSync(file, 'utf8');
  src = src.replace(/^import .*$/m, '');
  src = src.replace(/export const \w+\s*:\s*[\w<>[\], |]+\s*=/, 'module.exports =');
  const mod = { exports: {} };
  new Function('module', src)(mod);
  return mod.exports;
}

const COLLECTIONS = [
  { file: 'data/events.ts', table: 'events' },
  { file: 'data/activities.ts', table: 'activities' },
  { file: 'data/seva.ts', table: 'seva_categories' },
  { file: 'data/gallery.ts', table: 'gallery_images' },
  { file: 'data/impact.ts', table: 'impact_stats' },
];

for (const { file, table } of COLLECTIONS) {
  const rows = loadCollection(file);
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error(`[seed] ${table}: FAILED - ${error.message}`);
    process.exitCode = 1;
  } else {
    console.log(`[seed] ${table}: ${rows.length} rows upserted`);
  }
}
