import type { Metadata } from 'next';
import JoinUs from '@/components/pages/JoinUs';

export const metadata: Metadata = {
  title: 'Join Us',
  description:
    'Anyone can contribute. Find the way that works best for you and volunteer with Punyaarth Seva.',
};

export default function JoinUsRoute() {
  return <JoinUs />;
}
