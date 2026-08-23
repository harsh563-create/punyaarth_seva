import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'ps_admin_session';

/**
 * Optimistic auth gate for /admin. The real (signed-cookie) verification
 * happens server-side in the admin panel layout and actions — here we only
 * redirect obvious cases based on cookie presence.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';
  const hasSessionCookie = Boolean(request.cookies.get(ADMIN_COOKIE)?.value);

  if (!isLoginPage && !hasSessionCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && hasSessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
