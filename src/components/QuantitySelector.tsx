import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../utils/format';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
  className?: string;
  label?: string;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  className,
  label = 'Quantity'
}: QuantitySelectorProps) {
  const btn =
  size === 'sm' ?
  'h-8 w-8 text-cocoa' :
  'h-11 w-11 text-cocoa';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-sm border border-cocoa/20 bg-white',
        className
      )}
      role="group"
      aria-label={label}>
      
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn('grid place-items-center disabled:opacity-30', btn)}>
        
        <Minus size={14} />
      </button>
      <span
        className={cn(
          'min-w-[2.5rem] text-center text-sm font-medium text-ink',
          size === 'sm' && 'min-w-[2rem] text-xs'
        )}
        aria-live="polite">
        
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn('grid place-items-center disabled:opacity-30', btn)}>
        
        <Plus size={14} />
      </button>
    </div>);

}