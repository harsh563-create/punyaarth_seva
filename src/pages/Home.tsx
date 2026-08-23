import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import HeroTree from '@/components/tree/HeroTree';
import { impactStats } from '@/data/impact';

/* ---------- helpers ---------- */

function Reveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 });
  return (
    <section
      ref={ref}
      className={`${inView ? 'animate-fade-in-up' : 'opacity-0'} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </section>
  );
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white/85 backdrop-blur-md rounded-[1.75rem] border border-white/70 shadow-[0_20px_45px_-20px_rgba(15,51,32,0.28)] ${className}`}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-saffron-dark font-medium text-xs tracking-[0.18em] uppercase">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z" />
      </svg>
      {children}
    </span>
  );
}

const ArrowIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

/* ---------- data ---------- */

const programs = [
  { title: 'Dana Pani', desc: 'Providing food and water to people and animals in need across our community.', icon: '🍽️', tint: 'bg-saffron/10' },
  { title: 'Nature Seva', desc: 'Tree plantations, river clean-ups, and environmental awareness campaigns.', icon: '🌿', tint: 'bg-forest/10' },
  { title: 'Community Support', desc: 'Helping families, elderly citizens, and underprivileged individuals.', icon: '🤝', tint: 'bg-earth/10' },
  { title: 'Animal & Bird Care', desc: 'Feeding strays, water bowls for birds, and shelter collaborations.', icon: '🐾', tint: 'bg-saffron/10' },
];

const values = [
  { title: 'Serve Selflessly', desc: 'We give our time, energy, and resources without expecting anything in return.', icon: '🌱', tint: 'bg-forest/10' },
  { title: 'Protect Nature', desc: 'We work to preserve and restore the natural environment for future generations.', icon: '🌍', tint: 'bg-forest/10' },
  { title: 'Inspire Others', desc: 'We encourage people to contribute in their own way and spread the spirit of seva.', icon: '💡', tint: 'bg-saffron/10' },
];

const testimonials = [
  { text: 'Joining Punyaarth Seva changed my perspective on life. Serving others gives a peace nothing else can.', name: 'Priya Sharma', role: 'Volunteer' },
  { text: 'The food distribution drives are incredibly well-organized. It feels amazing to see families smile.', name: 'Rahul Verma', role: 'Volunteer' },
  { text: 'Their tree plantation drives have brought greenery back to our neighborhood. Truly grateful.', name: 'Anita Devi', role: 'Community Member' },
];

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('');
}

/* Decorative roots that grow down into the footer's underground */
function RootsBand() {
  const roots = [
    'M 60 0 C 70 40, 58 80, 74 128 C 84 158, 76 190, 88 220',
    'M 170 0 C 160 52, 178 96, 162 150 C 150 188, 164 214, 152 250',
    'M 300 0 C 312 44, 292 92, 310 148 C 322 184, 308 216, 320 260',
    'M 430 0 C 420 36, 438 78, 424 130',
    'M 560 0 C 572 48, 552 100, 570 156 C 582 192, 568 224, 580 262',
    'M 690 0 C 680 42, 700 90, 684 144 C 672 182, 688 210, 676 246',
    'M 820 0 C 832 46, 812 94, 830 150 C 842 186, 828 218, 840 256',
    'M 940 0 C 930 38, 948 84, 934 136',
    'M 1060 0 C 1072 50, 1052 102, 1070 158 C 1082 194, 1068 226, 1080 264',
    'M 1180 0 C 1170 44, 1190 92, 1174 146',
    'M 1300 0 C 1312 46, 1292 96, 1310 152 C 1322 188, 1308 220, 1320 258',
    'M 1400 0 C 1392 34, 1408 72, 1396 118',
  ];
  const hairs = [
    'M 74 128 q 18 14 30 34', 'M 162 150 q -20 12 -28 32', 'M 310 148 q 20 16 26 38',
    'M 570 156 q -22 12 -30 34', 'M 684 144 q 20 14 28 36', 'M 830 150 q -18 14 -26 34',
    'M 1070 158 q 22 14 30 36',
  ];
  return (
    <svg
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[1440px] max-w-none h-auto pointer-events-none"
      viewBox="0 0 1440 280"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#8b5a34" strokeLinecap="round" opacity="0.5">
        {roots.map((d, i) => (
          <path key={i} d={d} strokeWidth={i % 3 === 0 ? 3 : 2} />
        ))}
      </g>
      <g stroke="#a06b40" strokeWidth="1.2" strokeLinecap="round" opacity="0.35">
        {hairs.map((d, i) => (
          <path key={`h${i}`} d={d} />
        ))}
      </g>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="hero-sky relative overflow-hidden">
        {/* soft ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 right-[12%] w-80 h-80 rounded-full bg-saffron/15 blur-3xl animate-float-blob" />
          <div className="absolute top-[55%] -left-20 w-72 h-72 rounded-full bg-forest/10 blur-3xl animate-float-blob" style={{ animationDelay: '-6s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-6 items-center min-h-[100svh] pt-24 pb-10 lg:pt-28 lg:pb-20">
            {/* Copy */}
            <div className="text-center lg:text-left order-1">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 backdrop-blur text-forest rounded-full text-sm font-medium border border-forest/15 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron" aria-hidden="true" />
                Seva for Humanity, Nature &amp; Every Life
              </span>

              <h1 className="mt-6 font-serif text-[2.6rem] leading-[1.08] sm:text-6xl lg:text-[4.2rem] xl:text-7xl font-semibold text-text">
                Grow a Future
                <br />
                <span className="text-forest">Rooted in Kindness.</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-text-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Every act of seva plants a seed of change. Join our community
                and watch kindness grow into something that sustains lives.
              </p>

              <div className="mt-9 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  to="/join"
                  className="inline-flex items-center gap-2 bg-forest text-text-on-dark px-8 py-4 rounded-full text-base font-medium shadow-lg shadow-forest/25 hover:bg-forest-light hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Plant a Future
                  <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/seva"
                  className="inline-flex items-center gap-2 bg-white/80 backdrop-blur text-forest px-8 py-4 rounded-full text-base font-medium border border-forest/20 hover:bg-forest/5 hover:border-forest/35 transition-all duration-300"
                >
                  Explore Our Work
                </Link>
              </div>

              {/* trust row */}
              <dl className="mt-10 flex flex-wrap items-baseline justify-center lg:justify-start gap-x-8 gap-y-3 text-left">
                {[impactStats[0], impactStats[1], impactStats[3]].map((s) => (
                  <div key={s.id} className="flex items-baseline gap-1.5">
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-serif text-xl font-semibold text-forest">
                      {s.value.toLocaleString()}{s.suffix}
                    </dd>
                    <span className="text-xs text-text-muted font-medium">{s.label}</span>
                  </div>
                ))}
              </dl>
            </div>

            {/* Tree */}
            <div className="order-2 relative flex justify-center lg:justify-end items-end">
              <div className="w-full max-w-[380px] sm:max-w-[460px] xl:max-w-[600px] -mb-2 lg:-mb-6">
                <HeroTree />
              </div>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="hidden lg:flex absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 animate-scroll-bounce text-forest/50">
          <span className="text-[0.65rem] tracking-[0.25em] uppercase font-medium">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* fade into page background */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-b from-transparent to-cream pointer-events-none" aria-hidden="true" />
      </section>

      {/* ============ MISSION ============ */}
      <Reveal className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
            <GlassCard className="p-8 md:p-12 flex flex-col justify-center">
              <Eyebrow>Our Mission</Eyebrow>
              <h2 className="mt-4 font-serif text-3xl md:text-[2.5rem] font-semibold text-text leading-tight">
                Every Branch of Seva<br />
                <span className="text-forest">Grows from Compassion.</span>
              </h2>
              <div className="mt-6 space-y-4 text-text-muted leading-relaxed">
                <p>
                  Punyaarth Seva started with a simple idea — that ordinary people, coming together,
                  can create extraordinary change for their community, their environment, and every living being.
                </p>
                <p>
                  Like a tree that gives shelter, food, and oxygen, our seva extends in every direction —
                  feeding the hungry, nurturing nature, caring for animals, and building a kinder world.
                </p>
              </div>
              <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-forest font-medium hover:gap-3 transition-all w-fit">
                Learn Our Story
                <ArrowIcon />
              </Link>
            </GlassCard>

            <div className="space-y-5">
              {values.map((v) => (
                <GlassCard key={v.title} className="p-6 md:p-7 flex gap-5 items-start hover:-translate-y-0.5 transition-transform duration-300">
                  <span className={`shrink-0 w-12 h-12 rounded-2xl ${v.tint} ring-1 ring-forest/10 flex items-center justify-center text-2xl`} aria-hidden="true">
                    {v.icon}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-text">{v.title}</h3>
                    <p className="mt-1.5 text-text-muted text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ============ IMPACT ============ */}
      <Reveal className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow>Our Impact</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-[2.5rem] font-semibold text-text">
            Seeds of Kindness,<br className="sm:hidden" />
            <span className="text-forest"> A Forest of Change.</span>
          </h2>
          <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {impactStats.map((stat) => (
              <GlassCard key={stat.id} className="p-6 md:p-8 hover:-translate-y-1 hover:shadow-[0_28px_50px_-20px_rgba(15,51,32,0.35)] transition-all duration-300">
                <dd className="text-3xl md:text-[2.5rem] font-serif font-bold text-forest leading-none">
                  {stat.value.toLocaleString()}{stat.suffix}
                </dd>
                <dt className="mt-2.5 text-text-muted text-xs md:text-sm font-medium">{stat.label}</dt>
              </GlassCard>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ============ PROGRAMS ============ */}
      <Reveal className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <Eyebrow>Our Work</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl md:text-[2.5rem] font-semibold text-text">
              Branches of Our <span className="text-forest">Seva.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {programs.map((prog) => (
              <GlassCard key={prog.title} className="p-7 md:p-9 group hover:-translate-y-1 hover:border-forest/20 transition-all duration-300">
                <div className="flex items-start gap-5">
                  <span className={`shrink-0 w-14 h-14 rounded-2xl ${prog.tint} ring-1 ring-forest/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
                    {prog.icon}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-semibold text-text group-hover:text-forest transition-colors">{prog.title}</h3>
                    <p className="mt-2.5 text-text-muted leading-relaxed">{prog.desc}</p>
                    <Link to="/seva" className="mt-4 inline-flex items-center gap-2 text-forest font-medium text-sm hover:gap-3 transition-all">
                      Learn More
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ============ TESTIMONIALS ============ */}
      <Reveal className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <Eyebrow>Stories</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl md:text-[2.5rem] font-semibold text-text">
              Voices from Our <span className="text-forest">Community.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {testimonials.map((t, i) => (
              <GlassCard key={i} className="p-7 md:p-8 flex flex-col">
                <svg className="w-8 h-8 text-saffron/50 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
                </svg>
                <p className="mt-4 text-text-light leading-relaxed flex-1">{t.text}</p>
                <div className="mt-6 pt-5 border-t border-beige-dark/60 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-forest to-forest-light text-text-on-dark flex items-center justify-center text-sm font-semibold" aria-hidden="true">
                    {initials(t.name)}
                  </span>
                  <div>
                    <div className="font-medium text-text text-sm">{t.name}</div>
                    <div className="text-text-muted text-xs">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ============ ROOTS / DONATION CTA — flows into the footer's soil ============ */}
      <section className="relative soil-section rounded-t-[2.5rem] md:rounded-t-[3.5rem] mt-8 overflow-hidden">
        <RootsBand />
        <Reveal className="relative pt-24 md:pt-32 pb-28 md:pb-36">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Eyebrow>Support Us</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-text-on-dark leading-tight">
              Every Root Needs Nourishment.
            </h2>
            <p className="mt-6 text-lg text-text-on-dark/75 max-w-2xl mx-auto leading-relaxed">
              Your support helps us reach more people, plant more trees, and build a stronger,
              kinder community. Every contribution matters.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link
                to="/join"
                className="inline-flex items-center gap-2 bg-saffron text-white px-8 py-4 rounded-full text-base font-medium hover:bg-saffron-light transition-colors shadow-lg shadow-black/25"
              >
                Support Our Seva
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white/10 text-text-on-dark px-8 py-4 rounded-full text-base font-medium border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
