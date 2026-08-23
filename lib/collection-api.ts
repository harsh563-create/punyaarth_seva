import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Shared plumbing for the /api collection routes: auth guard, JSON
 * validation, and generic list/create/item handlers backed by Supabase.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export type Mode = 'create' | 'update';
export type ParseFn = (body: unknown, mode: Mode) => Record<string, unknown>;

type Validator = (value: unknown) => unknown;

interface FieldSpec {
  validate: Validator;
  required?: boolean;
}

const ID_RE = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;

// ------------------------------------------------------------ validators --

function fail(message: string): never {
  throw new ApiError(400, message);
}

const localizedText: Validator = (v) => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    fail('Expected localized text like { "en": "...", "hi": "..." }');
  }
  const o = v as Record<string, unknown>;
  return {
    en: typeof o.en === 'string' ? o.en.trim() : '',
    hi: typeof o.hi === 'string' ? o.hi.trim() : '',
  };
};

function text(maxLength = 5000, allowEmpty = false): Validator {
  return (v) => {
    if (typeof v !== 'string') fail('Expected a string');
    const t = v.trim();
    if (!allowEmpty && !t) fail('Value cannot be empty');
    if (t.length > maxLength) fail(`Value exceeds ${maxLength} characters`);
    return t;
  };
}

function integer(min = Number.MIN_SAFE_INTEGER): Validator {
  return (v) => {
    const n = typeof v === 'number' ? v : Number(String(v ?? '').trim());
    if (v === null || v === '' || !Number.isFinite(n) || !Number.isInteger(n)) {
      fail('Expected an integer');
    }
    if (n < min) fail(`Must be at least ${min}`);
    return n;
  };
}

const nullableInt = (min = 0): Validator => (v) =>
  v === null || v === undefined || v === '' ? null : integer(min)(v);

const boolean: Validator = (v) => {
  if (typeof v !== 'boolean') fail('Expected true or false');
  return v;
};

const stringList: Validator = (v) => {
  if (!Array.isArray(v)) fail('Expected a list of strings');
  return v.map((item) => {
    if (typeof item !== 'string') fail('Expected a list of strings');
    const t = item.trim();
    if (!t) fail('List entries cannot be empty');
    return t;
  });
};

function oneOf(options: readonly string[]): Validator {
  return (v) => {
    if (typeof v !== 'string' || !options.includes(v)) {
      fail(`Expected one of: ${options.join(', ')}`);
    }
    return v;
  };
}

/** Digits-only value of 10–13 characters (allows +91 style input). */
const phone: Validator = (v) => {
  if (typeof v !== 'string' || !v.trim()) fail('Mobile number is required');
  const digits = v.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) {
    fail('Enter a valid mobile number');
  }
  return digits;
};

/** Alphanumeric bank reference such as a 12-digit UTR. */
const transactionRef: Validator = (v) => {
  const t = typeof v === 'string' ? v.trim() : '';
  if (!/^[A-Za-z0-9-]{4,60}$/.test(t)) {
    fail('Enter a valid UTR / transaction reference');
  }
  return t;
};

/** Strict-ish VPA check, e.g. "punyaarthseva@upi". Empty allowed (unset). */
export const upiId: Validator = (v) => {
  const t = typeof v === 'string' ? v.trim().toLowerCase() : '';
  if (!t) return '';
  if (!/^[a-z0-9._-]{2,64}@[a-z]{2,32}$/.test(t)) {
    fail('Enter a valid UPI ID (e.g. yourname@upi)');
  }
  return t;
};

const localizedList: Validator = (v) => {
  if (!Array.isArray(v)) fail('Expected a list of localized text entries');
  return v.map(localizedText);
};

/** List of { title, description } blocks with both languages. */
const localizedItemList: Validator = (v) => {
  if (!Array.isArray(v)) fail('Expected a list of items');
  return v.map((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      fail('Each item must be an object with title and description');
    }
    const o = entry as Record<string, unknown>;
    return {
      title: localizedText(o.title),
      description: localizedText(o.description),
    };
  });
};

// ---------------------------------------------------------------- schemas --

function makeParse(specs: Record<string, FieldSpec>): ParseFn {
  return (body, mode) => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      fail('Expected a JSON object');
    }
    const input = body as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [key, spec] of Object.entries(specs)) {
      const present = key in input;
      if (!present) {
        if (mode === 'create' && spec.required) {
          fail(`Missing required field "${key}"`);
        }
        continue;
      }
      out[key] = spec.validate(input[key]);
    }
    return out;
  };
}

const CATEGORIES = [
  'food-seva',
  'nature',
  'animals',
  'community',
  'events',
  'awareness',
] as const;

export const eventsSchema = makeParse({
  title: { validate: localizedText, required: true },
  date: { validate: text(20), required: true },
  description: { validate: localizedText },
  location: { validate: localizedText },
  image: { validate: text(500, true) },
  status: { validate: oneOf(['upcoming', 'past']) },
  volunteersNeeded: { validate: nullableInt(0) },
  volunteersJoined: { validate: nullableInt(0) },
});

export const activitiesSchema = makeParse({
  title: { validate: localizedText, required: true },
  date: { validate: text(20), required: true },
  category: { validate: oneOf(CATEGORIES), required: true },
  description: { validate: localizedText },
  location: { validate: localizedText },
  images: { validate: stringList },
  videos: { validate: stringList },
  volunteersInvolved: { validate: nullableInt(0) },
  featured: { validate: boolean },
});

export const sevaCategoriesSchema = makeParse({
  title: { validate: localizedText, required: true },
  icon: { validate: text(100, true) },
  image: { validate: text(500, true) },
  description: { validate: localizedText },
  longDescription: { validate: localizedText },
  activities: { validate: localizedList },
});

export const galleryImagesSchema = makeParse({
  src: { validate: text(500), required: true },
  alt: { validate: localizedText, required: true },
  category: { validate: oneOf(CATEGORIES), required: true },
  date: { validate: text(20, true) },
});

export const impactStatsSchema = makeParse({
  label: { validate: localizedText, required: true },
  value: { validate: integer(0), required: true },
  suffix: { validate: text(10, true) },
  icon: { validate: text(100, true) },
});

/** Public donor payment confirmation (POST /api/donations). */
export const donationSubmissionSchema = makeParse({
  donorName: { validate: text(120), required: true },
  mobile: { validate: phone, required: true },
  amount: { validate: integer(1), required: true },
  utr: { validate: transactionRef, required: true },
  screenshot: { validate: text(500, true) },
});

/** Admin-only status changes (PATCH /api/donations/[id]). */
export const donationUpdateSchema = makeParse({
  status: { validate: oneOf(['pending', 'verified']) },
});

/** Donation page configuration (PUT /api/donation-settings). */
export const donationSettingsSchema = makeParse({
  upiId: { validate: upiId },
  payeeName: { validate: text(120, true) },
  qrImage: { validate: text(500, true) },
  orgName: { validate: text(160, true) },
  registrationDetails: { validate: text(400, true) },
  taxExemptionDetails: { validate: text(400, true) },
  contactEmail: { validate: text(160, true) },
  contactPhone: { validate: text(40, true) },
});

/** Optional member phone — empty allowed, digits-only when present. */
const optionalPhone: Validator = (v) => {
  if (v === null || v === undefined || v === '') return '';
  const t = typeof v === 'string' ? v.trim() : '';
  if (!t) return '';
  const digits = t.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) {
    fail('Enter a valid mobile number');
  }
  return digits;
};

export const MEMBER_CATEGORIES = ['leadership', 'core', 'volunteer'] as const;

/** Team member profile (POST/PUT /api/team). */
export const teamSchema = makeParse({
  name: { validate: text(120), required: true },
  designation: { validate: localizedText, required: true },
  category: { validate: oneOf(MEMBER_CATEGORIES) },
  bio: { validate: localizedText },
  photo: { validate: text(500, true) },
  socials: { validate: stringList },
  phone: { validate: optionalPhone },
  showPhone: { validate: boolean },
  active: { validate: boolean },
  publicProfile: { validate: boolean },
  orderIndex: { validate: integer(0) },
});

/**
 * About page narrative (PUT /api/about). Stored as a single jsonb document,
 * so every key is required — partial saves would silently drop blocks.
 */
export const aboutContentSchema = makeParse({
  storyP1: { validate: localizedText, required: true },
  storyP2: { validate: localizedText, required: true },
  storyP3: { validate: localizedText, required: true },
  storyImage: { validate: text(500, true), required: true },
  visionQuote: { validate: localizedText, required: true },
  missionItems: { validate: localizedItemList, required: true },
  valuesItems: { validate: localizedItemList, required: true },
  ctaTitle: { validate: localizedText, required: true },
  ctaText: { validate: localizedText, required: true },
});

// ----------------------------------------------------------- route maker --

/** Strip DB-only columns so returned rows match the TypeScript types. */
function cleanRow(row: Record<string, unknown>): Record<string, unknown> {
  const { created_at, ...rest } = row;
  void created_at;
  return rest;
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new ApiError(401, 'Admin authentication required.');
  }
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, 'Request body must be valid JSON');
  }
}

export function handleError(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error('[api]', error);
  const message =
    error instanceof Error ? error.message : 'Unexpected server error';
  return Response.json({ error: message }, { status: 500 });
}

function assertConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new ApiError(
      503,
      'Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }
}

/** Configured service-role client; throws 503 when Supabase is unset. */
export function client() {
  assertConfigured();
  return getSupabase();
}

export interface CollectionConfig {
  /** Supabase table name. */
  table: string;
  /** Prefix used when generating ids for new rows. */
  idPrefix: string;
  parse: ParseFn;
}

export function createCollectionRoutes(config: CollectionConfig) {
  const { table, idPrefix, parse } = config;

  async function GET(): Promise<Response> {
    try {
      const { data, error } = await client()
        .from(table)
        .select('*')
        .order('created_at', { ascending: true })
        .order('id', { ascending: true });
      if (error) throw new ApiError(500, error.message);
      return Response.json({ items: (data ?? []).map(cleanRow) });
    } catch (error) {
      return handleError(error);
    }
  }

  async function POST(request: Request): Promise<Response> {
    try {
      await requireAdmin();
      const body = (await readJsonBody(request)) as Record<string, unknown>;
      const fields = parse(body, 'create');

      let id: unknown = body.id;
      if (typeof id !== 'string' || !ID_RE.test(id)) {
        id = `${idPrefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
      }

      const { data, error } = await client()
        .from(table)
        .insert({ ...(fields as object), id })
        .select('*')
        .single();
      if (error) throw new ApiError(500, error.message);
      return Response.json({ item: cleanRow(data) }, { status: 201 });
    } catch (error) {
      return handleError(error);
    }
  }

  return { GET, POST };
}

export function createItemRoutes(config: CollectionConfig) {
  const { table, parse } = config;

  async function mutate(
    request: Request,
    context: { params: Promise<{ id: string }> },
    mode: Mode
  ): Promise<Response> {
    try {
      await requireAdmin();
      const { id } = await context.params;
      if (!ID_RE.test(id)) throw new ApiError(400, 'Invalid id');

      const body = await readJsonBody(request);
      const fields = parse(body, mode);
      if (Object.keys(fields).length === 0) {
        throw new ApiError(400, 'No valid fields to update');
      }

      const { data, error } = await client()
        .from(table)
        .update(fields)
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) throw new ApiError(500, error.message);
      if (!data) throw new ApiError(404, `${table}: "${id}" not found`);
      return Response.json({ item: cleanRow(data) });
    } catch (error) {
      return handleError(error);
    }
  }

  const PUT = (request: Request, context: { params: Promise<{ id: string }> }) =>
    mutate(request, context, 'create');

  const PATCH = (
    request: Request,
    context: { params: Promise<{ id: string }> }
  ) => mutate(request, context, 'update');

  async function DELETE(
    _request: Request,
    context: { params: Promise<{ id: string }> }
  ): Promise<Response> {
    try {
      await requireAdmin();
      const { id } = await context.params;
      if (!ID_RE.test(id)) throw new ApiError(400, 'Invalid id');

      const { data, error } = await client()
        .from(table)
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();
      if (error) throw new ApiError(500, error.message);
      if (!data) throw new ApiError(404, `${table}: "${id}" not found`);
      return Response.json({ ok: true, id });
    } catch (error) {
      return handleError(error);
    }
  }

  return { PUT, PATCH, DELETE };
}
