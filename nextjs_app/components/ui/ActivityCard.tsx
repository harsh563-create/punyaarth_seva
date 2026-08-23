'use client';

import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import type { SevaCategory } from '@/types';
import { useLanguage } from '@/i18n/useLanguage';

interface ActivityCardProps {
  seva: SevaCategory;
  index: number;
}

const iconMap: Record<string, string> = {
  utensils: '🍽️',
  leaf: '🌿',
  'heart-handshake': '🤝',
  'paw-print': '🐾',
  megaphone: '📢',
};

export default function ActivityCard({ seva, index }: ActivityCardProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { t, tr } = useLanguage();

  return (
    <Link
      ref={ref}
      href={`/seva#${seva.id}`}
      className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow transition-transform duration-500 hover:-translate-y-1 ${
        inView ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={seva.image}
          alt={tr(seva.title)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="text-4xl" role="img" aria-label={tr(seva.title)}>
            {iconMap[seva.icon] || '❤️'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-text group-hover:text-forest transition-colors">
          {tr(seva.title)}
        </h3>
        <p className="mt-2 text-text-muted text-sm leading-relaxed">
          {tr(seva.description)}
        </p>
        <div className="mt-4 inline-flex items-center text-forest font-medium text-sm group-hover:gap-2 transition-all">
          {t('common.learnMore')}
          <svg
            className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
