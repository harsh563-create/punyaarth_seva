'use client';

import { useInView } from 'react-intersection-observer';
import type { Event } from '@/types';
import { useLanguage } from '@/i18n/useLanguage';

interface EventCardProps {
  event: Event;
  index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { t, tr, locale } = useLanguage();

  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString(locale, { month: 'short' });

  const isUpcoming = event.status === 'upcoming';

  return (
    <div
      ref={ref}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow transition-transform duration-500 hover:-translate-y-1 ${
        inView ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={tr(event.title)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4 bg-white rounded-xl px-3 py-2 text-center shadow-md">
          <div className="text-2xl font-serif font-bold text-forest leading-none">
            {day}
          </div>
          <div className="text-xs font-medium text-text-muted uppercase">
            {month}
          </div>
        </div>
        {isUpcoming && (
          <div className="absolute top-4 right-4 bg-saffron text-white text-xs font-medium px-3 py-1 rounded-full">
            {t('common.upcoming')}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-text group-hover:text-forest transition-colors">
          {tr(event.title)}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-text-muted text-sm">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {tr(event.location)}
        </div>
        <p className="mt-3 text-text-muted text-sm leading-relaxed line-clamp-2">
          {tr(event.description)}
        </p>
        {isUpcoming && event.volunteersNeeded && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>
                {event.volunteersJoined} {t('eventCard.joined')}
              </span>
              <span>
                {event.volunteersNeeded} {t('eventCard.needed')}
              </span>
            </div>
            <div className="h-2 bg-beige rounded-full overflow-hidden">
              <div
                className="h-full bg-forest rounded-full transition-all duration-1000"
                style={{
                  width: `${
                    ((event.volunteersJoined || 0) / event.volunteersNeeded) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        )}
        <button className="mt-4 text-forest font-medium text-sm hover:text-forest-light transition-colors cursor-pointer">
          {isUpcoming ? t('common.joinEvent') : t('common.viewDetails')} →
        </button>
      </div>
    </div>
  );
}
