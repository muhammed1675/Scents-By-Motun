import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, PackageSearch, Search } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { trackOrder } from '../services';
import { PageHeader } from '../components/PageHeader';
import { Field, TextInput } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime, formatNaira } from '../utils/format';

const steps: {status: OrderStatus;label: string;}[] = [
{ status: 'pending', label: 'Order received' },
{ status: 'processing', label: 'Processing' },
{ status: 'shipped', label: 'Shipped' },
{ status: 'delivered', label: 'Delivered' }];


function progressIndex(status: OrderStatus): number {
  if (status === 'cancelled') return -1;
  return steps.findIndex((s) => s.status === status);
}

export function TrackOrder() {
  const [reference, setReference] = useState('');
  const [contact, setContact] = useState('');
  const [isSearching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reference.trim() || !contact.trim()) {
      setError('Enter your order number and the email or phone you used.');
      return;
    }
    setSearching(true);
    setError('');
    setOrder(null);
    const result = await trackOrder(reference, contact);
    setSearching(false);
    if (!result.ok || !result.order) {
      setError(result.message);
      return;
    }
    setOrder(result.order);
  }

  const activeIndex = order ? progressIndex(order.status) : -1;

  return (
    <div className="w-full bg-ivory">
      <PageHeader
        eyebrow="Order Tracking"
        title="Track your order"
        description="Enter your order number and the email or phone you used at checkout. No account needed."
        crumbs={[{ label: 'Track Order' }]} />
      

      <div className="container py-12">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-xl rounded-sm border border-cocoa/10 bg-white p-6 sm:p-8"
          noValidate>
          
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Order number" htmlFor="track-ref" required>
              <TextInput
                id="track-ref"
                value={reference}
                placeholder="SBM-10432"
                onChange={(e) => setReference(e.target.value)} />
              
            </Field>
            <Field label="Email or phone" htmlFor="track-contact" required>
              <TextInput
                id="track-contact"
                value={contact}
                placeholder="you@email.com or 0803 000 0000"
                onChange={(e) => setContact(e.target.value)} />
              
            </Field>
          </div>

          {error &&
          <p role="alert" className="mt-4 text-sm text-[#b3261e]">
              {error}
            </p>
          }

          <Button type="submit" fullWidth className="mt-6" disabled={isSearching}>
            <Search size={16} />
            {isSearching ? 'Searching…' : 'Track order'}
          </Button>
        </form>

        {order &&
        <div className="mx-auto mt-8 max-w-xl rounded-sm border border-cocoa/10 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-cocoa/10 pb-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-chestnut">
                  Order {order.reference}
                </p>
                <p className="mt-1 text-sm text-cocoa/60">
                  Placed {formatDateTime(order.createdAt)}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {order.status === 'cancelled' ?
          <p className="mt-6 text-sm text-cocoa/70">
                This order was cancelled. If that's a surprise, message us on
                WhatsApp and we'll sort it out.
              </p> :

          <ol className="mt-6 flex items-start justify-between gap-2">
                {steps.map((step, i) => {
                  const done = i <= activeIndex;
                  return (
                    <li key={step.status} className="flex flex-1 flex-col items-center text-center">
                      <div className="flex w-full items-center">
                        <div
                        className={`h-px flex-1 ${i === 0 ? 'bg-transparent' : done ? 'bg-gold' : 'bg-cocoa/15'}`} />
                        
                        {done ?
                    <CheckCircle2 size={20} className="mx-1 shrink-0 text-gold" /> :

                    <Circle size={20} className="mx-1 shrink-0 text-cocoa/25" />
                    }
                        <div
                        className={`h-px flex-1 ${i === steps.length - 1 ? 'bg-transparent' : done ? 'bg-gold' : 'bg-cocoa/15'}`} />
                        
                      </div>
                      <span
                      className={`mt-2 text-[11px] uppercase tracking-wide ${done ? 'text-ink' : 'text-cocoa/50'}`}>
                      
                        {step.label}
                      </span>
                    </li>);

                })}
              </ol>
          }

            <div className="mt-8 space-y-3">
              {order.items.map((item) =>
            <div key={item.productId} className="flex items-center gap-3 text-sm">
                  <img
                src={item.image}
                alt=""
                className="h-12 w-12 shrink-0 rounded-sm border border-cocoa/10 object-cover" />
                
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-ink">{item.name}</p>
                    <p className="text-xs text-cocoa/60">Qty {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-cocoa">{formatNaira(item.price * item.quantity)}</p>
                </div>
            )}
            </div>

            <div className="mt-6 space-y-1.5 border-t border-cocoa/10 pt-5 text-sm text-cocoa/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatNaira(order.subtotal)}</span>
              </div>
              {order.discount > 0 &&
            <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-{formatNaira(order.discount)}</span>
                </div>
            }
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatNaira(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-1.5 text-base font-medium text-ink">
                <span>Total</span>
                <span>{formatNaira(order.total)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-sm bg-cream/50 p-4 text-sm text-cocoa/80">
              <p className="text-ink">
                Delivering to {order.shipping.city}, {order.shipping.state}
              </p>
              <p className="mt-1">{order.shipping.street}</p>
            </div>
          </div>
        }

        {!order && !isSearching &&
        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3 text-center text-sm text-cocoa/50">
            <PackageSearch size={28} className="text-cocoa/30" />
            <p>
              Can't find your order number? Check your order confirmation
              email, or{' '}
              <Link to="/contact" className="text-cocoa underline hover:text-gold">
                contact us
              </Link>{' '}
              with your name and phone number.
            </p>
          </div>
        }
      </div>
    </div>);

}
