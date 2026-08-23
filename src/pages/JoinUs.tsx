import { useInView } from 'react-intersection-observer';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/ui/FadeIn';
import { volunteerWays } from '@/data/volunteers';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

const iconMap: Record<string, ReactNode> = {
  clock: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  'share-2': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  heart: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

export default function JoinUs() {
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      <PageHero
        title="Your Time Can Become Someone's Hope."
        subtitle="Anyone can contribute. Find the way that works best for you."
      />

      {/* Ways to Help */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Ways You Can Help"
            subtitle="There are many ways to be a part of Punyaarth Seva."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {volunteerWays.map((way, index) => (
              <FadeIn
                key={way.title}
                delay={index * 100}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mb-5">
                  {iconMap[way.icon]}
                </div>
                <h3 className="font-serif text-xl font-semibold text-text">
                  {way.title}
                </h3>
                <p className="mt-3 text-text-muted leading-relaxed">
                  {way.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-20 md:py-28 bg-forest text-text-on-dark relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`${ctaInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold">
              Want to Volunteer?
            </h2>
            <p className="mt-6 text-lg text-text-on-dark/80 max-w-2xl mx-auto">
              Every volunteer makes a difference. Reach out to us and we'll
              connect you with opportunities to serve.
            </p>
            <div className="mt-10">
              <Link to="/contact">
                <Button size="lg" variant="secondary">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
