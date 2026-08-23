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

const localizedList: Validator = (v) => {
  if (!Array.isArray(v)) fail('Expected a list of localized text entries');
  return v.map(localizedText);
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
  description: { validate: text(5000, true) },
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
  description: { validate: text(5000, true) },
  location: { validate: localizedText },
  images: { validate: stringList },
  volunteersInvolved: { validate: nullableInt(0) },
  featured: { validate: boolean },
});

export const sevaCategoriesSchema = makeParse({
  title: { validate: localizedText, required: true },
  icon: { validate: text(100, true) },
  image: { validate: text(500, true) },
  description: { validate: text(2000, true) },
  longDescription: { validate: text(8000, true) },
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

// ----------------------------------------------------------- route maker --

/** Strip DB-only columns so returned rows match the TypeScript types. */
function cleanRow(row: Record<string, unknown>): Record<string, unknown> {
  const { created_at, ...rest } = row;
  void created_at;
  return rest;
}

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new ApiError(401, 'Admin authentication required.');
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, 'Request body must be valid JSON');
  }
}

function handleError(error: unknown): Response {
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

function client() {
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
