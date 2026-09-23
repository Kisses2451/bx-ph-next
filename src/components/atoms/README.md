# Atoms

The smallest building blocks: **one UI element with one job** — a badge, an icon, a button, an image.

**Belongs here if:**
- it renders a single element (plus maybe an icon or a line of text inside it);
- it does not import any other component from `components/`;
- public-site atoms use plain HTML + CSS classes. Chakra UI is only loaded under `/admin`, so only admin atoms may use it;
- it doesn't load data. Local UI state (like an animation) is fine.

**Doesn't belong here:** a label + input + error message together — that's a molecule.

Naming: say what it *shows*, e.g. `PlayerStatusBadge`, not `Badge2` or `StatusThing`.

## Components in this folder

| Component | File | What it is |
| --- | --- | --- |
| `ActionIconButton` | [ActionIconButton.tsx](ActionIconButton.tsx) | Small icon-only button with a tooltip, used for row actions (edit, approve, delete…). Clicks don't bubble to the row. |
| `ActiveNavLink` | [ActiveNavLink.tsx](ActiveNavLink.tsx) | A Next.js <Link> that knows when it points at the current page: it adds the `active` class and `aria-current="page"` so the navbar can highlight it. |
| `AnimatedStatValue` | [AnimatedStatValue.tsx](AnimatedStatValue.tsx) | A big stat number that counts up once it scrolls into view (used on the About page stats row). |
| `ArrowIcon` | [ArrowIcon.tsx](ArrowIcon.tsx) | Right-pointing arrow used in call-to-action buttons and tiles. Decorative only (aria-hidden); takes the text colour. |
| `CharacterCount` | [CharacterCount.tsx](CharacterCount.tsx) | Right-aligned "12/400" counter shown under text inputs that have a length limit. |
| `DepartmentBadge` | [DepartmentBadge.tsx](DepartmentBadge.tsx) | Badge for a player's department: Community is purple, Clan (and anything else) is blue. Empty shows "—". |
| `EventCountdown` | [EventCountdown.tsx](EventCountdown.tsx) | Live "04 DAYS · 12 HRS · 36 MIN" countdown to an event date (YYYY-MM-DD, start of the day in Philippine time). Updates every minute and shows "Happening today" once the day has started. It renders an empty box of the same height on the server, then fills in after the page loads, so server and browser HTML always match. |
| `FeedItemTypeBadge` | [FeedItemTypeBadge.tsx](FeedItemTypeBadge.tsx) | Label on home feed cards: gold "EVENT" with a calendar icon, or maroon "UPDATE" with an info icon. |
| `LogoThumbnail` | [LogoThumbnail.tsx](LogoThumbnail.tsx) | 48×32 logo preview for admin tables and cards. Falls back to the first two letters of the name. |
| `MarqueeTicker` | [MarqueeTicker.tsx](MarqueeTicker.tsx) | Endless horizontal ticker of uppercase labels separated by diamonds. Pauses on hover and stops for reduced-motion users. Screen readers get the list once; the moving copies are hidden from them. |
| `NavIcon` | [NavIcon.tsx](NavIcon.tsx) | 20px line icon used in the site navbar links and menu. Decorative only (aria-hidden). |
| `PhilippineFlagIcon` | [PhilippineFlagIcon.tsx](PhilippineFlagIcon.tsx) | Small Philippine flag drawn in SVG. Decorative only (aria-hidden). |
| `PlayerAvatar` | [PlayerAvatar.tsx](PlayerAvatar.tsx) | Round player photo, or the player's initials when no photo is available. |
| `PlayerStatusBadge` | [PlayerStatusBadge.tsx](PlayerStatusBadge.tsx) | Coloured badge for a player's application status: approved (green), rejected (red), pending (yellow). |
| `ScrollReveal` | [ScrollReveal.tsx](ScrollReveal.tsx) | Fades/slides its children in the first time they scroll into view. Content already on screen, reduced-motion users and no-JS visitors see it immediately. `index` staggers items in a list (used by the CSS as --i). |
| `SkeletonRows` | [SkeletonRows.tsx](SkeletonRows.tsx) | Grey placeholder bars shown while a list or table is loading. |
| `TurnstileWidget` | [TurnstileWidget.tsx](TurnstileWidget.tsx) | Cloudflare Turnstile "I am human" check shown on the last step of the Join form. Renders nothing unless `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set. |
| `VisibilityBadge` | [VisibilityBadge.tsx](VisibilityBadge.tsx) | "Visible" (green) or "Hidden" (grey) badge for items that can be hidden from the public website. |
