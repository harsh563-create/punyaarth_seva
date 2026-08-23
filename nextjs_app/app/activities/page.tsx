import type { Metadata } from 'next';
import Activities from '@/components/pages/Activities';

export const metadata: Metadata = {
  title: 'Activities & Gallery',
  description:
    'A visual journey through our seva activities and the moments that define our mission.',
};

export default function ActivitiesRoute() {
  return <Activities />;
}
