'use client';

import Link from 'next/link';
import FadeIn from '@/components/ui/FadeIn';
import { useLanguage } from '@/i18n/useLanguage';
import type { Event } from '@/types';

export default function EventDetails({ event }: { event: Event }) {
  const { t, tr, locale } = useLanguage();
  const isUpcoming = event.status === 'upcoming';

  const dateObj = new Date(event.date);
  const fullDate = dateObj.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const chipDay = dateObj.getDate();
  const chipMonth = dateObj.toLocaleString(locale, { month: 'short' });

  const progress =
    isUpcoming && event.volunteersNeeded
      ? Math.min(
          100,
          Math.round(((event.volunteersJoined || 0) / event.volunteersNeeded) * 100)
        )
      : null;

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-forest transition-colors hover:text-saffron-dark cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('eventDetail.backToEvents')}
        </Link>

        <FadeIn className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Photo */}
          <div className="relative overflow-hidden rounded-3xl shadow-lg">
            {event.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.image}
                alt={tr(event.title)}
                className="h-72 w-full object-cover md:h-[420px]"
              />
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-gradient-to-br from-forest-muted to-cream-dark font-serif text-5xl text-white/70 md:h-[420px]" aria-hidden="true">
                🌿
              </div>
            )}
            <div className="absolute left-5 top-5 rounded-xl bg-white px-3 py-2 text-center shadow-md">
              <div className="font-serif text-2xl font-bold leading-none text-forest">{chipDay}</div>
              <div className="text-xs font-medium uppercase text-text-muted">{chipMonth}</div>
            </div>
          </div>

          {/* Details */}
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 font-sans text-xs font-medium ${
                isUpcoming ? 'bg-saffron text-white' : 'bg-earth-muted text-text-on-dark'
              }`}
            >
              {isUpcoming ? t('common.upcoming') : t('eventDetail.completedBadge')}
            </span>

            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-text md:text-4xl">
              {tr(event.title)}
            </h1>

            <dl className="mt-6 space-y-3 font-sans text-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-text-muted">{t('eventDetail.dateLabel')}</dt>
                  <dd className="font-medium text-text">{fullDate}</dd>
                </div>
              </div>
              {tr(event.location) && (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-muted">{t('eventDetail.locationLabel')}</dt>
                    <dd className="font-medium text-text">{tr(event.location)}</dd>
                  </div>
                </div>
              )}
            </dl>

            {progress !== null && (
              <div className="mt-6 rounded-2xl border border-beige-dark bg-white p-5">
                <div className="flex justify-between font-sans text-xs text-text-muted">
                  <span>
                    {event.volunteersJoined || 0} {t('eventCard.joined')}
                  </span>
                  <span>
                    {event.volunteersNeeded} {t('eventCard.needed')}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-beige">
                  <div className="h-full rounded-full bg-forest transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 font-sans text-xs text-text-muted">{progress}%</p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-serif text-xl font-semibold text-forest">
                {t('eventDetail.aboutTitle')}
              </h2>
              <p className="mt-3 whitespace-pre-line font-sans leading-relaxed text-text-muted">
                {tr(event.description) || t('eventDetail.notFound')}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {isUpcoming && (
                <Link
                  href="/join"
                  className="rounded-full bg-forest px-6 py-3 font-sans text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-light hover:shadow-lg cursor-pointer"
                >
                  {t('eventDetail.joinCta')}
                </Link>
              )}
              <Link
                href="/donate"
                className="rounded-full border-2 border-saffron px-6 py-3 font-sans text-sm font-semibold text-saffron-dark transition-colors hover:bg-saffron hover:text-white cursor-pointer"
              >
                {t('eventDetail.donateCta')}
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
