import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getSupabase, isSupabaseConfigured, MEDIA_BUCKET } from '@/lib/supabase';

export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      {
        error:
          'Image storage not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      },
      { status: 503 }
    );
  }
  if (!(await isAdminAuthenticated())) {
    return Response.json(
      { error: 'Admin authentication required.' },
      { status: 401 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: 'Expected multipart/form-data with a "file" field.' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return Response.json(
      { error: 'Missing "file" field.' },
      { status: 400 }
    );
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return Response.json(
      {
        error: `Unsupported file type "${file.type || 'unknown'}". Allowed: ${Object.keys(ALLOWED_TYPES).join(', ')}.`,
      },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: `File too large (max ${MAX_BYTES / (1024 * 1024)} MB).` },
      { status: 413 }
    );
  }

  const path = `uploads/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = new Uint8Array(await file.arrayBuffer());

  const { error } = await getSupabase()
    .storage.from(MEDIA_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error('[api/upload]', error);
    return Response.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }

  const { data } = getSupabase()
    .storage.from(MEDIA_BUCKET)
    .getPublicUrl(path);

  return Response.json({ url: data.publicUrl, path }, { status: 201 });
}
