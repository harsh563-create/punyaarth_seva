import type { Metadata } from 'next';
import OurSeva from '@/components/pages/OurSeva';
import { getSevaCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Our Seva',
  description:
    'Every type of service matters. Explore the different ways we serve our community.',
};

export default async function OurSevaRoute() {
  const sevaCategories = await getSevaCategories();
  return <OurSeva sevaCategories={sevaCategories} />;
}
