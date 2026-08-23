import { createContext } from 'react';
import type { Lang, LocalizedText } from '@/types';
import type { TranslationKey } from './translations';

export interface LanguageContextValue {
  lang: Lang;
  locale: string;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  tl: <T>(key: TranslationKey) => T;
  tr: (text: LocalizedText) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
