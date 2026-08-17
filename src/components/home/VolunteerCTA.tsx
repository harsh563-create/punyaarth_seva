import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function VolunteerCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-forest relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-text-on-dark leading-tight">
            Be a Part of the{' '}
            <span className="text-saffron">Change.</span>
          </h2>
          <p className="mt-6 text-lg text-text-on-dark/80 max-w-2xl mx-auto">
            You don't need to do something big to make a difference. Give your
            time, your effort, or simply your kindness.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/join">
              <Button size="lg" variant="secondary">
                Join Punyaarth Seva
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="ghost"
                className="text-text-on-dark border-2 border-text-on-dark/30 hover:bg-text-on-dark/10 hover:border-text-on-dark/50"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
