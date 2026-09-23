# Copilot task: fix the Admin sign-in page, About → Our story, About → Our pillars, and the footer wordmark

Project: `bx-website-next` (Next.js 16 App Router, React 19, TypeScript strict, Chakra UI v2).
The causes below were found by reading the current code. Do not re-investigate them; apply the fixes.
After each part, run `npm run typecheck`, then check the page in the browser at widths 375, 768, 1024, 1440 and 1920px.
Do not change the copy or the animations unless a step says so.

---

## Part 0 — Two global bugs behind most of the broken layouts (do this first)

### 0a. A global `max-width: 65ch` squeezes lists, spans and paragraphs everywhere
`src/index.css` (around line 332) contains:
```css
p,
li,
blockquote,
span,
td {
  max-width: 65ch;
}
```
This caps **every** `<li>`, `<span>` and `<p>` at about 650px. This is why each Our Pillars row stops halfway across the page: every row is inside an `<li>`. It also clips headline `<span>`s, the footer wordmark (a `<p>`), the partner wall tiles and the milestone items.

**Fix:**
1. Delete that rule.
2. Add a scoped, opt-in version instead:
   ```css
   /* Comfortable reading width for running text only. Opt in with .bx-prose. */
   .bx-prose { max-width: 65ch; }
   ```
3. Add `bx-prose` (or a `max-width` in that element's own class) **only** to long running text. Leave everything else full width.
   - `.about-monument__intro` (already has 640px)
   - `.about-origin__paragraph`
   - `.about-pillars__desc`
   - `.about-purpose__text` (already has 520px)
   - `.partners-hero__intro`
   - `.join-cta__text`
   - `.home-hero__lead`
   - feed card descriptions
   - `.mega-footer__tagline`
   - the text in `LatestUpdateAnnouncementModal`
   - the description rows in `AdminEntryDetails`
4. Search `src/index.css` for any other element-type selectors with `max-width` (for example `h1`, `h2`, `ul`, `ol`), and remove them the same way.

### 0b. `cqi` font sizes with no container around them
The display titles now use `font-size: min(…, Ncqi)`. `cqi` measures the nearest ancestor that has `container-type: inline-size` (the `.bx-display-container` class in `src/styles/motion.css`). When there is none, it falls back to the **whole viewport**, so the text gets far too big. That is why the footer "BLOODLUST" wordmark runs off the right edge.

**Fix:**
1. Search the whole `src/` folder for `cqi`. For every rule that uses it, make sure the element's own column (its nearest block-level wrapper) has the class `bx-display-container`.
   - Do **not** put `bx-display-container` on the navbar or on anything that contains `position: fixed` children (the navbar search), because containers can change how fixed children are positioned.
2. Specifically:
   - `SiteFooter` — wrap the wordmark `<p>` in `<div className="bx-display-container">`.
   - `AboutPillarsSection` — add `bx-display-container` to `.about-pillars__list`.
   - `MilestoneTimelineSection` — add it to `.about-milestones__track`.
   - `MissionVisionSection` — add it to each `.about-purpose__card`.
   - `PartnerLogoWall` — add it to the `<div className="shared-container">`.
   - `PartnersHeroSection` — add it to `.partners-hero__head > div:first-child`.
   - `FeaturedGamesSection` — add it to each games panel.
   - `JoinCallToActionSection` — add it to the copy column.
   - `AdminDashboardTemplate` — add it to the header's first `<div>`.
3. Add a comment next to `.bx-display-container` in `motion.css`: `/* Every element that uses cqi units needs one of these as its nearest wrapper; without it cqi falls back to the viewport. */`

**Acceptance for Part 0:**
- Running `grep -rn "cqi" src` lists only rules whose elements sit inside a `.bx-display-container`.
- No element is capped at 65ch unless it is running text.

---

## Part 1 — Admin sign-in page (`/admin` while signed out)

Problems in the current screenshot:
- The card is jammed against the navbar; its top edge is hidden.
- The page has no vertical breathing room, and the footer starts right under the card.
- The "Sign in" button is pale pink. Chakra's `colorScheme="brand"` solid button uses the 200 shade in dark mode.
- The card uses generic Chakra styling that doesn't match the rest of the site.

**Fix** (in `src/components/organisms/AdminAccessGate.tsx`; add styles to `src/styles/admin.css`):
1. Replace the outer `<Flex minH="50vh" …>` of the **sign-in state** with a section:
   ```tsx
   <section className="admin-gate" aria-labelledby="admin-gate-title">
     <div className="admin-gate__card bx-gradient-border">
       <div className="admin-gate__inner bx-gradient-border__inner">
         <p className="bx-eyebrow">Restricted area</p>
         <h1 id="admin-gate-title" className="admin-gate__title bx-display">Admin <span className="bx-outline-text">access</span></h1>
         <p className="admin-gate__lead">Sign in with your admin account to manage the website.</p>
         {/* existing form, see step 2 */}
       </div>
     </div>
     <a className="admin-gate__back" href="/">← Back to the website</a>
   </section>
   ```
   Use `NextLink` for the back link.
2. Keep the existing email/password `FormControl`s and all the logic. Change the submit button to a plain element with the site button classes, keeping `type="submit"` and the loading state:
   ```tsx
   <button type="submit" className="bx-btn bx-btn--primary bx-shine admin-gate__submit" disabled={submitting} aria-busy={submitting}>
     {submitting ? 'Signing in…' : 'Sign in'}
   </button>
   ```
   Show the auth error (if any) above the button in a `role="alert"` paragraph with class `admin-gate__error`.
3. Apply the same `.admin-gate` wrapper, without the form, to the **loading** state (spinner) and the **not authorized** state (message plus a Sign out button using `bx-btn bx-btn--ghost`), so all three states look consistent.
4. Add to `src/styles/admin.css`:
   ```css
   .admin-gate { display: grid; place-items: center; align-content: center; gap: 20px; min-height: calc(100dvh - 80px); padding: clamp(48px, 10vh, 120px) var(--gutter); }
   .admin-gate__card { width: min(100%, 480px); }
   .admin-gate__inner { display: flex; flex-direction: column; gap: 20px; padding: clamp(28px, 4vw, 44px); background: var(--surface); }
   .admin-gate__title { margin: 0; font-family: var(--font-sans); font-size: clamp(2.5rem, 6vw, 3.5rem); font-weight: 700; line-height: 0.9; text-transform: uppercase; }
   .admin-gate__lead { margin: 0; color: var(--text-muted); }
   .admin-gate__submit { width: 100%; margin-top: 8px; }
   .admin-gate__error { margin: 0; padding: 10px 14px; border-left: 3px solid var(--maroon-bright, var(--maroon)); background: var(--surface-2); color: var(--text); font-size: 14px; }
   .admin-gate__back { color: var(--text-muted); font-size: 14px; letter-spacing: 0.08em; text-decoration: none; }
   .admin-gate__back:hover { color: var(--text); }
   .admin-gate .chakra-input { height: 48px; border-radius: 0 !important; background: var(--bg); border-color: var(--border-strong); }
   .admin-gate .chakra-input:focus-visible { border-color: var(--maroon); box-shadow: 0 0 0 1px var(--maroon); }
   .admin-gate .chakra-form__label { font-size: 13px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted); }
   ```
5. In `src/theme.ts`, make the `Button` `solid` variant for `colorScheme="brand"` use `brand.500` background and white text in **both** colour modes (hover `brand.400`), so no other button on the site turns pale pink.

**Acceptance:**
- The card is centred vertically and horizontally below the navbar, with its full border visible.
- The Sign in button is maroon with white text.
- There is at least 48px of space above and below the card.
- On phones the card fits within the screen, with 16px side gutters.

---

## Part 2 — About → "From passion to purpose" (Our story)

Problems:
- The left column stretches to the height of the right column (`justify-content: space-between`), which leaves a big empty gap between the title and the game chips.
- The right-hand paragraphs are very large (up to 34px), so the section is very tall.
- The accent line "TO PURPOSE" reads pink rather than maroon (see Part 5).

**Fix** (`src/styles/about.css`, `AboutStorySection.tsx`):
1. Change `.about-origin__head` so the title and chips stay together and follow the reader down the page:
   ```css
   .about-origin__head { display: flex; flex-direction: column; justify-content: flex-start; gap: 32px; align-self: start; position: sticky; top: 120px; }
   ```
   Under `@media (max-width: 1023px)` set `position: static`.
2. Make the grid `grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(40px, 6vw, 96px); align-items: start;`.
3. Change the paragraph size to `font-size: clamp(1.125rem, 1.6vw, 1.5rem); line-height: 1.5;`, and add `max-width: 60ch`.
4. Change the rail ("OUR STORY") colour to `var(--text-muted)`. Move it so it sits inside the gutter: `left: max(12px, calc((100vw - var(--container-max)) / 2 - 56px))`. Hide it below 1280px.
5. Reduce section padding to `padding-block: clamp(64px, 8vw, 104px)`.

**Acceptance:** at 1440px, the game chips sit directly under the title, with no empty gap. The section is no taller than about 1.2× the viewport, and the text column reads comfortably.

---

## Part 3 — About → "Our pillars"

Problems:
- The rows only fill half the page (caused by the global `li` max-width, fixed in Part 0).
- The description column is so narrow that its text wraps every 2–3 words and **overlaps the title** ("RECRUIT", "DEVELOP", "COMPETE").
- The arrows float mid-page.

**Fix** (`src/styles/about.css`):
1. After Part 0, confirm each row spans the full container width.
2. Change the row grid so the title column is sized to the longest title and the description gets the rest:
   ```css
   .about-pillars__row { grid-template-columns: 120px minmax(max-content, 0.9fr) minmax(0, 1.4fr) 40px; gap: clamp(20px, 3vw, 48px); align-items: center; padding: clamp(28px, 3vw, 40px) clamp(16px, 2vw, 24px); }
   .about-pillars__title { font-size: clamp(2.25rem, 4.5vw, 4.5rem); white-space: nowrap; }
   .about-pillars__desc { max-width: 52ch; font-size: clamp(1rem, 1.1vw, 1.125rem); }
   ```
   Remove the `cqi` size from `.about-pillars__title` in favour of the clamp above.
3. Under `@media (max-width: 1023px)` keep `grid-template-columns: 64px minmax(0, 1fr)`, put the description under the title (`grid-column: 2`), and hide the arrow. Set `.about-pillars__title { white-space: normal; }` there.
4. Put the numbers in `var(--text-muted)` by default and white on hover, so they don't compete with the titles (the maroon fill still sweeps in on hover).

**Acceptance:** at 1440px, each row is one line: `01 | RECRUIT | description in 2–3 lines | →`. There is no overlap at any width from 375 to 1920px.

---

## Part 4 — Footer "BLOODLUST" wordmark

Problem: the outlined wordmark runs off the right edge (the "T" is cut off). This is caused by the global `p` max-width and by `cqi` with no container (Part 0).

**Fix** (`SiteFooter.tsx`, `src/styles/home.css`):
1. After Part 0, wrap the wordmark in `<div className="bx-display-container">` if you haven't already.
2. Size it so the whole word exactly fills the container width. "BLOODLUST" is 9 characters, about 5.9em wide in Chakra Petch bold:
   ```css
   .mega-footer__wordmark { font-size: min(14.75rem, calc(100cqi / 5.9)); white-space: nowrap; max-width: none; }
   ```
3. Check it at 375, 1024, 1440 and 1920px. The last letter must be fully visible, with the right edge aligned to the container edge (±8px). If your fonts measure differently, adjust `5.9` until it fits.

---

## Part 5 — Maroon that reads as maroon, not pink

`--maroon-text` (#e07a8b) reads pink on black. It is used for headline accents ("TO PURPOSE"), pillar numbers and the footer outline.

**Fix** in `src/index.css` (dark theme):
```css
--maroon-text: #c8323f; /* deep crimson; about 3.8:1 on --bg, so use it for LARGE text (≥ 24px) only */
```
- Anywhere `--maroon-text` is used for **small** text (under 24px, such as `.staff-roster__role` and small labels), switch to `var(--text)` or `var(--text-muted)`, so body text keeps at least 4.5:1 contrast.
- The footer wordmark outline, headline accent words and big numbers can stay on `--maroon-text`.
- In light mode, keep `--maroon-text: var(--maroon)`.

---

## Finish
- Run `npm run lint`, `npm run typecheck` and `npm run build`.
- List the files you changed with one line each.
- Confirm you checked `/admin` (signed out), `/about` (story, pillars, footer) and `/partners` at 375, 1024 and 1440px.
