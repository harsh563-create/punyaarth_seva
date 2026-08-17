import Hero from '@/components/home/Hero';
import ImpactSection from '@/components/home/ImpactSection';
import WhatWeDo from '@/components/home/WhatWeDo';
import FeaturedStory from '@/components/home/FeaturedStory';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import GalleryPreview from '@/components/home/GalleryPreview';
import VolunteerCTA from '@/components/home/VolunteerCTA';
import InstagramSection from '@/components/home/InstagramSection';

export default function Home() {
  return (
    <>
      <Hero />
      <ImpactSection />
      <WhatWeDo />
      <FeaturedStory />
      <UpcomingEvents />
      <GalleryPreview />
      <VolunteerCTA />
      <InstagramSection />
    </>
  );
}
