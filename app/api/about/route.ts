import {
  aboutContentSchema,
  ApiError,
  client,
  handleError,
  readJsonBody,
  requireAdmin,
} from '@/lib/collection-api';
import { isSupabaseConfigured, getSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

/**
 * GET /api/about — public. Returns the stored content document, or null
 * when nothing has been saved yet (the site then uses bundled translations).
 */
export async function GET(): Promise<Response> {
  try {
    if (!isSupabaseConfigured()) return Response.json({ content: null });
    const { data, error } = await getSupabase()
      .from('about_content')
      .select('content')
      .eq('id', 'default')
      .maybeSingle();
    if (error) throw new ApiError(500, error.message);
    return Response.json({ content: data?.content ?? null });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/about — admin only. Upserts the full content document
 * (id = 'default'); blank fields fall back to bundled translations.
 */
export async function PUT(request: Request): Promise<Response> {
  try {
    await requireAdmin();
    // 'create' mode enforces every key: the whole document is replaced.
    const fields = aboutContentSchema(await readJsonBody(request), 'create');

    const { data, error } = await client()
      .from('about_content')
      .upsert({ id: 'default', content: fields })
      .select('content')
      .single();
    if (error) throw new ApiError(500, error.message);

    return Response.json({ item: data.content });
  } catch (error) {
    return handleError(error);
  }
}
