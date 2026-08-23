import {
  createCollectionRoutes,
  handleError,
  mediaSchema,
  requireAdmin,
} from '@/lib/collection-api';

const base = createCollectionRoutes({
  table: 'media_assets',
  idPrefix: 'med',
  parse: mediaSchema,
});

// The library is an admin feature; keep the list endpoint guarded too.
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
