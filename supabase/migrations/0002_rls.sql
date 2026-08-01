-- Row Level Security policies

/* Admin check helper — security definer so policies never recurse into profiles. */
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
     where p.id = uid and p.role = 'admin'
  );
$$;

grant execute on function public.is_admin(uuid) to anon, authenticated;

/* -------------------------------- profiles -------------------------------- */
alter table public.profiles enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

/* -------------------------- categories & products ------------------------- */
alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select to anon, authenticated using (true);

drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

/* ------------------------------- addresses -------------------------------- */
alter table public.addresses enable row level security;

drop policy if exists "addresses owner all" on public.addresses;
create policy "addresses owner all" on public.addresses
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

/* --------------------------------- coupons -------------------------------- */
alter table public.coupons enable row level security;

drop policy if exists "coupons public read active" on public.coupons;
create policy "coupons public read active" on public.coupons
  for select to anon, authenticated
  using (is_active = true or public.is_admin(auth.uid()));

drop policy if exists "coupons admin write" on public.coupons;
create policy "coupons admin write" on public.coupons
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

/* --------------------------------- orders --------------------------------- */
alter table public.orders enable row level security;

-- Guests may place an order (user_id null); signed-in shoppers must own it.
drop policy if exists "orders insert own or guest" on public.orders;
create policy "orders insert own or guest" on public.orders
  for insert to anon, authenticated
  with check (
    (auth.uid() is null and user_id is null)
    or user_id = auth.uid()
  );

drop policy if exists "orders read own or admin" on public.orders;
create policy "orders read own or admin" on public.orders
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update" on public.orders
  for update to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

/* ------------------------------ testimonials ------------------------------ */
alter table public.testimonials enable row level security;

drop policy if exists "testimonials public read approved" on public.testimonials;
create policy "testimonials public read approved" on public.testimonials
  for select to anon, authenticated
  using (status = 'approved' or public.is_admin(auth.uid()));

drop policy if exists "testimonials admin write" on public.testimonials;
create policy "testimonials admin write" on public.testimonials
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

/* --------------------------- contact + newsletter ------------------------- */
alter table public.contact_messages enable row level security;

drop policy if exists "messages public insert" on public.contact_messages;
create policy "messages public insert" on public.contact_messages
  for insert to anon, authenticated with check (true);

drop policy if exists "messages admin read" on public.contact_messages;
create policy "messages admin read" on public.contact_messages
  for select to authenticated using (public.is_admin(auth.uid()));

drop policy if exists "messages admin update" on public.contact_messages;
create policy "messages admin update" on public.contact_messages
  for update to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter public insert" on public.newsletter_subscribers;
create policy "newsletter public insert" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

drop policy if exists "newsletter admin read" on public.newsletter_subscribers;
create policy "newsletter admin read" on public.newsletter_subscribers
  for select to authenticated using (public.is_admin(auth.uid()));

/* ------------------------------ store locations --------------------------- */
alter table public.store_locations enable row level security;

drop policy if exists "locations public read" on public.store_locations;
create policy "locations public read" on public.store_locations
  for select to anon, authenticated using (true);

drop policy if exists "locations admin write" on public.store_locations;
create policy "locations admin write" on public.store_locations
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
