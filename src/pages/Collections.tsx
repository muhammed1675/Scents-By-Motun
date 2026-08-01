import React, { useEffect, useState } from 'react';
import { Category } from '../types';
import { getCategories } from '../services';
import { CategoryTile } from '../components/CategoryTile';
import { PageHeader } from '../components/PageHeader';
import { NewsletterSignup } from '../components/NewsletterSignup';

export function Collections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().
    then(setCategories).
    finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-ivory">
      <PageHeader
        eyebrow="Collections"
        title="Every way to wear Motun"
        description="Fourteen collections spanning parfums, oils, mists, gifting and home fragrance."
        crumbs={[{ label: 'Collections' }]} />
      

      <div className="container pb-16">
        {isLoading ?
        <div className="grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) =>
          <div key={i} className="aspect-[3/4] rounded-sm bg-cream" />
          )}
          </div> :

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) =>
          <li key={c.id}>
                <CategoryTile category={c} size="lg" />
              </li>
          )}
          </ul>
        }
      </div>

      <NewsletterSignup />
    </div>);

}