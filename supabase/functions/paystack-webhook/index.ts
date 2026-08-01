/**
 * Paystack webhook + verification endpoint.
 *
 * Deploy:  supabase functions deploy paystack-webhook --no-verify-jwt
 * Secrets: supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxx
 *
 * Two jobs:
 *  1. POST from Paystack (charge.success) — signature checked with HMAC SHA512.
 *  2. POST { action: "verify", reference } from the storefront — re-checks the
 *     transaction with Paystack's verify API so the shopper doesn't wait on
 *     webhook delivery.
 *
 * Either way, a genuine successful charge sets the matching order to
 * status='processing' and stores payment_reference.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PAYSTACK_SECRET = Deno.env.get('PAYSTACK_SECRET_KEY') ?? '';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } }
);

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' }
  });
}

async function hmacSha512(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig)).
  map((b) => b.toString(16).padStart(2, '0')).
  join('');
}

async function markPaid(reference: string, amountKobo: number | null) {
  const { data: order } = await admin.
  from('orders').
  select('id,total,status').
  eq('reference', reference).
  maybeSingle();

  if (!order) return { ok: false, reason: 'order-not-found' };

  // Guard against a mismatched amount (tampered client-side payload).
  if (amountKobo !== null && Math.round(Number(order.total) * 100) !== amountKobo) {
    return { ok: false, reason: 'amount-mismatch' };
  }

  if (order.status === 'pending') {
    await admin.
    from('orders').
    update({ status: 'processing', payment_reference: reference }).
    eq('id', order.id);
  }
  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!PAYSTACK_SECRET) return json({ error: 'PAYSTACK_SECRET_KEY not set' }, 500);

  const raw = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  /* ---- 1. Webhook call from Paystack ---- */
  if (signature) {
    const expected = await hmacSha512(PAYSTACK_SECRET, raw);
    if (expected !== signature) return json({ error: 'Invalid signature' }, 401);

    const event = JSON.parse(raw);
    if (event?.event === 'charge.success') {
      const result = await markPaid(
        event.data?.reference,
        typeof event.data?.amount === 'number' ? event.data.amount : null
      );
      return json(result);
    }
    return json({ ignored: event?.event ?? 'unknown' });
  }

  /* ---- 2. Verification call from the storefront ---- */
  let body: { action?: string; reference?: string } = {};
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  if (body.action !== 'verify' || !body.reference) {
    return json({ error: 'Unsupported request' }, 400);
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(body.reference)}`,
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
  );
  const payload = await res.json();
  if (!payload?.status || payload?.data?.status !== 'success') {
    return json({ verified: false });
  }

  const result = await markPaid(payload.data.reference, payload.data.amount ?? null);
  return json({ verified: result.ok, ...result });
});
