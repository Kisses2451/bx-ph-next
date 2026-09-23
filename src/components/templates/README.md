# Templates

**Page layouts with slots and no data.** A template decides *where* things go (header, tabs, footer) and receives the actual content through props or `children`.

**Belongs here if:**
- more than one screen could share the layout, or it is the outer frame of a screen;
- it does not load data or know about specific records.

`SiteLayoutTemplate` wraps every route (see `app/layout.tsx`). `AdminDashboardTemplate` frames the admin dashboard.

## Components in this folder

| Component | File | What it is |
| --- | --- | --- |
| `AdminDashboardTemplate` | [AdminDashboardTemplate.tsx](AdminDashboardTemplate.tsx) | Admin page frame: "MANAGEMENT CENTER" header (with "CENTER" outlined), the signed-in email and Sign out, then a flat tab bar whose selected tab gets a gold underline, and the selected tab's content. |
| `SiteLayoutTemplate` | [SiteLayoutTemplate.tsx](SiteLayoutTemplate.tsx) | The frame around every page: sticky navbar on top, page content, footer at the bottom. Also mounts the "Join now" application modal once so any page can open it. |
