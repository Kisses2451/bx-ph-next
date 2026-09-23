import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AdminRoute } from './AdminRoute'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

// Handles /admin plus /admin/players, /admin/latest-updates, /admin/games,
// /admin/partners, /admin/events, /admin/timeline and /admin/staffs.
const ADMIN_TABS = ['players', 'applications', 'latest-updates', 'games', 'partners', 'events', 'timeline', 'staffs']

// Access control: AdminAccessGate hides the UI; Supabase row-level security protects the data. Every table written by the dashboard must have RLS policies that only allow users listed in admin_users.
export default async function Page({ params }: { params: Promise<{ tab?: string[] }> }) {
  const { tab } = await params

  if (tab && (tab.length > 1 || !ADMIN_TABS.includes(tab[0]))) {
    notFound()
  }

  return <AdminRoute />
}
