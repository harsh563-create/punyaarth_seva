import type { Metadata } from 'next';
import Activities from '@/components/pages/Activities';
import { getActivities, getGalleryImages } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Activities & Gallery',
  description:
    'A visual journey through our seva activities and the moments that define our mission.',
};

export default async function ActivitiesRoute() {
  const [activities, galleryImages] = await Promise.all([
    getActivities(),
    getGalleryImages(),
  ]);
  return <Activities activities={activities} galleryImages={galleryImages} />;
}
