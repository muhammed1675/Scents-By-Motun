import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { SortOption } from '../types';
import { Checkbox, SelectInput, TextInput } from './ui/Field';
import { Button } from './ui/Button';
import { formatNaira, cn } from '../utils/format';

export interface FilterState {
  inStockOnly: boolean;
  minPrice: number;
  maxPrice: number;
}

interface FilterPanelProps {
  filters: FilterState;
  bounds: {min: number;max: number;};
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

const sortOptions: {value: SortOption;label: string;}[] = [
{ value: 'featured', label: 'Featured' },
{ value: 'newest', label: 'Newest' },
{ value: 'price-asc', label: 'Price: low to high' },
{ value: 'price-desc', label: 'Price: high to low' },
{ value: 'name-asc', label: 'Name: A – Z' }];


function isFiltered(filters: FilterState, bounds: {min: number;max: number;}) {
  return (
    filters.inStockOnly ||
    filters.minPrice > bounds.min ||
    filters.maxPrice < bounds.max);

}

/** The filter controls themselves — rendered in the sidebar and mobile sheet. */
export function FilterPanel({
  filters,
  bounds,
  onFiltersChange,
  onReset
}: FilterPanelProps) {
  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-xs font-medium uppercase tracking-widest text-chestnut">
          Availability
        </legend>
        <Checkbox
          label="In stock only"
          checked={filters.inStockOnly}
          onChange={(e) =>
          onFiltersChange({ ...filters, inStockOnly: e.target.checked })
          } />
        
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-medium uppercase tracking-widest text-chestnut">
          Price
        </legend>
        <p className="mb-3 text-sm text-cocoa/70">
          {formatNaira(filters.minPrice)} – {formatNaira(filters.maxPrice)}
        </p>
        <div className="flex items-center gap-2">
          <TextInput
            type="number"
            aria-label="Minimum price"
            value={filters.minPrice}
            min={bounds.min}
            max={filters.maxPrice}
            step={1000}
            onChange={(e) =>
            onFiltersChange({
              ...filters,
              minPrice: Number(e.target.value) || 0
            })
            } />
          
          <span className="text-cocoa/50">–</span>
          <TextInput
            type="number"
            aria-label="Maximum price"
            value={filters.maxPrice}
            min={filters.minPrice}
            max={bounds.max}
            step={1000}
            onChange={(e) =>
            onFiltersChange({
              ...filters,
              maxPrice: Number(e.target.value) || bounds.max
            })
            } />
          
        </div>
        <input
          type="range"
          aria-label="Maximum price slider"
          min={bounds.min}
          max={bounds.max}
          step={1000}
          value={filters.maxPrice}
          onChange={(e) =>
          onFiltersChange({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="mt-4 w-full accent-[#4A2E1F]" />
        
      </fieldset>

      {isFiltered(filters, bounds) &&
      <Button variant="outline" size="sm" onClick={onReset} fullWidth>
          Clear filters
        </Button>
      }
    </div>);

}

interface FilterBarProps extends FilterPanelProps {
  sort: SortOption;
  resultCount: number;
  onSortChange: (sort: SortOption) => void;
}

/** Toolbar with the result count, sort control and the mobile filter sheet. */
export function FilterBar({
  filters,
  bounds,
  sort,
  resultCount,
  onFiltersChange,
  onSortChange,
  onReset
}: FilterBarProps) {
  const [isOpen, setOpen] = useState(false);
  const filtered = isFiltered(filters, bounds);

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-y border-cocoa/10 py-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 text-sm text-cocoa lg:hidden">
          
          <SlidersHorizontal size={16} />
          Filters
          {filtered && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
        </button>
        <p className="hidden text-sm text-cocoa/60 lg:block">
          {resultCount} {resultCount === 1 ? 'product' : 'products'}
        </p>
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort"
            className="hidden text-xs uppercase tracking-widest text-chestnut sm:block">
            
            Sort
          </label>
          <SelectInput
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-auto min-w-[9rem] py-2 text-xs">
            
            {sortOptions.map((o) =>
            <option key={o.value} value={o.value}>
                {o.label}
              </option>
            )}
          </SelectInput>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}>
        
        <div
          onClick={() => setOpen(false)}
          className={cn(
            'absolute inset-0 bg-ink/40 transition-opacity',
            isOpen ? 'opacity-100' : 'opacity-0'
          )} />
        
        <div
          role="dialog"
          aria-label="Filters"
          aria-modal={isOpen}
          className={cn(
            'absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-lg bg-ivory p-5 transition-transform duration-300',
            isOpen ? 'translate-y-0' : 'translate-y-full'
          )}>
          
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-xl text-ink">Filters</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="text-cocoa">
              
              <X size={20} />
            </button>
          </div>
          <FilterPanel
            filters={filters}
            bounds={bounds}
            onFiltersChange={onFiltersChange}
            onReset={onReset} />
          
          <Button className="mt-6" fullWidth onClick={() => setOpen(false)}>
            Show {resultCount} products
          </Button>
        </div>
      </div>
    </>);

}