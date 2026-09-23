// Images uploaded from the admin dashboard live in the Supabase storage bucket `site-media`,
// in one folder per kind (games/, partners/, events/, staff/). These helpers turn a public URL
// back into its storage path so the old file can be deleted when it is replaced or removed.
// They return null for URLs that are not in that folder (e.g. images hosted elsewhere).

function siteMediaPath(url: string | null | undefined, folder: string) {
  if (!url) return null
  try {
    const path = new URL(url).pathname.split('/site-media/')[1]
    return path?.startsWith(`${folder}/`) ? path : null
  } catch {
    return null
  }
}

export const gameStoragePath = (url: string | null | undefined) => siteMediaPath(url, 'games')
export const partnerStoragePath = (url: string | null | undefined) => siteMediaPath(url, 'partners')
export const eventStoragePath = (url: string | null | undefined) => siteMediaPath(url, 'events')
export const staffStoragePath = (url: string | null | undefined) => siteMediaPath(url, 'staff')
