-- Player groups: saved squads so the host doesn't re-type names every game.
-- Shared across all friends (anon-key RLS, same trust model as word_pairs).

create table if not exists public.player_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  players jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.player_groups enable row level security;

drop policy if exists "anon read"   on public.player_groups;
drop policy if exists "anon insert" on public.player_groups;
drop policy if exists "anon delete" on public.player_groups;

create policy "anon read"   on public.player_groups for select using (true);
create policy "anon insert" on public.player_groups for insert with check (true);
create policy "anon delete" on public.player_groups for delete using (true);
