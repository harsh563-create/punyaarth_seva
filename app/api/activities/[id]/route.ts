import {
  activitiesSchema,
  createItemRoutes,
} from '@/lib/collection-api';

const routes = createItemRoutes({
  table: 'activities',
  idPrefix: 'act',
  parse: activitiesSchema,
});

export const PUT = routes.PUT;
export const PATCH = routes.PATCH;
export const DELETE = routes.DELETE;
