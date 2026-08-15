import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../types';
import { getCategoryBySlug } from '../services';
import { PageHeader } from '../components/PageHeader';
import { ProductBrowser } from '../components/ProductBrowser';
import { EmptyState } from '../components/ui/Loading';
import { Button } from '../components/ui/Button';

export function CategoryPage() {
  const { slug = '' } = useParams();
  const [category, setCategory] = useState<Category | undefined>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCategoryBySlug(slug).
    then(setCategory).
    finally(() => setLoading(false));
  }, [slug]);

  if (!isLoading && !category) {
    return (
      <div className="container py-20">
        <EmptyState
          title="Collection not found"
          description="That collection may have been renamed or retired."
          action={<Button to="/collections">Browse collections</Button>} />
        
      </div>);

  }

  return (
    <div className="w-full bg-ivory">
      <PageHeader
        eyebrow="Collection"
        title={category?.name ?? 'Loading…'}
        description={category?.description}
        crumbs={[
        { label: 'Collections', to: '/collections' },
        { label: category?.name ?? '' }]
        } />
      
      <ProductBrowser categorySlug={slug} perPage={9} />
    </div>);

}