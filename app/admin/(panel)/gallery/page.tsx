import type { Metadata } from 'next';
import CollectionManager, {
  type ColumnDef,
  type FieldDef,
} from '@/components/admin/CollectionManager';
import { getGalleryImages } from '@/lib/data';

export const metadata: Metadata = { title: 'Gallery' };

const CATEGORY_OPTIONS = [
  'food-seva',
  'nature',
  'animals',
  'community',
  'events',
  'awareness',
];

const fields: FieldDef[] = [
  { name: 'src', label: 'Image path', type: 'image', wide: true },
  { name: 'alt', label: 'Alt text', type: 'text', localized: true },
  { name: 'category', label: 'Category', type: 'select', options: CATEGORY_OPTIONS },
  { name: 'date', label: 'Date', type: 'date' },
];

const columns: ColumnDef[] = [
  {
    header: 'Photo',
    cell: { kind: 'thumb', srcField: 'src', altField: 'alt' },
  },
  { header: 'Alt text', cell: { kind: 'localized', field: 'alt' } },
  { header: 'Category', cell: { kind: 'badge', field: 'category', tone: 'earth' } },
  { header: 'Date', cell: { kind: 'text', field: 'date' } },
];

export default async function AdminGalleryPage() {
  const initialGallery = await getGalleryImages();
  return (
    <CollectionManager
      title="Gallery"
      singular="photo"
      description="Photos shown in the website gallery."
      fields={fields}
      columns={columns}
      initialItems={initialGallery}
      idPrefix="img"
      apiPath="/api/gallery"
    />
  );
}
