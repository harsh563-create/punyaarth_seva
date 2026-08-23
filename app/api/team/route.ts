import {
  createCollectionRoutes,
  handleError,
  requireAdmin,
  teamSchema,
} from '@/lib/collection-api';

const base = createCollectionRoutes({
  table: 'team_members',
  idPrefix: 'mbr',
  parse: teamSchema,
});

// Member rows may hold private contact details, so the list endpoint is
// admin-only. The public site reads through the server-side data layer.
async function guardedGet(): Promise<Response> {
  try {
    await requireAdmin();
  } catch (error) {
    return handleError(error);
  }
  return base.GET();
}

export const GET = guardedGet;
export const POST = base.POST;
