import SectionHeading from '@/components/ui/SectionHeading';
import EventCard from '@/components/ui/EventCard';
import { events } from '@/data/events';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function UpcomingEvents() {
  const upcomingEvents = events.filter((e) => e.status === 'upcoming').slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-cream-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Seva & Community Events"
          subtitle="Join us in our upcoming events and be a part of something meaningful."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/events">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
