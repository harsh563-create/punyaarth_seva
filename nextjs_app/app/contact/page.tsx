import type { Metadata } from 'next';
import Contact from '@/components/pages/Contact';

export const metadata: Metadata = {
  title: 'Get in Touch',
  description:
    'Have a question, want to volunteer, or just want to say hello? We would love to hear from you.',
};

export default function ContactRoute() {
  return <Contact />;
}
