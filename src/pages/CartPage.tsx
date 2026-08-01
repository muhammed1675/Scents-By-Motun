import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Trash2, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatNaira } from '../utils/format';
import { PageHeader } from '../components/PageHeader';
import { QuantitySelector } from '../components/QuantitySelector';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/Loading';

export function CartPage() {
  const {
    cart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon
  } = useCart();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ok: boolean;text: string;} | null>(
    null
  );
  const [isApplying, setApplying] = useState(false);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setApplying(true);
    const result = await applyCoupon(code);
    setMessage({ ok: result.ok, text: result.message });
    setApplying(false);
    if (result.ok) setCode('');
  }

  return (
    <div className="w-full bg-ivory">
      <PageHeader
        title="Your bag"
        crumbs={[{ label: 'Bag' }]}
        description={
        cart.lines.length > 0 ?
        `${cart.lines.length} ${cart.lines.length === 1 ? 'item' : 'items'} ready to go.` :
        undefined
        } />
      

      <div className="container py-10">
        {cart.lines.length === 0 ?
        <EmptyState
          title="Your bag is empty"
          description="Once you add a bottle it will show up here, saved for later."
          action={<Button to="/shop">Shop all products</Button>} /> :


        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <section aria-label="Bag items">
              <ul className="divide-y divide-cocoa/10 border-y border-cocoa/10">
                {cart.lines.map((line) =>
              <li key={line.productId} className="flex gap-4 py-6">
                    <Link to={`/product/${line.product.slug}`}>
                      <img
                    src={line.product.images[0]}
                    alt={line.product.name}
                    className="h-32 w-24 rounded-sm object-cover sm:h-36 sm:w-28" />
                  
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-chestnut">
                            {line.product.brandLine}
                          </p>
                          <h2 className="font-heading text-lg text-ink">
                            <Link
                          to={`/product/${line.product.slug}`}
                          className="hover:text-chestnut">
                          
                              {line.product.name}
                            </Link>
                          </h2>
                          <p className="text-xs text-cocoa/60">
                            {line.product.size} · {formatNaira(line.product.price)} each
                          </p>
                        </div>
                        <button
                      type="button"
                      onClick={() => removeItem(line.productId)}
                      aria-label={`Remove ${line.product.name} from bag`}
                      className="h-fit text-cocoa/50 hover:text-[#b3261e]">
                      
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <QuantitySelector
                      value={line.quantity}
                      max={line.product.stock}
                      onChange={(q) => updateQuantity(line.productId, q)} />
                    
                        <span className="font-semibold text-cocoa">
                          {formatNaira(line.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </li>
              )}
              </ul>
              <Link
              to="/shop"
              className="mt-6 inline-block text-xs uppercase tracking-widest text-cocoa underline hover:text-gold">
              
                Continue shopping
              </Link>
            </section>

            <aside className="h-fit rounded-sm border border-cocoa/10 bg-cream/50 p-6 lg:sticky lg:top-32">
              <h2 className="font-heading text-xl text-ink">Order summary</h2>

              <form onSubmit={handleApply} className="mt-5">
                <label
                htmlFor="coupon"
                className="block text-xs font-medium uppercase tracking-widest text-chestnut">
                
                  Coupon code
                </label>
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cocoa/40" />
                  
                    <input
                    id="coupon"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="MOTUN10"
                    className="w-full rounded-sm border border-cocoa/20 bg-white py-2.5 pl-9 pr-3 text-sm uppercase focus:border-gold focus:outline-none" />
                  
                  </div>
                  <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  disabled={isApplying || !code}>
                  
                    {isApplying ? 'Applying…' : 'Apply'}
                  </Button>
                </div>
                {message &&
              <p
                role="status"
                className={
                message.ok ?
                'mt-2 text-xs text-[#2F5D3A]' :
                'mt-2 text-xs text-[#b3261e]'
                }>
                
                    {message.text}
                  </p>
              }
              </form>

              <dl className="mt-6 space-y-3 border-t border-cocoa/10 pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-cocoa/70">Subtotal</dt>
                  <dd className="font-medium text-cocoa">
                    {formatNaira(cart.subtotal)}
                  </dd>
                </div>
                {cart.coupon &&
              <div className="flex items-center justify-between text-[#2F5D3A]">
                    <dt className="flex items-center gap-1.5">
                      {cart.coupon.code}
                      <button
                    type="button"
                    onClick={() => {
                      removeCoupon();
                      setMessage(null);
                    }}
                    aria-label="Remove coupon"
                    className="text-cocoa/50 hover:text-[#b3261e]">
                    
                        <X size={13} />
                      </button>
                    </dt>
                    <dd>−{formatNaira(cart.coupon.discount)}</dd>
                  </div>
              }
                <div className="flex justify-between">
                  <dt className="text-cocoa/70">Delivery</dt>
                  <dd className="text-cocoa/70">Calculated at checkout</dd>
                </div>
                <div className="flex justify-between border-t border-cocoa/10 pt-4 text-base">
                  <dt className="font-heading text-lg text-ink">Total</dt>
                  <dd className="font-heading text-lg text-ink">
                    {formatNaira(cart.total)}
                  </dd>
                </div>
              </dl>

              <Button to="/checkout" size="lg" fullWidth className="mt-6">
                Checkout
              </Button>
              <p className="mt-3 text-center text-xs text-cocoa/60">
                Pay online or complete your order on WhatsApp.
              </p>
            </aside>
          </div>
        }
      </div>
    </div>);

}