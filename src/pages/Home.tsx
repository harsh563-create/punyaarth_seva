import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { impactStats } from '@/data/impact';

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section ref={ref} className={`${inView ? 'animate-fade-in-up' : 'opacity-0'} ${className}`}>
      {children}
    </section>
  );
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg ${className}`}>
      {children}
    </div>
  );
}

const programs = [
  { title: 'Dana Pani', desc: 'Providing food and water to people and animals in need across our community.', icon: '🍽️' },
  { title: 'Nature Seva', desc: 'Tree plantations, river clean-ups, and environmental awareness campaigns.', icon: '🌿' },
  { title: 'Community Support', desc: 'Helping families, elderly citizens, and underprivileged individuals.', icon: '🤝' },
  { title: 'Animal & Bird Care', desc: 'Feeding strays, water bowls for birds, and shelter collaborations.', icon: '🐾' },
];

const testimonials = [
  { text: 'Joining Punyaarth Seva changed my perspective on life. Serving others gives a peace nothing else can.', name: 'Priya Sharma', role: 'Volunteer' },
  { text: 'The food distribution drives are incredibly well-organized. It feels amazing to see families smile.', name: 'Rahul Verma', role: 'Volunteer' },
  { text: 'Their tree plantation drives have brought greenery back to our neighborhood. Truly grateful.', name: 'Anita Devi', role: 'Community Member' },
];

export default function Home() {
  return (
    <div className="relative z-10">
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto pt-20">
          <span className="inline-block px-5 py-2 bg-forest/10 text-forest rounded-full text-sm font-medium mb-8 border border-forest/20">
            Seva for Humanity, Nature & Every Life
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-text leading-[1.05]">
            Grow a Future<br />
            <span className="text-forest">Rooted in Kindness.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-text-light max-w-xl mx-auto leading-relaxed">
            Every act of seva plants a seed of change. Join our community and watch kindness grow into something that sustains lives.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-forest text-text-on-dark px-8 py-4 rounded-full text-base font-medium hover:bg-forest-light transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-transform">
              Plant a Future
            </Link>
            <Link to="/seva" className="inline-flex items-center gap-2 bg-white/80 backdrop-blur text-forest px-8 py-4 rounded-full text-base font-medium border border-forest/20 hover:bg-forest/5 transition-colors">
              Explore Our Work
            </Link>
          </div>
          <div className="mt-16 animate-scroll-bounce">
            <svg className="w-6 h-6 mx-auto text-forest/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ============ ABOUT / MISSION ============ */}
      <Section className="py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <GlassCard className="p-10 md:p-14">
              <span className="text-saffron font-medium text-sm tracking-wide uppercase">Our Mission</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl font-semibold text-text leading-tight">
                Every Branch of Seva<br />
                <span className="text-forest">Grows from Compassion.</span>
              </h2>
              <div className="mt-6 space-y-4 text-text-muted leading-relaxed">
                <p>
                  Punyaarth Seva started with a simple idea — that ordinary people, coming together, can create extraordinary change for their community, their environment, and every living being.
                </p>
                <p>
                  Like a tree that gives shelter, food, and oxygen, our seva extends in every direction — feeding the hungry, nurturing nature, caring for animals, and building a kinder world.
                </p>
              </div>
              <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-forest font-medium hover:gap-3 transition-all">
                Learn Our Story
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </GlassCard>
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur rounded-2xl p-8 border border-white/40">
                <span className="text-3xl">🌱</span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-text">Serve Selflessly</h3>
                <p className="mt-2 text-text-muted text-sm leading-relaxed">We give our time, energy, and resources without expecting anything in return.</p>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-2xl p-8 border border-white/40">
                <span className="text-3xl">🌍</span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-text">Protect Nature</h3>
                <p className="mt-2 text-text-muted text-sm leading-relaxed">We work to preserve and restore the natural environment for future generations.</p>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-2xl p-8 border border-white/40">
                <span className="text-3xl">💡</span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-text">Inspire Others</h3>
                <p className="mt-2 text-text-muted text-sm leading-relaxed">We encourage people to contribute in their own way and spread the spirit of seva.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ IMPACT ============ */}
      <Section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-saffron font-medium text-sm tracking-wide uppercase">Our Impact</span>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl font-semibold text-text">
            Seeds of Kindness,<br />
            <span className="text-forest">A Forest of Change.</span>
          </h2>
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat) => (
              <GlassCard key={stat.id} className="p-8 text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold text-forest">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="mt-2 text-text-muted text-sm font-medium">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ PROGRAMS ============ */}
      <Section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-saffron font-medium text-sm tracking-wide uppercase">Our Work</span>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-semibold text-text">
              Branches of Our <span className="text-forest">Seva.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((prog) => (
              <GlassCard key={prog.title} className="p-8 md:p-10 hover:shadow-xl transition-shadow group">
                <span className="text-4xl">{prog.icon}</span>
                <h3 className="mt-4 font-serif text-xl font-semibold text-text group-hover:text-forest transition-colors">{prog.title}</h3>
                <p className="mt-3 text-text-muted leading-relaxed">{prog.desc}</p>
                <Link to="/seva" className="mt-5 inline-flex items-center gap-2 text-forest font-medium text-sm hover:gap-3 transition-all">
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ TESTIMONIALS ============ */}
      <Section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-saffron font-medium text-sm tracking-wide uppercase">Stories</span>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-semibold text-text">
              Voices from Our <span className="text-forest">Community.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <GlassCard key={i} className="p-8 flex flex-col">
                <svg className="w-8 h-8 text-forest/20 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
                </svg>
                <p className="mt-4 text-text-light leading-relaxed italic flex-1">{t.text}</p>
                <div className="mt-6 pt-4 border-t border-beige">
                  <div className="font-medium text-text text-sm">{t.name}</div>
                  <div className="text-text-muted text-xs">{t.role}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ DONATION CTA ============ */}
      <Section className="py-24 md:py-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GlassCard className="p-12 md:p-16 bg-forest/95! border-forest-dark/20!">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-text-on-dark leading-tight">
              Every Root Needs Nourishment.
            </h2>
            <p className="mt-6 text-lg text-text-on-dark/80 max-w-2xl mx-auto leading-relaxed">
              Your support helps us reach more people, plant more trees, and build a stronger, kinder community. Every contribution matters.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link to="/join" className="inline-flex items-center gap-2 bg-saffron text-white px-8 py-4 rounded-full text-base font-medium hover:bg-saffron-light transition-colors shadow-lg">
                Support Our Seva
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white/10 text-text-on-dark px-8 py-4 rounded-full text-base font-medium border border-white/20 hover:bg-white/20 transition-colors">
                Get in Touch
              </Link>
            </div>
          </GlassCard>
        </div>
      </Section>

      {/* ============ SPACER FOR ROOTS ============ */}
      <div className="h-[50vh]" />
    </div>
  );
}
