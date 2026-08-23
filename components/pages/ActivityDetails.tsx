'use client';

import { useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import FadeIn from '@/components/ui/FadeIn';
import type { Activity } from '@/types';
import { useLanguage } from '@/i18n/useLanguage';
import { isDirectVideo, youtubeId } from '@/lib/media';

const CATEGORY_CHIP: Record<string, string> = {
  'food-seva': 'bg-saffron/15 text-saffron-dark',
  nature: 'bg-forest/10 text-forest',
  animals: 'bg-earth/15 text-earth-dark',
  community: 'bg-saffron-light text-saffron-dark',
  events: 'bg-beige text-text-muted',
  awareness: 'bg-forest-muted text-forest',
};

function VideoBlock({ url }: { url: string }) {
  const ytId = youtubeId(url);

  if (ytId) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          title="YouTube video"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  if (isDirectVideo(url)) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-md ring-1 ring-black/5">
        <video src={url} controls preload="metadata" className="h-full w-full" />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-forest ring-1 ring-black/5 hover:bg-cream transition-colors"
    >
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {url}
    </a>
  );
}

export default function ActivityDetails({ activity }: { activity: Activity }) {
  const { t, tr, locale } = useLanguage();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const chip = CATEGORY_CHIP[activity.category] ?? 'bg-forest/10 text-forest';

  const story = activity.longDescription?.en || activity.longDescription?.hi
    ? tr(activity.longDescription)
    : tr(activity.description);

  const photos = activity.images ?? [];
  const videos = activity.videos ?? [];

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-forest to-forest-dark pb-20 pt-10 text-cream md:pt-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-saffron"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('activityDetail.backToActivities')}
          </Link>

          <FadeIn>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${chip}`}>
                {t(`common.categories.${activity.category}`)}
              </span>
              {activity.volunteersInvolved ? (
                <span className="flex items-center gap-1.5 text-xs text-cream/80">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {activity.volunteersInvolved} {t('activityDetail.volunteersSuffix')}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              {tr(activity.title)}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/80">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(activity.date).toLocaleDateString(locale, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {tr(activity.location)}
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-serif text-2xl font-semibold text-text md:text-3xl">
              {t('activityDetail.storyTitle')}
            </h2>
            <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-saffron to-forest" />
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-text-muted md:text-lg">
              {story}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Photos */}
      {photos.length > 0 && (
        <section className="bg-cream pb-14 md:pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="font-serif text-2xl font-semibold text-text md:text-3xl">
                {t('activityDetail.photosTitle')}
              </h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-saffron to-forest" />
            </FadeIn>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setLightbox(src)}
                  className="group overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 cursor-pointer"
                >
                  <img
                    src={src}
                    alt={`${tr(activity.title)} — ${i + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className={`bg-cream ${photos.length > 0 ? 'pb-14 md:pb-20' : 'py-14 md:py-20'}`}>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="font-serif text-2xl font-semibold text-text md:text-3xl">
                {t('activityDetail.videosTitle')}
              </h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-saffron to-forest" />
            </FadeIn>
            <div className="mt-8 space-y-8">
              {videos.map((url, i) => (
                <FadeIn key={`${url}-${i}`}>
                  <VideoBlock url={url} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo Lightbox */}
      <Modal isOpen={!!lightbox} onClose={() => setLightbox(null)}>
        {lightbox && (
          <img
            src={lightbox}
            alt=""
            className="max-h-[80vh] w-full rounded-xl object-contain"
          />
        )}
      </Modal>
    </>
  );
}
