-- ============================================================
-- Dinely – JJuma payments schema
-- Run in the Supabase SQL Editor after the base migration.
-- Safe to re-run (IF NOT EXISTS / additive alters).
-- ============================================================

-- ─── Payments (subscription + order audit trail) ────────────
create table if not exists payments (
  id                   uuid primary key default uuid_generate_v4(),
  kind                 text not null check (kind in ('subscription', 'order')),
  reference_id         text not null,
  user_id              text not null,
  amount               numeric(15, 2) not null,
  currency             text not null default 'RWF',
  status               text not null default 'pending'
                         check (status in ('pending', 'paid', 'failed', 'cancelled')),
  plan                 text,
  billing_cycle        text,
  jjuma_transaction_id text unique,
  jjuma_reference      text,
  idempotency_key      text not null unique,
  description          text,
  paid_at              timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists idx_payments_reference on payments (kind, reference_id);
create index if not exists idx_payments_user on payments (user_id, created_at desc);
create index if not exists idx_payments_status on payments (status);
create unique index if not exists idx_payments_jjuma_txn
  on payments (jjuma_transaction_id)
  where jjuma_transaction_id is not null;

-- ─── Order payment columns ──────────────────────────────────
alter table orders
  add column if not exists payment_method text not null default 'cash';

alter table orders
  add column if not exists payment_status text not null default 'unpaid';

alter table orders
  add column if not exists jjuma_transaction_id text;

alter table orders
  add column if not exists jjuma_reference text;

alter table orders
  add column if not exists paid_at timestamptz;

alter table orders
  add column if not exists delivery_fee numeric(10, 2) not null default 0;

alter table orders
  add column if not exists service_fee numeric(10, 2) not null default 0;

alter table orders
  add column if not exists subtotal numeric(10, 2);

-- Backfill check constraints (ignore if already present)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_payment_method_check'
  ) then
    alter table orders
      add constraint orders_payment_method_check
      check (payment_method in ('jjuma', 'cash'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_payment_status_check'
  ) then
    alter table orders
      add constraint orders_payment_status_check
      check (payment_status in ('unpaid', 'awaiting_payment', 'paid', 'failed', 'cancelled'));
  end if;
end $$;

create index if not exists idx_orders_payment_status on orders (payment_status);

-- ─── Restaurant JJuma subscription refs ─────────────────────
alter table restaurants
  add column if not exists jjuma_subscription_ref text;

alter table restaurants
  add column if not exists subscription_paid_at timestamptz;

-- RLS: service role bypasses; enable for consistency with other tables
alter table payments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'payments' and policyname = 'Service role full access'
  ) then
    create policy "Service role full access" on payments
      for all using (true) with check (true);
  end if;
end $$;
