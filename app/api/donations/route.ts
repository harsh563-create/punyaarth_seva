import {
  ApiError,
  client,
  donationSubmissionSchema,
  handleError,
  requireAdmin,
} from '@/lib/collection-api';

export const runtime = 'nodejs';

const MAX_PROOF_BYTES = 5 * 1024 * 1024; // 5 MB

const PROOF_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_AMOUNT = 10_000_000;

/** GET /api/donations — admin only. Newest submissions first. */
export async function GET(): Promise<Response> {
  try {
    await requireAdmin();
    const { data, error } = await client()
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });
    if (error) throw new ApiError(500, error.message);
    const items = (data ?? []).map((row: Record<string, unknown>) => ({
      ...row,
      createdAt: row.created_at,
    }));
    return Response.json({ items });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/donations — public payment confirmation.
 * Accepts multipart/form-data (with optional screenshot) or plain JSON.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    let fields: Record<string, unknown>;
    let proof: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      let form: FormData;
      try {
        form = await request.formData();
      } catch {
        throw new ApiError(400, 'Invalid form submission');
      }

      // Honeypot: bots fill every field. Pretend success, store nothing.
      if (String(form.get('website') ?? '')) {
        return Response.json({ ok: true }, { status: 201 });
      }

      fields = Object.fromEntries(
        ['donorName', 'mobile', 'amount', 'utr'].map((key) => [
          key,
          String(form.get(key) ?? ''),
        ])
      );
      const maybeFile = form.get('screenshot');
      if (maybeFile instanceof File && maybeFile.size > 0) {
        proof = maybeFile;
      }
    } else {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        throw new ApiError(400, 'Request body must be valid');
      }
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new ApiError(400, 'Expected a JSON object');
      }
      const input = body as Record<string, unknown>;
      if (String(input.website ?? '')) {
        return Response.json({ ok: true }, { status: 201 });
      }
      fields = {
        donorName: input.donorName,
        mobile: input.mobile,
        amount: input.amount,
        utr: input.utr,
      };
    }

    const values = donationSubmissionSchema(fields, 'create') as Record<
      string,
      unknown
    >;
    if (Number(values.amount) > MAX_AMOUNT) {
      throw new ApiError(400, 'Amount is too large');
    }

    // Validate the screenshot before touching storage or the database.
    if (proof && (!PROOF_TYPES[proof.type] || proof.size > MAX_PROOF_BYTES)) {
      throw new ApiError(
        proof.size > MAX_PROOF_BYTES ? 413 : 415,
        proof.size > MAX_PROOF_BYTES
          ? 'Screenshot must be under 5 MB.'
          : 'Screenshot must be a JPG, PNG or WebP image.'
      );
    }

    const db = client();
    let proofPath = '';
    if (proof) {
      proofPath = `proofs/${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${PROOF_TYPES[proof.type]}`;
      const buffer = new Uint8Array(await proof.arrayBuffer());
      const { error } = await db.storage
        .from('payment-proofs')
        .upload(proofPath, buffer, { contentType: proof.type, upsert: false });
      if (error) {
        console.error('[api/donations] proof upload:', error);
        throw new ApiError(500, 'Could not store the payment screenshot.');
      }
    }

    const id = `don-${Date.now().toString(36)}${Math.floor(
      Math.random() * 1000
    )}`;
    const { error } = await db.from('donations').insert({
      id,
      donorName: values.donorName,
      mobile: values.mobile,
      amount: values.amount,
      utr: values.utr,
      screenshot: proofPath,
      status: 'pending',
    });
    if (error) throw new ApiError(500, error.message);

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
