import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function Hero() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/hero-bg.jpg"
          alt="Volunteers serving the community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/90 via-forest-dark/75 to-forest-dark/60" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/6 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-3xl">
          <div
            className={`${
              inView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <span className="inline-block px-4 py-1.5 bg-saffron/20 text-saffron rounded-full text-sm font-medium mb-6 border border-saffron/30">
              Seva for Humanity, Nature & Every Life
            </span>
          </div>

          <h1
            className={`font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-text-on-dark leading-tight ${
              inView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '150ms' }}
          >
            Seva That Makes{' '}
            <span className="text-saffron">a Difference.</span>
          </h1>

          <p
            className={`mt-6 text-lg md:text-xl text-text-on-dark/80 max-w-2xl leading-relaxed ${
              inView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '300ms' }}
          >
            Punyaarth Seva is a community of people coming together to serve
            humanity, care for nature, and spread kindness — one small act at a
            time.
          </p>

          <div
            className={`mt-10 flex flex-wrap gap-4 ${
              inView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '450ms' }}
          >
            <Link to="/join">
              <Button size="lg" variant="secondary">
                Join Our Seva
              </Button>
            </Link>
            <Link to="/seva">
              <Button size="lg" variant="ghost" className="text-text-on-dark border-2 border-text-on-dark/30 hover:bg-text-on-dark/10 hover:border-text-on-dark/50">
                Explore Our Work
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-bounce">
        <span className="text-text-on-dark/50 text-xs tracking-widest uppercase">
          Scroll
        </span>
        <svg
          className="w-5 h-5 text-text-on-dark/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
