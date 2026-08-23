import type { Metadata } from 'next';
import CollectionManager, {
  type ColumnDef,
  type FieldDef,
} from '@/components/admin/CollectionManager';
import { getActivities } from '@/lib/data';

export const metadata: Metadata = { title: 'Activities' };

const CATEGORY_OPTIONS = [
  'food-seva',
  'nature',
  'animals',
  'community',
  'events',
  'awareness',
];

const fields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', localized: true },
  { name: 'category', label: 'Category', type: 'select', options: CATEGORY_OPTIONS },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'location', label: 'Location', type: 'text', localized: true },
  {
    name: 'volunteersInvolved',
    label: 'Volunteers involved',
    type: 'number',
  },
  { name: 'featured', label: 'Featured activity', type: 'boolean' },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    localized: true,
    wide: true,
  },
  {
    name: 'images',
    label: 'Photos',
    type: 'media',
    mediaKind: 'image',
    wide: true,
    placeholder: '/assets/images/photo-1.jpg\n/assets/images/photo-2.jpg',
    hint: 'One per line — paste URLs or pick from the Media Library.',
  },
  {
    name: 'videos',
    label: 'Videos',
    type: 'media',
    mediaKind: 'video',
    wide: true,
    placeholder:
      'https://www.youtube.com/watch?v=VIDEO_ID\nhttps://youtu.be/VIDEO_ID\nhttps://example.com/video.mp4',
    hint: 'One per line — YouTube links embed, direct .mp4/.webm play inline. Or pick from the Media Library.',
  },
];

const columns: ColumnDef[] = [
  { header: 'Activity', cell: { kind: 'localized', field: 'title' } },
  { header: 'Category', cell: { kind: 'badge', field: 'category', tone: 'forest' } },
  { header: 'Date', cell: { kind: 'text', field: 'date' } },
  {
    header: 'Featured',
    cell: {
      kind: 'boolean',
      field: 'featured',
      label: 'Featured',
      tone: 'saffron',
    },
  },
  { header: 'Photos', cell: { kind: 'count', field: 'images' } },
  { header: 'Videos', cell: { kind: 'count', field: 'videos' } },
];

export default async function AdminActivitiesPage() {
  const initialActivities = await getActivities();
  return (
    <CollectionManager
      title="Activities"
      singular="activity"
      description="Completed seva activities with their photos, videos and categories."
      fields={fields}
      columns={columns}
      initialItems={initialActivities}
      idPrefix="act"
      apiPath="/api/activities"
    />
  );
}
