import type { Metadata } from 'next';
import CollectionManager, {
  type ColumnDef,
  type FieldDef,
} from '@/components/admin/CollectionManager';
import { getImpactStats } from '@/lib/data';

export const metadata: Metadata = { title: 'Impact Stats' };

const fields: FieldDef[] = [
  { name: 'label', label: 'Label', type: 'text', localized: true },
  { name: 'value', label: 'Value', type: 'number' },
  { name: 'suffix', label: 'Suffix', type: 'text', placeholder: '+, %, K…' },
  {
    name: 'icon',
    label: 'Icon slug',
    type: 'text',
    placeholder: 'utensils, users…',
  },
];

const columns: ColumnDef[] = [
  { header: 'Stat', cell: { kind: 'localized', field: 'label' } },
  {
    header: 'Display',
    cell: { kind: 'stat', field: 'value', suffixField: 'suffix' },
  },
  { header: 'Icon', cell: { kind: 'code', field: 'icon' } },
];

export default async function AdminImpactPage() {
  const initialStats = await getImpactStats();
  return (
    <CollectionManager
      title="Impact Stats"
      singular="stat"
      description="The counters highlighted across the website."
      fields={fields}
      columns={columns}
      initialItems={initialStats}
      idPrefix="stat"
      apiPath="/api/impact-stats"
    />
  );
}
