# Molecules

**A few atoms (or Chakra elements) working together to do one small job** — a form field with its label and error, a stat tile, a pair of edit/delete buttons, a logo tile.

**Belongs here if:**
- it combines a handful of elements into something reusable;
- it only imports from `atoms/` (never from `organisms/`, `templates/` or `pages/`);
- it receives its data through props. It doesn't fetch data or talk to Supabase;
- public-site molecules use plain HTML + CSS classes (Chakra UI is only loaded under `/admin`).

**Doesn't belong here:** a whole page section with a heading, a list and loading/error states — that's an organism.

## Components in this folder

| Component | File | What it is |
| --- | --- | --- |
| `AdminCardGrid` | [AdminCardGrid.tsx](AdminCardGrid.tsx) | Responsive grid (1 / 2 / 3 columns) that holds AdminItemCards in the admin "card" view. |
| `AdminDataTable` | [AdminDataTable.tsx](AdminDataTable.tsx) | White bordered table with a grey header row, used for every list in the admin dashboard. |
| `AdminItemCard` | [AdminItemCard.tsx](AdminItemCard.tsx) | Clickable bordered card for one record in the admin "card" view. |
| `AdminPanelToolbar` | [AdminPanelToolbar.tsx](AdminPanelToolbar.tsx) | Header row of an admin tab: title on the left; table/card switch and "Add …" button on the right. |
| `EditDeleteActions` | [EditDeleteActions.tsx](EditDeleteActions.tsx) | Edit + delete icon buttons for an admin table row or card. Clicks don't open the row. |
| `EmptyStatePanel` | [EmptyStatePanel.tsx](EmptyStatePanel.tsx) | Dashed placeholder box shown when an admin list has no items or failed to load. |
| `FeedCompactCard` | [FeedCompactCard.tsx](FeedCompactCard.tsx) | Smaller card beside the big feed tile: type badge, date, title, and location or description. |
| `FeedFeaturedCard` | [FeedFeaturedCard.tsx](FeedFeaturedCard.tsx) | The big tile in the home feed, framed by a moving gold/maroon border. Shows the date, a huge title with the first word drifting as an outlined watermark behind it, and, for events, a live countdown plus "Add to calendar" and "Directions" links. |
| `FormTextField` | [FormTextField.tsx](FormTextField.tsx) | Labelled single-line input with an error message underneath. Used by all admin entry forms. |
| `FormTextareaField` | [FormTextareaField.tsx](FormTextareaField.tsx) | Labelled multi-line text box with a character counter and error message. Used by admin entry forms. |
| `GameLogoDropzoneField` | [GameLogoDropzoneField.tsx](GameLogoDropzoneField.tsx) | Drag-and-drop (or click to choose) field for a game logo. Validates type/size, previews the file, and warns if it is under 256×256 px or not roughly square. |
| `GamesMarqueeStrip` | [GamesMarqueeStrip.tsx](GamesMarqueeStrip.tsx) | Scrolling strip under the home hero: every featured game title plus a gold "Recruitment open". Shows fallback titles while games load or if loading fails. Set STRIP_MODE to 'off' to hide it. |
| `ImageUploadField` | [ImageUploadField.tsx](ImageUploadField.tsx) | Admin form field for an image: either a file picker (`allowUpload`) or a URL input. Shows a thumbnail preview, the detected size, and warnings when the image is smaller or a different shape than the recommended size for `entityType` (see data/imageGuidelines.ts). |
| `PaginationBar` | [PaginationBar.tsx](PaginationBar.tsx) | "Page 2 of 5 · 120 players" text with Previous / Next buttons. |
| `PlayerCountsSummary` | [PlayerCountsSummary.tsx](PlayerCountsSummary.tsx) | "Summary Findings" box at the top of the admin Players tab: total, approved and pending counts. |
| `RecruitmentLiveTile` | [RecruitmentLiveTile.tsx](RecruitmentLiveTile.tsx) | Maroon "Recruitment live / Join the roster" tile in the home feed. Opens the join modal (falls back to /join). |
| `ReorderButtons` | [ReorderButtons.tsx](ReorderButtons.tsx) | Up/down arrow buttons that change an item's display order on the website. |
| `SiteDialog` | [SiteDialog.tsx](SiteDialog.tsx) | Accessible pop-up window for the public site (no Chakra): traps focus, closes on Escape, locks page scroll and returns focus when it closes. Bottom sheet on phones, centred box on larger screens. Used by the Join and announcement pop-ups. |
| `SiteSearch` | [SiteSearch.tsx](SiteSearch.tsx) | Navbar search box. Matches the typed text against a fixed list of site pages and keywords (no server search) and shows links to the matching pages. Collapses to an icon below 1024px. |
| `StatTile` | [StatTile.tsx](StatTile.tsx) | Small box with a label on top and a big number below, e.g. "Approved / 42". |
| `TableCardViewToggle` | [TableCardViewToggle.tsx](TableCardViewToggle.tsx) | Two-button switch that lets admins show a list as a table or as a grid of cards. |
| `VisibleOnWebsiteToggle` | [VisibleOnWebsiteToggle.tsx](VisibleOnWebsiteToggle.tsx) | "Visible on website" switch used in admin forms to hide an item from the public site without deleting it. |
