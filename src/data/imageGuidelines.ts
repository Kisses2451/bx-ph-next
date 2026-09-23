export type ImageEntityType = 'playerAvatar' | 'game' | 'staff' | 'partner' | 'event' | 'latestUpdate'

export interface ImageGuideline {
  recommendedWidth: number
  recommendedHeight: number
  minWidth: number
  minHeight: number
  aspectRatio: string
  formats: string[]
  maxSizeMB: number
  derivedFrom: string
  displayNote: string
}

// Derived from the largest rendered sizes in the existing UI and the expanded full-width responsive layout.
// - playerAvatar: [src/components/organisms/admin/AdminPlayersPanel.tsx] uses a 42px circular avatar in table rows and 48px avatars in cards; [src/components/pages/AboutPage.tsx] shows staff portraits at 280px tall with objectFit="cover". With the wide-screen layout, these images can render at larger sizes while remaining crisp and centered.
// - game: [src/components/pages/HomePage.tsx] uses 180px tall feature cards and [src/data/siteContent.ts] loads 900px-wide imagery for feature cards. The full-width page can render wider cover art on large displays, so the guideline was increased to preserve clarity and match the wider card proportions.
// - staff: [src/components/pages/AboutPage.tsx] uses 280px tall portrait cards and profile thumbs in the admin dashboard. The expanded grid keeps the portrait sizes legible on wide screens without introducing blur.
// - partner: [src/components/pages/PartnersPage.tsx] shows a 90px high logo card and [src/data/siteContent.ts] uses 200x80 placeholder logos. The full-width layout keeps logo cards larger across wide screens, so the guideline remains comfortably above the display size.
// - event: [src/components/pages/HomePage.tsx] upcoming event cards are rendered at a masonry card size with no explicit banner image in the current code. The wide layout increases card width and the guideline follows that scale.
// - latestUpdate: [src/components/pages/HomePage.tsx] currently uses text updates; no explicit cover image exists, so the guideline follows the same wide-featured-card ratio and is marked as a project assumption.
export const IMAGE_GUIDELINES: Record<ImageEntityType, ImageGuideline> = {
  playerAvatar: {
    recommendedWidth: 1200,
    recommendedHeight: 1200,
    minWidth: 600,
    minHeight: 600,
    aspectRatio: '1:1',
    formats: ['JPG', 'PNG', 'WebP'],
    maxSizeMB: 2,
    derivedFrom: 'src/components/organisms/admin/AdminPlayersPanel.tsx, src/components/pages/AboutPage.tsx',
    displayNote: 'Circular avatar; square source works best and avoids cropping.',
  },
  game: {
    recommendedWidth: 2000,
    recommendedHeight: 1125,
    minWidth: 1000,
    minHeight: 563,
    aspectRatio: '16:9',
    formats: ['JPG', 'PNG', 'WebP'],
    maxSizeMB: 2,
    derivedFrom: 'src/components/pages/HomePage.tsx and src/data/siteContent.ts',
    displayNote: 'Featured game cards use a wide cover with object-fit cover; keep the subject centered to avoid cropping.',
  },
  staff: {
    recommendedWidth: 1200,
    recommendedHeight: 1200,
    minWidth: 600,
    minHeight: 600,
    aspectRatio: '1:1',
    formats: ['JPG', 'PNG', 'WebP'],
    maxSizeMB: 2,
    derivedFrom: 'src/components/pages/AboutPage.tsx and src/components/organisms/admin/AdminPlayersPanel.tsx',
    displayNote: 'Portrait cards crop to a square or rounded rectangle; keep faces centered.',
  },
  partner: {
    recommendedWidth: 1600,
    recommendedHeight: 640,
    minWidth: 800,
    minHeight: 320,
    aspectRatio: '5:2',
    formats: ['PNG', 'SVG', 'WebP', 'JPG'],
    maxSizeMB: 2,
    derivedFrom: 'src/components/pages/PartnersPage.tsx and src/data/siteContent.ts',
    displayNote: 'Logo cards are wide and lightly cropped; keep logo content within the safe area.',
  },
  event: {
    recommendedWidth: 1800,
    recommendedHeight: 1012,
    minWidth: 900,
    minHeight: 506,
    aspectRatio: '16:9',
    formats: ['JPG', 'PNG', 'WebP'],
    maxSizeMB: 2,
    derivedFrom: 'src/components/pages/HomePage.tsx',
    displayNote: 'Cards in the event grid are shown in a wide format and use cover cropping.',
  },
  latestUpdate: {
    recommendedWidth: 1800,
    recommendedHeight: 1012,
    minWidth: 900,
    minHeight: 506,
    aspectRatio: '16:9',
    formats: ['JPG', 'PNG', 'WebP'],
    maxSizeMB: 2,
    derivedFrom: 'src/components/pages/HomePage.tsx and the project’s featured card styling',
    displayNote: 'No live cover image is currently rendered; this follows the same wide-featured-card ratio used for other media content.',
  },
}
