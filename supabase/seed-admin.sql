-- Admin user seeder — run this in the Supabase SQL editor, OR use
--   node scripts/seed-admin.mjs
-- which reads ADMIN_EMAIL / ADMIN_PASSWORD from .env.
--
-- Idempotent: re-running with the same email updates the password hash.
-- The password is stored as a bcrypt hash via pgcrypto (see schema.sql).

select public.seed_admin_user(
  'admin@example.com',
  'Admin@12345',
  'Admin'
);