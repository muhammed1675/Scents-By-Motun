import React, { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Product, SortOption } from '../types';
import { getPriceRange, getProducts } from '../services';
import { ProductCard } from './ProductCard';
import { FilterBar, FilterPanel, FilterState } from './FilterBar';
import { Pagination } from './Pagination';
import { Button } from './ui/Button';
import { EmptyState, ProductGridSkeleton } from './ui/Loading';

interface ProductBrowserProps {
  categorySlug?: string;
  showSearch?: boolean;
  initialSearch?: string;
  initialSort?: SortOption;
  perPage?: number;
}

export function ProductBrowser({
  categorySlug,
  showSearch = false,
  initialSearch = '',
  initialSort = 'featured',
  perPage = 9
}: ProductBrowserProps) {
  const [bounds, setBounds] = useState({ min: 0, max: 200000 });
  const [filters, setFilters] = useState<FilterState>({
    inStockOnly: false,
    minPrice: 0,
    maxPrice: 200000
  });
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [search, setSearch] = useState(initialSearch);
  const [searchDraft, setSearchDraft] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getPriceRange().then((range) => {
      setBounds(range);
      setFilters((f) => ({ ...f, minPrice: range.min, maxPrice: range.max }));
    });
  }, []);

  useEffect(() => {
    setSearch(initialSearch);
    setSearchDraft(initialSearch);
    setPage(1);
  }, [initialSearch]);

  useEffect(() => {
    setPage(1);
  }, [categorySlug, sort, filters]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProducts({
      categorySlug,
      search,
      inStockOnly: filters.inStockOnly,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort,
      page,
      perPage
    }).then((result) => {
      if (!active) return;
      setProducts(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [categorySlug, search, filters, sort, page, perPage]);

  const resetFilters = useCallback(() => {
    setFilters({
      inStockOnly: false,
      minPrice: bounds.min,
      maxPrice: bounds.max
    });
  }, [bounds]);

  return (
    <div className="container py-8 sm:py-10">
      {showSearch &&
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(searchDraft);
          setPage(1);
        }}
        className="mb-7 flex gap-2"
        role="search">
        
          <div className="relative flex-1">
            <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cocoa/40" />
          
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <input
            id="shop-search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Search by name, note or collection…"
            className="w-full rounded-sm border border-cocoa/20 bg-white py-3 pl-9 pr-3 text-sm focus:border-gold focus:outline-none" />
          
          </div>
          <Button type="submit">Search</Button>
        </form>
      }

      <div className="gap-10 lg:grid lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block" aria-label="Product filters">
          <FilterPanel
            filters={filters}
            bounds={bounds}
            onFiltersChange={setFilters}
            onReset={resetFilters} />
          
        </aside>

        <div>
          <FilterBar
            filters={filters}
            bounds={bounds}
            sort={sort}
            resultCount={total}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            onReset={resetFilters} />
          

          <div className="mt-8">
            {isLoading ?
            <ProductGridSkeleton count={perPage} /> :
            products.length === 0 ?
            <EmptyState
              title="No products match those filters"
              description="Try widening your price range or clearing the in-stock filter."
              action={
              <Button variant="outline" onClick={resetFilters}>
                    Clear filters
                  </Button>
              } /> :


            <>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-3">
                  {products.map((product) =>
                <li key={product.id}>
                      <ProductCard product={product} />
                    </li>
                )}
                </ul>
                <div className="mt-12">
                  <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage} />
                
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </div>);

}