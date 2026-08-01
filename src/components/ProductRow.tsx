import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ui/Loading';

interface ProductRowProps {
  products: Product[];
  isLoading?: boolean;
}

/** Horizontally scrollable product rail on mobile, grid on larger screens. */
export function ProductRow({ products, isLoading }: ProductRowProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) =>
        <ProductCardSkeleton key={i} />
        )}
      </div>);

  }

  return (
    <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {products.map((product) =>
      <li
        key={product.id}
        className="w-[62vw] flex-shrink-0 snap-start sm:w-auto">
        
          <ProductCard product={product} />
        </li>
      )}
    </ul>);

}