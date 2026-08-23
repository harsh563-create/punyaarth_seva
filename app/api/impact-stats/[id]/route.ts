import {
  createItemRoutes,
  impactStatsSchema,
} from '@/lib/collection-api';

const routes = createItemRoutes({
  table: 'impact_stats',
  idPrefix: 'stat',
  parse: impactStatsSchema,
});

export const PUT = routes.PUT;
export const PATCH = routes.PATCH;
export const DELETE = routes.DELETE;
