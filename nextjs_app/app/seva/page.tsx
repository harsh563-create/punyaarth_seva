import type { Metadata } from 'next';
import OurSeva from '@/components/pages/OurSeva';

export const metadata: Metadata = {
  title: 'Our Seva',
  description:
    'Every type of service matters. Explore the different ways we serve our community.',
};

export default function OurSevaRoute() {
  return <OurSeva />;
}
