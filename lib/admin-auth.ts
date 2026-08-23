import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'ps_admin_session';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? 'punyaarth-dev-secret-change-me';
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? 'punyaarth-admin';
}

export function checkPassword(input: string): boolean {
  const expected = Buffer.from(getAdminPassword());
  const provided = Buffer.from(input ?? '');
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
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
