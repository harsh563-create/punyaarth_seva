import {
  activitiesSchema,
  createCollectionRoutes,
} from '@/lib/collection-api';

const routes = createCollectionRoutes({
  table: 'activities',
  idPrefix: 'act',
  parse: activitiesSchema,
});

export const GET = routes.GET;
export const POST = routes.POST;
