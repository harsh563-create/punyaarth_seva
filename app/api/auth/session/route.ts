import { isAdminAuthenticated } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    authenticated: await isAdminAuthenticated(),
  });
}
