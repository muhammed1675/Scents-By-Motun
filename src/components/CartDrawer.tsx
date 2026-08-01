import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatNaira, cn } from '../utils/format';
import { Button } from './ui/Button';
import { QuantitySelector } from './QuantitySelector';

export function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeItem } =
  useCart();

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60]',
        isDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      aria-hidden={!isDrawerOpen}>
      
      <div
        onClick={closeDrawer}
        className={cn(
          'absolute inset-0 bg-ink/40 transition-opacity duration-300',
          isDrawerOpen ? 'opacity-100' : 'opacity-0'
        )} />
      
      <aside
        role="dialog"
        aria-modal={isDrawerOpen}
        aria-label="Shopping bag"
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-soft transition-transform duration-300',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
        
        <header className="flex items-center justify-between border-b border-cocoa/10 px-5 py-4">
          <h2 className="font-heading text-xl text-ink">
            Your bag ({cart.lines.length})
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            className="text-cocoa hover:text-gold">
            
            <X size={20} />
          </button>
        </header>

        {cart.lines.length === 0 ?
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={32} className="text-cocoa/30" />
            <p className="mt-4 font-heading text-xl text-ink">
              Your bag is empty
            </p>
            <p className="mt-2 text-sm text-cocoa/70">
              Find your signature scent among our bestsellers.
            </p>
            <Button to="/shop" onClick={closeDrawer} className="mt-6">
              Start shopping
            </Button>
          </div> :

        <>
            <ul className="flex-1 divide-y divide-cocoa/10 overflow-y-auto px-5">
              {cart.lines.map((line) =>
            <li key={line.productId} className="flex gap-4 py-4">
                  <Link
                to={`/product/${line.product.slug}`}
                onClick={closeDrawer}
                className="shrink-0">
                
                    <img
                  src={line.product.images[0]}
                  alt={line.product.name}
                  className="h-24 w-20 rounded-sm object-cover" />
                
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <h3 className="font-heading text-base text-ink">
                          {line.product.name}
                        </h3>
                        <p className="text-xs text-cocoa/60">
                          {line.product.size}
                        </p>
                      </div>
                      <button
                    type="button"
                    onClick={() => removeItem(line.productId)}
                    aria-label={`Remove ${line.product.name}`}
                    className="h-fit text-cocoa/50 hover:text-[#b3261e]">
                    
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantitySelector
                    size="sm"
                    value={line.quantity}
                    max={line.product.stock}
                    onChange={(q) => updateQuantity(line.productId, q)} />
                  
                      <span className="text-sm font-semibold text-cocoa">
                        {formatNaira(line.lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
            )}
            </ul>

            <footer className="border-t border-cocoa/10 bg-cream/60 px-5 py-5">
              <div className="flex justify-between text-sm text-cocoa">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {formatNaira(cart.subtotal)}
                </span>
              </div>
              {cart.coupon &&
            <div className="mt-1.5 flex justify-between text-sm text-[#2F5D3A]">
                  <span>Coupon {cart.coupon.code}</span>
                  <span>−{formatNaira(cart.coupon.discount)}</span>
                </div>
            }
              <p className="mt-2 text-xs text-cocoa/60">
                Delivery calculated at checkout.
              </p>
              <div className="mt-4 grid gap-2">
                <Button to="/checkout" onClick={closeDrawer} fullWidth>
                  Checkout
                </Button>
                <Button
                to="/cart"
                onClick={closeDrawer}
                variant="outline"
                fullWidth>
                
                  View bag
                </Button>
              </div>
            </footer>
          </>
        }
      </aside>
    </div>);

}