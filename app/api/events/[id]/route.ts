import { createItemRoutes, eventsSchema } from '@/lib/collection-api';

const routes = createItemRoutes({
  table: 'events',
  idPrefix: 'evt',
  parse: eventsSchema,
});

export const PUT = routes.PUT;
export const PATCH = routes.PATCH;
export const DELETE = routes.DELETE;
