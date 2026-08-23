import type { Metadata } from 'next';
import CollectionManager, {
  type ColumnDef,
  type FieldDef,
} from '@/components/admin/CollectionManager';
import { getEvents } from '@/lib/data';

export const metadata: Metadata = { title: 'Events' };

const fields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', localized: true },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'location', label: 'Location', type: 'text', localized: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['upcoming', 'past'],
  },
  { name: 'image', label: 'Cover image', type: 'image' },
  { name: 'volunteersNeeded', label: 'Volunteers needed', type: 'number' },
  { name: 'volunteersJoined', label: 'Volunteers joined', type: 'number' },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    localized: true,
    wide: true,
  },
];

const columns: ColumnDef[] = [
  { header: 'Event', cell: { kind: 'localized', field: 'title' } },
  { header: 'Date', cell: { kind: 'text', field: 'date' } },
  { header: 'Location', cell: { kind: 'truncate', field: 'location' } },
  {
    header: 'Status',
    cell: { kind: 'badge', field: 'status', tone: { upcoming: 'saffron' } },
  },
  {
    header: 'Volunteers',
    cell: {
      kind: 'volunteers',
      joinedField: 'volunteersJoined',
      neededField: 'volunteersNeeded',
    },
  },
];

export default async function AdminEventsPage() {
  const initialEvents = await getEvents();
  return (
    <CollectionManager
      title="Events"
      singular="event"
      description="Seva days, drives and community gatherings shown on the Events page."
      fields={fields}
      columns={columns}
      initialItems={initialEvents}
      idPrefix="evt"
      apiPath="/api/events"
    />
  );
}
