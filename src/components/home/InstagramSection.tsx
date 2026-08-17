import { useInView } from 'react-intersection-observer';
import Button from '@/components/ui/Button';

export default function InstagramSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const instagramImages = [
    { id: 'ig-1', src: '/assets/images/food-seva.jpg', alt: 'Food distribution activity' },
    { id: 'ig-2', src: '/assets/images/nature-seva.jpg', alt: 'Tree plantation drive' },
    { id: 'ig-3', src: '/assets/images/animal-care.jpg', alt: 'Animal care initiative' },
    { id: 'ig-4', src: '/assets/images/community-support.jpg', alt: 'Community support' },
    { id: 'ig-5', src: '/assets/images/awareness.jpg', alt: 'Awareness campaign' },
    { id: 'ig-6', src: '/assets/images/food-seva.jpg', alt: 'Water seva activity' },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 bg-cream-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-text">
              Follow Our Seva Journey
            </h2>
            <p className="mt-4 text-text-muted text-lg max-w-2xl mx-auto">
              See what we're doing, where we're serving, and the moments we
              share with our community.
            </p>
            <div className="mt-4 h-1 w-16 bg-saffron rounded-full mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {instagramImages.map((img, index) => (
            <a
              key={img.id}
              href="https://www.instagram.com/punyaarth_seva_samiti/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-square rounded-xl overflow-hidden ${
                inView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/50 transition-colors duration-500 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://www.instagram.com/punyaarth_seva_samiti/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" icon={<span>📷</span>}>
              Follow Us on Instagram
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
