import { ApiError, client, handleError, requireAdmin } from '@/lib/collection-api';

export const runtime = 'nodejs';

function csvCell(value: unknown): string {
  const s = String(value ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * GET /api/donations/export — admin only. CSV download of all submissions
 * (BOM-prefixed so Excel opens UTF-8 names correctly).
 */
export async function GET(): Promise<Response> {
  try {
    await requireAdmin();
    const { data, error } = await client()
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });
    if (error) throw new ApiError(500, error.message);

    const header = ['id', 'date', 'donorName', 'mobile', 'amount', 'utr', 'status'];
    const rows = (data ?? []).map((row: Record<string, unknown>) =>
      [
        row.id,
        row.created_at,
        row.donorName,
        row.mobile,
        row.amount,
        row.utr,
        row.status,
      ]
        .map(csvCell)
        .join(',')
    );
    const csv = '\uFEFF' + [header.join(','), ...rows].join('\r\n');

    const stamp = new Date().toISOString().slice(0, 10);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="punyaarth-donations-${stamp}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
