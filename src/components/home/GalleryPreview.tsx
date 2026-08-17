import { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import GalleryCard from '@/components/ui/GalleryCard';
import Modal from '@/components/ui/Modal';
import { galleryImages } from '@/data/gallery';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import type { GalleryImage } from '@/types';

export default function GalleryPreview() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const previewImages = galleryImages.slice(0, 8);

  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Moments of Seva"
          subtitle="Real moments from our activities — every photo tells a story of kindness."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previewImages.map((image) => (
            <GalleryCard
              key={image.id}
              image={image}
              onClick={setSelectedImage}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/activities">
            <Button variant="outline">View All Activities</Button>
          </Link>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      >
        {selectedImage && (
          <div className="p-2">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
            />
            <div className="p-4">
              <p className="text-text font-medium">{selectedImage.alt}</p>
              <p className="text-text-muted text-sm mt-1">
                {new Date(selectedImage.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
