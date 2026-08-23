import type { Metadata } from 'next';
import Donate from '@/components/pages/Donate';
import { getDonationSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Support Our Seva — Donate',
  description:
    'Aapka chhota sa yogdan kisi ki zindagi mein bada badlav la sakta hai. Donate securely via UPI to Punyaarth Seva Samiti.',
};

export default async function DonateRoute() {
  const settings = await getDonationSettings();
  return <Donate settings={settings} />;
}
