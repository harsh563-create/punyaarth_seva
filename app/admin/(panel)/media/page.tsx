import type { Metadata } from 'next';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { getMediaAssets } from '@/lib/data';

export const metadata: Metadata = { title: 'Media Library' };

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-text">
          Media Library
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Add images and videos once, reuse them across Activities and other
          modules.
        </p>
      </header>
      <MediaLibrary initialAssets={assets} />
    </div>
  );
}
