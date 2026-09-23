# Copilot task: fix admin access, broken headlines, colour palette, and admin coverage

You are working in `bx-website-next` (Next.js 16 App Router, React 19, TypeScript strict, Chakra UI v2, Supabase JS v2).
Work through the four parts **in order**. After each part, run `npm run typecheck` and `npm run build` and fix anything you broke before moving on.
Do not rename or move files unless a step says so. Keep the atomic folder rules: a component may only import from its own level or lower (atoms ← molecules ← organisms ← templates ← pages). Update the README table in any folder where you add a component.

---

## Part 1 — "Admin access" sends the user back to the home page

### Cause (already diagnosed, do not re-investigate)
`src/app/admin/[[...tab]]/page.tsx` runs `protectAdminRoute()` on the server. It reads the Supabase session from **cookies** via `createServerClient` and calls `redirect('/')` when there is no user.
But the browser client in `src/lib/supabase.ts` is created with `createClient` from `@supabase/supabase-js`, which stores the session in **localStorage**, not cookies. So the server never sees a user and always redirects.
Also, a signed-out visitor is redirected before they can reach the sign-in form that `AdminAccessGate` renders, so nobody can ever log in from `/admin`.

### Fix
1. In `src/app/admin/[[...tab]]/page.tsx`:
   - Delete `protectAdminRoute()` and the `cookies` / `createServerClient` / `redirect` imports it uses.
   - Keep the `metadata` (`robots: { index: false, follow: false }`).
   - Keep tab validation, but add `'timeline'` to `ADMIN_TABS`. For an unknown tab, call `notFound()` from `next/navigation` instead of redirecting home.
   - The page must render `<AdminRoute />` for everyone. `AdminAccessGate` already shows a spinner, then the sign-in form, or "not authorized" to signed-in non-admins.
2. Add this comment above the page component: `// Access control: AdminAccessGate hides the UI; Supabase row-level security protects the data. Every table written by the dashboard must have RLS policies that only allow users listed in admin_users.`
3. Check `src/components/organisms/AdminAccessGate.tsx`. After a successful sign-in, it must re-check `admin_users` and render `children` without a full page reload. If it calls `router.push('/')` or `window.location` anywhere on success, remove that.
4. Check every link to the admin area (`HomeHeroSection` "Admin access", `SiteNavbar`, `SiteFooter`). Each should point to `/admin` and must not call `openJoinFlow` or `preventDefault`.

**Acceptance:**
- Signed out: clicking "Admin access" shows the sign-in form at `/admin`.
- Signed in as an admin: the dashboard shows.
- Signed in as a non-admin: "not authorized" with a Sign out button shows.
- `/admin/timeline` works.
- `/admin/nonsense` shows the 404 page.

---

## Part 2 — Big headlines break in the middle of words ("BLOODLUS / T", "PHILIPPINE / S")

### Cause
Chakra UI's CSS reset sets `overflow-wrap: break-word` on `h1`–`h6` and `p`. The display titles use viewport-based font sizes (`vw`) inside grid columns that are narrower than the viewport. When the longest word ("PHILIPPINES", "BLOODLUST") is wider than its column, the browser splits it mid-word.

### Fix
1. In `src/styles/motion.css`, add one shared rule for display headlines, and use it everywhere below:
   ```css
   /* Display headlines: never split a word; size from the container, not the viewport. */
   .bx-display { overflow-wrap: normal; word-break: keep-all; hyphens: none; white-space: normal; }
   .bx-display-container { container-type: inline-size; }
   ```
2. Add `bx-display` to every oversized title, and add `bx-display-container` to its direct parent column:
   - `HomeHeroSection` — `.home-hero__title`, parent `.home-hero__copy`.
   - `HomeFeedSection` — the section title and the `FeedFeaturedCard` title (`.feed-featured__title`; remove `overflow-wrap: anywhere` from it in `home.css`).
   - `FeaturedGamesSection` — section title and panel titles.
   - `JoinCallToActionSection` — `.join-cta__title`.
   - `SiteFooter` — the giant wordmark.
   - `AboutIntroSection` — `.about-monument__title`.
   - `AboutStorySection` — `.about-origin__title`.
   - `MissionVisionSection` — `.about-purpose__title` and the watermark.
   - `AboutPillarsSection` — `.about-pillars__title`.
   - `MilestoneTimelineSection` — `.about-milestones__year` and title.
   - `PartnersHeroSection` — `.partners-hero__title`.
   - `PartnerLogoWall` — `.partners-wall__title`.
   - `AdminDashboardTemplate` — `.admin-header__title`.
   - `AdminEntryModal` — `.admin-modal__title`.
   - The shared `.bx-section-title`.
3. Change each of those `font-size` values from `vw` to **container units** (`cqi`). Pick the size so the **longest single word fits on one line** at every width from 320px to 1920px. Chakra Petch bold uppercase is about 0.62em per character, so for a word of N characters the max is `min(<current rem max>, calc(100cqi / (N * 0.64)))`. Examples:
   - Home hero ("PHILIPPINES", 11 chars): `font-size: min(8.25rem, 14cqi);`
   - About monument ("BLOODLUST.", 10 chars): `font-size: min(13.75rem, 15.5cqi);`
   - Partners hero ("PARTNERS.", 9 chars): `font-size: min(10rem, 17cqi);`
   - Section titles: `font-size: min(5.5rem, 11cqi);`

   For titles that come from the database (game titles, feed titles, milestone titles), add `overflow-wrap: break-word` **only** as a last resort for very long single words, and clamp to 3 lines as today.
4. Keep `line-height`, letter-spacing and the entrance animations (`bx-mask-in`, `bx-rise-in`) as they are.

**Acceptance:** at widths 320, 375, 768, 1024, 1280, 1440 and 1920px, no headline on `/`, `/about`, `/partners` or `/admin` breaks a word across lines, and there is no horizontal page scroll.

---

## Part 3 — Colour palette: maroon + black, with gold as a small accent only

Target proportions: about **70% black/near-black surfaces, 25% maroon, 5% gold**.
Gold is for tiny highlights only. It must never be used for large text, big numbers, filled buttons or large filled blocks.

1. Update the dark-theme tokens in `src/index.css` (`:root`) to:
   ```css
   --bg: #0a0707;           /* near-black with a warm red tint */
   --surface: #120b0c;
   --surface-2: #1a0f11;
   --surface-3: #241317;
   --text: #f6efef;
   --text-muted: #b9a7aa;
   --border: rgba(246, 239, 239, 0.12);
   --border-strong: rgba(246, 239, 239, 0.22);
   --maroon: #7a1420;
   --maroon-bright: #a31d2e; /* new: hover / emphasis */
   --maroon-dark: #3e0c13;
   --maroon-text: #e07a8b;   /* maroon readable on black, for headline accents */
   --accent: #c9a227;        /* gold: small accents only */
   --accent-muted: #a88724;
   --btn-primary-bg: var(--maroon);
   --btn-primary-bg-hover: var(--maroon-bright);
   --btn-primary-text: #fff8f0;
   --btn-primary-border: var(--maroon-bright);
   ```
   In the light theme (`html[data-theme='light']`), keep the same maroon family on an off-white background, and set `--btn-primary-border: var(--maroon)`.
2. In `src/styles/home.css`, change `--bx-accent-text` so headline accents are **maroon**: `--bx-accent-text: var(--maroon-text);` (light: `var(--maroon)`). Add a new `--bx-gold: var(--accent);` for the few gold uses.
3. Replace gold with maroon or white in these places (search `var(--accent)`, `--bx-accent-text`, `#c9a227`, `rgba(201, 162, 39`):
   - Big numbers and stat values (About stats band, admin stat tiles, milestone years, pillar numbers): white text. The one highlighted stat uses `--maroon-text`.
   - Headline accent words ("PARTNERS**.**", "TO PURPOSE", "CORP.", "THE FEED**.**"): `--maroon-text`.
   - Filled buttons and filled tiles (milestone "next" button, segmented control selected state, "Your logo here" tile): maroon background, white text.
   - Line fills and bars (milestone line, admin stat bars, `bx-border-sweep` gradient): maroon → maroon-bright. Gold may appear only as one thin 10–15% stop.
   - Status pill "pending": muted neutral (`--text-muted` text on `--surface-3`) with the dot in gold.
   - Status pill "approved": keep green but desaturate to `#5f9e72`.
   - Status pill "rejected": maroon.
4. **Keep gold only for:**
   - eyebrow labels (`.bx-eyebrow`) — change them to `--text-muted` text with a 24px gold line before them (`::before`, 2px high);
   - the active admin tab underline;
   - focus rings (`outline: 2px solid var(--accent)`);
   - the pulsing dots (`.bx-pulse-dot`, pending status dot);
   - the "Featured partner" and "Latest" labels;
   - the arrow icon inside primary buttons.
5. In `src/theme.ts`, make sure Chakra's `brand` colour scale is maroon (500 = `#7a1420`) and `accent` is gold. Any Chakra component still using `colorScheme="yellow"`, `"green"` or `"blue"` in the admin area should use `brand`, except the approved status.
6. Remove leftover light-grey/white Chakra surfaces in the admin area. Search for `'white'`, `'gray.50'`, `'gray.900'` and `useColorModeValue(` in `src/components/organisms/admin/**` and `src/components/molecules/Admin*`, and replace them with `var(--surface)`, `var(--surface-2)` and `var(--border)`. This includes `AdminEntryDetails.tsx` (the read-only "View" window), `AdminItemCard`, `EmptyStatePanel`, `AdminPlayerFilterBar` and `AdminPanelToolbar`.

**Acceptance:**
- A screenshot of `/`, `/about`, `/partners` and `/admin` reads as black and maroon at a glance.
- Gold is visible only as thin lines, dots, small labels and focus rings.
- Text contrast is at least 4.5:1 for body text and 3:1 for large text; check `--maroon-text` on `--bg`.

---

## Part 4 — Everything that comes from the database must be editable in the admin dashboard

Current map (verify it with a search for `.from('` and `.rpc('`):

| Table / source | Shown publicly in | Admin tab today | Status |
| --- | --- | --- | --- |
| `latest_updates` | Home feed, announcement pop-up | Latest Updates (add / edit / delete / visibility) | OK |
| `events` | Home feed | Events (add / edit / delete / visibility) | Add reorder (up/down), like Games |
| `games` | Home hero count, marquee, featured games | Games (add / edit / delete / visibility / reorder) | OK |
| `partners` | Partners page | Partners (add / edit / delete / visibility / reorder) | OK |
| `timeline_events` | About → Key milestones | Timeline (add / edit / delete / visibility) | Add a card view like the other tabs |
| `staff` | **not shown anywhere on the site** | Staffs | See step 3 |
| `players` | About stats (via `get_public_stats`) | Players (add / edit / delete / approve / reject) | See step 1 |
| `applications` | written by the Join form | **none** | See step 1 |
| `admin_users` | — | **none** | See step 2 |
| `get_public_stats()` RPC | About stats | — | Read-only, derived; no tab needed |

1. **Applications → Players.** The Join modal (`JoinApplicationModal.tsx`) inserts into `applications`, but the Players tab reads `players`.
   - Check `supabase/migrations/**` (or ask me) for a trigger that copies `applications` into `players`.
   - If there is **no** trigger: add an "Applications" tab (`AdminApplicationsPanel` organism plus a `useAdminApplications` hook, following the pattern of `useAdminPlayers` / `AdminPlayersPanel`). It should list new applications with their photo (signed URL from the `player-photos` bucket), and offer **Approve** (inserts a `players` row with `status: 'approved'`, then marks the application processed or deletes it), **Reject** and **View**.
   - If there **is** a trigger: add a comment in `useAdminPlayers.ts` saying so, and no new tab.
2. **Admins.** Add a read-only "Admins" section at the bottom of the Players tab listing the `admin_users` rows (email if available, role, created date). Do **not** add create/delete from the UI unless an RLS policy that allows only admins to write `admin_users` already exists. Otherwise add a TODO explaining that new admins are added in the Supabase dashboard.
3. **Staff.** The `staff` table is editable but not displayed. Add a "Our staff" section to the About page, after the pillars:
   - new organism `StaffRosterSection`, with data from `lib/publicData.ts` (`is_visible = true`, ordered by `sort_order`), passed down from `app/about/page.tsx` like the timeline;
   - a grid of photo cards (name, role, short bio);
   - hidden when there are no visible staff.
4. **Parity checks for every tab:**
   - every field the public site reads is editable in that tab's form;
   - Save refreshes the list;
   - visibility switches exist wherever the table has `is_visible`;
   - reorder exists wherever the table has `sort_order`;
   - delete asks for confirmation (`ConfirmDialogProvider`);
   - images upload to `site-media` and the old file is removed on replace.
5. After any admin save, public pages must show the change within 60 seconds (`revalidate = 60` in `lib/publicData.ts`). If you add a server action or route handler for this, call `revalidatePath('/')`, `revalidatePath('/about')` and `revalidatePath('/partners')` after writes. Otherwise leave it as is and note the 60-second delay in the admin header ("Changes appear on the site within a minute").

**Acceptance:** for every row in the table above, I can open `/admin`, change the data, and see it on the public page after a refresh (within 60 s). The Join form's submissions are visible and actionable in the dashboard.

---

## Finish
- Run `npm run lint`, `npm run typecheck` and `npm run build`, and fix all errors.
- List every file you changed, grouped by part, with one line each on what changed.
- Tell me anything you could not verify (for example whether the applications→players trigger exists, or RLS policies).
