import {
  Address,
  Category,
  ContactMessage,
  Coupon,
  Order,
  Product,
  StoreLocation,
  Testimonial } from
'../types';

/* Row -> domain mappers. Every returned shape matches src/types/index.ts exactly. */

export function toProduct(row: any): Product {
  const notes = row.notes ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brandLine: row.brand_line ?? '',
    description: row.description ?? '',
    notes: {
      top: notes.top ?? [],
      heart: notes.heart ?? [],
      base: notes.base ?? []
    },
    price: Number(row.price),
    compareAtPrice:
    row.compare_at_price === null || row.compare_at_price === undefined ?
    undefined :
    Number(row.compare_at_price),
    size: row.size ?? '',
    images: row.images ?? [],
    categorySlugs: row.category_slugs ?? [],
    stock: row.stock ?? 0,
    isNewArrival: !!row.is_new_arrival,
    isBestSeller: !!row.is_best_seller,
    isActive: !!row.is_active,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0
  };
}

export function fromProduct(p: Partial<Product>) {
  const row: Record<string, unknown> = {};
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.name !== undefined) row.name = p.name;
  if (p.brandLine !== undefined) row.brand_line = p.brandLine;
  if (p.description !== undefined) row.description = p.description;
  if (p.notes !== undefined) row.notes = p.notes;
  if (p.price !== undefined) row.price = p.price;
  if (p.compareAtPrice !== undefined) row.compare_at_price = p.compareAtPrice ?? null;
  if (p.size !== undefined) row.size = p.size;
  if (p.images !== undefined) row.images = p.images;
  if (p.categorySlugs !== undefined) row.category_slugs = p.categorySlugs;
  if (p.stock !== undefined) row.stock = p.stock;
  if (p.isNewArrival !== undefined) row.is_new_arrival = p.isNewArrival;
  if (p.isBestSeller !== undefined) row.is_best_seller = p.isBestSeller;
  if (p.isActive !== undefined) row.is_active = p.isActive;
  if (p.rating !== undefined) row.rating = p.rating;
  if (p.reviewCount !== undefined) row.review_count = p.reviewCount;
  return row;
}

export function toCategory(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? '',
    image: row.image ?? '',
    isActive: !!row.is_active
  };
}

export function fromCategory(c: Partial<Category>) {
  const row: Record<string, unknown> = {};
  if (c.slug !== undefined) row.slug = c.slug;
  if (c.name !== undefined) row.name = c.name;
  if (c.description !== undefined) row.description = c.description;
  if (c.image !== undefined) row.image = c.image;
  if (c.isActive !== undefined) row.is_active = c.isActive;
  return row;
}

export function toAddress(row: any): Address {
  return {
    id: row.id,
    label: row.label ?? '',
    street: row.street ?? '',
    city: row.city ?? '',
    state: row.state ?? '',
    country: row.country ?? 'Nigeria',
    isDefault: !!row.is_default
  };
}

export function toCoupon(row: any): Coupon {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: Number(row.value),
    minSpend: Number(row.min_spend ?? 0),
    usageLimit: row.usage_limit ?? 0,
    timesUsed: row.times_used ?? 0,
    expiresAt: row.expires_at ?? '',
    isActive: !!row.is_active
  };
}

export function fromCoupon(c: Partial<Coupon>) {
  const row: Record<string, unknown> = {};
  if (c.code !== undefined) row.code = c.code;
  if (c.type !== undefined) row.type = c.type;
  if (c.value !== undefined) row.value = c.value;
  if (c.minSpend !== undefined) row.min_spend = c.minSpend;
  if (c.usageLimit !== undefined) row.usage_limit = c.usageLimit;
  if (c.timesUsed !== undefined) row.times_used = c.timesUsed;
  if (c.expiresAt !== undefined) row.expires_at = c.expiresAt || null;
  if (c.isActive !== undefined) row.is_active = c.isActive;
  return row;
}

export function toOrder(row: any): Order {
  return {
    id: row.id,
    reference: row.reference,
    customer: row.customer ?? { fullName: '', email: '', phone: '' },
    shipping: row.shipping ?? { street: '', city: '', state: '', country: 'Nigeria' },
    items: row.items ?? [],
    subtotal: Number(row.subtotal ?? 0),
    discount: Number(row.discount ?? 0),
    shippingFee: Number(row.shipping_fee ?? 0),
    total: Number(row.total ?? 0),
    status: row.status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status ?? (row.status === 'cancelled' ? 'refunded' : 'unpaid'),
    createdAt: row.created_at
  };
}

export function toTestimonial(row: any): Testimonial {
  return {
    id: row.id,
    name: row.name,
    location: row.location ?? '',
    rating: Number(row.rating ?? 5),
    quote: row.quote ?? '',
    status: row.status,
    createdAt: row.created_at
  };
}

export function toMessage(row: any): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? '',
    comment: row.comment ?? '',
    createdAt: row.created_at,
    isRead: !!row.is_read
  };
}

export function toLocation(row: any): StoreLocation {
  return {
    id: row.id,
    name: row.name,
    address: row.address ?? '',
    city: row.city ?? '',
    hours: row.hours ?? '',
    phone: row.phone ?? ''
  };
}