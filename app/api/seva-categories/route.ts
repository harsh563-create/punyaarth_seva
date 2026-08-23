import {
  createCollectionRoutes,
  sevaCategoriesSchema,
} from '@/lib/collection-api';

const routes = createCollectionRoutes({
  table: 'seva_categories',
  idPrefix: 'seva',
  parse: sevaCategoriesSchema,
});

export const GET = routes.GET;
export const POST = routes.POST;
