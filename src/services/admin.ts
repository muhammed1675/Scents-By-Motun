import {
  Category,
  ContactMessage,
  Coupon,
  CustomRequest,
  CustomRequestStatus,
  Order,
  OrderStatus,
  Product,
  Testimonial,
  TestimonialStatus } from
'../types';
import { supabase } from './supabase';
import { slugify } from './db';
import {
  fromCategory,
  fromCoupon,
  fromProduct,
  toCategory,
  toCoupon,
  toCustomRequest,
  toMessage,
  toOrder,
  toProduct,
  toTestimonial } from
'./mappers';

/* -------------------------------- access ---------------------------------- */

/** True only when the signed-in user's profile row has role = 'admin'. */
export async function checkAdminAccess(): Promise<boolean> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;
  const { data, error } = await supabase.
  from('profiles').
  select('role').
  eq('id', auth.user.id).
  maybeSingle();
  if (error) return false;
  return data?.role === 'admin';
}

/* ---------------------------------- stats --------------------------------- */

export interface AdminStats {
  revenue: number;
  orderCount: number;
  pendingOrders: number;
  lowStockCount: number;
  unreadMessages: number;
  pendingTestimonials: number;
  newCustomRequests: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [orders, lowStock, messages, testimonials, customRequests] = await Promise.all([
  supabase.from('orders').select('total,status'),
  supabase.
  from('products').
  select('id', { count: 'exact', head: true }).
  eq('is_active', true).
  lte('stock', 8),
  supabase.
  from('contact_messages').
  select('id', { count: 'exact', head: true }).
  eq('is_read', false),
  supabase.
  from('testimonials').
  select('id', { count: 'exact', head: true }).
  eq('status', 'pending'),
  supabase.
  from('custom_requests').
  select('id', { count: 'exact', head: true }).
  eq('status', 'new')]
  );

  const rows = (orders.data ?? []) as { total: number; status: OrderStatus }[];
  return {
    revenue: rows.
    filter((o) => o.status !== 'cancelled').
    reduce((sum, o) => sum + Number(o.total), 0),
    orderCount: rows.length,
    pendingOrders: rows.filter((o) => o.status === 'pending').length,
    lowStockCount: lowStock.count ?? 0,
    unreadMessages: messages.count ?? 0,
    pendingTestimonials: testimonials.count ?? 0,
    newCustomRequests: customRequests.count ?? 0
  };
}

/* --------------------------------- products -------------------------------- */

export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await supabase.
  from('products').
  select('*').
  order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toProduct);
}

export async function saveProduct(
input: Omit<Product, 'id' | 'slug'> & {id?: string;slug?: string;})
: Promise<Product> {
  const row = fromProduct(input as Partial<Product>);
  if (input.id) {
    const { data, error } = await supabase.
    from('products').
    update(row).
    eq('id', input.id).
    select('*').
    single();
    if (error) throw new Error(error.message);
    return toProduct(data);
  }
  row.slug = input.slug || slugify(input.name);
  const { data, error } = await supabase.
  from('products').
  insert(row).
  select('*').
  single();
  if (error) throw new Error(error.message);
  return toProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Uploads an image to the public `product-images` bucket and returns its URL. */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.
  from('product-images').
  upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

/* -------------------------------- categories ------------------------------- */

export async function getAdminCategories(): Promise<Category[]> {
  const { data, error } = await supabase.
  from('categories').
  select('*').
  order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toCategory);
}

export async function saveCategory(
input: Omit<Category, 'id' | 'slug'> & {id?: string;slug?: string;})
: Promise<Category> {
  const row = fromCategory(input as Partial<Category>);
  if (input.id) {
    const { data, error } = await supabase.
    from('categories').
    update(row).
    eq('id', input.id).
    select('*').
    single();
    if (error) throw new Error(error.message);
    return toCategory(data);
  }
  row.slug = input.slug || slugify(input.name);
  const { data, error } = await supabase.
  from('categories').
  insert(row).
  select('*').
  single();
  if (error) throw new Error(error.message);
  return toCategory(data);
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/* ---------------------------------- orders --------------------------------- */

export async function getAdminOrders(status?: OrderStatus | 'all'): Promise<Order[]> {
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (status && status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(toOrder);
}

export async function getAdminOrder(id: string): Promise<Order | undefined> {
  const { data, error } = await supabase.
  from('orders').
  select('*').
  eq('id', id).
  maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toOrder(data) : undefined;
}

export async function updateOrderStatus(
id: string,
status: OrderStatus)
: Promise<Order | undefined> {
  const { data, error } = await supabase.
  from('orders').
  update({ status }).
  eq('id', id).
  select('*').
  maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toOrder(data) : undefined;
}

/* --------------------------------- coupons --------------------------------- */

export async function getAdminCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase.
  from('coupons').
  select('*').
  order('code', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toCoupon);
}

export async function saveCoupon(
input: Omit<Coupon, 'id'> & {id?: string;})
: Promise<Coupon> {
  const row = fromCoupon(input as Partial<Coupon>);
  if (input.id) {
    const { data, error } = await supabase.
    from('coupons').
    update(row).
    eq('id', input.id).
    select('*').
    single();
    if (error) throw new Error(error.message);
    return toCoupon(data);
  }
  const { data, error } = await supabase.
  from('coupons').
  insert(row).
  select('*').
  single();
  if (error) throw new Error(error.message);
  return toCoupon(data);
}

export async function deleteCoupon(id: string): Promise<void> {
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/* ------------------------------- testimonials ------------------------------ */

export async function getAdminTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.
  from('testimonials').
  select('*').
  order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toTestimonial);
}

export async function setTestimonialStatus(
id: string,
status: TestimonialStatus)
: Promise<Testimonial | undefined> {
  const { data, error } = await supabase.
  from('testimonials').
  update({ status }).
  eq('id', id).
  select('*').
  maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toTestimonial(data) : undefined;
}

/* --------------------------------- messages -------------------------------- */

export async function getAdminMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase.
  from('contact_messages').
  select('*').
  order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toMessage);
}

export async function markMessageRead(
id: string,
isRead: boolean)
: Promise<ContactMessage[]> {
  const { error } = await supabase.
  from('contact_messages').
  update({ is_read: isRead }).
  eq('id', id);
  if (error) throw new Error(error.message);
  return getAdminMessages();
}

/* ---------------------------- custom requests ------------------------------ */

export async function getAdminCustomRequests(): Promise<CustomRequest[]> {
  const { data, error } = await supabase.
  from('custom_requests').
  select('*').
  order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toCustomRequest);
}

export async function updateCustomRequest(
id: string,
patch: {status?: CustomRequestStatus;adminNotes?: string;})
: Promise<CustomRequest[]> {
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.adminNotes !== undefined) row.admin_notes = patch.adminNotes;
  const { error } = await supabase.
  from('custom_requests').
  update(row).
  eq('id', id);
  if (error) throw new Error(error.message);
  return getAdminCustomRequests();
}
