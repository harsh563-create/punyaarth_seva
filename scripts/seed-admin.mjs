/**
 * Seeds the admin_users table with the credentials from the environment.
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD (optionally ADMIN_NAME) from the
 * environment or the project .env, then calls the public.seed_admin_user
 * Postgres function, which stores the password as a bcrypt hash computed
 * by pgcrypto on the server. Nothing runs on this machine.
 *
 * Usage:
 *   node scripts/seed-admin.mjs
 *
 * Alternatively run the same thing in the Supabase SQL editor (idempotent):
 *   select public.seed_admin_user('admin@example.org', 'Admin', 'a-strong-password');
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Load .env so the script works without shell-level env setup.
for (const line of readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) {
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? '';
const name = (process.env.ADMIN_NAME ?? '').trim() || 'Admin';

if (!url || !serviceRoleKey) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.');
  process.exit(1);
}
if (!email || !password) {
  console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.');
  process.exit(1);
}
if (password.length < 8) {
  console.error('ERROR: ADMIN_PASSWORD must be at least 8 characters long.');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.rpc('seed_admin_user', {
  p_email: email,
  p_name: name,
  p_password: password,
});

if (error) {
  console.error('Failed to seed admin user:');
  console.error(error);
  process.exit(1);
}

console.log(`Admin user seeded: ${email}`);
