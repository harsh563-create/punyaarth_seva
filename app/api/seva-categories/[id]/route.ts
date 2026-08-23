import {
  createItemRoutes,
  sevaCategoriesSchema,
} from '@/lib/collection-api';

const routes = createItemRoutes({
  table: 'seva_categories',
  idPrefix: 'seva',
  parse: sevaCategoriesSchema,
});

export const PUT = routes.PUT;
export const PATCH = routes.PATCH;
export const DELETE = routes.DELETE;
