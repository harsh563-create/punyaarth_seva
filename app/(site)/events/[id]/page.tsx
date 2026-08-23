import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetails from '@/components/pages/EventDetails';
import { getEvents } from '@/lib/data';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const events = await getEvents();
  const event = events.find((e) => e.id === id);
  if (!event) return { title: 'Event Not Found' };
  return {
    title: event.title.en,
    description: event.description.en || event.description.hi || undefined,
  };
}

export default async function EventDetailRoute({ params }: Props) {
  const { id } = await params;
  const events = await getEvents();
  const event = events.find((e) => e.id === id);
  if (!event) notFound();
  return <EventDetails event={event} />;
}
