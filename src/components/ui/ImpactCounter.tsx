import { useInView } from 'react-intersection-observer';
import { useCounter } from '@/hooks/useCounter';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ImpactStat } from '@/types';
import { useLanguage } from '@/i18n/useLanguage';

interface ImpactCounterProps {
  stat: ImpactStat;
  index: number;
}

const iconMap: Record<string, ReactNode> = {
  utensils: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  users: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'heart-handshake': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  smile: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function ImpactCounter({ stat, index }: ImpactCounterProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { count, start } = useCounter(stat.value, 2500);
  const { tr } = useLanguage();

  useEffect(() => {
    if (inView) start();
  }, [inView, start]);

  return (
    <div
      ref={ref}
      className={`text-center p-6 ${
        inView ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest/10 text-forest mb-4">
        {iconMap[stat.icon]}
      </div>
      <div className="text-4xl md:text-5xl font-serif font-bold text-forest">
        {count}
        {stat.suffix}
      </div>
      <div className="mt-2 text-text-muted font-medium">{tr(stat.label)}</div>
    </div>
  );
}
