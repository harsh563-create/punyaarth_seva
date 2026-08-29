import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE,
  createSessionToken,
  getSessionCookieOptions,
  verifyAdminCredentials,
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
  let body: { email?: unknown; password?: unknown; from?: unknown };
  try {
    body = (await request.json()) as {
      email?: unknown;
      password?: unknown;
      from?: unknown;
    };
  } catch {
    return Response.json(
      { error: 'Expected a JSON body with "email" and "password" fields.' },
      { status: 400 }
    );
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) {
    return Response.json(
      { error: 'Please enter your email and password.' },
      { status: 400 }
    );
  }

  // Small delay to blunt brute-force attempts.
  await new Promise((resolve) => setTimeout(resolve, 400));

  const name = await verifyAdminCredentials(email, password);
  if (!name) {
    return Response.json(
      { error: 'Incorrect email or password. Please try again.' },
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
