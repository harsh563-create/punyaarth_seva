import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import LivingTree from '@/components/tree/LivingTree';
import Home from '@/pages/Home';
import About from '@/pages/About';
import OurSeva from '@/pages/OurSeva';
import Activities from '@/pages/Activities';
import Events from '@/pages/Events';
import JoinUs from '@/pages/JoinUs';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import { useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="relative isolate min-h-screen bg-cream">
      <ScrollToTop />
      {isHome && <LivingTree />}
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/seva" element={<OurSeva />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/events" element={<Events />} />
          <Route path="/join" element={<JoinUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
