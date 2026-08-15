import React from 'react';
import { cn } from '../../utils/format';

export function Spinner({ className }: {className?: string;}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-cocoa/25 border-t-cocoa',
        className
      )} />);


}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full rounded-sm bg-cream" />
      <div className="mt-4 h-3 w-1/3 rounded bg-cream" />
      <div className="mt-2 h-4 w-3/4 rounded bg-cream" />
      <div className="mt-2 h-4 w-1/4 rounded bg-cream" />
    </div>);

}

export function ProductGridSkeleton({ count = 6 }: {count?: number;}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) =>
      <ProductCardSkeleton key={i} />
      )}
    </div>);

}

export function EmptyState({
  title,
  description,
  action




}: {title: string;description?: string;action?: React.ReactNode;}) {
  return (
    <div className="rounded-sm border border-dashed border-cocoa/20 bg-cream/40 px-6 py-14 text-center">
      <h3 className="font-heading text-xl text-cocoa">{title}</h3>
      {description &&
      <p className="mx-auto mt-2 max-w-md text-sm text-cocoa/70">
          {description}
        </p>
      }
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>);

}