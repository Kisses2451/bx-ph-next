# Components

The UI is organised with **atomic design**: small pieces combine into bigger ones.

```
atoms  →  molecules  →  organisms  →  templates  →  pages
(badge)   (form field)   (navbar,      (page         (one per
                          admin tab)    layout)       route)
```

| Folder | What goes in it | May import from |
| --- | --- | --- |
| [atoms/](atoms/README.md) | One element with one job: a badge, icon, button, avatar | nothing in `components/` |
| [molecules/](molecules/README.md) | A few atoms doing one small job: a labelled field, a stat tile, edit/delete buttons | atoms |
| [organisms/](organisms/README.md) | A whole section: navbar, home feed, an admin tab, a modal | atoms, molecules |
| [templates/](templates/README.md) | Page layout with slots and no data | atoms, molecules, organisms |
| [pages/](pages/README.md) | One screen per route. Loads data with hooks and assembles organisms in a template | everything above |
| [providers/](providers/README.md) | App-wide wrappers (error boundary, confirm dialog) | — |

**Rule of thumb:** imports only point *left* in the diagram. An atom never imports a molecule, and an organism never imports a page.

## Where the rest of the code lives

| Folder | Contents |
| --- | --- |
| `app/` | Next.js routes. Each `page.tsx` sets the title and renders a component from `components/pages/`. |
| `hooks/` | Data loading for public pages (`useFeaturedGames`, `usePublicTimeline`, …). |
| `hooks/admin/` | Admin dashboard data and actions. `useAdminEntryEditor` handles the add/edit modal, saving and deleting. `useAdminListActions` handles visibility switches and reordering. |
| `lib/` | Supabase client, uploads, image processing. |
| `lib/admin/` | Admin rules with no UI: tab list, empty forms, validation, error messages, storage paths. |
| `context/` | `PlayerContext`: the signed-in admin session (`usePlayers()`). |
| `data/` | Static text and image size guidelines. |
| `types/` | Shared TypeScript types. |

## Naming conventions

- **File name = component name**, one exported component per file (small private helpers may live in the same file).
- Names say **what it is and where it's used**: `AdminPlayersPanel`, `HomeFeedSection`, `PlayerStatusBadge`.
  - `…Section`: a block on a public page.
  - `…Panel`: an admin tab.
  - `…Modal`: a dialog.
  - `…Field`: a form input.
  - `…Badge`: a small label.
  - `…Template`: a layout.
  - `…Page`: a route.
- Every component has a one-line comment above it saying what it is. The tables in each folder's README are built from those comments.

## Adding a new component

1. Decide the level with the rules above. If you're unsure, start lower (a molecule) and move it up if it grows.
2. Create `Level/YourComponent.tsx` and add a `/** one-line description */` above the export.
3. Add a row to that folder's README.
