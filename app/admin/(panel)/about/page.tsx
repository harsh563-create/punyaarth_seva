import type { Metadata } from 'next';
import AboutManager from '@/components/admin/AboutManager';
import { getAboutContent } from '@/lib/data';
import { DEFAULT_ABOUT_STORY_IMAGE } from '@/data';
import en from '@/i18n/en';
import hi from '@/i18n/hi';
import type { AboutContent, AboutLabeledItem } from '@/types';

export const metadata: Metadata = { title: 'About Page' };

/** Effective form values: saved content per language, else bundled text. */
function buildInitial(saved: Awaited<ReturnType<typeof getAboutContent>>): AboutContent {
  const pair = (
    key: 'storyP1' | 'storyP2' | 'storyP3' | 'visionQuote' | 'ctaTitle' | 'ctaText'
  ) => ({
    en: saved?.[key]?.en?.trim() || en.about[key],
    hi: saved?.[key]?.hi?.trim() || hi.about[key],
  });

  const items = (key: 'missionItems' | 'valuesItems'): AboutLabeledItem[] =>
    en.about[key].map((item, i) => ({
      title: {
        en: saved?.[key]?.[i]?.title?.en?.trim() || item.title,
        hi: saved?.[key]?.[i]?.title?.hi?.trim() || hi.about[key][i].title,
      },
      description: {
        en: saved?.[key]?.[i]?.description?.en?.trim() || item.description,
        hi: saved?.[key]?.[i]?.description?.hi?.trim() || hi.about[key][i].description,
      },
    }));

  return {
    storyP1: pair('storyP1'),
    storyP2: pair('storyP2'),
    storyP3: pair('storyP3'),
    storyImage: saved?.storyImage?.trim() || DEFAULT_ABOUT_STORY_IMAGE,
    visionQuote: pair('visionQuote'),
    missionItems: items('missionItems'),
    valuesItems: items('valuesItems'),
    ctaTitle: pair('ctaTitle'),
    ctaText: pair('ctaText'),
  };
}

export default async function AdminAboutPage() {
  const saved = await getAboutContent();
  return <AboutManager initial={buildInitial(saved)} />;
}
