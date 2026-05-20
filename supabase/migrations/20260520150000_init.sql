-- Run this in the Supabase SQL editor (or supabase db push).

create extension if not exists "pgcrypto";

create table if not exists public.word_pairs (
  id uuid primary key default gen_random_uuid(),
  word_civilian text not null,
  word_undercover text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: friend group only, no separate user auth, so we
-- expose anon-key access. Tighten later if you ever go public.
alter table public.word_pairs enable row level security;

drop policy if exists "anon read"   on public.word_pairs;
drop policy if exists "anon insert" on public.word_pairs;
drop policy if exists "anon delete" on public.word_pairs;

create policy "anon read"   on public.word_pairs for select using (true);
create policy "anon insert" on public.word_pairs for insert with check (true);
create policy "anon delete" on public.word_pairs for delete using (true);

-- A couple of seeds so the first round works out of the box.
insert into public.word_pairs (word_civilian, word_undercover) values
  ('Laptop', 'Tablet'),
  ('Coffee', 'Tea'),
  ('Beach', 'Pool'),
  ('Football', 'Basketball'),
  ('Pizza', 'Lasagna')
on conflict do nothing;
