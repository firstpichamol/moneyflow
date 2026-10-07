-- Create extension
create extension if not exists "pgcrypto";

-- Create profiles table
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  created_at timestamptz not null default now()
);

-- Create line_profiles table
create table if not exists line_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  line_user_id text unique not null,
  display_name text,
  created_at timestamptz not null default now()
);

-- Create line_link_codes table
create table if not exists line_link_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  user_id uuid references profiles(id) on delete cascade,
  used_at timestamptz null,
  expires_at timestamptz not null default now() + interval '30 minutes',
  created_at timestamptz not null default now()
);

-- Create transactions table
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12,2) not null check (amount > 0),
  category text not null,
  description text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Create indexes
create index if not exists idx_transactions_user_id on transactions(user_id);
create index if not exists idx_transactions_created_at on transactions(created_at);
