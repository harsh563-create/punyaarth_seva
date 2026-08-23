import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE,
  checkPassword,
  createSessionToken,
  getSessionCookieOptions,
} from '@/lib/admin-auth';

export const runtime = 'nodejs';

function safeRedirectTarget(from: unknown): string {
  if (
    typeof from === 'string' &&
    from.startsWith('/admin') &&
    !from.startsWith('/admin/login')
  ) {
    return from;
  }
  return '/admin';
}

export async function POST(request: Request) {
  let body: { password?: unknown; from?: unknown };
  try {
    body = (await request.json()) as { password?: unknown; from?: unknown };
  } catch {
    return Response.json(
      { error: 'Expected a JSON body with a "password" field.' },
      { status: 400 }
    );
  }

  const password = typeof body.password === 'string' ? body.password : '';
  if (!password) {
    return Response.json(
      { error: 'Please enter the admin password.' },
      { status: 400 }
    );
  }

  // Small delay to blunt brute-force attempts.
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!checkPassword(password)) {
    return Response.json(
      { error: 'Incorrect password. Please try again.' },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createSessionToken(), getSessionCookieOptions());

  return Response.json({
    ok: true,
    redirectTo: safeRedirectTarget(body.from),
  });
}
