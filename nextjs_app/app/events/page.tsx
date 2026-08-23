import type { Metadata } from 'next';
import Events from '@/components/pages/Events';

export const metadata: Metadata = {
  title: 'Seva & Community Events',
  description:
    'Join us in making a difference through meaningful community events and seva activities.',
};

export default function EventsRoute() {
  return <Events />;
}
