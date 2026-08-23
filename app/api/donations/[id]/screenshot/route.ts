import { ApiError, client, handleError, requireAdmin } from '@/lib/collection-api';

export const runtime = 'nodejs';

const ID_RE = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;

/**
 * GET /api/donations/[id]/screenshot — admin only. Streams the private
 * payment screenshot from the payment-proofs bucket.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!ID_RE.test(id)) throw new ApiError(400, 'Invalid id');

    const { data, error } = await client()
      .from('donations')
      .select('screenshot')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new ApiError(500, error.message);
    const path = data?.screenshot as string | undefined;
    if (!path) throw new ApiError(404, 'No screenshot attached');

    const { data: blob, error: storageError } = await client()
      .storage.from('payment-proofs')
      .download(path);
    if (storageError || !blob) throw new ApiError(404, 'Screenshot not found');

    return new Response(blob, {
      headers: {
        'Content-Type': blob.type || 'application/octet-stream',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
