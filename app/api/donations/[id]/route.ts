import {
  ApiError,
  client,
  donationUpdateSchema,
  handleError,
  readJsonBody,
  requireAdmin,
} from '@/lib/collection-api';

export const runtime = 'nodejs';

const ID_RE = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;

/** PATCH /api/donations/[id] — admin only. Currently toggles verify status. */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!ID_RE.test(id)) throw new ApiError(400, 'Invalid id');

    const fields = donationUpdateSchema(await readJsonBody(request), 'update');
    if (Object.keys(fields).length === 0) {
      throw new ApiError(400, 'No valid fields to update');
    }

    const { data, error } = await client()
      .from('donations')
      .update(fields)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) throw new ApiError(500, error.message);
    if (!data) throw new ApiError(404, `Donation "${id}" not found`);
    return Response.json({
      item: { ...data, createdAt: (data as Record<string, unknown>).created_at },
    });
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/donations/[id] — admin only. */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!ID_RE.test(id)) throw new ApiError(400, 'Invalid id');

    const { data, error } = await client()
      .from('donations')
      .delete()
      .eq('id', id)
      .select('id, screenshot')
      .maybeSingle();
    if (error) throw new ApiError(500, error.message);
    if (!data) throw new ApiError(404, `Donation "${id}" not found`);

    // Best-effort cleanup of the private screenshot.
    const path = (data as Record<string, unknown>).screenshot;
    if (typeof path === 'string' && path) {
      await client().storage.from('payment-proofs').remove([path]);
    }
    return Response.json({ ok: true, id });
  } catch (error) {
    return handleError(error);
  }
}
