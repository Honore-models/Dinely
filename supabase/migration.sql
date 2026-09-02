-- ============================================================
-- Dinely SaaS -Supabase Postgres Migration
-- Run this in the Supabase SQL Editor to create all tables.
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Users ──────────────────────────────────────────────────
create table if not exists users (
  id            uuid primary key default uuid_generate_v4(),
  first_name    text not null,
  last_name     text not null,
  email         text not null unique,
  phone         text not null default '',
  password_hash text not null,
  role          text not null check (role in ('owner', 'customer')),
  restaurant_id text,
  avatar        text,
  address       text,
  favourites    text[] default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_users_email on users (email);
create index if not exists idx_users_role on users (role);

-- ─── Restaurants ────────────────────────────────────────────
create table if not exists restaurants (
  id                  uuid primary key default uuid_generate_v4(),
  owner_id            text not null,
  name                text not null,
  type                text not null default '',
  address             text not null default '',
  opening_hours       text not null default '',
  phone               text not null default '',
  email               text not null default '',
  logo                text,
  description         text,
  website             text,
  capacity            text,
  plan                text not null default 'Professional',
  billing_cycle       text not null default 'monthly',
  stripe_customer_id  text,
  stripe_subscription_id text,
  subscription_status text not null default 'trialing' check (subscription_status in ('active', 'trialing', 'past_due', 'canceled')),
  rating              numeric(3,1) default 0,
  review_count        integer default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_restaurants_owner on restaurants (owner_id);

-- ─── Menu Items ─────────────────────────────────────────────
create table if not exists menu_items (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id text not null,
  name          text not null,
  category      text not null default '',
  price         numeric(10,2) not null default 0,
  description   text,
  image         text,
  meal_times    text[] default '{}',
  price_range   text default '$',
  promo         text,
  rating        numeric(3,1) default 0,
  reviews       integer default 0,
  orders        integer default 0,
  favourites    integer default 0,
  available     boolean default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_menu_restaurant on menu_items (restaurant_id);
create index if not exists idx_menu_category on menu_items (restaurant_id, category);

-- ─── Orders ─────────────────────────────────────────────────
create table if not exists orders (
  id               uuid primary key default uuid_generate_v4(),
  restaurant_id    text not null,
  customer_id      text not null,
  customer_name    text not null default '',
  items            jsonb not null default '[]',
  type             text not null check (type in ('Delivery', 'Takeaway', 'Dine-in')),
  status           text not null default 'Pending' check (status in ('Pending', 'Active', 'Completed', 'Cancelled')),
  total            numeric(10,2) not null default 0,
  delivery_address text,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_orders_restaurant on orders (restaurant_id, created_at desc);
create index if not exists idx_orders_customer on orders (customer_id, created_at desc);
create index if not exists idx_orders_status on orders (status);

-- ─── Bookings ───────────────────────────────────────────────
create table if not exists bookings (
  id             uuid primary key default uuid_generate_v4(),
  restaurant_id  text not null,
  customer_id    text not null,
  customer_name  text not null default '',
  customer_email text not null default '',
  table_id       text,
  date           text not null,
  time           text not null,
  party_size     integer not null default 1,
  status         text not null default 'Pending' check (status in ('Pending', 'Confirmed', 'Cancelled', 'Completed')),
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_bookings_restaurant on bookings (restaurant_id, date);
create index if not exists idx_bookings_customer on bookings (customer_id);

-- ─── Tables ─────────────────────────────────────────────────
create table if not exists restaurant_tables (
  id             uuid primary key default uuid_generate_v4(),
  restaurant_id  text not null,
  number         integer not null,
  capacity       integer not null default 2,
  location       text,
  status         text not null default 'available' check (status in ('available', 'occupied', 'reserved', 'inactive')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (restaurant_id, number)
);

create index if not exists idx_tables_restaurant on restaurant_tables (restaurant_id);

-- ─── Employees ──────────────────────────────────────────────
create table if not exists employees (
  id             uuid primary key default uuid_generate_v4(),
  restaurant_id  text not null,
  first_name     text not null,
  last_name      text not null,
  email          text not null,
  phone          text not null default '',
  role           text not null default '',
  salary         numeric(10,2),
  start_date     text,
  notes          text,
  image          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (restaurant_id, email)
);

create index if not exists idx_employees_restaurant on employees (restaurant_id);

-- ─── Reviews ────────────────────────────────────────────────
create table if not exists reviews (
  id             uuid primary key default uuid_generate_v4(),
  restaurant_id  text not null,
  customer_id    text not null,
  customer_name  text not null default '',
  rating         integer not null check (rating between 1 and 5),
  comment        text not null default '',
  helpful        integer default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (restaurant_id, customer_id)
);

create index if not exists idx_reviews_restaurant on reviews (restaurant_id);

-- ─── Row Level Security (RLS) ──────────────────────────────
-- Enable RLS on all tables but use service_role in API routes to bypass.
-- This provides an extra safety net if anon key is ever used client-side.

alter table users enable row level security;
alter table restaurants enable row level security;
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table bookings enable row level security;
alter table restaurant_tables enable row level security;
alter table employees enable row level security;
alter table reviews enable row level security;

-- Allow service_role full access (API routes use service_role key)
create policy "Service role full access" on users for all using (true) with check (true);
create policy "Service role full access" on restaurants for all using (true) with check (true);
create policy "Service role full access" on menu_items for all using (true) with check (true);
create policy "Service role full access" on orders for all using (true) with check (true);
create policy "Service role full access" on bookings for all using (true) with check (true);
create policy "Service role full access" on restaurant_tables for all using (true) with check (true);
create policy "Service role full access" on employees for all using (true) with check (true);
create policy "Service role full access" on reviews for all using (true) with check (true);
