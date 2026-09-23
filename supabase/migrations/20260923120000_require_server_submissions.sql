-- Apply this only AFTER you have set SUPABASE_SERVICE_ROLE_KEY (and, ideally, the Turnstile keys)
-- in your hosting environment and confirmed a test application goes through /api/apply.
--
-- Effect: browsers can no longer insert applications or upload photos directly with the public anon key, so every
-- application must pass the server route (rate limit + CAPTCHA + validation). The service role key used by the
-- route bypasses row-level security, so it keeps working.
--
-- Safe to run more than once (every policy is dropped before it is created).
--
-- Apply with:  npx supabase db push   (or paste into the Supabase SQL editor)

drop policy if exists "Visitors submit applications" on public.players;

-- Signed-in admins can still add players from the dashboard.
drop policy if exists "Admins add players, others submit applications" on public.players;
drop policy if exists "Admins add players" on public.players;
create policy "Admins add players" on public.players for insert to authenticated with check ((select public.is_admin()));

-- Photos are uploaded by the server route now; keep admin uploads from the dashboard working.
drop policy if exists player_photos_public_upload on storage.objects;
drop policy if exists player_photos_admin_upload on storage.objects;
create policy player_photos_admin_upload on storage.objects for insert to authenticated
  with check ((bucket_id = 'player-photos') and (select public.is_admin()));
