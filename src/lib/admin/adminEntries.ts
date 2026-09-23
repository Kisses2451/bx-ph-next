// Shared vocabulary of the admin dashboard: which tabs exist, what kinds of records can be
// edited, and the empty form each kind starts from when an admin clicks "Add …".
import type { EventItem, GameItem, PartnerItem, PlayerGame, PlayerStatusValue, StaffMember, SupabaseEvent, SupabaseGame, SupabaseStaff } from '../../types/player'

/** Tabs in the order they appear. */
export type AdminTab = 'players' | 'applications' | 'latest-updates' | 'games' | 'partners' | 'events' | 'timeline' | 'staffs'
/** A kind of record that the add/edit/view modal can show. */
export type AdminEntryKind = 'player' | 'update' | 'game' | 'partner' | 'event' | 'staff' | 'timeline'
/** view = read-only details, add = empty form, edit = form filled with an existing record. */
export type AdminEntryModalMode = 'view' | 'add' | 'edit'

/** A record open in the modal. `item` is the untouched original (used to detect unsaved changes). */
export type AdminEntryModalState = {
  kind: AdminEntryKind
  mode: AdminEntryModalMode
  item: Record<string, any>
}

/** Validation messages keyed by form field name. */
export type AdminFormErrors = Record<string, string>

export type AdminGame = SupabaseGame & { is_visible: boolean; sort_order: number }
export type AdminEvent = SupabaseEvent
export type AdminStaff = SupabaseStaff
export type AdminTimelineEvent = { id: string; year: number; month: number | null; title: string; description: string | null; is_visible: boolean; created_at?: string; updated_at?: string }
export type AdminLatestUpdate = { id: string; tag: string | null; title: string; description: string | null; published_at: string | null; is_visible: boolean; sort_order: number; created_at?: string; updated_at?: string }
export type AdminPlayerCounts = { total: number; approved: number; pending: number; rejected: number }
/** Date filter on the Players tab: all time, last 7 or 30 days, or a custom From/To range. */
export type AdminPlayerDatePreset = 'all' | '7' | '30' | 'custom'

export const ADMIN_TAB_ORDER: AdminTab[] = ['players', 'applications', 'latest-updates', 'games', 'partners', 'events', 'timeline', 'staffs']

/** URL for each tab. Timeline has no route of its own and uses ?tab=timeline. */
export const ADMIN_TAB_ROUTES: Record<AdminTab, string> = {
  players: '/admin/players',
  applications: '/admin/applications',
  'latest-updates': '/admin/latest-updates',
  games: '/admin/games',
  partners: '/admin/partners',
  events: '/admin/events',
  timeline: '/admin?tab=timeline',
  staffs: '/admin/staffs',
}

/** Works out the selected tab from the URL (/admin/games, /admin?tab=timeline …). Defaults to players. */
export function adminTabFromUrl(pathname: string, queryTab: string | null | undefined): AdminTab {
  if (queryTab === 'timeline') return 'timeline'
  const segment = pathname.split('/').filter(Boolean).pop() ?? 'players'
  if (segment === 'games') return 'games'
  if (segment === 'applications') return 'applications'
  if (segment === 'latest-updates') return 'latest-updates'
  if (segment === 'partners') return 'partners'
  if (segment === 'events') return 'events'
  if (segment === 'staffs') return 'staffs'
  return 'players'
}

// ---- Empty forms used by "Add …" ----

export const defaultPlayerForm = { id: '', first_name: '', last_name: '', email: '', contact_number: '', date_of_birth: '', contact_link: '', registration_source: 'Online Recruitment', main_game: 'CODM' as PlayerGame, department: 'Clan', in_game_name: '', uid: '', player_id: '', status: 'pending' as PlayerStatusValue, photo_path: '', photo_drive_url: '' }

export const defaultGameForm: Omit<GameItem, 'id'> & { id?: string } = {
  id: '',
  title: '',
  genre: '',
  status: 'Active',
  description: '',
  image: '',
  imageUrl: '',
  featured: true,
}

export const defaultEventForm: Omit<EventItem, 'id'> & { id?: string; is_visible: boolean; sort_order: number } = {
  id: '',
  title: '',
  date: new Date().toISOString().slice(0, 10),
  location: '',
  description: '',
  image: '',
  imageUrl: '',
  is_visible: true,
  sort_order: 0,
}

export const defaultPartnerForm: Omit<PartnerItem, 'id'> & { id?: string } = {
  id: '',
  name: '',
  category: '',
  website: '',
  description: '',
  logo: '',
  imageUrl: '',
}

export const defaultStaffForm: Omit<StaffMember, 'id'> & { id?: string } = {
  id: '',
  name: '',
  role: '',
  bio: '',
  image: '',
  imageUrl: '',
}

export const defaultUpdateForm = {
  id: '',
  title: '',
  tag: 'Recruitment',
  detail: '',
  published_at: new Date().toISOString().slice(0, 16),
  is_visible: true,
  sort_order: 0,
}

export const defaultTimelineForm = {
  id: '', year: new Date().getFullYear(), month: null as number | null, title: '', description: '', is_visible: true,
}

/** A fresh, empty form for the given kind. */
export function createEmptyAdminEntry(kind: AdminEntryKind): Record<string, any> {
  switch (kind) {
    case 'player':
      return { ...defaultPlayerForm, id: '' }
    case 'update':
      return { ...defaultUpdateForm, id: '' }
    case 'game':
      return { ...defaultGameForm, id: '' }
    case 'partner':
      return { ...defaultPartnerForm, id: '' }
    case 'event':
      return { ...defaultEventForm, id: '' }
    case 'staff':
      return { ...defaultStaffForm, id: '' }
    case 'timeline':
      return { ...defaultTimelineForm }
    default:
      return {}
  }
}

/** Reads a form value, treating missing values as an empty string. */
export function readValue(source: Record<string, any>, key: string) {
  return source[key] ?? ''
}

/** True when the form differs from the record it was opened with. */
export function itemIsDirty(current: Record<string, any>, original: Record<string, any>) {
  return JSON.stringify(current) !== JSON.stringify(original)
}

export function sortTimelineEvents(a: AdminTimelineEvent, b: AdminTimelineEvent) {
  return a.year - b.year || (a.month ?? 0) - (b.month ?? 0) || String(a.created_at ?? '').localeCompare(String(b.created_at ?? ''))
}
