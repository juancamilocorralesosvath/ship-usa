create extension if not exists pgcrypto;

create table products (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  external_id text not null,
  category text not null check (category in ('ropa', 'tecnologia')),
  title text not null,
  brand text,
  image_url text,
  price_usd numeric(10,2),
  product_url text,
  is_trending boolean not null default false,
  active boolean not null default true,
  synced_at timestamptz not null default now(),
  unique (source, external_id)
);

create table catalog_sources (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'shopify' check (kind in ('shopify')),
  domain text not null unique,
  brand_name text not null,
  enabled boolean not null default false,
  last_sync_status text
);

create table trips (
  id uuid primary key default gen_random_uuid(),
  traveler text not null check (traveler in ('papa', 'juan_camilo')),
  departs_on date not null,
  returns_on date,
  order_cutoff date not null,
  notes text,
  published boolean not null default false
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'nuevo'
    check (status in ('nuevo','cotizado','confirmado','comprado','en_camino','entregado','cancelado')),
  customer_name text not null,
  whatsapp text not null,
  city text not null,
  notes text,
  trip_id uuid references trips(id),
  quoted_total_cop numeric(12,0),
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity int not null default 1 check (quantity > 0),
  variant text,
  notes text
);

create table custom_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_name text not null,
  brand text,
  reference text,
  variant text,
  link text,
  description text,
  quantity int not null default 1 check (quantity > 0),
  budget_cop numeric(12,0),
  photo_paths text[] not null default '{}',
  channel text not null default 'form' check (channel in ('form', 'chat'))
);

-- RLS: anonymous reads only active products and published trips.
-- Orders are written by server actions with the service role; nothing public reads them.
alter table products enable row level security;
alter table catalog_sources enable row level security;
alter table trips enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table custom_requests enable row level security;

create policy "public reads active products" on products
  for select to anon, authenticated using (active);
create policy "public reads published trips" on trips
  for select to anon, authenticated using (published);

-- Admin access goes through the service role in server code after the
-- ADMIN_EMAILS check, so no authenticated-role policies are needed.

insert into storage.buckets (id, name, public)
values ('request-photos', 'request-photos', false)
on conflict (id) do nothing;
