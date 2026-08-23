import type { Metadata } from 'next';
import About from '@/components/pages/About';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'We are a group of people who voluntarily come together to help society, people, animals, and nature.',
};

export default function AboutRoute() {
  return <About />;
}
