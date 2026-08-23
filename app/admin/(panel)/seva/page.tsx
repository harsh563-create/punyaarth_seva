import type { Metadata } from 'next';
import CollectionManager, {
  type ColumnDef,
  type FieldDef,
} from '@/components/admin/CollectionManager';
import { getSevaCategories } from '@/lib/data';

export const metadata: Metadata = { title: 'Seva Categories' };

const fields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', localized: true },
  {
    name: 'icon',
    label: 'Icon slug',
    type: 'text',
    placeholder: 'utensils, leaf, paw…',
  },
  { name: 'image', label: 'Cover image', type: 'image' },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    localized: true,
    wide: true,
  },
  {
    name: 'activities',
    label: 'Included activities',
    type: 'lines',
    wide: true,
    placeholder: 'Food distribution\nCommunity kitchens',
  },
];

const columns: ColumnDef[] = [
  { header: 'Category', cell: { kind: 'localized', field: 'title' } },
  { header: 'Icon', cell: { kind: 'code', field: 'icon' } },
  {
    header: 'Activities',
    cell: { kind: 'count', field: 'activities', suffix: ' listed' },
  },
  {
    header: 'Image',
    cell: { kind: 'thumb', srcField: 'image', altField: 'title' },
  },
];

export default async function AdminSevaPage() {
  const initialSeva = await getSevaCategories();
  return (
    <CollectionManager
      title="Seva Categories"
      singular="category"
      description="The pillars of seva shown on the Our Seva page."
      fields={fields}
      columns={columns}
      initialItems={initialSeva}
      idPrefix="seva"
      apiPath="/api/seva-categories"
    />
  );
}
