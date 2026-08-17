import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function FeaturedStory() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div
            className={`relative isolate ${
              inView ? 'animate-slide-in-left' : 'opacity-0'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/assets/images/featured-story.jpg"
                alt="Community seva in action"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/30 to-transparent" />
            </div>
            {/* Floating accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-saffron/10 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-forest/10 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div
            className={`${
              inView ? 'animate-slide-in-right' : 'opacity-0'
            }`}
          >
            <span className="text-saffron font-medium text-sm tracking-wide uppercase">
              Featured Story
            </span>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-text leading-tight">
              Every Act of Kindness{' '}
              <span className="text-forest">Matters.</span>
            </h2>
            <div className="mt-8 space-y-4 text-text-muted leading-relaxed">
              <p>
                Sometimes seva doesn't require much. A meal, a glass of water, a
                tree planted, or simply helping someone — these small acts become
                meaningful gestures of kindness that ripple through our
                community.
              </p>
              <p>
                At Punyaarth Seva, we believe that every person has the power to
                make a difference. When we come together with a shared purpose of
                serving others, even the smallest actions create lasting impact.
              </p>
              <p>
                Our volunteers don't just give food or plant trees — they share
                hope, spread compassion, and build a stronger, kinder community
                for everyone.
              </p>
            </div>
            <div className="mt-8">
              <Link to="/activities">
                <Button variant="primary">See Our Activities</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
