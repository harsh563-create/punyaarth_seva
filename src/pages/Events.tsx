import { useMemo } from 'react';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import EventCard from '@/components/ui/EventCard';
import { events } from '@/data/events';

export default function Events() {
  const upcomingEvents = useMemo(
    () => events.filter((e) => e.status === 'upcoming'),
    []
  );
  const pastEvents = useMemo(
    () => events.filter((e) => e.status === 'past'),
    []
  );

  return (
    <>
      <PageHero
        title="Seva & Community Events"
        subtitle="Join us in making a difference through meaningful community events and seva activities."
      />

      {/* Upcoming Events */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Be a part of our upcoming seva activities and community gatherings."
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
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 md:py-28 bg-cream-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Past Events"
            subtitle="A look back at our completed events and their impact."
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
