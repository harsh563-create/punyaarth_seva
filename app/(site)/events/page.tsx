import type { Metadata } from 'next';
import Events from '@/components/pages/Events';
import { getEvents } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Seva & Community Events',
  description:
    'Join us in making a difference through meaningful community events and seva activities.',
};

export default async function EventsRoute() {
  const events = await getEvents();
  return <Events events={events} />;
}
