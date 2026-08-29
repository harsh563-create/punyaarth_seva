import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const ADMIN_COOKIE = 'ps_admin_session';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? 'punyaarth-dev-secret-change-me';
}

/**
 * Verifies an admin's email + password against the Supabase `admin_users`
 * table (passwords are stored as bcrypt hashes; comparison happens inside
 * Postgres via the verify_admin_credentials function). Returns the admin's
 * display name on success, otherwise null.
 *
 * When Supabase isn't configured at all, it falls back to the ADMIN_EMAIL /
 * ADMIN_PASSWORD env pair so the demo mode keeps working.
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<string | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) return null;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await getSupabase().rpc('verify_admin_credentials', {
        p_email: normalizedEmail,
        p_password: password,
      });
      if (error) {
        console.error('verify_admin_credentials failed:', error.message);
        return null;
      }
      return typeof data === 'string' && data ? data : null;
    } catch {
      return null;
    }
  }

  // Demo-mode fallback: env-pair credentials.
  const expectedEmail = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD ?? '';
  const emailMatches =
    expectedEmail.length === normalizedEmail.length &&
    timingSafeEqual(Buffer.from(expectedEmail), Buffer.from(normalizedEmail));
  const passwordMatches =
    expectedPassword.length === password.length &&
    timingSafeEqual(Buffer.from(expectedPassword), Buffer.from(password));
  return emailMatches && passwordMatches ? 'Admin' : null;
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

export function createSessionToken(): string {
  const expiresAt = String(Date.now() + SESSION_TTL_MS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return false;
  const expiresAt = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  const expectedSignature = sign(expiresAt);
  if (
    signature.length !== expectedSignature.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return false;
  }
  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && Date.now() < expiry;
}

/** Server-side session check for layouts and server actions. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  };
}
