import {
  createCollectionRoutes,
  eventsSchema,
} from '@/lib/collection-api';

const routes = createCollectionRoutes({
  table: 'events',
  idPrefix: 'evt',
  parse: eventsSchema,
});

export const GET = routes.GET;
export const POST = routes.POST;
