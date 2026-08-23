'use client';

import { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal';
import type { LocalizedText, MediaAsset } from '@/types';
import { mediaThumb, youtubeId } from '@/lib/media';
import { Badge, LocalizedCell, MutedText, Thumb } from './ui';
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from './icons';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'image'
  | 'lines'
  | 'media'
  | 'boolean';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  /** For type 'media': which library kind the picker shows. */
  mediaKind?: 'image' | 'video';
  /** Renders EN + HI inputs and stores a { en, hi } object. */
  localized?: boolean;
  placeholder?: string;
  hint?: string;
  wide?: boolean;
}

export type ColumnTone = 'forest' | 'saffron' | 'earth' | 'muted';

/**
 * Declarative, serializable cell spec. Server Components cannot pass render
 * functions to this Client Component, so cells are described as data and
 * rendered here instead.
 */
export type CellSpec =
  /** LocalizedText field rendered with EN + HI lines. */
  | { kind: 'localized'; field: string }
  /** Plain muted text of a field value; `strong` renders it prominent. */
  | { kind: 'text'; field: string; strong?: boolean }
  /** Truncated single-line view of a LocalizedText field (EN). */
  | { kind: 'truncate'; field: string }
  /** Badge for a string field; tone may be fixed or mapped per value. */
  | {
      kind: 'badge';
      field: string;
      tone?: ColumnTone | Partial<Record<string, ColumnTone>>;
    }
  /** Boolean flag shown as a badge when true, an em dash otherwise. */
  | { kind: 'boolean'; field: string; label?: string; tone?: ColumnTone }
  /** Length of an array field, with optional suffix text. */
  | { kind: 'count'; field: string; suffix?: string }
  /** Monospace code chip (e.g. icon slugs). */
  | { kind: 'code'; field: string }
  /** Formatted number plus optional suffix field (e.g. "1,200+"). */
  | { kind: 'stat'; field: string; suffixField?: string }
  /** Number pair like "joined / needed". */
  | { kind: 'volunteers'; joinedField: string; neededField?: string }
  /** Image thumbnail from a path field. */
  | { kind: 'thumb'; srcField: string; altField?: string };

export interface ColumnDef {
  header: string;
  cell: CellSpec;
}

type Row = { id: string };
type Draft = Record<string, unknown>;

interface CollectionManagerProps<T extends Row> {
  title: string;
  singular: string;
  description?: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  initialItems: T[];
  idPrefix: string;
  searchFields?: (keyof T)[];
  /** REST base path (e.g. "/api/events"). Omit for local-only demo mode. */
  apiPath?: string;
}

function defaultFor(field: FieldDef): unknown {
  if (field.localized) return { en: '', hi: '' };
  switch (field.type) {
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'lines':
      return [];
    case 'select':
      return field.options?.[0] ?? '';
    default:
      return '';
  }
}

function buildDraft(fields: FieldDef[]): Draft {
  return Object.fromEntries(fields.map((f) => [f.name, defaultFor(f)]));
}

function draftFromRow<T extends Row>(row: T, fields: FieldDef[]): Draft {
  const draft = buildDraft(fields);
  for (const f of fields) {
    if (row[f.name as keyof T] !== undefined) {
      draft[f.name] = structuredClone(row[f.name as keyof T]);
    }
  }
  return draft;
}

function draftToItem(draft: Draft, id: string): Draft {
  const item: Draft = { ...draft, id };
  for (const [key, value] of Object.entries(item)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      'en' in (value as Record<string, unknown>)
    ) {
      const loc = value as { en?: unknown; hi?: unknown };
      item[key] = {
        en: String(loc.en ?? ''),
        hi: typeof loc.hi === 'string' ? loc.hi : '',
      };
    }
  }
  return item;
}

function localized(value: unknown): LocalizedText {
  if (value && typeof value === 'object' && 'en' in (value as Record<string, unknown>)) {
    return value as LocalizedText;
  }
  return { en: '', hi: '' };
}

function Cell({ spec, row }: { spec: CellSpec; row: Row }) {
  const record = row as Record<string, unknown>;
  const value = 'field' in spec ? record[spec.field] : undefined;

  switch (spec.kind) {
    case 'localized':
      return <LocalizedCell text={localized(value)} />;
    case 'text':
      return spec.strong ? (
        <span className="font-sans text-sm font-medium text-text">
          {String(value ?? '')}
        </span>
      ) : (
        <MutedText>{String(value ?? '')}</MutedText>
      );
    case 'truncate':
      return (
        <span className="block max-w-[180px] truncate font-sans text-sm">
          {localized(value).en}
        </span>
      );
    case 'badge': {
      const tone =
        typeof spec.tone === 'string'
          ? spec.tone
          : (spec.tone?.[String(value)] ?? 'muted');
      return <Badge tone={tone}>{String(value ?? '')}</Badge>;
    }
    case 'boolean':
      return value ? (
        <Badge tone={spec.tone ?? 'saffron'}>{spec.label ?? 'Yes'}</Badge>
      ) : (
        <MutedText>—</MutedText>
      );
    case 'count': {
      const n = Array.isArray(value)
        ? value.length
        : Number.isFinite(Number(value))
          ? Number(value)
          : 0;
      return <MutedText>{`${n}${spec.suffix ?? ''}`}</MutedText>;
    }
    case 'code':
      return (
        <code className="rounded bg-beige px-2 py-1 font-sans text-xs text-earth-dark">
          {String(value ?? '')}
        </code>
      );
    case 'stat': {
      const n = Number(value) || 0;
      const suffix = spec.suffixField
        ? String(record[spec.suffixField] ?? '')
        : '';
      return (
        <span className="font-serif text-lg font-semibold text-forest">
          {n.toLocaleString('en-US')}
          {suffix}
        </span>
      );
    }
    case 'volunteers': {
      const joined = Number(record[spec.joinedField]) || 0;
      const neededRaw = spec.neededField ? record[spec.neededField] : undefined;
      const needed = neededRaw == null ? null : Number(neededRaw);
      return (
        <MutedText>
          {joined}
          {needed ? ` / ${needed}` : ''}
        </MutedText>
      );
    }
    case 'thumb':
      return (
        <Thumb
          src={String(record[spec.srcField] ?? '')}
          alt={spec.altField ? localized(record[spec.altField]).en : ''}
        />
      );
    default:
      return null;
  }
}

export default function CollectionManager<T extends Row>({
  title,
  singular,
  description,
  fields,
  columns,
  initialItems,
  idPrefix,
  apiPath,
}: CollectionManagerProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(() => buildDraft(fields));
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T | null> {
    try {
      const response = await fetch(path, {
        method,
        headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      const payload = (await response.json().catch(() => ({}))) as {
        item?: T;
        error?: string;
      };
      if (!response.ok) {
        setError(payload.error ?? `Request failed (${response.status})`);
        return null;
      }
      setError(null);
      // Success payloads are either { item } (POST/PUT) or { ok: true }
      // (DELETE); both must resolve truthy for the caller's optimistic update.
      return payload.item ?? (payload as T);
    } catch {
      setError('Network error — change shown locally only.');
      return null;
    }
  }

  async function uploadImage(file: File): Promise<string | null> {
    if (!apiPath) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const payload = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !payload.url) {
        setError(payload.error ?? `Upload failed (${response.status})`);
        return null;
      }
      setError(null);
      return payload.url;
    } catch {
      setError('Upload failed — network error.');
      return null;
    } finally {
      setUploading(false);
    }
  }

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(q)
    );
  }, [items, query]);

  function openCreate() {
    setEditingId(null);
    setDraft(buildDraft(fields));
    setModalOpen(true);
  }

  function openEdit(row: T) {
    setEditingId(row.id);
    setDraft(draftFromRow(row, fields));
    setModalOpen(true);
  }

  /** Pulls the authoritative list back from the API after a mutation so the
   *  table always mirrors what is stored in Supabase. */
  async function fetchServerItems(): Promise<T[] | null> {
    if (!apiPath) return null;
    try {
      const response = await fetch(apiPath);
      const payload = (await response.json().catch(() => ({}))) as {
        items?: T[];
      };
      if (response.ok && Array.isArray(payload.items)) return payload.items;
    } catch {
      /* fall back to the optimistic update below */
    }
    return null;
  }

  async function saveDraft() {
    const item = draftToItem(draft, editingId ?? newId());

    if (editingId) {
      const saved = apiPath
        ? await request<T>('PUT', `${apiPath}/${encodeURIComponent(editingId)}`, draftToItem(draft, editingId))
        : null;
      const next = (saved ?? item) as unknown as T;
      setItems((prev) =>
        prev.map((row) => (row.id === editingId ? next : row))
      );
    } else {
      const saved = apiPath ? await request<T>('POST', apiPath, item) : null;
      const created = (saved ?? item) as unknown as T;
      setItems((prev) => [
        prev.find((row) => row.id === created.id) ?? created,
        ...prev.filter((row) => row.id !== created.id),
      ]);
    }
    setModalOpen(false);

    const fresh = await fetchServerItems();
    if (fresh) setItems(fresh);
  }

  function newId(): string {
    return `${idPrefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  }

  async function deleteRow(id: string) {
    if (apiPath) {
      const ok = await request<{ ok: boolean }>(
        'DELETE',
        `${apiPath}/${encodeURIComponent(id)}`
      );
      if (!ok) {
        setConfirmingId(null);
        return;
      }
    }
    setItems((prev) => prev.filter((row) => row.id !== id));
    setConfirmingId(null);

    const fresh = await fetchServerItems();
    if (fresh) setItems(fresh);
  }

  async function resetAll() {
    setError(null);
    if (apiPath) {
      const response = await fetch(apiPath);
      const payload = (await response.json().catch(() => ({}))) as {
        items?: T[];
        error?: string;
      };
      if (response.ok && Array.isArray(payload.items)) {
        setItems(payload.items);
        setQuery('');
        setConfirmingId(null);
        return;
      }
      setError(payload.error ?? 'Could not reload from the server.');
    }
    setItems(initialItems);
    setQuery('');
    setConfirmingId(null);
  }

  function setFieldValue(name: string, value: unknown) {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-forest">{title}</h1>
          {description && (
            <p className="mt-1 font-sans text-sm text-text-muted">{description}</p>
          )}
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 font-sans text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-light hover:shadow-lg cursor-pointer"
        >
          <PlusIcon className="h-4 w-4" />
          Add {singular}
        </button>
      </header>

      {error && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
          <p className="font-sans text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="shrink-0 rounded-lg px-2 py-0.5 font-sans text-xs font-medium text-red-500 transition-colors hover:bg-red-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-saffron/40 bg-saffron-light/15 px-4 py-3">
        <p className="font-sans text-sm text-earth-dark">
          {apiPath ? (
            <>
              <strong className="font-semibold">Live:</strong> changes are saved
              to the database and appear on the website.
            </>
          ) : (
            <>
              <strong className="font-semibold">Demo mode:</strong> changes stay
              in this browser tab only and are not saved to the website yet.
            </>
          )}
        </p>
        <button
          onClick={resetAll}
          className="rounded-full border border-saffron-dark px-3 py-1 font-sans text-xs font-medium text-saffron-dark transition-colors hover:bg-saffron hover:text-white cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-beige-dark bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-beige-dark px-5 py-3.5">
          <div className="relative max-w-xs flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}…`}
              className="w-full rounded-full border border-beige-dark bg-beige py-2 pl-9 pr-4 font-sans text-sm focus:border-forest focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-muted"
            />
          </div>
          <span className="shrink-0 font-sans text-sm text-text-muted">
            {visibleItems.length} of {items.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-beige-dark bg-beige/60">
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className="px-5 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-text-muted"
                  >
                    {col.header}
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-sans text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-5 py-10 text-center font-sans text-sm text-text-muted"
                  >
                    Nothing found{query ? ` for “${query}”` : ''}.
                  </td>
                </tr>
              ) : (
                visibleItems.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-beige/70 transition-colors last:border-0 hover:bg-cream-light"
                  >
                    {columns.map((col) => (
                      <td key={col.header} className="px-5 py-3.5 align-middle">
                        <Cell spec={col.cell} row={row} />
                      </td>
                    ))}
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(row)}
                          aria-label={`Edit ${singular}`}
                          title="Edit"
                          className="rounded-lg p-2 text-forest transition-colors hover:bg-forest-muted cursor-pointer"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        {confirmingId === row.id ? (
                          <button
                            onClick={() => deleteRow(row.id)}
                            onBlur={() => setConfirmingId(null)}
                            autoFocus
                            className="rounded-lg bg-red-600 px-2.5 py-1.5 font-sans text-xs font-medium text-white cursor-pointer"
                          >
                            Confirm?
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmingId(row.id)}
                            aria-label={`Delete ${singular}`}
                            title="Delete"
                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 cursor-pointer"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 sm:p-8">
          <h2 className="mb-6 pr-10 font-serif text-2xl font-semibold text-forest">
            {editingId ? `Edit ${singular}` : `Add ${singular}`}
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveDraft();
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {fields.map((field) => (
              <div
                key={field.name}
                className={
                  field.wide || field.type === 'textarea' || field.type === 'lines'
                    ? 'sm:col-span-2'
                    : ''
                }
              >
                <label className="mb-1.5 block font-sans text-sm font-medium text-text">
                  {field.label}
                </label>

                {field.localized ? (
                  <LocalizedInput
                    field={field}
                    value={
                      (draft[field.name] as { en: string; hi: string }) ?? {
                        en: '',
                        hi: '',
                      }
                    }
                    onChange={(value) => setFieldValue(field.name, value)}
                  />
                ) : (
                  <SingleInput
                    field={field}
                    value={draft[field.name]}
                    onChange={(value) => setFieldValue(field.name, value)}
                    onUpload={uploadImage}
                    uploading={uploading}
                  />
                )}
              </div>
            ))}

            <div className="mt-2 flex items-center justify-end gap-3 sm:col-span-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-forest px-5 py-2 font-sans text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-saffron px-6 py-2 font-sans text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-saffron-light hover:shadow-lg cursor-pointer"
              >
                {editingId ? 'Save changes' : `Add ${singular}`}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

function inputClasses(type: FieldType): string {
  return `w-full rounded-xl border border-beige-dark bg-white px-3.5 py-2 font-sans text-sm text-text placeholder:text-text-muted/60 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest-muted ${
    type === 'textarea' || type === 'lines' || type === 'media'
      ? 'min-h-[90px]'
      : ''
  }`;
}

/** Modal grid of library assets; clicking one appends its URL. */
function MediaPickerModal({
  kind,
  open,
  onClose,
  onPick,
}: {
  kind: 'image' | 'video';
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
}) {
  const [assets, setAssets] = useState<MediaAsset[] | null>(null);
  const [error, setError] = useState('');

  function handleOpen() {
    setAssets(null);
    setError('');
    fetch('/api/media')
      .then(async (res) => {
        if (!res.ok) throw new Error(`Library unavailable (${res.status}).`);
        const data = (await res.json()) as { items?: MediaAsset[] };
        setAssets((data.items ?? []).filter((a) => a.kind === kind));
      })
      .catch((err: Error) => setError(err.message));
  }

  useEffect(() => {
    if (open) handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
    >
      <div>
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h3 className="font-serif text-lg font-semibold text-text">
            {kind === 'image' ? 'Pick an image' : 'Pick a video'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-forest hover:bg-saffron-light transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

        {error && (
          <p className="mx-6 mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {!assets && !error && (
          <p className="px-6 py-10 text-center text-sm text-text-muted">
            Loading library…
          </p>
        )}

        {assets && assets.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-text-muted">
            Nothing here yet. Add assets in the Media Library first.
          </p>
        )}

        {assets && assets.length > 0 && (
          <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto p-6 sm:grid-cols-3">
            {assets.map((asset) => {
              const yt = youtubeId(asset.url);
              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onPick(asset.url);
                    onClose();
                  }}
                  className="group overflow-hidden rounded-xl ring-1 ring-black/5 transition-shadow hover:shadow-lg cursor-pointer text-left"
                >
                  <div className="aspect-video w-full overflow-hidden bg-cream">
                    {asset.kind === 'video' && !yt ? (
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
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="truncate px-2.5 py-2 text-xs font-medium text-text">
                    {asset.title || asset.url}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

/** Multi-value media field backed by the shared library. */
function MediaLinesField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const urls: string[] = Array.isArray(value) ? (value as string[]) : [];

  function addUrl(url: string) {
    if (!urls.includes(url)) onChange([...urls, url]);
  }

  return (
    <>
      <textarea
        value={urls.join('\n')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
          )
        }
        placeholder={
          field.placeholder ??
          'One entry per line\nhttps://youtube.com/watch?v=…\n/assets/images/photo.jpg'
        }
        className={`${inputClasses('media')} resize-y`}
      />
      <p className="mt-1 font-sans text-xs text-text-muted">
        One per line — or pick from the{' '}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="font-medium text-forest underline underline-offset-2 hover:text-saffron cursor-pointer"
        >
          Media Library
        </button>
        .
      </p>
      <MediaPickerModal
        kind={field.mediaKind ?? 'image'}
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={addUrl}
      />
    </>
  );
}

function LocalizedInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: { en: string; hi: string };
  onChange: (value: { en: string; hi: string }) => void;
}) {
  if (field.type === 'textarea') {
    return (
      <div className="grid gap-2">
        <textarea
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          placeholder="English"
          className={`${inputClasses('textarea')} resize-y`}
        />
        <textarea
          value={value.hi}
          onChange={(e) => onChange({ ...value, hi: e.target.value })}
          placeholder="हिन्दी"
          lang="hi"
          className={`${inputClasses('textarea')} resize-y`}
        />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      <input
        type="text"
        value={value.en}
        onChange={(e) => onChange({ ...value, en: e.target.value })}
        placeholder="English"
        className={inputClasses('text')}
      />
      <input
        type="text"
        value={value.hi}
        onChange={(e) => onChange({ ...value, hi: e.target.value })}
        placeholder="हिन्दी"
        lang="hi"
        className={inputClasses('text')}
      />
    </div>
  );
}

function SingleInput({
  field,
  value,
  onChange,
  onUpload,
  uploading = false,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  onUpload?: (file: File) => Promise<string | null>;
  uploading?: boolean;
}) {
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`${inputClasses('textarea')} resize-y`}
        />
      );
    case 'lines':
      return (
        <>
          <textarea
            value={Array.isArray(value) ? (value as string[]).join('\n') : ''}
            onChange={(e) =>
              onChange(
                e.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean)
              )
            }
            placeholder={
              field.placeholder ?? 'One entry per line\n/assets/images/photo.jpg'
            }
            className={`${inputClasses('lines')} resize-y`}
          />
          <p className="mt-1 font-sans text-xs text-text-muted">
            {field.hint ?? 'One entry per line.'}
          </p>
        </>
      );
    case 'media':
      return <MediaLinesField field={field} value={value} onChange={onChange} />;
    case 'number':
      return (
        <input
          type="number"
          value={Number(value ?? 0)}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={inputClasses('number')}
        />
      );
    case 'date':
      return (
        <input
          type="date"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses('date')}
        />
      );
    case 'select':
      return (
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClasses('select')} cursor-pointer`}
        >
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case 'boolean':
      return (
        <label className="mt-1 inline-flex cursor-pointer items-center gap-2 font-sans text-sm text-text">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 accent-forest cursor-pointer"
          />
          Enabled
        </label>
      );
    case 'image':
      return (
        <div className="flex items-center gap-3">
          {typeof value === 'string' && value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-11 w-16 shrink-0 rounded-lg border border-beige-dark object-cover"
            />
          ) : (
            <span className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-beige-dark font-sans text-[10px] text-text-muted">
              No img
            </span>
          )}
          <div className="min-w-0 flex-1 space-y-1.5">
            <input
              type="text"
              value={String(value ?? '')}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/assets/images/photo.jpg"
              className={inputClasses('text')}
            />
            {onUpload && (
              <label
                className={`inline-flex cursor-pointer items-center gap-1.5 font-sans text-xs font-medium text-forest transition-colors hover:text-forest-light ${uploading ? 'pointer-events-none opacity-60' : ''}`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  disabled={uploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    const url = await onUpload(file);
                    if (url) onChange(url);
                  }}
                />
                {uploading ? 'Uploading…' : 'Upload image'}
              </label>
            )}
          </div>
        </div>
      );
    default:
      return (
        <input
          type="text"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClasses('text')}
        />
      );
  }
}
