-- ============================================================
-- RUKWARO AUTOSPARES — Supabase schema (MVP)
-- Run this in Supabase SQL Editor after creating your project.
-- ============================================================

-- 1) PRODUCTS ------------------------------------------------
create table if not exists public.products (
  id            text primary key,
  sku           text unique not null,
  name          text not null,
  category      text not null check (category in
                  ('lighting','lenses','bumpers-grills','fenders-mudflaps','oils-lubricants','service-parts')),
  category_name text not null,
  subcategory   text not null,
  brand         text not null,
  grade         text not null check (grade in
                  ('OEM Genuine','Certified Aftermarket','Performance OEM')),
  oem_part_number text not null,
  side          text,
  price_kes     integer not null check (price_kes >= 0),
  original_price_kes integer,
  rating        numeric(2,1) default 5.0,
  reviews_count integer default 0,
  image         text not null,
  description   text not null default '',
  key_specs     jsonb not null default '{}'::jsonb,
  compatible_vehicles text[] not null default '{}',
  stock_kirinyaga  boolean not null default true,
  stock_industrial boolean not null default true,
  stock_westlands  boolean not null default true,
  is_featured   boolean not null default false,
  is_bestseller boolean not null default false,
  badge         text,
  volume_or_qty text,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 2) ORDERS --------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_ref       text unique not null,
  customer_name   text not null,
  phone           text not null,
  vehicle         text,
  branch          text not null,
  delivery_method text not null check (delivery_method in ('boda','pickup','upcountry','cod')),
  status          text not null default 'new' check (status in
                    ('new','confirmed','packing','dispatched','delivered','cancelled')),
  subtotal_kes    integer not null check (subtotal_kes >= 0),
  delivery_fee_kes integer not null default 0,
  total_kes       integer not null check (total_kes >= 0),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 3) ORDER ITEMS ---------------------------------------------
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  text references public.products(id),
  name        text not null,
  sku         text not null,
  qty         integer not null check (qty > 0),
  price_kes   integer not null check (price_kes >= 0)
);

-- 4) LEADS / REMINDERS (Rukwaro Club + restock alerts) -------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  phone       text not null,
  name        text,
  vehicle     text,
  kind        text not null default 'club' check (kind in ('club','restock','quote','fleet')),
  note        text,
  created_at  timestamptz not null default now()
);

-- 5) ADMIN ALLOWLIST -----------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email   text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.leads       enable row level security;
alter table public.admin_users enable row level security;

-- Public can read active products
create policy "products_public_read" on public.products
  for select using (active = true);

-- Public can insert leads (club signup / restock request)
create policy "leads_public_insert" on public.leads
  for insert with check (true);

-- Public can create an order (guest checkout) and read their order via a function later;
-- for MVP, any authenticated admin can manage; guests insert only.
create policy "orders_guest_insert" on public.orders
  for insert with check (true);

create policy "order_items_guest_insert" on public.order_items
  for insert with check (true);

-- Admins (allowlisted) can do everything
create policy "products_admin_all" on public.products
  for all using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "orders_admin_all" on public.orders
  for all using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "order_items_admin_all" on public.order_items
  for all using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "leads_admin_all" on public.leads
  for all using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "admin_users_self_read" on public.admin_users
  for select using (user_id = auth.uid());

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================
-- STORAGE BUCKET (product images)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- ============================================================
-- SEED: admin allowlist (run AFTER creating your admin user in
-- Authentication → Users, replace the email)
-- ============================================================
-- insert into public.admin_users (user_id, email)
-- select id, email from auth.users where email = 'admin@rukwaroautospares.co.ke';
