import type { Metadata } from 'next';
import About from '@/components/pages/About';
import { getAboutContent } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'We are a group of people who voluntarily come together to help society, people, animals, and nature.',
};

export default async function AboutRoute() {
  const content = await getAboutContent();
  return <About content={content} />;
}
