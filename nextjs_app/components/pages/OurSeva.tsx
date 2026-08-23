'use client';

import Link from "next/link";
import { useInView } from 'react-intersection-observer';
import PageHero from '@/components/ui/PageHero';
import { sevaCategories } from '@/data/seva';
import Button from '@/components/ui/Button';
import type { SevaCategory } from '@/types';
import { useLanguage } from '@/i18n/useLanguage';

const iconMap: Record<string, string> = {
  utensils: '🍽️',
  leaf: '🌿',
  'heart-handshake': '🤝',
  'paw-print': '🐾',
  megaphone: '📢',
};

function SevaCategoryBlock({ seva, index }: { seva: SevaCategory; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const isEven = index % 2 === 0;
  const { t, tr } = useLanguage();

  return (
    <div
      ref={ref}
      id={seva.id}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
        !isEven ? 'lg:direction-rtl' : ''
      }`}
    >
      <div className={`${isEven ? (inView ? 'animate-slide-in-left' : 'opacity-0') : (inView ? 'animate-slide-in-right' : 'opacity-0')}`}>
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <img
            src={seva.image}
            alt={tr(seva.title)}
            className="w-full h-[350px] md:h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/30 to-transparent" />
        </div>
      </div>

      <div className={`${isEven ? (inView ? 'animate-slide-in-right' : 'opacity-0') : (inView ? 'animate-slide-in-left' : 'opacity-0')}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl" aria-hidden="true">{iconMap[seva.icon]}</span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-text">
            {tr(seva.title)}
          </h2>
        </div>
        <p className="text-text-muted leading-relaxed text-lg">
          {tr(seva.longDescription)}
        </p>
        <div className="mt-8">
          <h3 className="font-serif text-lg font-semibold text-forest mb-3">
            {t('sevaPage.relatedActivities')}
          </h3>
          <ul className="space-y-2">
            {seva.activities.map((activity) => (
              <li key={activity.en} className="flex items-center gap-2 text-text-muted">
                <svg className="w-4 h-4 text-saffron shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {tr(activity)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function OurSeva() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        title={t('sevaPage.heroTitle')}
        subtitle={t('sevaPage.heroSubtitle')}
      />

      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {sevaCategories.map((seva, index) => (
              <SevaCategoryBlock key={seva.id} seva={seva} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-forest text-text-on-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold">
            {t('sevaPage.ctaTitle')}
          </h2>
          <p className="mt-4 text-text-on-dark/80 text-lg">
            {t('sevaPage.ctaText')}
          </p>
          <div className="mt-8">
            <Link href="/join">
              <Button size="lg" variant="secondary">
                {t('sevaPage.ctaButton')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
