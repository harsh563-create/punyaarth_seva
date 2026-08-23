'use client';

import { useState } from 'react';
import type { GalleryImage } from '@/types';
import { useLanguage } from '@/i18n/useLanguage';

interface GalleryCardProps {
  image: GalleryImage;
  onClick: (image: GalleryImage) => void;
}

export default function GalleryCard({ image, onClick }: GalleryCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { tr } = useLanguage();

  return (
    <button
      onClick={() => onClick(image)}
      className="group relative overflow-hidden rounded-xl cursor-pointer aspect-square"
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-beige animate-pulse" />
      )}
      <img
        src={image.src}
        alt={tr(image.alt)}
        className={`w-full h-full object-cover transition-opacity transition-transform duration-700 group-hover:scale-110 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
      />
      <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/40 transition-colors duration-500" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="bg-white/90 rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-500">
          <svg
            className="w-6 h-6 text-forest"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
