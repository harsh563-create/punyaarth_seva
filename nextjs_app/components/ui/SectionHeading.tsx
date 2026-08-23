'use client';

import { useInView } from 'react-intersection-observer';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''} ${
        inView ? 'animate-fade-in-up' : 'opacity-0'
      }`}
    >
      <h2
        className={`font-serif text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight ${
          light ? 'text-text-on-dark' : 'text-text'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg max-w-2xl ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-text-on-dark/80' : 'text-text-muted'}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 h-1 w-16 bg-saffron rounded-full ${
          centered ? 'mx-auto' : ''
        }`}
      />
    </div>
  );
}
