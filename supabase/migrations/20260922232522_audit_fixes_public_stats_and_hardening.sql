-- Applied to the live project on 2026-09-23.

-- 1. "Members" on the About page counts approved players only (applications are pending players).
create or replace function public.get_public_stats()
returns json language sql stable security definer set search_path to 'public'
as $$
  select json_build_object(
    'members', (select count(*) from public.players where status = 'approved'),
    'games',   (select count(*) from public.games where is_visible = true)
  );
$$;

-- 2. Signed-out visitors never need is_admin() (no anon policy uses it).
revoke execute on function public.is_admin() from anon;

-- 3. Cover the players.reviewed_by foreign key with an index.
create index if not exists players_reviewed_by_idx on public.players (reviewed_by);

-- 4. TRUNCATE bypasses row-level security; the website never needs it.
revoke truncate on all tables in schema public from anon, authenticated;
