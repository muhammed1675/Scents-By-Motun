import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatNaira, cn } from '../utils/format';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const soldOut = product.stock === 0;
  const saved = wishlist.has(product.id);

  return (
    <article className={cn('group flex flex-col', className)}>
      <div className="relative overflow-hidden rounded-sm bg-cream">
        <Link to={`/product/${product.slug}`} className="block">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNewArrival &&
          <span className="bg-cocoa px-2 py-1 text-[10px] uppercase tracking-widest text-ivory">
              New
            </span>
          }
          {product.compareAtPrice &&
          <span className="bg-gold px-2 py-1 text-[10px] uppercase tracking-widest text-ink">
              Save {formatNaira(product.compareAtPrice - product.price)}
            </span>
          }
          {soldOut &&
          <span className="bg-ink/80 px-2 py-1 text-[10px] uppercase tracking-widest text-ivory">
              Sold out
            </span>
          }
        </div>

        <button
          type="button"
          onClick={() => wishlist.toggle(product.id)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ivory/90 text-cocoa transition hover:bg-ivory">
          
          <Heart size={16} className={saved ? 'fill-blush text-blush' : ''} />
        </button>

        {!soldOut &&
        <button
          type="button"
          onClick={() => addItem(product)}
          className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-sm bg-cocoa px-4 py-2.5 text-xs uppercase tracking-widest text-ivory opacity-0 transition-all duration-300 hover:bg-ink group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100">
          
            <ShoppingBag size={14} />
            Add to cart
          </button>
        }
      </div>

      <div className="mt-3.5 flex flex-1 flex-col">
        <p className="text-[11px] uppercase tracking-widest text-chestnut">
          {product.brandLine}
        </p>
        <h3 className="mt-1 font-heading text-lg leading-snug text-ink">
          <Link to={`/product/${product.slug}`} className="hover:text-chestnut">
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-cocoa/60">{product.size}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-cocoa">
            {formatNaira(product.price)}
          </span>
          {product.compareAtPrice &&
          <span className="text-xs text-cocoa/50 line-through">
              {formatNaira(product.compareAtPrice)}
            </span>
          }
        </div>
      </div>
    </article>);

}