import { useInView } from 'react-intersection-observer';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageHero({
  title,
  subtitle,
  backgroundImage,
}: PageHeroProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden"
    >
      {backgroundImage ? (
        <>
          <div className="absolute inset-0">
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-forest-dark/75" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-forest to-forest-dark" />
      )}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
      </div>

      <div
        className={`relative z-10 text-center px-6 max-w-4xl mx-auto ${
          inView ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-text-on-dark leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-text-on-dark/80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="mt-6 h-1 w-16 bg-saffron rounded-full mx-auto" />
      </div>
    </section>
  );
}
