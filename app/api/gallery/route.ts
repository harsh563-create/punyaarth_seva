import {
  createCollectionRoutes,
  galleryImagesSchema,
} from '@/lib/collection-api';

const routes = createCollectionRoutes({
  table: 'gallery_images',
  idPrefix: 'img',
  parse: galleryImagesSchema,
});

export const GET = routes.GET;
export const POST = routes.POST;
