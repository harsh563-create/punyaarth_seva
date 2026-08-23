'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import FilterTabs from '@/components/ui/FilterTabs';
import GalleryCard from '@/components/ui/GalleryCard';
import Modal from '@/components/ui/Modal';
import FadeIn from '@/components/ui/FadeIn';
import type { Activity, GalleryImage } from '@/types';
import { useLanguage } from '@/i18n/useLanguage';

const filterIds = ['all', 'food-seva', 'nature', 'animals', 'community', 'events', 'awareness'] as const;

const CATEGORY_CHIP: Record<string, string> = {
  'food-seva': 'bg-saffron/15 text-saffron-dark',
  nature: 'bg-forest/10 text-forest',
  animals: 'bg-earth/15 text-earth-dark',
  community: 'bg-saffron-light text-saffron-dark',
  events: 'bg-beige text-text-muted',
  awareness: 'bg-forest-muted text-forest',
};

function ActivityCard({ activity }: { activity: Activity }) {
  const { t, tr, locale } = useLanguage();
  const chip = CATEGORY_CHIP[activity.category] ?? 'bg-forest/10 text-forest';

  return (
    <Link
      href={`/activities/${activity.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-saffron to-forest transition-transform duration-500 group-hover:scale-x-100" />

      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${chip}`}>
          {t(`common.categories.${activity.category}`)}
        </span>
        <time className="text-xs text-text-muted">
          {new Date(activity.date).toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
      </div>

      <h4 className="mt-4 font-serif text-xl font-semibold leading-snug text-text transition-colors group-hover:text-forest">
        {tr(activity.title)}
      </h4>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-text-muted">
        {tr(activity.description)}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="max-w-[9rem] truncate">{tr(activity.location)}</span>
          </span>
          {activity.volunteersInvolved ? (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {activity.volunteersInvolved}
            </span>
          ) : null}
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-forest transition-all duration-300 group-hover:bg-saffron group-hover:text-white">
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function Activities({
  activities,
  galleryImages,
}: {
  activities: Activity[];
  galleryImages: GalleryImage[];
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { t, tr, locale } = useLanguage();

  const filters = useMemo(
    () => filterIds.map((id) => ({ id, label: t(`common.categories.${id}`) })),
    [t]
  );

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return activities;
    return activities.filter((a) => a.category === activeFilter);
  }, [activeFilter, activities]);

  const filteredImages = useMemo(() => {
    if (activeFilter === 'all') return galleryImages;
    return galleryImages.filter((img) => img.category === activeFilter);
  }, [activeFilter, galleryImages]);

  return (
    <>
      <PageHero
        title={t('activitiesPage.heroTitle')}
        subtitle={t('activitiesPage.heroSubtitle')}
      />

      {/* Filter & Grid */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <FilterTabs
              filters={filters}
              active={activeFilter}
              onChange={setActiveFilter}
            />
          </div>

          {/* Activity Cards */}
          <div className="mb-16">
            <h3 className="font-serif text-2xl font-semibold text-text mb-8">
              {t('activitiesPage.activitiesHeading')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <FadeIn key={activity.id}>
                  <ActivityCard activity={activity} />
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div>
            <h3 className="font-serif text-2xl font-semibold text-text mb-8">
              {t('activitiesPage.galleryHeading')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <GalleryCard
                  key={image.id}
                  image={image}
                  onClick={setSelectedImage}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        {selectedImage && (
          <div className="p-2">
            <img
              src={selectedImage.src}
              alt={tr(selectedImage.alt)}
              className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
            />
            <div className="p-4">
              <p className="text-text font-medium">{tr(selectedImage.alt)}</p>
              <p className="text-text-muted text-sm mt-1">
                {new Date(selectedImage.date).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
