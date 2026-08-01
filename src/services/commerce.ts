import {
  AppliedCoupon,
  Cart,
  CartItem,
  CartLine,
  CustomerDetails,
  Order,
  PaymentMethod,
  Product,
  ShippingDetails } from
'../types';
import { supabase } from './supabase';
import { toOrder, toProduct } from './mappers';
import { payWithPaystack, verifyPayment } from './paystack';

const CART_KEY = 'sbm.cart';
const COUPON_KEY = 'sbm.coupon';

/* The bag itself stays in localStorage — it is device state, not backend state.
   Product data on each line is always re-read from Supabase so prices and
   stock cannot go stale. */

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {

    /* storage unavailable — cart stays in memory for the session */}
}

async function fetchCartProducts(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from('products').select('*').in('id', ids);
  if (error) throw new Error(error.message);
  return (data ?? []).map(toProduct);
}

async function buildCart(
items: CartItem[],
coupon: AppliedCoupon | null)
: Promise<Cart> {
  const products = await fetchCartProducts(items.map((i) => i.productId));
  const lines: CartLine[] = items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return [];
    return [
    {
      ...item,
      product,
      lineTotal: product.price * item.quantity
    }];

  });
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;
  return {
    lines,
    subtotal,
    coupon: coupon ? { ...coupon, discount } : null,
    total: subtotal - discount
  };
}

export async function getCart(): Promise<Cart> {
  const items = read<CartItem[]>(CART_KEY, []);
  const coupon = read<AppliedCoupon | null>(COUPON_KEY, null);
  return buildCart(items, coupon);
}

export async function saveCart(items: CartItem[]): Promise<Cart> {
  persist(CART_KEY, items);
  const coupon = read<AppliedCoupon | null>(COUPON_KEY, null);
  return buildCart(items, coupon);
}

export async function applyCoupon(
code: string,
subtotal: number)
: Promise<{ok: boolean;message: string;coupon?: AppliedCoupon;}> {
  const { data, error } = await supabase.
  from('coupons').
  select('*').
  ilike('code', code.trim()).
  eq('is_active', true).
  maybeSingle();

  if (error) return { ok: false, message: 'Could not check that code right now.' };
  if (!data) return { ok: false, message: 'That coupon code is not valid.' };
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
    return { ok: false, message: 'That coupon has expired.' };
  }
  if (data.usage_limit > 0 && data.times_used >= data.usage_limit) {
    return { ok: false, message: 'This coupon has been fully redeemed.' };
  }
  if (subtotal < Number(data.min_spend ?? 0)) {
    return {
      ok: false,
      message: `Spend ₦${Number(data.min_spend).toLocaleString()} or more to use ${data.code}.`
    };
  }

  const discount =
  data.type === 'percent' ?
  Math.round(subtotal * Number(data.value) / 100) :
  Number(data.value);
  const applied: AppliedCoupon = { code: data.code, discount };
  persist(COUPON_KEY, applied);
  return { ok: true, message: `${data.code} applied.`, coupon: applied };
}

export async function removeCoupon(): Promise<void> {
  persist(COUPON_KEY, null);
}

export async function clearCart(): Promise<void> {
  persist(CART_KEY, []);
  persist(COUPON_KEY, null);
}

export function getShippingFee(state: string): number {
  if (!state) return 0;
  return state.toLowerCase().includes('lagos') ? 3500 : 6000;
}

export async function createOrder(input: {
  customer: CustomerDetails;
  shipping: ShippingDetails;
  paymentMethod: PaymentMethod;
  cart: Cart;
}): Promise<Order> {
  const { customer, shipping, paymentMethod, cart } = input;
  const shippingFee = getShippingFee(shipping.state);
  const { data: sessionData } = await supabase.auth.getUser();
  const userId = sessionData.user?.id ?? null;

  const payload = {
    user_id: userId,
    customer,
    shipping,
    items: cart.lines.map((line) => ({
      productId: line.product.id,
      name: line.product.name,
      image: line.product.images[0],
      price: line.product.price,
      quantity: line.quantity
    })),
    subtotal: cart.subtotal,
    discount: cart.coupon?.discount ?? 0,
    shipping_fee: shippingFee,
    total: cart.total + shippingFee,
    status: 'pending' as const,
    payment_method: paymentMethod
  };

  const { data, error } = await supabase.
  from('orders').
  insert(payload).
  select('*').
  single();
  if (error) throw new Error(error.message);

  let order = toOrder(data);

  if (cart.coupon) {
    // Best-effort redemption count; never blocks the order.
    await supabase.rpc('redeem_coupon', { coupon_code: cart.coupon.code });
  }

  if (paymentMethod === 'online') {
    const result = await payWithPaystack({
      email: customer.email,
      amount: order.total,
      reference: order.reference,
      metadata: { order_id: order.id, reference: order.reference }
    });

    if (result.status === 'success' && result.reference) {
      // The Edge Function verifies with Paystack's secret key and, when the
      // charge is genuine, sets status='processing' + payment_reference.
      await verifyPayment(result.reference);
      const refreshed = await supabase.
      from('orders').
      select('*').
      eq('id', order.id).
      maybeSingle();
      if (refreshed.data) order = toOrder(refreshed.data);
    }
    // Cancelled or unavailable: the order stays 'pending' so it can be
    // recovered/paid later, exactly like a WhatsApp order.
  }

  await clearCart();
  return order;
}

export function buildWhatsAppLink(order: Order): string {
  const lines = order.items.
  map((i) => `• ${i.name} ×${i.quantity} — ₦${i.price.toLocaleString()}`).
  join('%0A');
  const message = [
  `Hello Scent by Motun! I'd like to place order ${order.reference}.`,
  '',
  lines,
  '',
  `Subtotal: ₦${order.subtotal.toLocaleString()}`,
  `Delivery: ₦${order.shippingFee.toLocaleString()}`,
  `Total: ₦${order.total.toLocaleString()}`,
  '',
  `Name: ${order.customer.fullName}`,
  `Phone: ${order.customer.phone}`,
  `Address: ${order.shipping.street}, ${order.shipping.city}, ${order.shipping.state}`].
  join('%0A');
  return `https://wa.me/2348030001122?text=${message.replace(/\n/g, '%0A')}`;
}
