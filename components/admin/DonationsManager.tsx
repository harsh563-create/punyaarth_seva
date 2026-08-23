'use client';

import { useMemo, useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import type { Donation, DonationSettings } from '@/types';
import { Badge } from './ui';
import {
  CheckIcon,
  DownloadIcon,
  EyeIcon,
  RupeeIcon,
  SearchIcon,
  TrashIcon,
} from './icons';

interface DonationsManagerProps {
  initialDonations: Donation[];
  initialSettings: DonationSettings;
}

const EMPTY_SETTINGS: DonationSettings = {
  upiId: '',
  payeeName: '',
  qrImage: '',
  orgName: 'Punyaarth Seva Samiti',
  registrationDetails: '',
  taxExemptionDetails: '',
  contactEmail: '',
  contactPhone: '',
};

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DonationsManager({
  initialDonations,
  initialSettings,
}: DonationsManagerProps) {
  const [donations, setDonations] = useState(initialDonations);
  const [settings, setSettings] = useState({
    ...EMPTY_SETTINGS,
    ...initialSettings,
  });

  // settings form state
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');
  const [uploadingQr, setUploadingQr] = useState(false);
  const qrInputRef = useRef<HTMLInputElement>(null);

  // submissions state
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rowError, setRowError] = useState('');
  const [preview, setPreview] = useState<Donation | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return donations;
    return donations.filter(
      (d) =>
        d.donorName.toLowerCase().includes(q) ||
        d.utr.toLowerCase().includes(q) ||
        d.mobile.includes(q)
    );
  }, [donations, search]);

  const pendingCount = donations.filter((d) => d.status === 'pending').length;

  function update(field: keyof DonationSettings, value: string) {
    setSettings((s) => ({ ...s, [field]: value }));
    setSettingsMessage('');
  }

  async function uploadQr(file: File) {
    setUploadingQr(true);
    setSettingsMessage('');
    try {
      const form = new FormData();
      form.set('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? 'Upload failed');
      }
      setSettings((s) => ({ ...s, qrImage: data.url }));
    } catch (error) {
      setSettingsMessage(
        error instanceof Error ? error.message : 'Upload failed'
      );
    } finally {
      setUploadingQr(false);
      if (qrInputRef.current) qrInputRef.current.value = '';
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (savingSettings) return;
    setSavingSettings(true);
    setSettingsMessage('');
    try {
      const res = await fetch('/api/donation-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? 'Could not save settings');
      setSettingsMessage('Saved. The donation page is updated.');
    } catch (error) {
      setSettingsMessage(
        error instanceof Error ? error.message : 'Could not save settings'
      );
    } finally {
      setSavingSettings(false);
    }
  }

  async function toggleVerified(donation: Donation) {
    if (busyId) return;
    setBusyId(donation.id);
    setRowError('');
    try {
      const next = donation.status === 'verified' ? 'pending' : 'verified';
      const res = await fetch(`/api/donations/${donation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? 'Update failed');
      setDonations((items) =>
        items.map((item) =>
          item.id === donation.id ? { ...item, status: next } : item
        )
      );
    } catch (error) {
      setRowError(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(donation: Donation) {
    if (busyId) return;
    if (!window.confirm(`Delete the donation from ${donation.donorName}?`)) {
      return;
    }
    setBusyId(donation.id);
    setRowError('');
    try {
      const res = await fetch(`/api/donations/${donation.id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? 'Delete failed');
      setDonations((items) => items.filter((item) => item.id !== donation.id));
    } catch (error) {
      setRowError(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setBusyId(null);
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-beige-dark bg-white px-3.5 py-2.5 text-sm text-text outline-none focus:border-forest focus:ring-2 focus:ring-forest/15';

  return (
    <div className="space-y-8">
      {/* ================= PAYMENT SETTINGS ================= */}
      <section className="rounded-2xl border border-beige-dark bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Payment settings
            </h2>
            <p className="mt-1 font-sans text-sm text-text-muted">
              Shown on the public donation page. Use the organization&apos;s
              real UPI ID and QR code only.
            </p>
          </div>
          <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-muted text-forest sm:flex">
            <RupeeIcon className="h-5 w-5" />
          </span>
        </div>

        <form onSubmit={saveSettings} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="upi-id" className="block font-sans text-sm font-medium text-text">
              UPI ID *
            </label>
            <input
              id="upi-id"
              required
              placeholder="punyaarthseva@upi"
              value={settings.upiId}
              onChange={(e) => update('upiId', e.target.value)}
              className={`${inputClass} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="payee-name" className="block font-sans text-sm font-medium text-text">
              Payee name (shown in UPI apps)
            </label>
            <input
              id="payee-name"
              maxLength={120}
              value={settings.payeeName}
              onChange={(e) => update('payeeName', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <span className="block font-sans text-sm font-medium text-text">
              UPI QR code
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-beige-dark bg-cream">
                {settings.qrImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.qrImage}
                    alt="UPI QR code preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="px-2 text-center font-sans text-xs text-text-muted">
                    No QR uploaded
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <input
                  ref={qrInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadQr(file);
                  }}
                  className="block w-full cursor-pointer rounded-xl border border-beige-dark bg-white px-3 py-2 font-sans text-xs text-text-muted file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-forest file:px-3.5 file:py-1.5 file:text-xs file:font-medium file:text-text-on-dark"
                />
                {settings.qrImage && (
                  <button
                    type="button"
                    onClick={() => update('qrImage', '')}
                    className="rounded-full border border-red-200 px-3.5 py-1.5 font-sans text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Remove QR code
                  </button>
                )}
                {uploadingQr && (
                  <p className="font-sans text-xs text-text-muted">Uploading…</p>
                )}
              </div>
            </div>
          </div>

          <hr className="-mx-6 border-beige sm:col-span-2" />

          <div className="sm:col-span-2">
            <label htmlFor="org-name" className="block font-sans text-sm font-medium text-text">
              Organization name
            </label>
            <input
              id="org-name"
              maxLength={160}
              value={settings.orgName}
              onChange={(e) => update('orgName', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="reg-details" className="block font-sans text-sm font-medium text-text">
              Registration details
            </label>
            <input
              id="reg-details"
              maxLength={400}
              placeholder="e.g. Reg. No. ABC/2019/01234"
              value={settings.registrationDetails}
              onChange={(e) => update('registrationDetails', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tax-details" className="block font-sans text-sm font-medium text-text">
              80G / 12A tax exemption
            </label>
            <input
              id="tax-details"
              maxLength={400}
              placeholder="e.g. 80G No. DEL-PE12345 (if applicable)"
              value={settings.taxExemptionDetails}
              onChange={(e) => update('taxExemptionDetails', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block font-sans text-sm font-medium text-text">
              Contact email
            </label>
            <input
              id="contact-email"
              type="email"
              maxLength={160}
              value={settings.contactEmail}
              onChange={(e) => update('contactEmail', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className="block font-sans text-sm font-medium text-text">
              Contact phone
            </label>
            <input
              id="contact-phone"
              type="tel"
              maxLength={40}
              value={settings.contactPhone}
              onChange={(e) => update('contactPhone', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <button
              type="submit"
              disabled={savingSettings || uploadingQr}
              className="rounded-full bg-forest px-6 py-2.5 font-sans text-sm font-semibold text-text-on-dark transition-colors hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {savingSettings ? 'Saving…' : 'Save settings'}
            </button>
            {settingsMessage && (
              <p className="font-sans text-sm text-text-muted">{settingsMessage}</p>
            )}
          </div>
        </form>
      </section>

      {/* ================= SUBMISSIONS ================= */}
      <section className="rounded-2xl border border-beige-dark bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
          <div>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Donation submissions
            </h2>
            <p className="mt-1 font-sans text-sm text-text-muted">
              {donations.length} total · {pendingCount} pending verification
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                placeholder="Search name, UTR, mobile…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 rounded-full border border-beige-dark bg-white py-2 pl-9 pr-4 font-sans text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </div>
            <a
              href="/api/donations/export"
              className="inline-flex items-center gap-2 rounded-full border border-forest/25 px-4 py-2 font-sans text-sm font-medium text-forest transition-colors hover:bg-forest-muted cursor-pointer"
            >
              <DownloadIcon className="h-4 w-4" />
              Download CSV
            </a>
          </div>
        </div>

        {rowError && (
          <p role="alert" className="mx-6 mt-4 rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
            {rowError}
          </p>
        )}

        {filtered.length === 0 ? (
          <p className="p-6 font-sans text-sm text-text-muted">
            {donations.length === 0
              ? 'No donation submissions yet.'
              : 'No submissions match your search.'}
          </p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-beige-dark font-sans text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Donor</th>
                    <th className="px-4 py-3 font-medium">Mobile</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">UTR</th>
                    <th className="px-4 py-3 font-medium">Proof</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id} className="border-b border-beige last:border-0 hover:bg-cream/60">
                      <td className="whitespace-nowrap px-6 py-3.5 font-sans text-xs text-text-muted">
                        {formatDate(d.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 font-sans text-sm font-medium text-text">
                        {d.donorName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-sans text-sm text-text-muted">
                        {d.mobile}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-sans text-sm font-semibold text-forest">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 font-sans font-mono text-xs text-text-light">
                        {d.utr}
                      </td>
                      <td className="px-4 py-3.5">
                        {d.screenshot ? (
                          <button
                            type="button"
                            onClick={() => setPreview(d)}
                            aria-label="View payment screenshot"
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-sans text-xs font-medium text-forest hover:bg-forest-muted cursor-pointer"
                          >
                            <EyeIcon className="h-4 w-4" />
                            View
                          </button>
                        ) : (
                          <span className="font-sans text-xs text-text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge tone={d.status === 'verified' ? 'forest' : 'saffron'}>
                          {d.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={busyId === d.id}
                            onClick={() => toggleVerified(d)}
                            title={d.status === 'verified' ? 'Mark as pending' : 'Mark as verified'}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer ${
                              d.status === 'verified'
                                ? 'border border-beige-dark text-text-muted hover:bg-beige'
                                : 'bg-forest text-text-on-dark hover:bg-forest-light'
                            }`}
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                            {d.status === 'verified' ? 'Unverify' : 'Verify'}
                          </button>
                          <button
                            type="button"
                            disabled={busyId === d.id}
                            onClick={() => remove(d)}
                            aria-label={`Delete donation from ${d.donorName}`}
                            className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-beige p-6 pt-2 md:hidden">
              {filtered.map((d) => (
                <li key={d.id} className="py-4 first:pt-2 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-sans text-sm font-semibold text-text">{d.donorName}</p>
                      <p className="font-sans text-xs text-text-muted">{formatDate(d.createdAt)}</p>
                    </div>
                    <Badge tone={d.status === 'verified' ? 'forest' : 'saffron'}>
                      {d.status}
                    </Badge>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-sans text-xs">
                    <div>
                      <dt className="text-text-muted">Amount</dt>
                      <dd className="font-semibold text-forest">₹{Number(d.amount).toLocaleString('en-IN')}</dd>
                    </div>
                    <div>
                      <dt className="text-text-muted">Mobile</dt>
                      <dd className="text-text">{d.mobile}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-text-muted">UTR</dt>
                      <dd className="font-mono text-text">{d.utr}</dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {d.screenshot && (
                      <button
                        type="button"
                        onClick={() => setPreview(d)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-beige-dark px-3 py-1.5 font-sans text-xs font-medium text-forest cursor-pointer"
                      >
                        <EyeIcon className="h-3.5 w-3.5" /> Screenshot
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busyId === d.id}
                      onClick={() => toggleVerified(d)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs font-medium disabled:opacity-50 cursor-pointer ${
                        d.status === 'verified'
                          ? 'border border-beige-dark text-text-muted'
                          : 'bg-forest text-text-on-dark'
                      }`}
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                      {d.status === 'verified' ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === d.id}
                      onClick={() => remove(d)}
                      className="ml-auto rounded-full p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                      aria-label="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Screenshot preview */}
      <Modal isOpen={preview !== null} onClose={() => setPreview(null)}>
        {preview && (
          <div className="p-6">
            <h3 className="pr-10 font-serif text-lg font-semibold text-forest">
              Payment proof — {preview.donorName}
            </h3>
            <p className="mt-1 font-sans text-xs text-text-muted">
              ₹{Number(preview.amount).toLocaleString('en-IN')} · UTR{' '}
              <span className="font-mono">{preview.utr}</span>
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/donations/${preview.id}/screenshot`}
              alt={`Payment screenshot from ${preview.donorName}`}
              className="mt-4 max-h-[70vh] w-full rounded-xl object-contain"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
