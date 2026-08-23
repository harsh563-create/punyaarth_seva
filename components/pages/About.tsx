'use client';

import Link from "next/link";
import { useInView } from 'react-intersection-observer';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/ui/FadeIn';
import { useLanguage } from '@/i18n/useLanguage';
import { DEFAULT_ABOUT_STORY_IMAGE } from '@/data';
import type { AboutContent } from '@/types';

interface LabeledItem {
  title: string;
  description: string;
}

const principleIcons = [
  (
    <svg key="heart" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  (
    <svg key="people" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  (
    <svg key="sparkle" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  (
    <svg key="bulb" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
];

const valueIcons = ['🤲', '💚', '🤝', '🫂'];

interface AboutProps {
  /** Admin-edited overrides; blank/missing fields fall back to translations. */
  content?: AboutContent | null;
}

export default function About({ content = null }: AboutProps) {
  const { ref: storyRef, inView: storyInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: visionRef, inView: visionInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { t, tl, lang } = useLanguage();
  const baseMission = tl<LabeledItem[]>('about.missionItems');
  const baseValues = tl<LabeledItem[]>('about.valuesItems');

  // DB value for the active language wins; otherwise the bundled translation.
  const pick = (value: { en?: string; hi?: string } | undefined, fallback: string): string => {
    const s = value?.[lang];
    return s && s.trim() ? s : fallback;
  };
  const storyP1 = pick(content?.storyP1, t('about.storyP1'));
  const storyP2 = pick(content?.storyP2, t('about.storyP2'));
  const storyP3 = pick(content?.storyP3, t('about.storyP3'));
  const visionQuote = pick(content?.visionQuote, t('about.visionQuote'));
  const ctaTitle = pick(content?.ctaTitle, t('about.ctaTitle'));
  const ctaText = pick(content?.ctaText, t('about.ctaText'));
  const storyImage =
    content?.storyImage && content.storyImage.trim()
      ? content.storyImage
      : DEFAULT_ABOUT_STORY_IMAGE;
  const missionPrinciples = baseMission.map((item, i) => ({
    title: pick(content?.missionItems?.[i]?.title, item.title),
    description: pick(content?.missionItems?.[i]?.description, item.description),
  }));
  const values = baseValues.map((item, i) => ({
    title: pick(content?.valuesItems?.[i]?.title, item.title),
    description: pick(content?.valuesItems?.[i]?.description, item.description),
  }));

  return (
    <>
      <PageHero
        title={t('about.heroTitle')}
        subtitle={t('about.heroSubtitle')}
      />

      {/* Our Story */}
      <section ref={storyRef} className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={`${storyInView ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <span className="text-saffron font-medium text-sm tracking-wide uppercase">{t('about.storyEyebrow')}</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl font-semibold text-text leading-tight">
                {t('about.storyTitle')}
              </h2>
              <div className="mt-6 space-y-4 text-text-muted leading-relaxed">
                <p>{storyP1}</p>
                <p>{storyP2}</p>
                <p>{storyP3}</p>
              </div>
            </div>
            <div className={`isolate ${storyInView ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={storyImage}
                  alt="Punyaarth Seva volunteers together"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-saffron/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section ref={visionRef} className="py-20 md:py-28 bg-forest text-text-on-dark relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`${visionInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="text-saffron font-medium text-sm tracking-wide uppercase">{t('about.visionEyebrow')}</span>
            <blockquote className="mt-6 font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed italic text-text-on-dark/90">
              {visionQuote}
            </blockquote>
            <div className="mt-6 h-1 w-16 bg-saffron rounded-full mx-auto" />
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t('about.missionTitle')}
            subtitle={t('about.missionSubtitle')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {missionPrinciples.map((principle, index) => (
              <FadeIn
                key={principle.title}
                delay={index * 100}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow transition-transform duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-4">
                  {principleIcons[index]}
                </div>
                <h3 className="font-serif text-xl font-semibold text-text">{principle.title}</h3>
                <p className="mt-3 text-text-muted text-sm leading-relaxed">{principle.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-28 bg-cream-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t('about.valuesTitle')}
            subtitle={t('about.valuesSubtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <FadeIn
                key={value.title}
                delay={index * 100}
                className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="text-4xl" aria-hidden="true">{valueIcons[index]}</span>
                <h3 className="mt-4 font-serif text-xl font-semibold text-forest">{value.title}</h3>
                <p className="mt-3 text-text-muted text-sm leading-relaxed">{value.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-text">
            {ctaTitle}
          </h2>
          <p className="mt-4 text-text-muted text-lg">
            {ctaText}
          </p>
          <div className="mt-8">
            <Link href="/join">
              <Button size="lg">{t('about.ctaButton')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
