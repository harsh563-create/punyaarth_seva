import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMobileMenu } from '@/hooks/useMobileMenu';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/seva', label: 'Our Seva' },
  { path: '/activities', label: 'Activities' },
  { path: '/events', label: 'Events' },
  { path: '/join', label: 'Join Us' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isOpen, toggle, close } = useMobileMenu();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    close();
  }, [location.pathname, close]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : isHome
            ? 'bg-transparent'
            : 'bg-cream/95 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <svg
                  className="w-9 h-9 md:w-10 md:h-10"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="19"
                    className={`transition-colors duration-300 ${
                      scrolled || !isHome ? 'fill-forest' : 'fill-cream'
                    }`}
                  />
                  <path
                    d="M20 10 C15 10, 11 16, 13 21 C15 26, 18 26, 20 32 C22 26, 25 26, 27 21 C29 16, 25 10, 20 10Z"
                    className="fill-cream"
                  />
                  <circle cx="14" cy="26" r="2.5" className="fill-saffron" opacity="0.8" />
                  <circle cx="26" cy="26" r="2.5" className="fill-saffron" opacity="0.8" />
                </svg>
              </div>
              <span
                className={`font-serif text-lg md:text-xl font-semibold transition-colors duration-300 ${
                  scrolled || !isHome ? 'text-forest' : 'text-forest'
                }`}
              >
                Punyaarth Seva
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'text-forest bg-forest/10'
                      : scrolled || !isHome
                      ? 'text-text-light hover:text-forest hover:bg-forest/5'
                      : 'text-text-light hover:text-forest hover:bg-forest/5'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-saffron rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Link
                to="/join"
                className="inline-flex items-center gap-2 bg-forest text-text-on-dark px-6 py-2.5 rounded-full text-sm font-medium hover:bg-forest-light transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Join Us
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={toggle}
                  className={`lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    'hover:bg-forest/5'
                  }`}
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 origin-center ${
                    isOpen
                      ? 'rotate-45 translate-y-[4px] bg-forest'
                      : 'bg-text'
                  }`}
                />
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 ${
                    isOpen
                      ? 'opacity-0 scale-x-0'
                      : 'bg-text'
                  }`}
                />
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 origin-center ${
                    isOpen
                      ? '-rotate-45 -translate-y-[4px] bg-forest'
                      : 'bg-text'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-500 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={close}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-beige">
              <Link to="/" className="font-serif text-xl font-semibold text-forest" onClick={close}>
                Punyaarth Seva
              </Link>
              <button
                onClick={close}
                className="w-10 h-10 rounded-full bg-cream flex items-center justify-center hover:bg-beige transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors duration-300 ${
                      location.pathname === link.path
                        ? 'text-forest bg-forest/5'
                        : 'text-text-light hover:text-forest hover:bg-cream'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/join"
                  className="flex items-center justify-center gap-2 bg-forest text-text-on-dark px-6 py-3 rounded-full text-base font-medium hover:bg-forest-light transition-colors w-full"
                  onClick={close}
                >
                  Join Our Seva
                </Link>
              </div>
            </div>
            <div className="p-6 border-t border-beige">
              <p className="text-xs text-text-muted text-center">
                Seva for Humanity, Nature & Every Life
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
