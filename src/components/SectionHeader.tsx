import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../utils/format';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  linkTo?: string;
  linkLabel?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  linkTo,
  linkLabel = 'View all',
  align = 'left',
  className
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-7 gap-4 sm:flex sm:items-end sm:justify-between',
        align === 'center' && 'sm:block sm:text-center',
        className
      )}>
      
      <div className={cn(align === 'center' && 'mx-auto max-w-2xl')}>
        {eyebrow &&
        <p className="text-[11px] font-medium uppercase tracking-widest text-chestnut">
            {eyebrow}
          </p>
        }
        <h2 className="mt-1.5 font-heading text-2xl text-ink sm:text-3xl">
          {title}
        </h2>
        {description &&
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-cocoa/70">
            {description}
          </p>
        }
      </div>
      {linkTo &&
      <Link
        to={linkTo}
        className={cn(
          'mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-cocoa hover:text-gold sm:mt-0',
          align === 'center' && 'sm:mt-4'
        )}>
        
          {linkLabel}
          <ArrowRight size={14} />
        </Link>
      }
    </div>);

}