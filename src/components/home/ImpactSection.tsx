import { impactStats } from '@/data/impact';
import ImpactCounter from '@/components/ui/ImpactCounter';
import SectionHeading from '@/components/ui/SectionHeading';

export default function ImpactSection() {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Together, We Can Make a Difference"
          subtitle="Every number represents a life touched, a meal shared, or a step towards a better world."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {impactStats.map((stat, index) => (
            <ImpactCounter key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
