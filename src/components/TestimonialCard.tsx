import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '../types';
import { cn } from '../utils/format';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  className
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        'flex h-full flex-col rounded-sm border border-cocoa/10 bg-white p-6',
        className
      )}>
      
      <div
        className="flex gap-0.5"
        aria-label={`${testimonial.rating} out of 5 stars`}>
        
        {Array.from({ length: 5 }).map((_, i) =>
        <Star
          key={i}
          size={14}
          className={
          i < testimonial.rating ?
          'fill-gold text-gold' :
          'text-cocoa/20'
          } />

        )}
      </div>
      <blockquote className="mt-4 flex-1 font-heading text-lg italic leading-relaxed text-ink">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-5 border-t border-cocoa/10 pt-4">
        <p className="text-sm font-medium text-cocoa">{testimonial.name}</p>
        <p className="text-xs text-cocoa/60">{testimonial.location}</p>
      </figcaption>
    </figure>);

}