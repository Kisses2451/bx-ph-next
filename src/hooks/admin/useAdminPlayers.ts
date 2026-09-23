import { useEffect, useMemo, useState } from 'react'
import type { AdminPlayerCounts, AdminPlayerDatePreset } from '../../lib/admin/adminEntries'
import { manilaDate, sanitizePlayerSearch } from '../../lib/admin/playerHelpers'
import { supabase } from '../../lib/supabase'
import type { SupabasePlayer } from '../../types/player'

const PLAYER_SELECT = 'id,full_name,first_name,last_name,email,main_game,department,in_game_name,uid,status,photo_path,photo_drive_url,created_at'
const PLAYER_PAGE_SIZE = 25
type AdminUserRecord = { id?: string; user_id: string; role: string; email?: string | null; created_at?: string | null }

/**
 * Everything the admin Players tab needs: filter values, the current page of players (25 per page),
 * signed photo URLs, and the total/approved/pending counts. Search is debounced by 300 ms and
 * changing any filter jumps back to page 1. Only loads for signed-in admins.
 */
export function useAdminPlayers({ isAuthenticated, role }: { isAuthenticated: boolean; role: string }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [datePreset, setDatePreset] = useState<AdminPlayerDatePreset>('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [playerRows, setPlayerRows] = useState<SupabasePlayer[]>([])
  const [playerLoading, setPlayerLoading] = useState(false)
  const [playerError, setPlayerError] = useState('')
  const [playerCounts, setPlayerCounts] = useState<AdminPlayerCounts>({ total: 0, approved: 0, pending: 0, rejected: 0 })
  const [playerPage, setPlayerPage] = useState(1)
  const [playerTotal, setPlayerTotal] = useState(0)
  const [playerPhotoUrls, setPlayerPhotoUrls] = useState<Record<string, string>>({})
  const [playerGameFilter, setPlayerGameFilter] = useState('all')
  const [playerSearchDebounced, setPlayerSearchDebounced] = useState('')
  const [admins, setAdmins] = useState<AdminUserRecord[]>([])

  useEffect(() => {
    const timer = window.setTimeout(() => setPlayerSearchDebounced(sanitizePlayerSearch(searchTerm)), 300)
    return () => window.clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    setPlayerPage(1)
  }, [playerSearchDebounced, departmentFilter, statusFilter, playerGameFilter, datePreset, fromDate, toDate])

  const playerDateRange = useMemo(() => {
    const today = manilaDate(new Date())
    const shift = (date: string, days: number) => {
      const next = new Date(`${date}T00:00:00Z`)
      next.setUTCDate(next.getUTCDate() + days)
      return next.toISOString().slice(0, 10)
    }
    if (datePreset === '7') return { from: shift(today, -6), to: today }
    if (datePreset === '30') return { from: shift(today, -29), to: today }
    if (datePreset === 'custom') return { from: fromDate, to: toDate }
    return { from: '', to: '' }
  }, [datePreset, fromDate, toDate])

  const loadPlayers = async () => {
    if (!supabase || !isAuthenticated || role !== 'admin') return
    setPlayerLoading(true)
    setPlayerError('')
    let query = supabase.from('players').select(PLAYER_SELECT, { count: 'exact' }).order('created_at', { ascending: false }).range((playerPage - 1) * PLAYER_PAGE_SIZE, playerPage * PLAYER_PAGE_SIZE - 1)
    if (playerSearchDebounced) query = query.or(`full_name.ilike.%${playerSearchDebounced}%,email.ilike.%${playerSearchDebounced}%,in_game_name.ilike.%${playerSearchDebounced}%,uid.ilike.%${playerSearchDebounced}%`)
    if (departmentFilter !== 'all') query = query.eq('department', departmentFilter)
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    if (playerGameFilter !== 'all') query = query.eq('main_game', playerGameFilter)
    if (playerDateRange.from) query = query.gte('created_at', `${playerDateRange.from}T00:00:00+08:00`)
    if (playerDateRange.to) {
      const exclusiveEnd = new Date(`${playerDateRange.to}T00:00:00+08:00`)
      exclusiveEnd.setDate(exclusiveEnd.getDate() + 1)
      query = query.lt('created_at', exclusiveEnd.toISOString())
    }
    const { data, error, count } = await query
    if (error) {
      console.error('Players load failed:', error)
      setPlayerRows([])
      setPlayerTotal(0)
      setPlayerError(error.code === '42501' ? 'Admin permission required.' : 'Players are unavailable right now.')
      setPlayerLoading(false)
      return
    }
    const rows = (data ?? []) as unknown as SupabasePlayer[]
    setPlayerRows(rows)
    setPlayerTotal(count ?? 0)
    // Player photos are private: fetch 1-hour signed URLs for any photos we don't have yet.
    const paths = rows.map((row) => row.photo_path).filter((path): path is string => Boolean(path && !playerPhotoUrls[path]))
    if (paths.length) {
      const signed = await supabase.storage.from('player-photos').createSignedUrls(paths, 3600)
      if (!signed.error) setPlayerPhotoUrls((current) => ({ ...current, ...Object.fromEntries(paths.map((path, index) => [path, signed.data?.[index]?.signedUrl]).filter((entry): entry is [string, string] => Boolean(entry[1]))) }))
    }
    setPlayerLoading(false)
  }

  const loadPlayerCounts = async () => {
    if (!supabase || !isAuthenticated || role !== 'admin') return
    // One database call (function admin_player_counts, see supabase/migrations) instead of four.
    const { data, error } = await supabase.rpc('admin_player_counts')
    if (error) {
      console.error('Player counts load failed:', error)
      return
    }
    const counts = (data ?? {}) as Partial<Record<'total' | 'approved' | 'pending' | 'rejected', number>>
    setPlayerCounts({ total: counts.total ?? 0, approved: counts.approved ?? 0, pending: counts.pending ?? 0, rejected: counts.rejected ?? 0 })
  }

  const loadAdmins = async () => {
    if (!supabase || !isAuthenticated || role !== 'admin') return
    const { data, error } = await supabase.from('admin_users').select('*').order('created_at', { ascending: true })
    if (error) {
      console.error('Admin users load failed:', error)
      return
    }
    setAdmins((data ?? []) as AdminUserRecord[])
  }

  useEffect(() => { void loadPlayers() }, [isAuthenticated, role, playerPage, playerSearchDebounced, departmentFilter, statusFilter, playerGameFilter, playerDateRange])
  useEffect(() => { void loadPlayerCounts() }, [isAuthenticated, role])
  useEffect(() => { void loadAdmins() }, [isAuthenticated, role])

  const clearFilters = () => {
    setSearchTerm('')
    setDepartmentFilter('all')
    setStatusFilter('all')
    setPlayerGameFilter('all')
    setDatePreset('all')
    setFromDate('')
    setToDate('')
  }

  return {
    filters: {
      searchTerm, setSearchTerm,
      departmentFilter, setDepartmentFilter,
      statusFilter, setStatusFilter,
      gameFilter: playerGameFilter, setGameFilter: setPlayerGameFilter,
      datePreset, setDatePreset,
      fromDate, setFromDate,
      toDate, setToDate,
      hasInvalidDateRange: datePreset === 'custom' && Boolean(fromDate && toDate && fromDate > toDate),
      clearFilters,
    },
    players: playerRows,
    photoUrls: playerPhotoUrls,
    isLoading: playerLoading,
    error: playerError,
    counts: playerCounts,
    page: playerPage,
    setPage: setPlayerPage,
    pageSize: PLAYER_PAGE_SIZE,
    total: playerTotal,
    reload: loadPlayers,
    reloadCounts: loadPlayerCounts,
    admins,
  }
}
