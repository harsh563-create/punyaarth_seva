'use client';

import { useState } from 'react';
import PageHero from '@/components/ui/PageHero';
import Button from '@/components/ui/Button';
import { socialLinks, SocialIcon } from '@/data/social';
import { useLanguage } from '@/i18n/useLanguage';

export default function Contact() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend API
    // POST /api/contact
    setSubmitted(true);
    setFormState({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <PageHero
        title={t('contactPage.heroTitle')}
        subtitle={t('contactPage.heroSubtitle')}
      />

      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-3xl font-semibold text-text mb-6">
                {t('contactPage.infoTitle')}
              </h2>
              <p className="text-text-muted leading-relaxed mb-10">
                {t('contactPage.infoText')}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-text">{t('contactPage.email')}</h3>
                    <p className="text-text-muted mt-1">info@punyaarthseva.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-text">{t('contactPage.phone')}</h3>
                    <a
                      href="tel:+919770074501"
                      className="text-text-muted mt-1 inline-block transition-colors hover:text-saffron-dark"
                    >
                      +91 97700 74501
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-text">{t('contactPage.location')}</h3>
                    <p className="text-text-muted mt-1 max-w-xs leading-relaxed">
                      {t('contactPage.address')}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-text">Follow Us</h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-beige-dark bg-white p-3.5 transition-colors hover:border-saffron/50 hover:bg-saffron/5"
                      >
                        <span className="w-10 h-10 rounded-lg bg-forest/10 text-forest flex items-center justify-center shrink-0 transition-colors group-hover:bg-saffron/15 group-hover:text-saffron-dark">
                          <SocialIcon pathD={social.pathD} />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium text-text">{social.label}</span>
                          <span className="block truncate text-sm text-text-muted group-hover:text-saffron-dark">
                            {social.handle}
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-10 overflow-hidden rounded-2xl border border-beige-dark bg-beige shadow-sm">
                <iframe
                  title="Punyaarth Seva Samiti — Sadashiv Galaxy, Indore"
                  src="https://www.google.com/maps?q=Sadashiv+Galaxy,+PRHG+4WJ,+Shakti+Nagar,+Sukhdev+Vihar,+Indore,+Madhya+Pradesh+452005&z=16&output=embed"
                  className="h-64 w-full md:h-72"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Sadashiv+Galaxy,+PRHG+4WJ,+Shakti+Nagar,+Sukhdev+Vihar,+Indore,+Madhya+Pradesh+452005"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white py-3 font-sans text-sm font-medium text-forest transition-colors hover:bg-saffron hover:text-white cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('contactPage.directions')}
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm">
                <h2 className="font-serif text-2xl font-semibold text-text mb-6">
                  {t('contactPage.formTitle')}
                </h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-forest/10 text-forest rounded-xl text-sm font-medium">
                    {t('contactPage.successMessage')}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">
                      {t('contactPage.nameLabel')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-colors transition-shadow text-text"
                      placeholder={t('contactPage.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
                      {t('contactPage.emailLabel')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-colors transition-shadow text-text"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text mb-1.5">
                      {t('contactPage.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-colors transition-shadow text-text"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text mb-1.5">
                      {t('contactPage.messageLabel')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-colors transition-shadow text-text resize-none"
                      placeholder={t('contactPage.messagePlaceholder')}
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full">
                    {t('contactPage.sendButton')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
