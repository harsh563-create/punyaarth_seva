import type { Metadata } from 'next';
import Team from '@/components/pages/Team';
import { getPublicTeamMembers } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the dedicated people behind Punyaarth Seva Samiti — leadership, core team and volunteers working together for समाज सेवा and a better tomorrow.',
};

export default async function TeamRoute() {
  const members = await getPublicTeamMembers();
  return <Team members={members} />;
}
