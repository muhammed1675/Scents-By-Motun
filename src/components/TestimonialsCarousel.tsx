import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../types';
import { TestimonialCard } from './TestimonialCard';
import { cn } from '../utils/format';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({
  testimonials
}: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}>
          
          {testimonials.map((t) =>
          <div key={t.id} className="w-full shrink-0 px-1">
              <TestimonialCard testimonial={t} className="mx-auto max-w-2xl" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setIndex((i) => (i - 1 + count) % count)}
          aria-label="Previous testimonial"
          className="grid h-9 w-9 place-items-center rounded-full border border-cocoa/20 text-cocoa hover:bg-cream">
          
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-2">
          {testimonials.map((t, i) =>
          <button
            key={t.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            aria-current={i === index}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === index ? 'w-6 bg-cocoa' : 'w-1.5 bg-cocoa/25'
            )} />

          )}
        </div>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % count)}
          aria-label="Next testimonial"
          className="grid h-9 w-9 place-items-center rounded-full border border-cocoa/20 text-cocoa hover:bg-cream">
          
          <ChevronRight size={16} />
        </button>
      </div>
    </div>);

}