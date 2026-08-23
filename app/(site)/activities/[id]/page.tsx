import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ActivityDetails from '@/components/pages/ActivityDetails';
import { getActivities } from '@/lib/data';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const activities = await getActivities();
  const activity = activities.find((a) => a.id === id);
  if (!activity) return { title: 'Activity Not Found' };
  return {
    title: activity.title.en,
    description: activity.description.en || activity.description.hi || undefined,
  };
}

export default async function ActivityDetailRoute({ params }: Props) {
  const { id } = await params;
  const activities = await getActivities();
  const activity = activities.find((a) => a.id === id);
  if (!activity) notFound();
  return <ActivityDetails activity={activity} />;
}
