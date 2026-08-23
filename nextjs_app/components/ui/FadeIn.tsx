'use client';

import { useInView } from 'react-intersection-observer';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'up' | 'left' | 'right';
}

const animations = {
  up: 'animate-fade-in-up',
  left: 'animate-slide-in-left',
  right: 'animate-slide-in-right',
};

export default function FadeIn({ children, className = '', delay = 0, variant = 'up' }: FadeInProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`${inView ? animations[variant] : 'opacity-0'} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
