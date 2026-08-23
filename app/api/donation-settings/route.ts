import {
  ApiError,
  client,
  donationSettingsSchema,
  handleError,
  readJsonBody,
  requireAdmin,
} from '@/lib/collection-api';

export const runtime = 'nodejs';

/**
 * PUT /api/donation-settings — admin only. Upserts the singleton row
 * (id = 'default') holding the UPI ID, QR code and trust details.
 */
export async function PUT(request: Request): Promise<Response> {
  try {
    await requireAdmin();
    const fields = donationSettingsSchema(await readJsonBody(request), 'update');
    if (Object.keys(fields).length === 0) {
      throw new ApiError(400, 'No valid fields to update');
    }

    const { data, error } = await client()
      .from('donation_settings')
      .upsert({ id: 'default', ...fields })
      .select('*')
      .single();
    if (error) throw new ApiError(500, error.message);

    const { created_at: _created, id: _id, ...settings } = data;
    void _created;
    void _id;
    return Response.json({ item: settings });
  } catch (error) {
    return handleError(error);
  }
}
