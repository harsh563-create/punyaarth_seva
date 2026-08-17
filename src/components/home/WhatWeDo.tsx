import SectionHeading from '@/components/ui/SectionHeading';
import ActivityCard from '@/components/ui/ActivityCard';
import { sevaCategories } from '@/data/seva';

export default function WhatWeDo() {
  return (
    <section className="py-20 md:py-28 bg-cream-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Seva"
          subtitle="From feeding the hungry to planting trees, every act of service matters."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sevaCategories.map((seva, index) => (
            <ActivityCard key={seva.id} seva={seva} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
