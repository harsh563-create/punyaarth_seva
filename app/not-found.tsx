import { LanguageProvider } from '@/i18n/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NotFound from '@/components/pages/NotFound';

export default function NotFoundRoute() {
  return (
    <LanguageProvider>
      <div className="relative isolate min-h-screen flex flex-col bg-cream">
        <Navbar />
        <main className="flex-1">
          <NotFound />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
