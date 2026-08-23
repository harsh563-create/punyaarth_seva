'use client';

import { useState } from 'react';
import type { AboutContent, AboutLabeledItem } from '@/types';

type Status = { kind: 'idle' | 'saving' | 'saved' } | { kind: 'error'; message: string };

const INPUT =
  'w-full rounded-xl border border-beige-dark bg-white px-3.5 py-2 font-sans text-sm text-text placeholder:text-text-muted/60 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest-muted';

/** One editable localized text: stacked English / Hindi inputs. */
function LocalizedArea({
  label,
  value,
  onChange,
  multiline = true,
}: {
  label: string;
  value: { en: string; hi: string };
  onChange: (next: { en: string; hi: string }) => void;
  multiline?: boolean;
}) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div>
      <span className="mb-1.5 block font-sans text-sm font-medium text-text">{label}</span>
      <div className="grid gap-2">
        <Tag
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          placeholder="English"
          className={`${INPUT} ${multiline ? 'min-h-[80px] resize-y' : ''}`}
        />
        <Tag
          value={value.hi}
          lang="hi"
          onChange={(e) => onChange({ ...value, hi: e.target.value })}
          placeholder="हिन्दी"
          className={`${INPUT} ${multiline ? 'min-h-[80px] resize-y' : ''}`}
        />
      </div>
    </div>
  );
}

function ItemEditor({
  index,
  item,
  onChange,
}: {
  index: number;
  item: AboutLabeledItem;
  onChange: (next: AboutLabeledItem) => void;
}) {
  return (
    <div className="rounded-2xl border border-beige-dark bg-cream-light/40 p-4">
      <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-wide text-earth-dark">
        Item {index + 1}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-sans text-xs font-medium text-text-muted">Title (EN)</label>
          <input
            value={item.title.en}
            onChange={(e) => onChange({ ...item, title: { ...item.title, en: e.target.value } })}
            className={INPUT}
          />
        </div>
        <div>
          <label className="mb-1 block font-sans text-xs font-medium text-text-muted">Title (HI)</label>
          <input
            value={item.title.hi}
            lang="hi"
            onChange={(e) => onChange({ ...item, title: { ...item.title, hi: e.target.value } })}
            className={INPUT}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block font-sans text-xs font-medium text-text-muted">
            Description (EN / HI)
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <textarea
              value={item.description.en}
              onChange={(e) =>
                onChange({ ...item, description: { ...item.description, en: e.target.value } })
              }
              placeholder="English"
              className={`${INPUT} min-h-[64px] resize-y`}
            />
            <textarea
              value={item.description.hi}
              lang="hi"
              onChange={(e) =>
                onChange({ ...item, description: { ...item.description, hi: e.target.value } })
              }
              placeholder="हिन्दी"
              className={`${INPUT} min-h-[64px] resize-y`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutManager({ initial }: { initial: AboutContent }) {
  const [content, setContent] = useState<AboutContent>(initial);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [uploading, setUploading] = useState(false);

  async function uploadStoryImage(file: File) {
    setUploading(true);
    setStatus({ kind: 'idle' });
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        throw new Error(data?.error ?? 'Upload failed');
      }
      setContent((prev) => ({ ...prev, storyImage: data.url as string }));
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Upload failed',
      });
    } finally {
      setUploading(false);
    }
  }

  function set<K extends keyof AboutContent>(key: K, value: AboutContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  function setItem(
    key: 'missionItems' | 'valuesItems',
    index: number,
    next: AboutLabeledItem
  ) {
    setContent((prev) => {
      const list = [...prev[key]];
      list[index] = next;
      return { ...prev, [key]: list };
    });
  }

  async function save() {
    setStatus({ kind: 'saving' });
    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus({ kind: 'error', message: payload.error ?? `Save failed (${response.status})` });
        return;
      }
      setStatus({ kind: 'saved' });
    } catch {
      setStatus({ kind: 'error', message: 'Network error — changes were not saved.' });
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-forest">About Page</h1>
          <p className="mt-1 max-w-2xl font-sans text-sm text-text-muted">
            Edit the story, vision quote, mission and values shown on the public About page.
            Leave a field blank to keep the default translation for that language.
          </p>
        </div>
        <button
          onClick={save}
          disabled={status.kind === 'saving'}
          className="rounded-full bg-forest px-6 py-2.5 font-sans text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-light hover:shadow-lg disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {status.kind === 'saving' ? 'Saving…' : 'Save changes'}
        </button>
      </header>

      {status.kind === 'saved' && (
        <div className="mb-4 rounded-xl border border-forest/30 bg-forest/10 px-4 py-3 font-sans text-sm text-forest">
          Saved — the About page now shows this content.
        </div>
      )}
      {status.kind === 'error' && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {status.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Our Story */}
        <section className="rounded-2xl border border-beige-dark bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-5 font-serif text-xl font-semibold text-forest">Our Story</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <LocalizedArea label="Paragraph 1" value={content.storyP1} onChange={(v) => set('storyP1', v)} />
            <LocalizedArea label="Paragraph 2" value={content.storyP2} onChange={(v) => set('storyP2', v)} />
            <LocalizedArea label="Paragraph 3" value={content.storyP3} onChange={(v) => set('storyP3', v)} />
          </div>
          <div className="mt-5 flex flex-wrap items-start gap-4 border-t border-beige pt-5">
            {content.storyImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.storyImage}
                alt="Story preview"
                className="h-28 w-44 shrink-0 rounded-xl border border-beige-dark object-cover"
              />
            ) : (
              <span className="flex h-28 w-44 shrink-0 items-center justify-center rounded-xl border border-dashed border-beige-dark font-sans text-xs text-text-muted">
                No image
              </span>
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <span className="block font-sans text-sm font-medium text-text">Story image</span>
              <input
                value={content.storyImage}
                onChange={(e) => set('storyImage', e.target.value)}
                placeholder="/assets/images/community-support.jpg"
                className={`${INPUT} max-w-md`}
              />
              <div className="flex items-center gap-4">
                <label
                  className={`inline-flex cursor-pointer items-center gap-1.5 font-sans text-xs font-medium text-forest transition-colors hover:text-forest-light ${
                    uploading ? 'pointer-events-none opacity-60' : ''
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (file) uploadStoryImage(file);
                    }}
                  />
                  {uploading ? 'Uploading…' : 'Upload new image'}
                </label>
                {content.storyImage && (
                  <button
                    type="button"
                    onClick={() => set('storyImage', '')}
                    className="font-sans text-xs font-medium text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="font-sans text-xs text-text-muted">
                Shown beside the Our Story section. JPG, PNG, WebP, GIF or AVIF — up to 8 MB.
                Removing it falls back to the default photo.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="rounded-2xl border border-beige-dark bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-5 font-serif text-xl font-semibold text-forest">Vision Quote</h2>
          <LocalizedArea label="Quote" value={content.visionQuote} onChange={(v) => set('visionQuote', v)} />
        </section>

        {/* Mission items */}
        <section className="rounded-2xl border border-beige-dark bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-serif text-xl font-semibold text-forest">Mission Items</h2>
          <div className="space-y-4">
            {content.missionItems.map((item, i) => (
              <ItemEditor key={i} index={i} item={item} onChange={(next) => setItem('missionItems', i, next)} />
            ))}
          </div>
        </section>

        {/* Values items */}
        <section className="rounded-2xl border border-beige-dark bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-serif text-xl font-semibold text-forest">Values Items</h2>
          <div className="space-y-4">
            {content.valuesItems.map((item, i) => (
              <ItemEditor key={i} index={i} item={item} onChange={(next) => setItem('valuesItems', i, next)} />
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="rounded-2xl border border-beige-dark bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-5 font-serif text-xl font-semibold text-forest">
            Join CTA (bottom of the page)
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <LocalizedArea
              label="Title"
              value={content.ctaTitle}
              onChange={(v) => set('ctaTitle', v)}
              multiline={false}
            />
            <LocalizedArea label="Text" value={content.ctaText} onChange={(v) => set('ctaText', v)} />
          </div>
        </section>
      </div>
    </div>
  );
}
