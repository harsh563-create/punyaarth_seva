import { createItemRoutes, teamSchema } from '@/lib/collection-api';

const routes = createItemRoutes({
  table: 'team_members',
  idPrefix: 'mbr',
  parse: teamSchema,
});

export const PUT = routes.PUT;
export const PATCH = routes.PATCH;
export const DELETE = routes.DELETE;
