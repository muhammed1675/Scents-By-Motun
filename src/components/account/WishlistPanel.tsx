import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { getProductsByIds } from '../../services';
import { useWishlist } from '../../contexts/WishlistContext';
import { ProductCard } from '../ProductCard';
import { Button } from '../ui/Button';
import { EmptyState, ProductGridSkeleton } from '../ui/Loading';

export function WishlistPanel() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductsByIds(ids).
    then(setProducts).
    finally(() => setLoading(false));
  }, [ids]);

  if (isLoading) return <ProductGridSkeleton count={3} />;

  if (products.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it for later."
        action={<Button to="/shop">Browse products</Button>} />);


  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
      {products.map((product) =>
      <li key={product.id}>
          <ProductCard product={product} />
        </li>
      )}
    </ul>);

}