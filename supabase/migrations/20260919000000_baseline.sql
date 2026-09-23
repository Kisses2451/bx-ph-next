-- Baseline: the schema as it was built in the Supabase dashboard before migrations were tracked in this repo
-- (captured from the live project on 2026-09-23). Later files in this folder change it step by step.
-- The live project already has this, so mark it as applied instead of running it:
--   npx supabase migration repair --status applied 20260919000000

-- ---------------------------------------------------------------- tables
create table public.admin_users (
  user_id uuid not null,
  role text default 'admin'::text not null,
  created_at timestamp with time zone default now() not null,
  constraint admin_users_pkey PRIMARY KEY (user_id),
  constraint admin_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  constraint admin_users_role_check CHECK ((role = 'admin'::text))
);
alter table public.admin_users enable row level security;

create table public.events (
  id uuid default gen_random_uuid() not null,
  title text not null,
  event_date date not null,
  location text,
  description text,
  image_url text,
  is_visible boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint events_pkey PRIMARY KEY (id),
  constraint events_description_check CHECK ((char_length(description) <= 400)),
  constraint events_image_url_check CHECK ((char_length(image_url) <= 500)),
  constraint events_location_check CHECK ((char_length(location) <= 120)),
  constraint events_title_check CHECK (((char_length(btrim(title)) >= 1) AND (char_length(btrim(title)) <= 120)))
);
alter table public.events enable row level security;

create table public.games (
  id uuid default gen_random_uuid() not null,
  title text not null,
  tag text,
  description text,
  image_url text,
  is_visible boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint games_pkey PRIMARY KEY (id),
  constraint games_description_check CHECK ((char_length(description) <= 400)),
  constraint games_image_url_check CHECK ((char_length(image_url) <= 500)),
  constraint games_tag_check CHECK ((char_length(tag) <= 40)),
  constraint games_title_check CHECK (((char_length(btrim(title)) >= 1) AND (char_length(btrim(title)) <= 120)))
);
alter table public.games enable row level security;

create table public.latest_updates (
  id uuid default gen_random_uuid() not null,
  tag text,
  title text not null,
  description text,
  published_at timestamp with time zone default now() not null,
  is_visible boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint latest_updates_pkey PRIMARY KEY (id),
  constraint latest_updates_description_check CHECK ((char_length(description) <= 400)),
  constraint latest_updates_tag_check CHECK ((char_length(tag) <= 40)),
  constraint latest_updates_title_check CHECK (((char_length(btrim(title)) >= 1) AND (char_length(btrim(title)) <= 120)))
);
alter table public.latest_updates enable row level security;

create table public.partners (
  id uuid default gen_random_uuid() not null,
  name text not null,
  description text,
  logo_url text,
  website_url text,
  is_visible boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  category text,
  constraint partners_pkey PRIMARY KEY (id),
  constraint partners_category_check CHECK ((char_length(category) <= 40)),
  constraint partners_description_check CHECK ((char_length(description) <= 400)),
  constraint partners_logo_url_check CHECK ((char_length(logo_url) <= 500)),
  constraint partners_name_check CHECK (((char_length(btrim(name)) >= 1) AND (char_length(btrim(name)) <= 120))),
  constraint partners_website_url_check CHECK (((char_length(website_url) <= 300) AND (website_url ~* '^https?://'::text)))
);
alter table public.partners enable row level security;

create table public.players (
  id uuid default gen_random_uuid() not null,
  first_name text not null,
  last_name text not null,
  contact_number text,
  email text not null,
  date_of_birth date,
  contact_link text,
  registration_source text,
  main_game text not null,
  department text,
  role_lane text,
  in_game_name text,
  uid text,
  player_id text,
  photo_path text,
  consent_privacy boolean default false not null,
  consent_eligibility boolean default false not null,
  status text default 'pending'::text not null,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  full_name text generated always as (btrim(((first_name || ' '::text) || last_name))) stored,
  display_role text generated always as (COALESCE(department, role_lane)) stored,
  photo_drive_url text,
  constraint players_pkey PRIMARY KEY (id),
  constraint players_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  constraint players_contact_link_check CHECK (((char_length(contact_link) <= 300) AND (contact_link ~* '^https?://([a-z0-9-]+\.)*(facebook\.com|fb\.com|instagram\.com)(/|$)'::text))),
  constraint players_contact_number_check CHECK ((contact_number ~ '^(09[0-9]{9}|\+639[0-9]{9})$'::text)),
  constraint players_date_of_birth_check CHECK ((date_of_birth > '1900-01-01'::date)),
  constraint players_department_check CHECK ((department = ANY (ARRAY['Clan'::text, 'Community'::text]))),
  constraint players_email_check CHECK (((char_length(email) <= 254) AND (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'::text))),
  constraint players_first_name_check CHECK (((char_length(btrim(first_name)) >= 1) AND (char_length(btrim(first_name)) <= 60))),
  constraint players_in_game_name_check CHECK (((char_length(btrim(in_game_name)) >= 1) AND (char_length(btrim(in_game_name)) <= 40))),
  constraint players_last_name_check CHECK (((char_length(btrim(last_name)) >= 1) AND (char_length(btrim(last_name)) <= 60))),
  constraint players_main_game_check CHECK ((main_game = ANY (ARRAY['CODM'::text, 'HOK'::text]))),
  constraint players_photo_drive_url_check CHECK (((char_length(photo_drive_url) <= 500) AND (photo_drive_url ~ '^https://(drive|docs)\.google\.com/'::text))),
  constraint players_photo_path_check CHECK ((char_length(photo_path) <= 300)),
  constraint players_player_id_check CHECK (((char_length(btrim(player_id)) >= 1) AND (char_length(btrim(player_id)) <= 40))),
  constraint players_registration_source_check CHECK ((registration_source = ANY (ARRAY['Online Recruitment'::text, 'LAN Event'::text]))),
  constraint players_role_lane_check CHECK ((role_lane = ANY (ARRAY['Clash'::text, 'Mid'::text, 'Jungler'::text, 'Roamer'::text, 'Farm'::text, 'Versatile'::text]))),
  constraint players_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))),
  constraint players_uid_check CHECK (((char_length(btrim(uid)) >= 1) AND (char_length(btrim(uid)) <= 40)))
);
alter table public.players enable row level security;

create table public.staff (
  id uuid default gen_random_uuid() not null,
  full_name text not null,
  role_title text,
  bio text,
  photo_url text,
  is_visible boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint staff_pkey PRIMARY KEY (id),
  constraint staff_bio_check CHECK ((char_length(bio) <= 400)),
  constraint staff_full_name_check CHECK (((char_length(btrim(full_name)) >= 1) AND (char_length(btrim(full_name)) <= 120))),
  constraint staff_photo_url_check CHECK ((char_length(photo_url) <= 500)),
  constraint staff_role_title_check CHECK ((char_length(role_title) <= 80))
);
alter table public.staff enable row level security;

create table public.timeline_events (
  id uuid default gen_random_uuid() not null,
  year smallint not null,
  month smallint,
  title text not null,
  description text,
  is_visible boolean default true not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint timeline_events_pkey PRIMARY KEY (id),
  constraint timeline_events_description_check CHECK ((char_length(description) <= 300)),
  constraint timeline_events_month_check CHECK (((month >= 1) AND (month <= 12))),
  constraint timeline_events_title_check CHECK (((char_length(btrim(title)) >= 1) AND (char_length(btrim(title)) <= 80))),
  constraint timeline_events_year_check CHECK (((year >= 1990) AND (year <= 2100)))
);
alter table public.timeline_events enable row level security;

-- ---------------------------------------------------------------- functions
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path to 'public'
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid() and role = 'admin');
$$;

create or replace function public.get_public_stats()
returns json language sql stable security definer set search_path to 'public'
as $$
  select json_build_object(
    'members', (select count(*) from public.players),
    'games',   (select count(*) from public.games where is_visible = true)
  );
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path to 'public'
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.players_stamp_review()
returns trigger language plpgsql set search_path to 'public'
as $$
begin
  if new.status is distinct from old.status and new.status in ('approved', 'rejected') then
    new.reviewed_at := now();
    new.reviewed_by := auth.uid();
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------- indexes
create index events_date_idx on public.events using btree (event_date);
create index games_order_idx on public.games using btree (sort_order);
create index latest_updates_order_idx on public.latest_updates using btree (sort_order, published_at desc);
create index partners_order_idx on public.partners using btree (sort_order);
create index players_created_at_idx on public.players using btree (created_at desc);
create unique index players_game_uid_key on public.players using btree (main_game, lower(uid)) where (uid is not null);
create index players_main_game_idx on public.players using btree (main_game);
create index players_status_idx on public.players using btree (status);
create index staff_order_idx on public.staff using btree (sort_order);
create index timeline_events_order_idx on public.timeline_events using btree (year, month);

-- ---------------------------------------------------------------- triggers
create trigger players_stamp_review before update on public.players for each row execute function public.players_stamp_review();
create trigger set_updated_at before update on public.events for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.games for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.latest_updates for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.partners for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.players for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.staff for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.timeline_events for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- row-level security (original version)
do $$
declare t text;
begin
  foreach t in array array['events','games','latest_updates','partners','staff','timeline_events'] loop
    execute format('create policy "Admins manage all rows" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "Public can read visible rows" on public.%I for select to anon, authenticated using (is_visible = true)', t);
  end loop;
end $$;

create policy "Admins manage players" on public.players for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Public can submit applications" on public.players for insert to anon, authenticated
  with check ((status = 'pending') and (reviewed_by is null) and (reviewed_at is null) and (consent_privacy is true) and (consent_eligibility is true)
    and (contact_number is not null) and (date_of_birth is not null) and (contact_link is not null) and (registration_source is not null)
    and (in_game_name is not null) and (uid is not null)
    and ((main_game = 'HOK') or ((department is not null) and (player_id is not null) and (photo_path is not null))));

create policy admin_users_admin_write on public.admin_users for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy admin_users_self_read on public.admin_users for select to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('player-photos', 'player-photos', false, 5242880, '{image/jpeg,image/png,image/webp}') on conflict (id) do nothing;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, '{image/jpeg,image/png,image/webp}') on conflict (id) do nothing;

create policy player_photos_admin_delete on storage.objects for delete to authenticated using ((bucket_id = 'player-photos') and public.is_admin());
create policy player_photos_admin_read on storage.objects for select to authenticated using ((bucket_id = 'player-photos') and public.is_admin());
create policy player_photos_admin_update on storage.objects for update to authenticated using ((bucket_id = 'player-photos') and public.is_admin()) with check ((bucket_id = 'player-photos') and public.is_admin());
create policy player_photos_public_upload on storage.objects for insert to anon, authenticated with check ((bucket_id = 'player-photos') and ((storage.foldername(name))[1] = 'applications'));
create policy site_media_admin_delete on storage.objects for delete to authenticated using ((bucket_id = 'site-media') and public.is_admin());
create policy site_media_admin_insert on storage.objects for insert to authenticated with check ((bucket_id = 'site-media') and public.is_admin());
create policy site_media_admin_update on storage.objects for update to authenticated using ((bucket_id = 'site-media') and public.is_admin()) with check ((bucket_id = 'site-media') and public.is_admin());
