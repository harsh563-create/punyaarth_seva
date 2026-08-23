'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { DonationSettings } from '@/types';
import { useLanguage } from '@/i18n/useLanguage';

const PRESETS = [101, 501, 1001, 5001];

type Step = 'amount' | 'pay' | 'confirm' | 'done';

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

const CAUSE_ICONS = ['causeBlood', 'causeHealth', 'causeTrees', 'causeEducation', 'causeCommunity'] as const;
const CAUSE_EMOJI: Record<(typeof CAUSE_ICONS)[number], string> = {
  causeBlood: '🩸',
  causeHealth: '🏥',
  causeTrees: '🌳',
  causeEducation: '📚',
  causeCommunity: '🤝',
};

export default function Donate({ settings }: { settings: DonationSettings }) {
  const { t } = useLanguage();

  const configured = Boolean(settings.upiId || settings.qrImage);

  const [step, setStep] = useState<Step>('amount');
  const [preset, setPreset] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [donorName, setDonorName] = useState('');
  const [mobile, setMobile] = useState('');
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const amount = preset ?? (Number(customValue) > 0 ? Math.floor(Number(customValue)) : null);
  const upiLink =
    settings.upiId && amount
      ? `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(
          settings.payeeName || settings.orgName
        )}&am=${amount}&cu=INR&tn=${encodeURIComponent(
          `Donation to ${settings.orgName}`
        )}`
      : '';

  function choosePreset(value: number) {
    setPreset(value);
    setCustomValue('');
    setError('');
  }

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(settings.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function submitConfirmation(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const form = new FormData();
      form.set('donorName', donorName);
      form.set('mobile', mobile);
      form.set('amount', String(amount));
      form.set('utr', utr.trim());
      form.set('website', ''); // honeypot
      if (screenshot) form.set('screenshot', screenshot);

      const res = await fetch('/api/donations', { method: 'POST', body: form });
      if (!res.ok) {
        let message = t('donatePage.errorGeneric');
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          /* non-JSON error */
        }
        throw new Error(message);
      }
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('donatePage.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  }

  function resetFlow() {
    setStep('amount');
    setPreset(null);
    setCustomValue('');
    setDonorName('');
    setMobile('');
    setUtr('');
    setScreenshot(null);
    setError('');
  }

  return (
    <div className="bg-white">
      {/* ============ HEADER ============ */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-saffron/10 text-saffron-dark rounded-full text-sm font-medium border border-saffron/20">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {t('donatePage.trustEyebrow')}
          </span>
          <h1 className="mt-5 font-serif text-4xl md:text-5xl font-semibold text-forest leading-tight">
            {t('donatePage.heroTitle')}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-text-light leading-relaxed">
            {t('donatePage.heroSubtitle')}
          </p>
        </div>
      </section>

      {!configured ? (
        /* ============ NOT CONFIGURED ============ */
        <section className="pb-24 px-4">
          <div className="max-w-xl mx-auto rounded-2xl border border-beige-dark bg-cream p-8 text-center shadow-sm">
            <p className="text-text-muted">{t('donatePage.notConfigured')}</p>
            {settings.contactEmail && (
              <p className="mt-3 text-sm text-text-muted">
                {t('donatePage.emailLabel')}:{' '}
                <a className="text-forest font-medium underline" href={`mailto:${settings.contactEmail}`}>
                  {settings.contactEmail}
                </a>
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="pb-20 px-4">
          <div className="max-w-2xl mx-auto rounded-[1.75rem] border border-beige-dark bg-white shadow-[0_20px_45px_-25px_rgba(15,51,32,0.35)] overflow-hidden">
            {/* ============ STEP: AMOUNT ============ */}
            {step === 'amount' && (
              <div className="p-6 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-text text-center">
                  {t('donatePage.amountTitle')}
                </h2>
                <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">
                  {PRESETS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => choosePreset(value)}
                      aria-pressed={preset === value}
                      className={`rounded-2xl border-2 px-4 py-5 text-lg font-semibold transition-colors cursor-pointer ${
                        preset === value
                          ? 'border-saffron bg-saffron/10 text-saffron-dark'
                          : 'border-beige-dark bg-white text-text hover:border-forest/40'
                      }`}
                    >
                      {formatINR(value)}
                    </button>
                  ))}
                </div>

                <div
                  className={`mt-4 rounded-2xl border-2 px-4 py-4 transition-colors ${
                    !preset && amount ? 'border-saffron bg-saffron/10' : 'border-beige-dark'
                  }`}
                >
                  <label
                    htmlFor="custom-amount"
                    className={`block text-sm font-medium ${
                      !preset && amount ? 'text-saffron-dark' : 'text-text-muted'
                    }`}
                  >
                    {t('donatePage.customAmount')}
                  </label>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-semibold text-text">₹</span>
                    <input
                      id="custom-amount"
                      type="number"
                      min={1}
                      inputMode="numeric"
                      placeholder={t('donatePage.customPlaceholder')}
                      value={customValue}
                      onChange={(e) => {
                        setCustomValue(e.target.value);
                        setPreset(null);
                        setError('');
                      }}
                      className="w-full bg-transparent text-lg font-semibold text-text outline-none placeholder:text-text-muted/60 placeholder:font-normal"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!amount}
                  onClick={() => amount && setStep('pay')}
                  className="mt-7 w-full rounded-full bg-forest py-4 text-base font-semibold text-text-on-dark transition-colors hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  {amount ? `${t('donatePage.scanPayCta')} · ${formatINR(amount)}` : t('donatePage.amountTitle')}
                </button>
              </div>
            )}

            {/* ============ STEP: PAY VIA UPI ============ */}
            {step === 'pay' && (
              <div className="p-6 md:p-10">
                <button
                  type="button"
                  onClick={() => setStep('amount')}
                  className="text-sm font-medium text-text-muted hover:text-forest cursor-pointer"
                >
                  ← {t('donatePage.changeLink')}
                </button>

                <div className="mt-4 text-center">
                  <p className="inline-flex items-center gap-2 rounded-full bg-forest-muted px-4 py-1.5 text-sm font-semibold text-forest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {t('donatePage.secureUpiTitle')} · {formatINR(amount ?? 0)}
                  </p>
                </div>

                {/* QR */}
                <div className="mx-auto mt-7 w-fit rounded-3xl border-2 border-forest/15 bg-white p-4 shadow-sm">
                  {settings.qrImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.qrImage}
                      alt={t('donatePage.qrAlt')}
                      width={280}
                      height={280}
                      className="h-[260px] w-[260px] object-contain sm:h-[300px] sm:w-[300px]"
                    />
                  ) : (
                    <div className="flex h-[260px] w-[260px] items-center justify-center rounded-xl bg-cream text-sm text-text-muted sm:h-[300px] sm:w-[300px]">
                      {t('donatePage.upiIdLabel')}
                    </div>
                  )}
                </div>

                {/* UPI ID */}
                {settings.upiId && (
                  <div className="mx-auto mt-6 flex max-w-md items-center justify-between gap-3 rounded-2xl border border-beige-dark bg-cream px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        {t('donatePage.upiIdLabel')}
                      </p>
                      <p className="truncate font-mono text-base font-semibold text-forest">
                        {settings.upiId}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={copyUpi}
                      className="shrink-0 rounded-full border border-forest/25 px-4 py-1.5 text-sm font-medium text-forest hover:bg-forest-muted cursor-pointer"
                    >
                      {copied ? t('donatePage.copiedLabel') : t('donatePage.copyButton')}
                    </button>
                  </div>
                )}

                {/* Instructions */}
                <ol className="mx-auto mt-6 max-w-md space-y-2.5 text-left">
                  {[t('donatePage.instruction1'), t('donatePage.instruction2'), t('donatePage.instruction3')].map(
                    (line, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text-light">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-saffron/15 text-[11px] font-bold text-saffron-dark">
                          {i + 1}
                        </span>
                        {line}
                      </li>
                    )
                  )}
                </ol>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {upiLink ? (
                    <a
                      href={upiLink}
                      className="flex-1 rounded-full bg-forest px-6 py-4 text-center text-base font-semibold text-text-on-dark transition-colors hover:bg-forest-light"
                    >
                      {t('donatePage.scanPayCta')}
                    </a>
                  ) : (
                    <div className="flex-1 rounded-full bg-cream px-6 py-4 text-center text-base font-medium text-text-muted border border-dashed border-beige-dark">
                      {t('donatePage.scanPayCta')}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setStep('confirm')}
                    className="flex-1 rounded-full border-2 border-forest px-6 py-4 text-base font-semibold text-forest transition-colors hover:bg-forest-muted cursor-pointer"
                  >
                    {t('donatePage.completedPaymentCta')}
                  </button>
                </div>

                <p className="mt-5 text-center text-xs leading-relaxed text-text-muted">
                  🔒 {t('donatePage.safeNote')}
                </p>
              </div>
            )}

            {/* ============ STEP: CONFIRMATION FORM ============ */}
            {step === 'confirm' && (
              <form onSubmit={submitConfirmation} className="p-6 md:p-10">
                <button
                  type="button"
                  onClick={() => setStep('pay')}
                  className="text-sm font-medium text-text-muted hover:text-forest cursor-pointer"
                >
                  ← {t('donatePage.secureUpiTitle')}
                </button>

                <h2 className="mt-4 font-serif text-2xl font-semibold text-text">
                  {t('donatePage.confirmTitle')}
                </h2>
                <p className="mt-1.5 text-sm text-text-muted">{t('donatePage.confirmSubtitle')}</p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="donor-name" className="block text-sm font-medium text-text">
                      {t('donatePage.donorNameLabel')} *
                    </label>
                    <input
                      id="donor-name"
                      required
                      maxLength={120}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={t('donatePage.donorNamePlaceholder')}
                      className="mt-1.5 w-full rounded-xl border border-beige-dark bg-white px-4 py-3 text-text outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="donor-mobile" className="block text-sm font-medium text-text">
                        {t('donatePage.mobileLabel')} *
                      </label>
                      <input
                        id="donor-mobile"
                        required
                        type="tel"
                        inputMode="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder={t('donatePage.mobilePlaceholder')}
                        className="mt-1.5 w-full rounded-xl border border-beige-dark bg-white px-4 py-3 text-text outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
                      />
                    </div>
                    <div>
                      <label htmlFor="donation-amount" className="block text-sm font-medium text-text">
                        {t('donatePage.amountLabel')} *
                      </label>
                      <input
                        id="donation-amount"
                        required
                        type="number"
                        min={1}
                        inputMode="numeric"
                        value={amount ?? ''}
                        onChange={(e) => {
                          setCustomValue(e.target.value);
                          setPreset(null);
                        }}
                        className="mt-1.5 w-full rounded-xl border border-beige-dark bg-white px-4 py-3 text-text outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="donation-utr" className="block text-sm font-medium text-text">
                      {t('donatePage.utrLabel')} *
                    </label>
                    <input
                      id="donation-utr"
                      required
                      minLength={4}
                      maxLength={60}
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      placeholder={t('donatePage.utrPlaceholder')}
                      className="mt-1.5 w-full rounded-xl border border-beige-dark bg-white px-4 py-3 font-mono text-text outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
                    />
                  </div>

                  <div>
                    <label htmlFor="donation-proof" className="block text-sm font-medium text-text">
                      {t('donatePage.screenshotLabel')}
                    </label>
                    <input
                      id="donation-proof"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                      className="mt-1.5 w-full cursor-pointer rounded-xl border border-dashed border-beige-dark bg-cream px-4 py-3 text-sm text-text-muted file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-text-on-dark"
                    />
                    <p className="mt-1 text-xs text-text-muted">{t('donatePage.screenshotHint')}</p>
                  </div>

                  {/* honeypot */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                  {error && (
                    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-saffron py-4 text-base font-semibold text-white transition-colors hover:bg-saffron-light disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? t('donatePage.submittingCta') : t('donatePage.submitCta')}
                  </button>
                </div>
              </form>
            )}

            {/* ============ STEP: THANK YOU ============ */}
            {step === 'done' && (
              <div className="p-8 md:p-12 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-muted text-forest">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h2 className="mt-6 font-serif text-2xl font-semibold text-forest leading-snug">
                  {t('donatePage.thankYouTitle')}
                </h2>
                <p className="mt-3 text-text-light">{t('donatePage.thankYouText')}</p>
                <button
                  type="button"
                  onClick={resetFlow}
                  className="mt-8 rounded-full border-2 border-forest px-6 py-3 text-sm font-semibold text-forest hover:bg-forest-muted cursor-pointer"
                >
                  {t('donatePage.anotherDonation')}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ TRUST & TRANSPARENCY ============ */}
      <section className="border-t border-beige bg-cream-light py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            {/* Where your donation goes */}
            <div className="rounded-2xl border border-beige-dark bg-white p-7 md:p-9 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold text-forest">
                {t('donatePage.trustTitle')}
              </h2>
              <ul className="mt-6 space-y-4">
                {CAUSE_ICONS.map((key) => (
                  <li key={key} className="flex items-center gap-4">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream text-xl"
                      aria-hidden="true"
                    >
                      {CAUSE_EMOJI[key]}
                    </span>
                    <span className="font-medium text-text">{t(`donatePage.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-7 border-t border-beige pt-5 text-xs leading-relaxed text-text-muted">
                🔒 {t('donatePage.safeNote')}
              </p>
            </div>

            {/* Organization details */}
            <div className="rounded-2xl border border-beige-dark bg-white p-7 md:p-9 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold text-forest">
                {t('donatePage.orgDetailsTitle')}
              </h2>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="font-medium uppercase tracking-wide text-xs text-text-muted">NGO</dt>
                  <dd className="mt-1 text-base font-semibold text-text">{settings.orgName}</dd>
                </div>
                {(settings.registrationDetails || settings.taxExemptionDetails) && (
                  <>
                    {settings.registrationDetails && (
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-xs text-text-muted">
                          {t('donatePage.registrationLabel')}
                        </dt>
                        <dd className="mt-1 text-text-light">{settings.registrationDetails}</dd>
                      </div>
                    )}
                    {settings.taxExemptionDetails && (
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-xs text-text-muted">
                          {t('donatePage.taxLabel')}
                        </dt>
                        <dd className="mt-1 text-text-light">{settings.taxExemptionDetails}</dd>
                      </div>
                    )}
                  </>
                )}
                {settings.contactEmail && (
                  <div>
                    <dt className="font-medium uppercase tracking-wide text-xs text-text-muted">
                      {t('donatePage.emailLabel')}
                    </dt>
                    <dd className="mt-1">
                      <a href={`mailto:${settings.contactEmail}`} className="text-forest font-medium hover:underline break-all">
                        {settings.contactEmail}
                      </a>
                    </dd>
                  </div>
                )}
                {settings.contactPhone && (
                  <div>
                    <dt className="font-medium uppercase tracking-wide text-xs text-text-muted">
                      {t('donatePage.phoneLabel')}
                    </dt>
                    <dd className="mt-1">
                      <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="text-forest font-medium hover:underline">
                        {settings.contactPhone}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-forest hover:gap-3 transition-all"
              >
                {t('home.touchCta')} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
