import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/format';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex items-center justify-center gap-1.5"
      aria-label="Pagination">
      
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="grid h-9 w-9 place-items-center rounded-sm border border-cocoa/20 text-cocoa disabled:opacity-30">
        
        <ChevronLeft size={16} />
      </button>
      {pages.map((p) =>
      <button
        key={p}
        type="button"
        onClick={() => onChange(p)}
        aria-current={p === page ? 'page' : undefined}
        className={cn(
          'h-9 w-9 rounded-sm border text-sm transition',
          p === page ?
          'border-cocoa bg-cocoa text-ivory' :
          'border-cocoa/20 text-cocoa hover:bg-cream'
        )}>
        
          {p}
        </button>
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="grid h-9 w-9 place-items-center rounded-sm border border-cocoa/20 text-cocoa disabled:opacity-30">
        
        <ChevronRight size={16} />
      </button>
    </nav>);

}