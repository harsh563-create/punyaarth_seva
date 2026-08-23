import Link from 'next/link';
import {
  getActivities,
  getEvents,
  getGalleryImages,
  getImpactStats,
  getSevaCategories,
} from '@/lib/data';
import {
  CalendarIcon,
  ChartIcon,
  HeartHandshakeIcon,
  ImageIcon,
  LeafIcon,
  PlusIcon,
  UsersIcon,
} from '@/components/admin/icons';

export default async function AdminDashboardPage() {
  const [events, activities, sevaCategories, galleryImages, impactStats] =
    await Promise.all([
      getEvents(),
      getActivities(),
      getSevaCategories(),
      getGalleryImages(),
      getImpactStats(),
    ]);

  const today = new Date().toISOString().slice(0, 10);
  const upcomingEvents = events.filter(
    (e) => e.status === 'upcoming' && e.date >= today
  );
  const pastEvents = events.filter((e) => !(e.status === 'upcoming' && e.date >= today));
  const totalVolunteers = events.reduce(
    (sum, e) => sum + (e.volunteersJoined ?? 0),
    0
  );

  const stats = [
    {
      label: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: CalendarIcon,
      href: '/admin/events',
    },
    {
      label: 'Past Events',
      value: pastEvents.length,
      icon: CalendarIcon,
      href: '/admin/events',
    },
    {
      label: 'Activities',
      value: activities.length,
      icon: HeartHandshakeIcon,
      href: '/admin/activities',
    },
    {
      label: 'Seva Categories',
      value: sevaCategories.length,
      icon: LeafIcon,
      href: '/admin/seva',
    },
    {
      label: 'Gallery Photos',
      value: galleryImages.length,
      icon: ImageIcon,
      href: '/admin/gallery',
    },
    {
      label: 'Impact Stats',
      value: impactStats.length,
      icon: ChartIcon,
      href: '/admin/impact',
    },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-forest">
          Dashboard
        </h1>
        <p className="mt-1 font-sans text-sm text-text-muted">
          An overview of everything on the Punyaarth Seva website.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border border-beige-dark bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-saffron/40 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-muted text-forest transition-colors group-hover:bg-saffron group-hover:text-white">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-serif text-3xl font-semibold text-text">
              {value}
            </p>
            <p className="font-sans text-sm text-text-muted">{label}</p>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-beige-dark bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-forest">
              Next upcoming event
            </h2>
            <Link
              href="/admin/events"
              className="font-sans text-sm font-medium text-saffron-dark hover:text-saffron"
            >
              Manage →
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className="font-sans text-sm text-text-muted">
              No upcoming events scheduled.
            </p>
          ) : (
            (() => {
              const next = [...upcomingEvents].sort((a, b) =>
                a.date.localeCompare(b.date)
              )[0];
              const progress =
                next.volunteersNeeded && next.volunteersNeeded > 0
                  ? Math.min(
                      100,
                      Math.round(
                        ((next.volunteersJoined ?? 0) / next.volunteersNeeded) *
                          100
                      )
                    )
                  : null;
              return (
                <div>
                  <h3 className="font-serif text-lg font-semibold text-text">
                    {next.title.en}
                  </h3>
                  <p className="font-sans text-sm text-text-muted">{next.title.hi}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-4 font-sans text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-text-muted">Date</dt>
                      <dd className="font-medium text-text">{next.date}</dd>
                    </div>
                    <div>
                      <dt className="text-text-muted">Location</dt>
                      <dd className="font-medium text-text">{next.location.en}</dd>
                    </div>
                    <div>
                      <dt className="text-text-muted">Volunteers</dt>
                      <dd className="font-medium text-text">
                        {next.volunteersJoined ?? 0}
                        {next.volunteersNeeded ? ` / ${next.volunteersNeeded}` : ''}
                      </dd>
                    </div>
                  </dl>
                  {progress !== null && (
                    <div className="mt-4">
                      <div className="h-2 overflow-hidden rounded-full bg-beige">
                        <div
                          className="h-full rounded-full bg-forest transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-1.5 font-sans text-xs text-text-muted">
                        {progress}% of volunteer slots filled
                      </p>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>

        <div className="rounded-2xl border border-beige-dark bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold text-forest">
            <UsersIcon className="h-5 w-5" />
            Volunteers joined
          </h2>
          <p className="font-serif text-4xl font-semibold text-forest">
            {totalVolunteers}
          </p>
          <p className="mt-1 font-sans text-sm text-text-muted">
            Across all recorded events
          </p>

          <hr className="my-5 border-beige-dark" />

          <h3 className="mb-2 font-sans text-sm font-semibold uppercase tracking-wide text-text-muted">
            Quick actions
          </h3>
          <ul className="space-y-2">
            {[
              { href: '/admin/events', label: 'Add new event' },
              { href: '/admin/gallery', label: 'Upload gallery photos' },
              { href: '/admin/impact', label: 'Update impact numbers' },
            ].map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 font-sans text-sm font-medium text-forest transition-colors hover:bg-forest-muted cursor-pointer"
                >
                  <PlusIcon className="h-4 w-4 text-saffron-dark" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
