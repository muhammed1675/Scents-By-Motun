import {
  Category,
  Paginated,
  Product,
  ProductQuery } from
'../types';
import { supabase } from './supabase';
import { toCategory, toProduct } from './mappers';

function applySort(query: any, sort: ProductQuery['sort'] = 'featured') {
  switch (sort) {
    case 'price-asc':
      return query.order('price', { ascending: true });
    case 'price-desc':
      return query.order('price', { ascending: false });
    case 'newest':
      return query.
      order('is_new_arrival', { ascending: false }).
      order('created_at', { ascending: false });
    case 'name-asc':
      return query.order('name', { ascending: true });
    default:
      return query.
      order('is_best_seller', { ascending: false }).
      order('name', { ascending: true });
  }
}

export async function getProducts(
query: ProductQuery = {})
: Promise<Paginated<Product>> {
  const {
    categorySlug,
    search,
    inStockOnly,
    minPrice,
    maxPrice,
    sort = 'featured',
    page = 1,
    perPage = 9
  } = query;

  let q = supabase.
  from('products').
  select('*', { count: 'exact' }).
  eq('is_active', true);

  if (categorySlug) q = q.contains('category_slugs', [categorySlug]);
  if (search) {
    const term = search.replace(/[%,()]/g, ' ').trim();
    if (term) {
      q = q.or(
        `name.ilike.%${term}%,brand_line.ilike.%${term}%,description.ilike.%${term}%`
      );
    }
  }
  if (inStockOnly) q = q.gt('stock', 0);
  if (typeof minPrice === 'number') q = q.gte('price', minPrice);
  if (typeof maxPrice === 'number') q = q.lte('price', maxPrice);

  q = applySort(q, sort);

  // Count first so the page number can be clamped exactly like the mock did.
  const countProbe = await q.range(0, 0);
  if (countProbe.error) throw new Error(countProbe.error.message);
  const total = countProbe.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;

  const { data, error } = await q.range(start, start + perPage - 1);
  if (error) throw new Error(error.message);

  return {
    items: (data ?? []).map(toProduct),
    total,
    page: safePage,
    perPage,
    totalPages
  };
}

export async function getProductBySlug(
slug: string)
: Promise<Product | undefined> {
  const { data, error } = await supabase.
  from('products').
  select('*').
  eq('slug', slug).
  eq('is_active', true).
  maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toProduct(data) : undefined;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase.
  from('products').
  select('*').
  in('id', ids);
  if (error) throw new Error(error.message);
  return (data ?? []).map(toProduct);
}

export async function getRelatedProducts(
product: Product,
limit = 4)
: Promise<Product[]> {
  if (product.categorySlugs.length === 0) return [];
  const { data, error } = await supabase.
  from('products').
  select('*').
  eq('is_active', true).
  neq('id', product.id).
  overlaps('category_slugs', product.categorySlugs).
  limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map(toProduct);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase.
  from('products').
  select('*').
  eq('is_active', true).
  eq('is_best_seller', true).
  limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map(toProduct);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase.
  from('products').
  select('*').
  eq('is_active', true).
  eq('is_new_arrival', true).
  limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map(toProduct);
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.
  from('categories').
  select('*').
  eq('is_active', true).
  order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toCategory);
}

export async function getCategoryBySlug(
slug: string)
: Promise<Category | undefined> {
  const { data, error } = await supabase.
  from('categories').
  select('*').
  eq('slug', slug).
  maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toCategory(data) : undefined;
}

export async function getPriceRange(): Promise<{min: number;max: number;}> {
  const [lowest, highest] = await Promise.all([
  supabase.
  from('products').
  select('price').
  eq('is_active', true).
  order('price', { ascending: true }).
  limit(1).
  maybeSingle(),
  supabase.
  from('products').
  select('price').
  eq('is_active', true).
  order('price', { ascending: false }).
  limit(1).
  maybeSingle()]
  );
  if (lowest.error) throw new Error(lowest.error.message);
  if (highest.error) throw new Error(highest.error.message);
  return {
    min: Number(lowest.data?.price ?? 0),
    max: Number(highest.data?.price ?? 0)
  };
}
