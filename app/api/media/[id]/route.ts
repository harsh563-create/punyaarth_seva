import { createItemRoutes, mediaSchema } from '@/lib/collection-api';

const routes = createItemRoutes({
  table: 'media_assets',
  idPrefix: 'med',
  parse: mediaSchema,
});

export const PUT = routes.PUT;
export const PATCH = routes.PATCH;
export const DELETE = routes.DELETE;
