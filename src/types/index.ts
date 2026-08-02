export type ID = string;

export interface Category {
  id: ID;
  slug: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface Product {
  id: ID;
  slug: string;
  name: string;
  brandLine: string;
  description: string;
  notes: {top: string[];heart: string[];base: string[];};
  price: number;
  compareAtPrice?: number;
  size: string;
  images: string[];
  categorySlugs: string[];
  stock: number;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  productId: ID;
  quantity: number;
}

export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
}

export interface Cart {
  lines: CartLine[];
  subtotal: number;
  coupon: AppliedCoupon | null;
  total: number;
}

export type CouponType = 'percent' | 'fixed';

export interface Coupon {
  id: ID;
  code: string;
  type: CouponType;
  value: number;
  minSpend: number;
  usageLimit: number;
  timesUsed: number;
  expiresAt: string;
  isActive: boolean;
}

export type OrderStatus =
'pending' |
'processing' |
'shipped' |
'delivered' |
'cancelled';

export type PaymentMethod = 'online' | 'whatsapp';

export type PaymentStatus = 'unpaid' | 'paid' | 'awaiting_confirmation' | 'refunded';

export interface Address {
  id: ID;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingDetails {
  street: string;
  city: string;
  state: string;
  country: string;
  notes?: string;
}

export interface OrderItem {
  productId: ID;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: ID;
  reference: string;
  customer: CustomerDetails;
  shipping: ShippingDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
  id: ID;
  name: string;
  location: string;
  rating: number;
  quote: string;
  status: TestimonialStatus;
  createdAt: string;
}

export interface ContactMessage {
  id: ID;
  name: string;
  email: string;
  phone: string;
  comment: string;
  createdAt: string;
  isRead: boolean;
}

export interface User {
  id: ID;
  fullName: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export interface StoreLocation {
  id: ID;
  name: string;
  address: string;
  city: string;
  hours: string;
  phone: string;
}

export interface ProductQuery {
  categorySlug?: string;
  search?: string;
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  perPage?: number;
}

export type SortOption =
'featured' |
'price-asc' |
'price-desc' |
'newest' |
'name-asc';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}