'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Lang, LocalizedText } from '@/types';
import { resolve, translations, type TranslationKey } from './translations';
import { LanguageContext, type LanguageContextValue } from './context';

const STORAGE_KEY = 'punyaarth-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Server-render always uses 'en' so markup matches; the stored preference is
  // restored on mount to avoid a hydration mismatch.
  const [lang, setLangState] = useState<Lang>('en');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'hi' || saved === 'en') setLangState(saved);
    } catch {
      /* storage unavailable */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang, hydrated]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggleLang = useCallback(() => setLangState((prev) => (prev === 'en' ? 'hi' : 'en')), []);

  const t = useCallback(
    (key: TranslationKey) => {
      const value = resolve(translations[lang], key);
      return typeof value === 'string' ? value : key;
    },
    [lang]
  );

  const tl = useCallback(
    <T,>(key: TranslationKey) => resolve(translations[lang], key) as T,
    [lang]
  );

  const tr = useCallback(
    (text: LocalizedText) => text[lang] ?? text.en,
    [lang]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      locale: lang === 'hi' ? 'hi-IN' : 'en-US',
      setLang,
      toggleLang,
      t,
      tl,
      tr,
    }),
    [lang, setLang, toggleLang, t, tl, tr]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
