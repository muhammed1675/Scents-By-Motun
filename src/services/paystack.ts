import { PAYSTACK_PUBLIC_KEY, supabase } from './supabase';

/**
 * Paystack inline checkout (test mode).
 *
 * The public key is safe in the browser. Verification never happens here —
 * the `paystack-webhook` Supabase Edge Function verifies the transaction with
 * the secret key and flips the order to `processing`. The client-side call to
 * `verifyPayment` below simply asks that same function to re-check straight
 * away so the shopper does not wait on webhook delivery.
 */

const SCRIPT_SRC = 'https://js.paystack.co/v1/inline.js';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

function loadPaystack(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No browser'));
  if (window.PaystackPop) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    const script = existing ?? document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () =>
    reject(new Error('Could not load Paystack.'))
    );
    if (!existing) document.body.appendChild(script);
  });
}

export interface PaystackResult {
  status: 'success' | 'cancelled' | 'unavailable';
  reference?: string;
}

/** Opens the Paystack popup and resolves once the shopper finishes or closes it. */
export async function payWithPaystack(input: {
  email: string;
  amount: number; // naira
  reference: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackResult> {
  if (!PAYSTACK_PUBLIC_KEY) {
    console.warn('[Paystack] VITE_PAYSTACK_PUBLIC_KEY is not set — skipping payment step.');
    return { status: 'unavailable' };
  }
  await loadPaystack();
  if (!window.PaystackPop) return { status: 'unavailable' };

  return new Promise<PaystackResult>((resolve) => {
    const handler = window.PaystackPop!.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: input.email,
      amount: Math.round(input.amount * 100), // kobo
      currency: 'NGN',
      ref: input.reference,
      metadata: input.metadata ?? {},
      callback: (response: { reference: string }) => {
        resolve({ status: 'success', reference: response.reference });
      },
      onClose: () => resolve({ status: 'cancelled' })
    });
    handler.openIframe();
  });
}

/** Asks the Edge Function to verify a reference with Paystack and update the order. */
export async function verifyPayment(reference: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('paystack-webhook', {
      body: { action: 'verify', reference }
    });
    if (error) return false;
    return !!(data as { verified?: boolean } | null)?.verified;
  } catch {
    return false;
  }
}
