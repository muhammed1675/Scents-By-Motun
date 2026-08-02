import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Category } from '../../types';
import { getCategories } from '../../services';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { cn } from '../../utils/format';

const primaryNav = [
{ to: '/shop', label: 'Shop All' },
{ to: '/collections', label: 'Collections' },
{ to: '/category/for-her', label: 'For Her' },
{ to: '/category/for-him', label: 'For Him' },
{ to: '/category/gift-sets', label: 'Gifting' },
{ to: '/about', label: 'About' },
{ to: '/contact', label: 'Contact' }];


export function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { itemCount, openDrawer } = useCart();
  const wishlist = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setMenuOpen(false);
    setQuery('');
  }

  return (
    <>
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur">
      <div className="announcement-banner bg-cocoa py-2 px-4">
        <p className="announcement-scroll text-[11px] uppercase tracking-widest text-ivory">
          Free delivery in Ibadan on orders over ₦100,000 • Track Your Order in Real-Time • Experience Luxury, Support Local
        </p>
      </div>

      <div className="border-b border-cocoa/10">
        <div className="container flex items-center justify-between gap-4 py-3.5">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="text-cocoa lg:hidden">
            
            <Menu size={22} />
          </button>

          <Link to="/" className="flex flex-col items-center lg:items-start">
            <span className="font-heading text-xl leading-none text-ink sm:text-2xl">
              Scents by Motun
            </span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-chestnut">
              Ibadan · Nigeria
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search products"
              aria-expanded={isSearchOpen}
              className="text-cocoa hover:text-gold">
              
              <Search size={20} />
            </button>
            <Link
              to="/account?tab=wishlist"
              aria-label="Wishlist"
              className="relative hidden text-cocoa hover:text-gold sm:block">
              
              <Heart size={20} />
              {wishlist.ids.length > 0 &&
              <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-blush px-1 text-[10px] text-ink">
                  {wishlist.ids.length}
                </span>
              }
            </Link>
            <Link
              to="/account"
              aria-label="Account"
              className="text-cocoa hover:text-gold">
              
              <User size={20} />
            </Link>
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Open bag, ${itemCount} items`}
              className="relative text-cocoa hover:text-gold">
              
              <ShoppingBag size={20} />
              {itemCount > 0 &&
              <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-medium text-ink">
                  {itemCount}
                </span>
              }
            </button>
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="container hidden items-center justify-center gap-8 pb-3 lg:flex">
          
          {primaryNav.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
            cn(
              'text-xs uppercase tracking-widest transition-colors',
              isActive ? 'text-gold' : 'text-cocoa hover:text-gold'
            )
            }>
            
              {item.label}
            </NavLink>
          )}
        </nav>

        {isSearchOpen &&
        <div className="border-t border-cocoa/10 bg-cream/60">
            <form onSubmit={submitSearch} className="container flex gap-2 py-3">
              <label htmlFor="header-search" className="sr-only">
                Search products
              </label>
              <input
              id="header-search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search oud, body mist, gift sets…"
              className="flex-1 rounded-sm border border-cocoa/20 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none" />
            
              <button
              type="submit"
              className="rounded-sm bg-cocoa px-5 text-xs uppercase tracking-widest text-ivory">
              
                Search
              </button>
            </form>
          </div>
        }
      </div>
    </header>

    {/* Mobile menu — portaled to <body> so this "fixed" panel is positioned
        against the viewport, not against <header>. Header has backdrop-blur,
        and per the CSS spec, backdrop-filter/filter/transform on an ancestor
        makes that ancestor the containing block for fixed descendants — so
        left inside <header>, this panel was clipped to the header's own
        (~110px) height instead of the full screen. */}
    {createPortal(
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}>
        
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            'absolute inset-0 bg-ink/40 transition-opacity',
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          )} />
        
        <div
          role="dialog"
          aria-label="Menu"
          aria-modal={isMenuOpen}
          className={cn(
            'absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-ivory p-5 transition-transform duration-300',
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}>
          
          <div className="mb-6 flex items-center justify-between">
            <span className="font-heading text-lg text-ink">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-cocoa">
              
              <X size={20} />
            </button>
          </div>

          <nav aria-label="Mobile" className="space-y-1">
            {primaryNav.map((item) =>
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-cocoa/10 py-3 text-sm uppercase tracking-widest text-cocoa">
              
                {item.label}
              </Link>
            )}
          </nav>

          <p className="mb-3 mt-7 text-[11px] font-medium uppercase tracking-widest text-chestnut">
            Shop by category
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {categories.map((c) =>
            <li key={c.id}>
                <Link
                to={`/category/${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="block py-1.5 text-sm text-cocoa/80 hover:text-gold">
                
                  {c.name}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
