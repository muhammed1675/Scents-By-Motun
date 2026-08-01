import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Heart, ShoppingBag, Star, Truck } from 'lucide-react';
import { Product } from '../types';
import { getProductBySlug, getRelatedProducts } from '../services';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { formatNaira, cn } from '../utils/format';
import { PageHeader } from '../components/PageHeader';
import { QuantitySelector } from '../components/QuantitySelector';
import { Button } from '../components/ui/Button';
import { EmptyState, Spinner } from '../components/ui/Loading';
import { ProductRow } from '../components/ProductRow';
import { SectionHeader } from '../components/SectionHeader';

export function ProductDetail() {
  const { slug = '' } = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const wishlist = useWishlist();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setActiveImage(0);
    setQuantity(1);
    getProductBySlug(slug).then(async (found) => {
      if (!active) return;
      setProduct(found);
      setLoading(false);
      if (found) setRelated(await getRelatedProducts(found));
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="grid place-items-center py-32">
        <Spinner className="h-8 w-8" />
      </div>);

  }

  if (!product) {
    return (
      <div className="container py-20">
        <EmptyState
          title="Product not found"
          description="This bottle may be sold out for good. Explore what is in stock instead."
          action={<Button to="/shop">Shop all products</Button>} />
        
      </div>);

  }

  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 8;
  const saved = wishlist.has(product.id);

  async function handleAdd() {
    if (!product) return;
    await addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="w-full bg-ivory">
      <PageHeader
        title={product.name}
        crumbs={[{ label: 'Shop', to: '/shop' }, { label: product.name }]} />
      

      <div className="container grid gap-10 py-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-sm bg-cream">
            <img
              src={product.images[activeImage]}
              alt={`${product.name} — view ${activeImage + 1}`}
              className="aspect-[4/5] w-full object-cover" />
            
          </div>
          {product.images.length > 1 &&
          <ul className="mt-3 flex gap-3">
              {product.images.map((image, i) =>
            <li key={image + i}>
                  <button
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === activeImage}
                className={cn(
                  'overflow-hidden rounded-sm border-2 transition',
                  i === activeImage ?
                  'border-cocoa' :
                  'border-transparent opacity-70 hover:opacity-100'
                )}>
                
                    <img
                  src={image}
                  alt=""
                  className="h-20 w-16 object-cover sm:h-24 sm:w-20" />
                
                  </button>
                </li>
            )}
            </ul>
          }
        </div>

        {/* Details */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-chestnut">
            {product.brandLine}
          </p>
          <h2 className="mt-2 font-heading text-3xl text-ink sm:text-4xl">
            {product.name}
          </h2>

          <div className="mt-3 flex items-center gap-2">
            <span
              className="flex gap-0.5"
              aria-label={`Rated ${product.rating} out of 5`}>
              
              {Array.from({ length: 5 }).map((_, i) =>
              <Star
                key={i}
                size={14}
                className={
                i < Math.round(product.rating) ?
                'fill-gold text-gold' :
                'text-cocoa/20'
                } />

              )}
            </span>
            <span className="text-xs text-cocoa/60">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-heading text-3xl text-cocoa">
              {formatNaira(product.price)}
            </span>
            {product.compareAtPrice &&
            <span className="text-sm text-cocoa/50 line-through">
                {formatNaira(product.compareAtPrice)}
              </span>
            }
            <span className="text-xs text-cocoa/60">· {product.size}</span>
          </div>

          <p className="mt-3 text-sm">
            {soldOut ?
            <span className="text-[#b3261e]">Out of stock</span> :
            lowStock ?
            <span className="text-[#8A6512]">
                Low stock — only {product.stock} left
              </span> :

            <span className="text-[#2F5D3A]">
                In stock — ships within 24 hours
              </span>
            }
          </p>

          <p className="mt-5 text-sm leading-relaxed text-cocoa/80">
            {product.description}
          </p>

          {/* Notes */}
          <dl className="mt-6 grid gap-3 rounded-sm border border-cocoa/10 bg-cream/50 p-5 sm:grid-cols-3">
            {(
            [
            ['Top notes', product.notes.top],
            ['Heart notes', product.notes.heart],
            ['Base notes', product.notes.base]] as
            const).
            map(([label, notes]) =>
            <div key={label}>
                <dt className="text-[11px] uppercase tracking-widest text-chestnut">
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm text-cocoa/80">
                  {notes.join(', ')}
                </dd>
              </div>
            )}
          </dl>

          {/* Purchase */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuantitySelector
              value={quantity}
              max={Math.max(1, product.stock)}
              onChange={setQuantity} />
            
            <Button
              onClick={handleAdd}
              disabled={soldOut}
              size="lg"
              className="flex-1 min-w-[12rem]">
              
              {added ?
              <>
                  <Check size={16} /> Added to bag
                </> :

              <>
                  <ShoppingBag size={16} />
                  {soldOut ? 'Sold out' : 'Add to cart'}
                </>
              }
            </Button>
          </div>

          <button
            type="button"
            onClick={() => wishlist.toggle(product.id)}
            aria-pressed={saved}
            className="mt-3 inline-flex items-center gap-2 text-sm text-cocoa hover:text-gold">
            
            <Heart size={16} className={saved ? 'fill-blush text-blush' : ''} />
            {saved ? 'Saved to wishlist' : 'Add to wishlist'}
          </button>

          <p className="mt-6 flex items-center gap-2 border-t border-cocoa/10 pt-6 text-xs text-cocoa/70">
            <Truck size={16} className="text-gold" />
            Lagos delivery ₦3,500 · Nationwide ₦6,000 · Free over ₦100,000
          </p>
        </div>
      </div>

      {related.length > 0 &&
      <section className="container pb-16 pt-4">
          <SectionHeader eyebrow="You may also like" title="Related scents" />
          <ProductRow products={related} />
        </section>
      }
    </div>);

}