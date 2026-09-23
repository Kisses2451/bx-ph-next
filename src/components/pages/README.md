# Pages

**One component per route.** A page:
1. calls the hooks that load its data (`hooks/`);
2. passes that data into organisms;
3. places them inside a template (or a simple container).

Keep pages thin. If a page grows a large block of markup, move it into an organism.

The files in `app/**/page.tsx` are Next.js route entry points. They set the page `<title>` (metadata) and render one of these components.

> The folder is `components/pages`, not `src/pages`. A top-level `src/pages` folder would switch on Next.js's old Pages Router.

| Route | Page component |
| --- | --- |
| `/` | `HomePage` |
| `/about` | `AboutPage` |
| `/partners` | `PartnersPage` |
| `/join`, `/apply` | `JoinPage` |
| `/apply/success` | `ApplicationSuccessPage` |
| `/admin`, `/admin/<tab>` | `AdminDashboardPage` (inside `AdminAccessGate`) |

## Components in this folder

| Component | File | What it is |
| --- | --- | --- |
| `AboutPage` | [AboutPage.tsx](AboutPage.tsx) | About page ( /about ), top to bottom: monument heading with live stats, the story, mission & vision split, the horizontal milestone track, the three pillars, and the "Ready to rise?" join banner. |
| `AdminDashboardPage` | [AdminDashboardPage.tsx](AdminDashboardPage.tsx) | Admin dashboard ( /admin, /admin/<tab> ). Only rendered for signed-in admins (see AdminAccessGate). |
| `ApplicationSuccessPage` | [ApplicationSuccessPage.tsx](ApplicationSuccessPage.tsx) | "Application submitted" confirmation page ( /apply/success ) with a Return home button. |
| `HomePage` | [HomePage.tsx](HomePage.tsx) | Home page ( / ): hero, games strip, the feed (updates + upcoming events), featured games and the join call-to-action. May pop up the newest update once per session. |
| `JoinPage` | [JoinPage.tsx](JoinPage.tsx) | Join page ( /join and /apply ): a short intro. The application form itself is the JoinApplicationModal, which opens automatically on these URLs. |
| `PartnersPage` | [PartnersPage.tsx](PartnersPage.tsx) | Partners page ( /partners ): hero with scrolling logo rows, the tiered partner wall, and the join banner. |
