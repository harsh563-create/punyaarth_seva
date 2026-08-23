import {
  createCollectionRoutes,
  impactStatsSchema,
} from '@/lib/collection-api';

const routes = createCollectionRoutes({
  table: 'impact_stats',
  idPrefix: 'stat',
  parse: impactStatsSchema,
});

export const GET = routes.GET;
export const POST = routes.POST;
