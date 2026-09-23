---
mode: agent
description: Rebuild the Home page to match design-reference/home-page.design.html
---

# Implement the new Home page design

The target design is `design-reference/home-page.design.html`. It is a static mockup made with inline styles. Treat it as a **visual spec**, not code to paste: read its markup and inline styles to get layout, spacing, font sizes, colours and animations, then rebuild each section inside our existing components.

Read `README.md` and `src/components/README.md` first. Keep the atomic structure (atoms → molecules → organisms → templates → pages), the naming style, and a one-line `/** description */` above every component. Update the folder README tables when you add components.

## Section → component map (top to bottom in the design)

| Design section | Our file |
| --- | --- |
| `<header>` navbar | `src/components/organisms/SiteNavbar.tsx` |
| Hero (title reveal, spinning rings around the floating logo, scanning light band, grid background) | `src/components/organisms/HomeHeroSection.tsx` |
| Scrolling games strip | `src/components/molecules/GamesMarqueeStrip.tsx` |
| "001 / THE FEED." bento grid (event tile + update tile + "Recruitment live" tile + ticker) | `src/components/organisms/HomeFeedSection.tsx`, `molecules/FeedFeaturedCard.tsx`, `molecules/FeedListRow.tsx` |
| "002 / FEATURED GAMES" expanding accordion | `src/components/organisms/FeaturedGamesSection.tsx` |
| Maroon "Ready to rise?" join banner | `src/components/organisms/JoinCallToActionSection.tsx` |
| Mega footer | `src/components/organisms/SiteFooter.tsx` |

## Rules

- **Styling:** keep Chakra UI. Use our CSS variables from `src/index.css` (`--bg`, `--surface`, `--surface-2`, `--text`, `--text-muted`, `--border`, `--maroon`, `--maroon-text`, `--accent`, `--btn-primary-*`) instead of the hex values in the mockup, so light mode keeps working. The mockup is dark mode only; also check light mode.
- **Animations:** move every `@keyframes bx-*` from the mockup's `<style>` into `src/index.css`, and keep the `prefers-reduced-motion` rule that turns them off. Only animate `transform`, `opacity` and `clip-path`. Entrance animations should start when the section scrolls into view (reuse `atoms/ScrollReveal.tsx` or an IntersectionObserver), not on page load.
- **Real data, no hard-coded content:** the event, update, game names and counts in the mockup are samples. Use the existing hooks (`useLatestUpdates`, `useUpcomingEvents`, `useFeaturedGames`, `usePublicStats`).
  - Feed bento: the soonest upcoming event fills the big tile, and the newest update fills the update tile. If there is no upcoming event, the newest update takes the big tile. The ticker lists the real items.
  - The countdown (DAYS / HRS / MIN) must be live. Add an atom `EventCountdown.tsx` that computes it from `event_date` in Asia/Manila time and updates every minute, and hide it when the event has passed.
  - The accordion uses the real games list with logos (`image_url`) and falls back to the monogram when there is no logo. Leave text like `[SHORT DESCRIPTION …]` and `[YEAR]` as clearly marked TODOs; don't invent copy.
- **Behaviour:** every "Join now", "Apply now" and "Start application" button must open the join modal, the way the current buttons do (`window.dispatchEvent(new CustomEvent('open-join-flow', …))`). Links go to the real routes (`/`, `/partners`, `/about`, `/join`, `/admin`).
- **Accordion:** the panels open on hover and on keyboard focus (`:hover` / `:focus-within`, with a `flex-grow` transition). Each panel is a real link or button.
- **Logo:** use `next/image` for `/bx-logo.png`.
- **Responsive:** the mockup is 1440px wide. Below `lg`, stack the columns (hero, bento and footer in one column; the accordion becomes a vertical list with every panel open). Check 390px, 768px and 1440px widths with no horizontal scroll.
- **Accessibility:** keep `aria-hidden` on decorative text such as outlines, watermarks and tickers. Keep buttons as `<button>`/`<a>`, text contrast at least 4.5:1, and visible focus styles.

## Process

Work **one section per step**, in the table's order. After each step:
1. run `npm run typecheck`, `npm run lint` and `npm run build`, and fix errors;
2. tell me what changed and what to look at in `npm run dev`;
3. wait for me to say "continue".

Start with the navbar.
