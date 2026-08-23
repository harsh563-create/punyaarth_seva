'use client';

import { useState, useMemo } from 'react';
import PageHero from '@/components/ui/PageHero';
import FilterTabs from '@/components/ui/FilterTabs';
import GalleryCard from '@/components/ui/GalleryCard';
import Modal from '@/components/ui/Modal';
import type { Activity, GalleryImage } from '@/types';
import { useLanguage } from '@/i18n/useLanguage';

const filterIds = ['all', 'food-seva', 'nature', 'animals', 'community', 'events', 'awareness'] as const;

export default function Activities({
  activities,
  galleryImages,
}: {
  activities: Activity[];
  galleryImages: GalleryImage[];
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const { t, tr, locale } = useLanguage();

  const filters = useMemo(
    () => filterIds.map((id) => ({ id, label: t(`common.categories.${id}`) })),
    [t]
  );

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return activities;
    return activities.filter((a) => a.category === activeFilter);
  }, [activeFilter]);

  const filteredImages = useMemo(() => {
    if (activeFilter === 'all') return galleryImages;
    return galleryImages.filter((img) => img.category === activeFilter);
  }, [activeFilter]);

  const activeActivity = activities.find((a) => a.id === selectedActivity);

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
              {filteredActivities.map((activity, index) => (
                <button
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity.id)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow transition-transform duration-500 hover:-translate-y-1 text-left cursor-pointer"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={activity.images[0]}
                      alt={tr(activity.title)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/90 text-forest text-xs font-medium px-3 py-1 rounded-full">
                      {t(`common.categories.${activity.category}`)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-serif text-lg font-semibold text-text group-hover:text-forest transition-colors">
                      {tr(activity.title)}
                    </h4>
                    <div className="mt-2 flex items-center gap-4 text-text-muted text-xs">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(activity.date).toLocaleDateString(locale, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {tr(activity.location)}
                      </span>
                    </div>
                    <p className="mt-3 text-text-muted text-sm line-clamp-2">
                      {tr(activity.description)}
                    </p>
                  </div>
                </button>
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

      {/* Activity Detail Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      >
        {activeActivity && (
          <div>
            <img
              src={activeActivity.images[0]}
              alt={tr(activeActivity.title)}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-forest/10 text-forest text-xs font-medium px-3 py-1 rounded-full">
                  {t(`common.categories.${activeActivity.category}`)}
                </span>
                <span className="text-text-muted text-sm">
                  {new Date(activeActivity.date).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-text">
                {tr(activeActivity.title)}
              </h3>
              <div className="mt-4 flex items-center gap-6 text-text-muted text-sm">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {tr(activeActivity.location)}
                </span>
                {activeActivity.volunteersInvolved && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {activeActivity.volunteersInvolved} {t('common.volunteers')}
                  </span>
                )}
              </div>
              <p className="mt-6 text-text-muted leading-relaxed">
                {tr(activeActivity.longDescription)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
