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
              <img
                src="/assets/images/img2.jpg"
                alt="Punyaarth Seva logo"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover ring-1 ring-black/10 shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <span
                className={`font-serif text-lg md:text-xl font-semibold transition-colors duration-300 ${
                  scrolled || !isHome ? 'text-forest' : 'text-forest'
                }`}
              >
                Punyaarth Seva
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`group relative px-4 py-2 text-sm tracking-wide rounded-full transition-all duration-300 ${
                      isActive
                        ? 'text-forest font-semibold'
                        : 'text-text-light font-medium hover:text-forest'
                    }`}
                  >
                    {link.label}

                    {/* Sliding underline track */}
                    <span className="pointer-events-none absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-[calc(100%-1.5rem)] overflow-hidden rounded-full">
                      {/* Hover line — grows in from left */}
                      <span
                        className={`absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-saffron to-saffron-light transition-transform duration-300 ease-out ${
                          isActive
                            ? 'scale-x-100 opacity-0'
                            : 'scale-x-0 opacity-70 group-hover:scale-x-100 group-hover:opacity-100'
                        }`}
                      />
                      {/* Active line — gradient glow */}
                      <span
                        className={`absolute inset-0 rounded-full bg-gradient-to-r from-saffron via-saffron-light to-saffron shadow-[0_1px_6px_rgba(230,126,34,0.45)] transition-all duration-500 ${
                          isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                        }`}
                      />
                    </span>

                    {/* Soft dot indicator for active */}
                    <span
                      className={`pointer-events-none absolute top-1 right-2 w-1 h-1 rounded-full bg-saffron transition-all duration-500 ${
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`}
                    />
                  </Link>
                );
              })}
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
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`relative overflow-hidden rounded-xl text-base font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-forest font-semibold'
                          : 'text-text-light hover:text-forest hover:translate-x-1'
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-gradient-to-b from-saffron to-saffron-light transition-all duration-300 ${
                          isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                        }`}
                      />
                      <span className={`block px-4 py-3 transition-colors duration-300 ${isActive ? 'pl-5' : ''}`}>
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
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
