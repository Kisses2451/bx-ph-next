-- Applied to the live project on 2026-09-23.
-- One permissive policy per role and action (faster), and is_admin() wrapped in a sub-select so Postgres runs it once per query.

do $$
declare t text;
begin
  foreach t in array array['events','games','latest_updates','partners','staff','timeline_events'] loop
    execute format('drop policy if exists "Admins manage all rows" on public.%I', t);
    execute format('drop policy if exists "Public can read visible rows" on public.%I', t);
    execute format('create policy "Visitors read visible rows" on public.%I for select to anon using (is_visible = true)', t);
    execute format('create policy "Signed-in read visible rows, admins read all" on public.%I for select to authenticated using (is_visible = true or (select public.is_admin()))', t);
    execute format('create policy "Admins insert" on public.%I for insert to authenticated with check ((select public.is_admin()))', t);
    execute format('create policy "Admins update" on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('create policy "Admins delete" on public.%I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end $$;

-- players: applications come in as pending rows; only admins can read or change them.
drop policy if exists "Admins manage players" on public.players;
drop policy if exists "Public can submit applications" on public.players;

create or replace function public.is_valid_application(p public.players)
returns boolean
language sql
immutable
set search_path to 'public'
as $$
  select p.status = 'pending' and p.reviewed_by is null and p.reviewed_at is null
    and p.consent_privacy is true and p.consent_eligibility is true
    and p.contact_number is not null and p.date_of_birth is not null and p.contact_link is not null
    and p.registration_source is not null and p.in_game_name is not null and p.uid is not null
    and (p.main_game = 'HOK' or (p.department is not null and p.player_id is not null and p.photo_path is not null));
$$;

create policy "Visitors submit applications" on public.players for insert to anon
  with check (public.is_valid_application(players));
create policy "Admins add players, others submit applications" on public.players for insert to authenticated
  with check ((select public.is_admin()) or public.is_valid_application(players));
create policy "Admins read players" on public.players for select to authenticated using ((select public.is_admin()));
create policy "Admins update players" on public.players for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete players" on public.players for delete to authenticated using ((select public.is_admin()));

-- admin_users: people can see their own row; admins can see and manage all.
drop policy if exists admin_users_admin_write on public.admin_users;
drop policy if exists admin_users_self_read on public.admin_users;
create policy "Own row or admin reads" on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "Admins insert admins" on public.admin_users for insert to authenticated with check ((select public.is_admin()));
create policy "Admins update admins" on public.admin_users for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete admins" on public.admin_users for delete to authenticated using ((select public.is_admin()));

-- One round trip for the admin Players tab counts. SECURITY INVOKER: row-level security still applies,
-- so anyone who is not an admin just gets zeros.
create or replace function public.admin_player_counts()
returns json
language sql
stable
security invoker
set search_path to 'public'
as $$
  select json_build_object(
    'total',    count(*),
    'approved', count(*) filter (where status = 'approved'),
    'pending',  count(*) filter (where status = 'pending'),
    'rejected', count(*) filter (where status = 'rejected')
  ) from public.players;
$$;
revoke execute on function public.admin_player_counts() from anon;
grant execute on function public.admin_player_counts() to authenticated;
