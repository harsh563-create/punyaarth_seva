'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/useLanguage';
import type { TranslationKey } from '@/i18n/translations';
import { socialLinks, SocialIcon } from '@/data/social';

const footerLinks: { path: string; label: TranslationKey }[] = [
  { path: '/about', label: 'footer.aboutUs' },
  { path: '/seva', label: 'nav.seva' },
  { path: '/activities', label: 'nav.activities' },
  { path: '/events', label: 'nav.events' },
  { path: '/donate', label: 'nav.donate' },
  { path: '/join', label: 'nav.join' },
  { path: '/contact', label: 'nav.contact' },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="relative z-10 bg-[#0b2a19] text-text-on-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/assets/images/img2.jpg"
                alt="Punyaarth Seva logo"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20"
              />
              <span className="font-serif text-xl font-semibold text-text-on-dark">Punyaarth Seva</span>
            </Link>
            <p className="text-text-on-dark/70 text-sm leading-relaxed">{t('footer.tagline')}</p>
            <p className="mt-4 text-text-on-dark/50 text-sm">{t('footer.motto')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-text-on-dark/70 text-sm hover:text-saffron transition-colors">
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm text-text-on-dark/70">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@punyaarthseva.org</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>India</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">{t('footer.followUs')}</h3>
            <p className="text-text-on-dark/70 text-sm mb-4">{t('footer.followText')}</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-text-on-dark/70 hover:bg-saffron hover:text-white transition-colors duration-300"
                  aria-label={social.label}>
                  <SocialIcon pathD={social.pathD} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-on-dark/50 text-sm">{t('footer.rights')}</p>
          <p className="text-text-on-dark/50 text-sm">{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
