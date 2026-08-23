import type { Metadata } from 'next';
import CollectionManager, {
  type ColumnDef,
  type FieldDef,
} from '@/components/admin/CollectionManager';
import { getTeamMembers } from '@/lib/data';

export const metadata: Metadata = { title: 'Team' };

const fields: FieldDef[] = [
  { name: 'name', label: 'Full name', type: 'text' },
  { name: 'designation', label: 'Designation', type: 'text', localized: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: ['leadership', 'core', 'volunteer'],
  },
  { name: 'orderIndex', label: 'Display order', type: 'number' },
  { name: 'photo', label: 'Photo', type: 'image' },
  { name: 'phone', label: 'Phone (private)', type: 'text' },
  { name: 'showPhone', label: 'Publish phone on website', type: 'boolean' },
  { name: 'publicProfile', label: 'Show on website', type: 'boolean' },
  { name: 'active', label: 'Active member', type: 'boolean' },
  {
    name: 'bio',
    label: 'Short bio / responsibility',
    type: 'textarea',
    localized: true,
    wide: true,
  },
  {
    name: 'socials',
    label: 'Social profile links',
    type: 'lines',
    wide: true,
  },
];

const columns: ColumnDef[] = [
  { header: '', cell: { kind: 'thumb', srcField: 'photo' } },
  { header: 'Name', cell: { kind: 'text', field: 'name', strong: true } },
  { header: 'Designation', cell: { kind: 'truncate', field: 'designation' } },
  {
    header: 'Category',
    cell: {
      kind: 'badge',
      field: 'category',
      tone: { leadership: 'saffron', core: 'forest' },
    },
  },
  { header: 'Order', cell: { kind: 'stat', field: 'orderIndex' } },
  { header: 'Active', cell: { kind: 'boolean', field: 'active', label: 'Active' } },
  {
    header: 'Public',
    cell: { kind: 'boolean', field: 'publicProfile', label: 'Public' },
  },
];

export default async function AdminTeamPage() {
  const members = await getTeamMembers();
  return (
    <CollectionManager
      title="Team"
      singular="member"
      description="People shown on the Our Team page. Phone numbers stay private unless “Publish phone on website” is enabled."
      fields={fields}
      columns={columns}
      initialItems={members}
      idPrefix="mbr"
      apiPath="/api/team"
    />
  );
}
