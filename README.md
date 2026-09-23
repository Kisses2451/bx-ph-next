# Bloodlust Philippines Website

A Next.js (App Router) + TypeScript site for a competitive gaming and talent organization. The app includes:

- a public landing page with updates, games, events, and partners
- dedicated About and Partners pages
- an applicant intake flow for player recruitment
- an admin dashboard for managing recruitment and site content

## Tech stack

- Next.js (App Router)
- React 19
- TypeScript
- Chakra UI v2
- Supabase

## Local setup

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

## Environment variables

Create `.env.local` in the project root (see `.env.example`). Next.js only exposes
variables prefixed with `NEXT_PUBLIC_` to the browser:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=player-photos
```

Never put the Supabase service role key in a `NEXT_PUBLIC_` variable.

## Supabase setup

1. Create a Supabase project in the Supabase dashboard.
2. Copy the project URL and anon key into `.env.local` as above.
3. Enable Email authentication for the admin sign-in flow.
4. Create a storage bucket named `player-photos` and make it public if uploaded player photos should be viewable in the app.

## Deployment to Vercel

1. Push the project to GitHub and import it in Vercel. Vercel detects Next.js automatically.
2. In the Vercel project settings, set **Framework Preset** to Next.js (it was Vite before the migration).
3. Add the `NEXT_PUBLIC_*` environment variables listed above.
4. Deploy.

## Routes

| URL | Route file | Page component |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | `components/pages/HomePage.tsx` |
| `/about` | `src/app/about/page.tsx` | `components/pages/AboutPage.tsx` |
| `/partners` | `src/app/partners/page.tsx` | `components/pages/PartnersPage.tsx` |
| `/join`, `/apply` | `src/app/join/page.tsx`, `src/app/apply/page.tsx` | `components/pages/JoinPage.tsx` |
| `/apply/success` | `src/app/apply/success/page.tsx` | `components/pages/ApplicationSuccessPage.tsx` |
| `/admin`, `/admin/<tab>` | `src/app/admin/[[...tab]]/page.tsx` | `components/pages/AdminDashboardPage.tsx` |

Unknown URLs redirect to `/`.

## Project structure

UI components follow **atomic design** (atoms → molecules → organisms → templates → pages).
Start with [src/components/README.md](src/components/README.md) for the rules and a map of every component.

```text
src/
  app/                  Next.js routes, root layout and providers
  components/
    atoms/              single elements: badges, icons, buttons, avatars
    molecules/          small groups: form fields, tiles, action buttons
    organisms/          page sections: navbar, feed, admin tabs, modals
    templates/          page layouts: site frame, admin dashboard frame
    pages/              one component per route
    providers/          app-wide wrappers: error boundary, confirm dialog
  hooks/                data loading for public pages
    admin/              admin dashboard data, saving and deleting
  lib/                  Supabase client, uploads, image processing
    admin/              admin rules: tabs, empty forms, validation, errors
  context/              signed-in admin session (usePlayers)
  data/                 static text and image guidelines
  types/                shared TypeScript types
public/                 static files served from /
```
