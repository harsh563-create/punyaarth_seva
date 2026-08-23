import { LanguageProvider } from '@/i18n/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <LanguageProvider>
      <div className="relative isolate min-h-screen bg-cream">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
