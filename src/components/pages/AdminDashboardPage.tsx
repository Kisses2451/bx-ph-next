'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { usePlayers } from '../../context/PlayerContext'
import { useAdminEntryEditor } from '../../hooks/admin/useAdminEntryEditor'
import { useAdminEvents } from '../../hooks/admin/useAdminEvents'
import { useAdminApplications } from '../../hooks/admin/useAdminApplications'
import { useAdminGames } from '../../hooks/admin/useAdminGames'
import { useAdminLatestUpdates } from '../../hooks/admin/useAdminLatestUpdates'
import { useAdminListActions } from '../../hooks/admin/useAdminListActions'
import { useAdminPlayers } from '../../hooks/admin/useAdminPlayers'
import { useAdminStaff } from '../../hooks/admin/useAdminStaff'
import { useAdminTimeline } from '../../hooks/admin/useAdminTimeline'
import { useAdminPartners } from '../../hooks/usePartners'
import { ADMIN_TAB_ORDER, ADMIN_TAB_ROUTES, adminTabFromUrl, type AdminTab } from '../../lib/admin/adminEntries'
import type { TableCardViewMode } from '../molecules/TableCardViewToggle'
import { AdminEntryModal } from '../organisms/admin/AdminEntryModal/AdminEntryModal'
import { AdminEventsPanel } from '../organisms/admin/AdminEventsPanel'
import { AdminApplicationsPanel } from '../organisms/admin/AdminApplicationsPanel'
import { AdminGamesPanel } from '../organisms/admin/AdminGamesPanel'
import { AdminLatestUpdatesPanel } from '../organisms/admin/AdminLatestUpdatesPanel'
import { AdminPartnersPanel } from '../organisms/admin/AdminPartnersPanel'
import { AdminPlayersPanel } from '../organisms/admin/AdminPlayersPanel'
import { AdminStaffPanel } from '../organisms/admin/AdminStaffPanel'
import { AdminTimelinePanel } from '../organisms/admin/AdminTimelinePanel'
import { AdminDashboardTemplate } from '../templates/AdminDashboardTemplate'

/**
 * Admin dashboard ( /admin, /admin/<tab> ). Only rendered for signed-in admins (see AdminAccessGate).
 *
 * How it is put together:
 * - one data hook per tab loads that tab's records (hooks/admin/useAdmin*.ts);
 * - useAdminEntryEditor owns the add/edit/view modal and all saves and deletes;
 * - useAdminListActions handles visibility switches and reordering;
 * - each tab is an organism in organisms/admin/, framed by AdminDashboardTemplate.
 * The selected tab comes from the URL, so tabs can be bookmarked.
 */
export function AdminDashboardPage() {
  const { role, isAuthenticated, email, logout } = usePlayers()
  const pathname = usePathname() ?? '/admin'
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentTab = adminTabFromUrl(pathname, searchParams?.get('tab'))

  const players = useAdminPlayers({ isAuthenticated, role })
  const applications = useAdminApplications({ isAuthenticated, role, onChanged: () => { void players.reload(); void players.reloadCounts() } })
  const games = useAdminGames({ isAuthenticated })
  const events = useAdminEvents({ isAuthenticated, role })
  const latestUpdates = useAdminLatestUpdates({ isAuthenticated, role })
  const staff = useAdminStaff({ isAuthenticated, role })
  const timeline = useAdminTimeline({ isAuthenticated })
  const { partners, isLoading: partnersLoading, error: partnersError, retry: retryPartners, refresh: refreshPartners } = useAdminPartners()

  const editor = useAdminEntryEditor({ players, games, events, latestUpdates, staff, timeline, partners, refreshPartners })
  const listActions = useAdminListActions({ games, events, latestUpdates, staff, timeline, partners, refreshPartners })

  // Table or card view, remembered per tab while the page is open.
  const [viewMode, setViewMode] = useState<Record<AdminTab, TableCardViewMode>>({
    players: 'table',
    applications: 'card',
    'latest-updates': 'table',
    games: 'table',
    partners: 'table',
    events: 'table',
    timeline: 'table',
    staffs: 'table',
  })
  const viewModeProps = (tab: AdminTab) => ({
    viewMode: viewMode[tab],
    onViewModeChange: (next: TableCardViewMode) => setViewMode((current) => ({ ...current, [tab]: next })),
  })

  const tabs = [
    {
      label: 'Players',
      content: <AdminPlayersPanel players={players} {...viewModeProps('players')} onOpen={(item, mode) => editor.openModal('player', item, mode)} onDelete={(id) => editor.handleDeleteEntry('player', id)} onApprove={(id) => editor.handlePlayerApprove(id, 'approve')} onReject={(id) => editor.handlePlayerApprove(id, 'reject')} />,
    },
    {
      label: 'Applications',
      content: <AdminApplicationsPanel applications={applications.applications} photoUrls={applications.photoUrls} isLoading={applications.isLoading} onApprove={(item) => void applications.approve(item)} onReject={(item) => void applications.reject(item)} onDelete={(item) => void applications.remove(item)} onReload={() => void applications.reload()} onCleanUpPhotos={() => void applications.cleanUpOrphanPhotos()} isCleaningPhotos={applications.isCleaningPhotos} />,
    },
    {
      label: 'Latest Updates',
      content: <AdminLatestUpdatesPanel updates={latestUpdates.updates} isLoading={latestUpdates.isLoading} {...viewModeProps('latest-updates')} onOpen={(item, mode) => editor.openModal('update', item, mode)} onDelete={(id) => editor.handleDeleteEntry('update', id)} onToggleVisibility={listActions.toggleLatestUpdateVisibility} />,
    },
    {
      label: 'Games',
      content: <AdminGamesPanel games={games.games} isLoading={games.isLoading} {...viewModeProps('games')} onOpen={(item, mode) => editor.openModal('game', item, mode)} onDelete={(id) => editor.handleDeleteEntry('game', id)} onToggleVisibility={listActions.toggleGameVisibility} onMove={listActions.moveGame} />,
    },
    {
      label: 'Partners',
      content: <AdminPartnersPanel partners={partners} isLoading={partnersLoading} error={partnersError} onRetry={retryPartners} {...viewModeProps('partners')} onOpen={(item, mode) => editor.openModal('partner', item, mode)} onDelete={(id) => editor.handleDeleteEntry('partner', id)} onToggleVisibility={listActions.togglePartnerVisibility} onMove={listActions.movePartner} />,
    },
    {
      label: 'Events',
      content: <AdminEventsPanel events={events.events} isLoading={events.isLoading} {...viewModeProps('events')} onOpen={(item, mode) => editor.openModal('event', item, mode)} onDelete={(id) => editor.handleDeleteEntry('event', id)} onToggleVisibility={listActions.toggleEventVisibility} onMove={listActions.moveEvent} />,
    },
    {
      label: 'Timeline',
      content: <AdminTimelinePanel events={timeline.events} isLoading={timeline.isLoading} error={timeline.error} {...viewModeProps('timeline')} onOpen={(item, mode) => editor.openModal('timeline', item, mode)} onDelete={(id) => editor.handleDeleteEntry('timeline', id)} onToggleVisibility={listActions.toggleTimelineVisibility} />,
    },
    {
      label: 'Staffs',
      content: <AdminStaffPanel staff={staff.staff} isLoading={staff.isLoading} {...viewModeProps('staffs')} onOpen={(item, mode) => editor.openModal('staff', item, mode)} onDelete={(id) => editor.handleDeleteEntry('staff', id)} onToggleVisibility={listActions.toggleStaffVisibility} onMove={listActions.moveStaff} />,
    },
  ]

  return (
    <AdminDashboardTemplate
      tabs={tabs}
      activeTabIndex={ADMIN_TAB_ORDER.indexOf(currentTab)}
      onTabChange={(index) => router.push(ADMIN_TAB_ROUTES[ADMIN_TAB_ORDER[index]])}
      onSignOut={logout}
      adminEmail={email}
    >
      <AdminEntryModal editor={editor} />
    </AdminDashboardTemplate>
  )
}
