'use client';

import { useMemo } from 'react';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import EventCard from '@/components/ui/EventCard';
import type { Event } from '@/types';
import { useLanguage } from '@/i18n/useLanguage';

export default function Events({ events }: { events: Event[] }) {
  const { t } = useLanguage();
  const upcomingEvents = useMemo(
    () => events.filter((e) => e.status === 'upcoming'),
    [events]
  );
  const pastEvents = useMemo(
    () => events.filter((e) => e.status === 'past'),
    [events]
  );

  return (
    <>
      <PageHero
        title={t('eventsPage.heroTitle')}
        subtitle={t('eventsPage.heroSubtitle')}
      />

      {/* Upcoming Events */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t('eventsPage.upcomingTitle')}
            subtitle={t('eventsPage.upcomingSubtitle')}
          />
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-muted text-lg">
                {t('eventsPage.noUpcoming')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 md:py-28 bg-cream-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t('eventsPage.pastTitle')}
            subtitle={t('eventsPage.pastSubtitle')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
