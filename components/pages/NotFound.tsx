'use client';

import Link from "next/link";
import Button from '@/components/ui/Button';
import { useLanguage } from '@/i18n/useLanguage';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <section className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-serif font-bold text-forest/20 mb-4">
          404
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text mb-4">
          {t('notFound.title')}
        </h1>
        <p className="text-text-muted text-lg mb-8">
          {t('notFound.text')}
        </p>
        <Link href="/">
          <Button variant="primary">{t('notFound.backHome')}</Button>
        </Link>
      </div>
    </section>
  );
}
