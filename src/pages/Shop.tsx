import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortOption } from '../types';
import { PageHeader } from '../components/PageHeader';
import { ProductBrowser } from '../components/ProductBrowser';

export function Shop() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const sort = params.get('sort') as SortOption ?? 'featured';

  return (
    <div className="w-full bg-ivory">
      <PageHeader
        eyebrow="Shop all"
        title={query ? `Results for “${query}”` : 'Every bottle we make'}
        description="Parfums, oils, mists, candles and gifting — filter your way to a favourite."
        crumbs={[{ label: 'Shop' }]} />
      
      <ProductBrowser
        showSearch
        initialSearch={query}
        initialSort={sort}
        perPage={12} />
      
    </div>);

}