import {
  createItemRoutes,
  galleryImagesSchema,
} from '@/lib/collection-api';

const routes = createItemRoutes({
  table: 'gallery_images',
  idPrefix: 'img',
  parse: galleryImagesSchema,
});

export const PUT = routes.PUT;
export const PATCH = routes.PATCH;
export const DELETE = routes.DELETE;
