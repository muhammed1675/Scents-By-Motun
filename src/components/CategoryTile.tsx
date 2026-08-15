import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';
import { cn } from '../utils/format';

interface CategoryTileProps {
  category: Category;
  size?: 'sm' | 'lg';
  className?: string;
}

export function CategoryTile({
  category,
  size = 'sm',
  className
}: CategoryTileProps) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className={cn(
        'group relative block overflow-hidden rounded-sm bg-cream',
        className
      )}>
      
      <img
        src={category.image}
        alt=""
        loading="lazy"
        className={cn(
          'w-full object-cover transition-transform duration-700 group-hover:scale-105',
          size === 'lg' ? 'aspect-[3/4]' : 'aspect-square'
        )} />
      
      <div className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/40" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3
          className={cn(
            'font-heading text-ivory',
            size === 'lg' ? 'text-2xl' : 'text-base sm:text-lg'
          )}>
          
          {category.name}
        </h3>
        {size === 'lg' &&
        <p className="mt-1 line-clamp-2 text-xs text-ivory/80">
            {category.description}
          </p>
        }
        <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gold">
          Shop
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>);

}