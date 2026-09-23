# Organisms

**A complete, recognisable section of a page** — the navbar, the home feed, the partner logo wall, an admin tab, a modal.

**Belongs here if:**
- someone would describe it as "the ___ section" or "the ___ modal";
- it may import atoms and molecules (never templates or pages);
- it may own UI state and handle loading / empty / error states. Data should usually be passed in by the page (from a hook), so the section stays easy to reuse and test.

### Sub-folders
An organism that needs private parts gets its own folder. The parts are only used by that organism; don't import them from anywhere else.
- `JoinApplicationModal/` — the join modal plus one file per step and its form rules (`joinApplicationForm.ts`).
- `admin/` — one panel per admin tab and the player filter bar.
- `admin/AdminEntryModal/` — the add/edit/view modal. `fields/` has one form section per record type.

## Components in this folder

| Component | File | What it is |
| --- | --- | --- |
| `AboutIntroSection` | [AboutIntroSection.tsx](AboutIntroSection.tsx) | Top of the About page: "ABOUT BLOODLUST" header and the row of four stats (founded, games, members, PH). |
| `AboutPillarsSection` | [AboutPillarsSection.tsx](AboutPillarsSection.tsx) | Three numbered cards on the About page: Recruit, Develop, Compete. |
| `AboutStorySection` | [AboutStorySection.tsx](AboutStorySection.tsx) | "FROM PASSION TO PURPOSE" story block on the About page: two paragraphs, game title chips and the logo. Text lives in data/siteContent.ts. |
| `AdminAccessGate` | [AdminAccessGate.tsx](AdminAccessGate.tsx) | Shows `children` only to signed-in admins. Otherwise shows a spinner while the session is checked, an admin sign-in form, or a "not authorized" message with a Sign out button. Note: this only hides the UI in the browser; Supabase row-level security must protect the data. |
| `FeaturedGamesSection` | [FeaturedGamesSection.tsx](FeaturedGamesSection.tsx) | "FEATURED GAMES" expanding accordion on the home page. One tall panel per game: the panel under the pointer (or focused / tapped) widens to show its logo, genre and description, while the others shrink to a vertical title. On tablets and phones the panels stack and all show their details. Shows skeleton panels while loading, a Retry button on error, and nothing when there are no games. |
| `HomeFeedSection` | [HomeFeedSection.tsx](HomeFeedSection.tsx) | "001 / THE FEED." bento grid on the home page (anchor #latest-updates): - the big tile shows the next event (or the newest update when there are no events); - the card beside it shows the next item; - the maroon tile opens the join modal; - a ticker underneath lists everything. When there are both events and updates, All / Events / Updates buttons filter the tiles. |
| `HomeHeroSection` | [HomeHeroSection.tsx](HomeHeroSection.tsx) | Opening section of the home page: the title wipes in line by line over a faint grid with a scanning light, the logo floats inside two slowly spinning rings, and a status row shows "Open recruitment". "Apply now" opens the join modal; "Admin access" is shown to everyone except signed-in admins. A scroll cue in the corner fades out after the first scroll. |
| `JoinApplicationFormStep` | [JoinApplicationModal/JoinApplicationFormStep.tsx](JoinApplicationModal/JoinApplicationFormStep.tsx) | Step 2: the application itself. Left column = personal details, right column = game details and photo. |
| `JoinApplicationModal` | [JoinApplicationModal/JoinApplicationModal.tsx](JoinApplicationModal/JoinApplicationModal.tsx) | Site-wide "Join now" application modal, mounted once in SiteLayoutTemplate. Opens automatically on /join and /apply, or when anything dispatches the `open-join-flow` window event. Steps: notice → form → review → success (see the Join*Step files next to this one). On submit it posts everything, photo included, to `/api/apply` (app/api/apply/route.ts), which checks the CAPTCHA and the answers again and saves the application as a pending player. Closing with answers filled in asks before discarding. |
| `JoinNoticeStep` | [JoinApplicationModal/JoinNoticeStep.tsx](JoinApplicationModal/JoinNoticeStep.tsx) | Step 1: privacy notice, eligibility declaration, main-game choice and the two required checkboxes. |
| `JoinReviewStep` | [JoinApplicationModal/JoinReviewStep.tsx](JoinApplicationModal/JoinReviewStep.tsx) | Step 3: read-only summary of everything entered, the "I am human" check (when switched on), and "Edit information" / "Confirm & submit". |
| `JoinSuccessStep` | [JoinApplicationModal/JoinSuccessStep.tsx](JoinApplicationModal/JoinSuccessStep.tsx) | Step 4: thank-you message after the application was saved. |
| `JoinCallToActionSection` | [JoinCallToActionSection.tsx](JoinCallToActionSection.tsx) | Full-width maroon "Ready to rise?" banner near the bottom of the home page, with diagonal stripes, a large "Start application" button (opens the join modal, falls back to /join), the three steps of the application, and a black ticker along the bottom edge listing the game titles. |
| `LatestUpdateAnnouncementModal` | [LatestUpdateAnnouncementModal.tsx](LatestUpdateAnnouncementModal.tsx) | Pop-up shown on the home page announcing the newest "latest update". "View all updates" scrolls to the feed (only when the feed is on the page). When it appears is decided by useLatestUpdateAnnouncement. |
| `MilestoneTimelineSection` | [MilestoneTimelineSection.tsx](MilestoneTimelineSection.tsx) | "KEY MILESTONES" timeline on the About page. The newest milestone is tagged LATEST. Shows placeholders while loading, a short message on error, and nothing if there are no milestones. |
| `MissionVisionSection` | [MissionVisionSection.tsx](MissionVisionSection.tsx) | "MISSION & VISION" heading and the two watermark-numbered cards on the About page. |
| `PartnerLogoWall` | [PartnerLogoWall.tsx](PartnerLogoWall.tsx) | Grid of partner logos on the Partners page (each links to the partner's site), with loading, error and "coming soon" states. |
| `SiteFooter` | [SiteFooter.tsx](SiteFooter.tsx) | Site footer on every page: logo, tagline and "Join now" button, an Explore column of page links, a Follow column (only when config/site.ts has socialLinks), a giant outlined "BLOODLUST" wordmark that wipes in when scrolled into view, and the copyright line. |
| `SiteNavbar` | [SiteNavbar.tsx](SiteNavbar.tsx) | Sticky site header: logo, search, page links, Join Now button and (below 768px) a "More" menu. The site is dark-only, so there is no theme toggle. Signed-in admins also get an Admin Dashboard link and a Log out button. |
| `AdminEntryDetails` | [admin/AdminEntryModal/AdminEntryDetails.tsx](admin/AdminEntryModal/AdminEntryDetails.tsx) | Read-only "View entry" layout: a summary box on the left and label/value rows on the right. |
| `AdminEntryForm` | [admin/AdminEntryModal/AdminEntryForm.tsx](admin/AdminEntryModal/AdminEntryForm.tsx) | Add/edit layout inside the entry modal: image preview on the left, the fields for this kind of record on the right. |
| `AdminEntryModal` | [admin/AdminEntryModal/AdminEntryModal.tsx](admin/AdminEntryModal/AdminEntryModal.tsx) | The one modal the admin dashboard uses to view, add or edit any record (player, update, game, partner, event, staff, milestone). All state and saving live in useAdminEntryEditor; this is the frame. |
| `EventEntryFields` | [admin/AdminEntryModal/fields/EventEntryFields.tsx](admin/AdminEntryModal/fields/EventEntryFields.tsx) | Add/edit form fields for an event: title, date, location, visibility, order, description and image. |
| `GameEntryFields` | [admin/AdminEntryModal/fields/GameEntryFields.tsx](admin/AdminEntryModal/fields/GameEntryFields.tsx) | Add/edit form fields for a game: logo, name, genre (with suggestions), visibility and description. |
| `LatestUpdateEntryFields` | [admin/AdminEntryModal/fields/LatestUpdateEntryFields.tsx](admin/AdminEntryModal/fields/LatestUpdateEntryFields.tsx) | Add/edit form fields for a latest update: title, tag, publish date, visibility, order, detail and image. |
| `PartnerEntryFields` | [admin/AdminEntryModal/fields/PartnerEntryFields.tsx](admin/AdminEntryModal/fields/PartnerEntryFields.tsx) | Add/edit form fields for a partner: name, category, website, description, logo and visibility. |
| `PlayerEntryFields` | [admin/AdminEntryModal/fields/PlayerEntryFields.tsx](admin/AdminEntryModal/fields/PlayerEntryFields.tsx) | Add/edit form fields for a player: personal details, game, department, IGN/UID and status. |
| `StaffEntryFields` | [admin/AdminEntryModal/fields/StaffEntryFields.tsx](admin/AdminEntryModal/fields/StaffEntryFields.tsx) | Add/edit form fields for a staff member: name, role, visibility, order, bio and photo. |
| `TimelineEntryFields` | [admin/AdminEntryModal/fields/TimelineEntryFields.tsx](admin/AdminEntryModal/fields/TimelineEntryFields.tsx) | Add/edit form fields for an About-page milestone: year, optional month, title, description and visibility. |
| `AdminApplicationsPanel` | [admin/AdminApplicationsPanel.tsx](admin/AdminApplicationsPanel.tsx) | Admin "Applications" tab: pending applications with approve/reject, plus "Clean up unused photos" (removes uploaded photos no player uses, older than 24 hours). |
| `AdminEventsPanel` | [admin/AdminEventsPanel.tsx](admin/AdminEventsPanel.tsx) | Admin "Events" tab: events shown in the home page feed once they are upcoming. |
| `AdminGamesPanel` | [admin/AdminGamesPanel.tsx](admin/AdminGamesPanel.tsx) | Admin "Games" tab: game titles and logos shown on the home page, with visibility and order controls. |
| `AdminLatestUpdatesPanel` | [admin/AdminLatestUpdatesPanel.tsx](admin/AdminLatestUpdatesPanel.tsx) | Admin "Latest Updates" tab: news items shown in the home page feed and announcement pop-up. |
| `AdminPartnersPanel` | [admin/AdminPartnersPanel.tsx](admin/AdminPartnersPanel.tsx) | Admin "Partners" tab: partner logos for the Partners page, with visibility and order controls. |
| `AdminPlayerFilterBar` | [admin/AdminPlayerFilterBar.tsx](admin/AdminPlayerFilterBar.tsx) | Search and filter controls above the admin player list: text search, department, status, game, date range (with custom From/To dates) and a Clear button, plus the number of matching players. |
| `AdminPlayersPanel` | [admin/AdminPlayersPanel.tsx](admin/AdminPlayersPanel.tsx) | Admin "Players" tab: counts summary, search & filters, player list (table or cards) with paging. |
| `AdminStaffPanel` | [admin/AdminStaffPanel.tsx](admin/AdminStaffPanel.tsx) | Admin "Staffs" tab: staff members with role, bio and photo. |
| `AdminTimelinePanel` | [admin/AdminTimelinePanel.tsx](admin/AdminTimelinePanel.tsx) | Admin "Timeline" tab: the "Key milestones" shown on the About page. Table view only. |
