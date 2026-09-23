# Providers

**Wrappers that give everything inside them shared state or behaviour.** They render no visible UI of their own
(except the error screen).

| Component | File | What it is |
| --- | --- | --- |
| `AdminProviders` | [AdminProviders.tsx](AdminProviders.tsx) | Loads Chakra UI (with Emotion's cache) and the confirm-dialog helper. Used only by `app/admin/layout.tsx`, so the public pages never download Chakra. Colour mode is locked to dark. |
| `AppErrorBoundary` | [AppErrorBoundary.tsx](AppErrorBoundary.tsx) | Catches a crash anywhere in the page and shows a "Something went wrong" message and a "Back to home" button instead of a blank screen. Plain HTML, no Chakra. |
| `ConfirmDialogProvider` | [ConfirmDialogProvider.tsx](ConfirmDialogProvider.tsx) | Gives admin components `useConfirm()`, an async confirm function that shows a Chakra "Are you sure?" dialog. Admin area only. |

`PlayerProvider` (signed-in user and role) lives in `src/context/PlayerContext.tsx` and wraps the whole site in `app/layout.tsx`.
