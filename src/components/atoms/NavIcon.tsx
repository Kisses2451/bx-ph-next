import type { ReactNode } from 'react'

export type NavIconName = 'dashboard' | 'home' | 'partners' | 'about' | 'logout'

const iconPaths: Record<NavIconName, ReactNode> = {
  dashboard: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  home: <><path d="m4 10 8-6 8 6" /><path d="M6 9.5V20h12V9.5" /><path d="M10 20v-6h4v6" /></>,
  partners: <><path d="m9.5 14.5 5-5" /><path d="M7.5 8.5 5.5 6.5a3 3 0 0 0-4.2 4.2l3 3a3 3 0 0 0 4.2 0l1-1" /><path d="m16.5 15.5 2 2a3 3 0 0 0 4.2-4.2l-3-3a3 3 0 0 0-4.2 0l-1 1" /></>,
  about: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><path d="M12 8h.01" /></>,
  logout: <><path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10" /><path d="m14 8 4 4-4 4" /><path d="M18 12H9" /></>,
}

/** 20px line icon used in the site navbar links and menu. Decorative only (aria-hidden). */
export function NavIcon({ name }: { name: NavIconName }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">{iconPaths[name]}</svg>
}
