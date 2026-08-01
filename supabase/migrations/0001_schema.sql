-- Scent by Motun — core schema
-- Run order: 0001 -> 0002 -> 0003 -> 0004 -> 0005

create extension if not exists "pgcrypto";

/* -------------------------------- profiles -------------------------------- */
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

/* ------------------------------- categories ------------------------------- */
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  image text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;

/* -------------------------------- products -------------------------------- */
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand_line text not null default '',
  description text not null default '',
  notes jsonb not null default '{"top":[],"heart":[],"base":[]}'::jsonb,
  price numeric(12,2) not null default 0,
  compare_at_price numeric(12,2),
  size text not null default '',
  images text[] not null default '{}',
  category_slugs text[] not null default '{}',
  stock integer not null default 0,
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  is_active boolean not null default true,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_category_slugs_idx on public.products using gin (category_slugs);
create index if not exists products_active_idx on public.products (is_active);

grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

/* ------------------------------- addresses -------------------------------- */
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default '',
  street text not null default '',
  city text not null default '',
  state text not null default '',
  country text not null default 'Nigeria',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_idx on public.addresses (user_id);

grant select, insert, update, delete on public.addresses to authenticated;
grant all on public.addresses to service_role;

/* --------------------------------- coupons -------------------------------- */
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percent','fixed')),
  value numeric(12,2) not null default 0,
  min_spend numeric(12,2) not null default 0,
  usage_limit integer not null default 0,
  times_used integer not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

grant select on public.coupons to anon;
grant select, insert, update, delete on public.coupons to authenticated;
grant all on public.coupons to service_role;

/* --------------------------------- orders --------------------------------- */
create sequence if not exists public.order_reference_seq start 10432;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('SBM-' || nextval('public.order_reference_seq')),
  user_id uuid references auth.users(id) on delete set null,
  customer jsonb not null,
  shipping jsonb not null,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending','processing','shipped','delivered','cancelled')),
  payment_method text not null check (payment_method in ('online','whatsapp')),
  payment_reference text,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

grant select, insert, update on public.orders to authenticated;
grant insert on public.orders to anon;
grant all on public.orders to service_role;

/* ------------------------------ testimonials ------------------------------ */
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  quote text not null default '',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

grant select on public.testimonials to anon;
grant select, insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;

/* ----------------------------- contact messages --------------------------- */
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  comment text not null default '',
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

grant insert on public.contact_messages to anon;
grant select, insert, update on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;

/* --------------------------- newsletter subscribers ----------------------- */
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

grant insert on public.newsletter_subscribers to anon;
grant select, insert on public.newsletter_subscribers to authenticated;
grant all on public.newsletter_subscribers to service_role;

/* ------------------------------ store locations --------------------------- */
create table if not exists public.store_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  city text not null default '',
  hours text not null default '',
  phone text not null default ''
);

grant select on public.store_locations to anon;
grant select, insert, update, delete on public.store_locations to authenticated;
grant all on public.store_locations to service_role;

/* ------------------------------- coupon usage ----------------------------- */
-- Lets the storefront bump times_used without granting a general UPDATE.
create or replace function public.redeem_coupon(coupon_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.coupons
     set times_used = times_used + 1
   where lower(code) = lower(coupon_code);
$$;

grant execute on function public.redeem_coupon(text) to anon, authenticated;
