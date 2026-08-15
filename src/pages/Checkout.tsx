import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, CreditCard, MessageCircle } from 'lucide-react';
import { Order, PaymentMethod } from '../types';
import { nigerianStates } from '../data/nigeria';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { buildWhatsAppLink, createOrder, getShippingFee } from '../services';
import { formatNaira } from '../utils/format';
import { PageHeader } from '../components/PageHeader';
import { Field, SelectInput, TextArea, TextInput } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/Loading';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  notes: string;
}

export function Checkout() {
  const { cart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    street: user?.addresses[0]?.street ?? '',
    city: user?.addresses[0]?.city ?? '',
    state: user?.addresses[0]?.state ?? 'Lagos',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState<PaymentMethod | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const shippingFee = getShippingFee(form.state);
  const grandTotal = cart.total + shippingFee;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = 'Enter your full name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
    next.email = 'Enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 10)
    next.phone = 'Enter a valid phone number.';
    if (!form.street.trim()) next.street = 'Enter your street address.';
    if (!form.city.trim()) next.city = 'Enter your city.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function placeOrder(paymentMethod: PaymentMethod) {
    if (!validate()) {
      document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setSubmitting(paymentMethod);
    const order = await createOrder({
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone
      },
      shipping: {
        street: form.street,
        city: form.city,
        state: form.state,
        country: 'Nigeria',
        notes: form.notes
      },
      paymentMethod,
      cart
    });
    setSubmitting(null);
    setPlacedOrder(order);
    if (paymentMethod === 'whatsapp') {
      window.open(buildWhatsAppLink(order), '_blank', 'noopener');
    }
  }

  if (placedOrder) {
    return (
      <div className="w-full bg-ivory">
        <PageHeader title="Order received" crumbs={[{ label: 'Checkout' }]} />
        <div className="container py-14">
          <div className="mx-auto max-w-lg rounded-sm border border-cocoa/10 bg-white p-8 text-center">
            <CheckCircle2 size={40} className="mx-auto text-[#2F5D3A]" />
            <h2 className="mt-4 font-heading text-2xl text-ink">
              Thank you, {placedOrder.customer.fullName.split(' ')[0]}
            </h2>
            <p className="mt-2 text-sm text-cocoa/75">
              Your order{' '}
              <span className="font-medium text-cocoa">
                {placedOrder.reference}
              </span>{' '}
              has been received.{' '}
              {placedOrder.paymentMethod === 'whatsapp' ?
              'We have opened WhatsApp so you can confirm the details with our team.' :
              'A payment link has been sent to your email — the online payment provider is being finalised.'}
            </p>
            <dl className="mt-6 space-y-2 border-y border-cocoa/10 py-5 text-left text-sm">
              <div className="flex justify-between">
                <dt className="text-cocoa/70">Items</dt>
                <dd>{formatNaira(placedOrder.subtotal)}</dd>
              </div>
              {placedOrder.discount > 0 &&
              <div className="flex justify-between text-[#2F5D3A]">
                  <dt>Discount</dt>
                  <dd>−{formatNaira(placedOrder.discount)}</dd>
                </div>
              }
              <div className="flex justify-between">
                <dt className="text-cocoa/70">Delivery</dt>
                <dd>{formatNaira(placedOrder.shippingFee)}</dd>
              </div>
              <div className="flex justify-between font-semibold text-ink">
                <dt>Total</dt>
                <dd>{formatNaira(placedOrder.total)}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button to="/account?tab=orders" variant="outline">
                View my orders
              </Button>
              <Button to="/shop">Keep shopping</Button>
            </div>
          </div>
        </div>
      </div>);

  }

  if (cart.lines.length === 0) {
    return (
      <div className="w-full bg-ivory">
        <PageHeader title="Checkout" crumbs={[{ label: 'Checkout' }]} />
        <div className="container py-14">
          <EmptyState
            title="Nothing to check out yet"
            description="Add a bottle to your bag and come back to complete your order."
            action={<Button to="/shop">Shop all products</Button>} />
          
        </div>
      </div>);

  }

  return (
    <div className="w-full bg-ivory">
      <PageHeader
        title="Checkout"
        crumbs={[{ label: 'Bag', to: '/cart' }, { label: 'Checkout' }]} />
      

      <div className="container grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
        <form
          id="checkout-form"
          onSubmit={(e) => e.preventDefault()}
          className="space-y-10">
          
          <section aria-labelledby="customer-heading">
            <h2
              id="customer-heading"
              className="font-heading text-xl text-ink">
              
              1. Your details
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field
                label="Full name"
                htmlFor="fullName"
                required
                error={errors.fullName}
                className="sm:col-span-2">
                
                <TextInput
                  id="fullName"
                  value={form.fullName}
                  autoComplete="name"
                  onChange={(e) => set('fullName', e.target.value)} />
                
              </Field>
              <Field label="Email" htmlFor="email" required error={errors.email}>
                <TextInput
                  id="email"
                  type="email"
                  value={form.email}
                  autoComplete="email"
                  onChange={(e) => set('email', e.target.value)} />
                
              </Field>
              <Field
                label="Phone"
                htmlFor="phone"
                required
                error={errors.phone}
                hint="We use this for delivery updates on WhatsApp.">
                
                <TextInput
                  id="phone"
                  type="tel"
                  value={form.phone}
                  autoComplete="tel"
                  placeholder="+234 800 000 0000"
                  onChange={(e) => set('phone', e.target.value)} />
                
              </Field>
            </div>
          </section>

          <section aria-labelledby="shipping-heading">
            <h2
              id="shipping-heading"
              className="font-heading text-xl text-ink">
              
              2. Shipping address
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field
                label="Street address"
                htmlFor="street"
                required
                error={errors.street}
                className="sm:col-span-2">
                
                <TextInput
                  id="street"
                  value={form.street}
                  autoComplete="street-address"
                  onChange={(e) => set('street', e.target.value)} />
                
              </Field>
              <Field label="City" htmlFor="city" required error={errors.city}>
                <TextInput
                  id="city"
                  value={form.city}
                  autoComplete="address-level2"
                  onChange={(e) => set('city', e.target.value)} />
                
              </Field>
              <Field label="State" htmlFor="state" required>
                <SelectInput
                  id="state"
                  value={form.state}
                  onChange={(e) => set('state', e.target.value)}>
                  
                  {nigerianStates.map((s) =>
                  <option key={s} value={s}>
                      {s}
                    </option>
                  )}
                </SelectInput>
              </Field>
              <Field
                label="Delivery notes"
                htmlFor="notes"
                className="sm:col-span-2"
                hint="Landmarks, gate colour, best time to call.">
                
                <TextArea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)} />
                
              </Field>
            </div>
          </section>

          <section aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="font-heading text-xl text-ink">
              3. How would you like to pay?
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-cocoa/15 bg-white p-5">
                <CreditCard size={20} className="text-gold" />
                <h3 className="mt-3 font-heading text-lg text-ink">
                  Pay online
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-cocoa/70">
                  Card, bank transfer or USSD. Payment provider is being
                  finalised — you will receive a secure link by email.
                </p>
                <Button
                  onClick={() => placeOrder('online')}
                  disabled={submitting !== null}
                  fullWidth
                  className="mt-4">
                  
                  {submitting === 'online' ? 'Placing order…' : 'Pay online'}
                </Button>
              </div>

              <div className="rounded-sm border border-cocoa/15 bg-white p-5">
                <MessageCircle size={20} className="text-[#25D366]" />
                <h3 className="mt-3 font-heading text-lg text-ink">
                  Order via WhatsApp
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-cocoa/70">
                  We open a chat with your order pre-filled. Confirm, transfer,
                  and we dispatch the same day.
                </p>
                <Button
                  onClick={() => placeOrder('whatsapp')}
                  disabled={submitting !== null}
                  variant="secondary"
                  fullWidth
                  className="mt-4">
                  
                  {submitting === 'whatsapp' ?
                  'Opening WhatsApp…' :
                  'Order via WhatsApp'}
                </Button>
              </div>
            </div>
          </section>
        </form>

        <aside className="h-fit rounded-sm border border-cocoa/10 bg-cream/50 p-6 lg:sticky lg:top-32">
          <h2 className="font-heading text-xl text-ink">Your order</h2>
          <ul className="mt-5 space-y-4 border-b border-cocoa/10 pb-5">
            {cart.lines.map((line) =>
            <li key={line.productId} className="flex gap-3">
                <img
                src={line.product.images[0]}
                alt=""
                className="h-16 w-14 rounded-sm object-cover" />
              
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">
                    {line.product.name}
                  </p>
                  <p className="text-xs text-cocoa/60">
                    {line.product.size} · ×{line.quantity}
                  </p>
                </div>
                <span className="text-sm text-cocoa">
                  {formatNaira(line.lineTotal)}
                </span>
              </li>
            )}
          </ul>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-cocoa/70">Subtotal</dt>
              <dd>{formatNaira(cart.subtotal)}</dd>
            </div>
            {cart.coupon &&
            <div className="flex justify-between text-[#2F5D3A]">
                <dt>{cart.coupon.code}</dt>
                <dd>−{formatNaira(cart.coupon.discount)}</dd>
              </div>
            }
            <div className="flex justify-between">
              <dt className="text-cocoa/70">Delivery to {form.state}</dt>
              <dd>{formatNaira(shippingFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-cocoa/10 pt-4">
              <dt className="font-heading text-lg text-ink">Total</dt>
              <dd className="font-heading text-lg text-ink">
                {formatNaira(grandTotal)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-cocoa/60">
            Need to change something?{' '}
            <Link to="/cart" className="underline hover:text-gold">
              Edit your bag
            </Link>
          </p>
        </aside>
      </div>
    </div>);

}