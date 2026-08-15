-- Custom Request ("can't find it? we'll source it") + safe guest order tracking
-- Run order: 0001 -> 0002 -> 0003 -> 0004 -> 0005 -> 0006 -> 0007

/* ----------------------------- custom requests ----------------------------- */
create sequence if not exists public.custom_request_reference_seq start 1001;

create table if not exists public.custom_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('CR-' || nextval('public.custom_request_reference_seq')),
  item_description text not null,
  details text not null default '',
  quantity integer not null default 1,
  budget numeric(12,2),
  need_by date,
  reference_images text[] not null default '{}',
  full_name text not null,
  phone text not null,
  email text not null default '',
  status text not null default 'new'
    check (status in ('new','reviewing','quoted','fulfilled','declined')),
  admin_notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists custom_requests_status_idx on public.custom_requests (status);

grant insert on public.custom_requests to anon;
grant select, insert, update on public.custom_requests to authenticated;
grant all on public.custom_requests to service_role;

alter table public.custom_requests enable row level security;

drop policy if exists "custom requests public insert" on public.custom_requests;
create policy "custom requests public insert" on public.custom_requests
  for insert to anon, authenticated with check (true);

drop policy if exists "custom requests admin read" on public.custom_requests;
create policy "custom requests admin read" on public.custom_requests
  for select to authenticated using (public.is_admin(auth.uid()));

drop policy if exists "custom requests admin update" on public.custom_requests;
create policy "custom requests admin update" on public.custom_requests
  for update to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

/* Reference-image uploads from the custom request form — public bucket,
   anyone may upload (customers are anonymous here), nobody may overwrite or
   delete another person's file, everyone may read (needed to preview/display). */
insert into storage.buckets (id, name, public)
values ('custom-request-images', 'custom-request-images', true)
on conflict (id) do update set public = true;

drop policy if exists "custom request images public read" on storage.objects;
create policy "custom request images public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'custom-request-images');

drop policy if exists "custom request images public insert" on storage.objects;
create policy "custom request images public insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'custom-request-images');

/* -------------------------- guest order tracking --------------------------- */
-- Orders already block anon SELECT (see 0002_rls.sql), which is correct —
-- a guessable order reference alone should never expose someone else's name,
-- address and phone number. This function is the one narrow, safe exception:
-- it only returns a row when the reference AND the email/phone on file both
-- match what the visitor typed, so it works like a "reference + password".
create or replace function public.track_order(p_reference text, p_contact text)
returns setof public.orders
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.orders
  where reference = upper(trim(p_reference))
    and (
      lower(customer ->> 'email') = lower(trim(p_contact))
      or regexp_replace(customer ->> 'phone', '\D', '', 'g') = regexp_replace(p_contact, '\D', '', 'g')
    )
  limit 1;
$$;

grant execute on function public.track_order(text, text) to anon, authenticated;
