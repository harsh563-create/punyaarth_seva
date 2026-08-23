import type { Metadata } from 'next';
import DonationsManager from '@/components/admin/DonationsManager';
import { getDonationSettings, getDonations } from '@/lib/data';

export const metadata: Metadata = { title: 'Donations' };

export default async function AdminDonationsPage() {
  const [donations, settings] = await Promise.all([
    getDonations(),
    getDonationSettings(),
  ]);

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-forest">
          Donations
        </h1>
        <p className="mt-1 font-sans text-sm text-text-muted">
          Manage the UPI payment details and review donor confirmations.
        </p>
      </header>
      <DonationsManager
        initialDonations={donations}
        initialSettings={settings}
      />
    </div>
  );
}
