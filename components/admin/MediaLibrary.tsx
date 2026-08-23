'use client';

import { useRef, useState } from 'react';
import type { MediaAsset } from '@/types';
import { detectMediaKind, mediaThumb, youtubeId } from '@/lib/media';

/**
 * Admin media library — add an image or video once (by link or upload),
 * then reuse it from any module through the media picker.
 */

function AssetCard({
  asset,
  onDeleted,
}: {
  asset: MediaAsset;
  onDeleted: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    const res = await fetch(`/api/media/${asset.id}`, { method: 'DELETE' });
    if (res.ok || res.status === 404) onDeleted(asset.id);
    setConfirming(false);
  }

  function handleCopy() {
    navigator.clipboard?.writeText(asset.url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => undefined
    );
  }

  const id = youtubeId(asset.url);

  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/5 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-cream">
        {asset.kind === 'video' && !id ? (
          <video
            src={asset.url}
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaThumb(asset.url)}
            alt={asset.title || asset.url}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
          {asset.kind}
        </span>
        {id && (
          <span className="absolute right-2 top-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
            ▶ YouTube
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-medium text-text" title={asset.title || asset.url}>
          {asset.title || asset.url}
        </p>
        <p className="mt-0.5 text-xs text-text-muted">{asset.source}</p>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 rounded-lg bg-cream px-2 py-1.5 text-xs font-medium text-forest hover:bg-saffron-light transition-colors cursor-pointer"
          >
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <a
            href={asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-cream px-2 py-1.5 text-xs font-medium text-forest hover:bg-saffron-light transition-colors"
          >
            Open
          </a>
          <button
            onClick={handleDelete}
            onBlur={() => setConfirming(false)}
            className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              confirming
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            {confirming ? 'Sure?' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MediaLibrary({
  initialAssets,
}: {
  initialAssets: MediaAsset[];
}) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [kindOverride, setKindOverride] = useState<'auto' | 'image' | 'video'>('auto');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function removeLocal(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }

  async function addAsset(payload: {
    url: string;
    title: string;
    kind: 'image' | 'video';
    source: 'upload' | 'youtube' | 'link';
  }): Promise<boolean> {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? `Could not save (${res.status}).`);
      return false;
    }
    const data = (await res.json()) as { item?: MediaAsset };
    if (data.item) setAssets((prev) => [...prev, data.item as MediaAsset]);
    return true;
  }

  async function handleAddLink() {
    setError('');
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Paste an image or video URL first.');
      return;
    }
    setBusy(true);
    const kind =
      kindOverride === 'auto' ? detectMediaKind(trimmed) : kindOverride;
    const ok = await addAsset({
      url: trimmed,
      title: title.trim(),
      kind,
      source: youtubeId(trimmed) ? 'youtube' : 'link',
    });
    if (ok) {
      setUrl('');
      setTitle('');
      setKindOverride('auto');
    }
    setBusy(false);
  }

  async function handleUpload(file: File) {
    setError('');
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const up = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = (await up.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;
      if (!up.ok || !data?.url) {
        setError(data?.error ?? `Upload failed (${up.status}).`);
        return;
      }
      await addAsset({
        url: data.url,
        title: title.trim() || file.name,
        kind: 'image',
        source: 'upload',
      });
      setTitle('');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      {/* Add row */}
      <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)_9rem_auto]">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste image or video URL — https://youtube.com/watch?v=… , https://site.com/photo.jpg , .mp4 …"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
          <select
            value={kindOverride}
            onChange={(e) =>
              setKindOverride(e.target.value as typeof kindOverride)
            }
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-forest"
          >
            <option value="auto">Type: auto</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <button
            onClick={handleAddLink}
            disabled={busy}
            className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-forest-light transition-colors disabled:opacity-50 cursor-pointer"
          >
            {busy ? 'Working…' : 'Add to Library'}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            YouTube links become embedded players; direct .mp4/.webm links play inline.
            Uploads are for images (max 8 MB).
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="rounded-lg bg-saffron px-4 py-2 text-sm font-medium text-white hover:bg-saffron-dark transition-colors disabled:opacity-50 cursor-pointer"
          >
            Upload Image…
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>

      {/* Grid */}
      {assets.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/15 bg-white/50 p-10 text-center text-sm text-text-muted">
          Library is empty. Add a YouTube link, direct media URL, or upload an image —
          then reuse it in Activities and other modules via “Pick from Library”.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onDeleted={removeLocal} />
          ))}
        </div>
      )}
    </div>
  );
}
