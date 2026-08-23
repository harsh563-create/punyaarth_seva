import type { LocalizedText } from '@/types';

export function Badge({
  children,
  tone = 'forest',
}: {
  children: React.ReactNode;
  tone?: 'forest' | 'saffron' | 'earth' | 'muted';
}) {
  const tones = {
    forest: 'bg-forest-muted text-forest',
    saffron: 'bg-saffron/15 text-saffron-dark',
    earth: 'bg-earth/10 text-earth',
    muted: 'bg-beige text-text-muted',
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 font-sans text-xs font-medium capitalize ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Thumb({ src, alt = '' }: { src: string; alt?: string }) {
  if (!src) {
    return (
      <span className="flex h-11 w-16 items-center justify-center rounded-lg border border-dashed border-beige-dark font-sans text-[10px] text-text-muted">
        No img
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className="h-11 w-16 rounded-lg border border-beige-dark object-cover"
    />
  );
}

export function LocalizedCell({ text }: { text: LocalizedText }) {
  return (
    <div className="max-w-[260px]">
      <p className="truncate font-sans text-sm font-medium text-text">
        {text.en}
      </p>
      {text.hi && (
        <p className="truncate font-sans text-xs text-text-muted" lang="hi">
          {text.hi}
        </p>
      )}
    </div>
  );
}

export function MutedText({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-sm text-text-muted">{children}</span>
  );
}
