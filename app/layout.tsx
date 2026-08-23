import type { Metadata, Viewport } from 'next';
import {
  Inter,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
  Playfair_Display,
} from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-serif-devanagari',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-devanagari',
});

export const metadata: Metadata = {
  title: {
    default: 'Punyaarth Seva — Seva for Humanity, Nature & Every Life',
    template: '%s | Punyaarth Seva',
  },
  description:
    'Punyaarth Seva - Seva for Humanity, Nature & Every Life. A community of people coming together to serve humanity, care for nature, and spread kindness.',
  keywords: [
    'punyaarth seva',
    'seva',
    'community service',
    'charity',
    'food distribution',
    'tree plantation',
    'animal care',
    'volunteer',
  ],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/images/img2.jpg', type: 'image/jpeg' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a4d2e',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`bg-cream ${playfair.variable} ${inter.variable} ${notoSerifDevanagari.variable} ${notoSansDevanagari.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
