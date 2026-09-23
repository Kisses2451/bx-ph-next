import { useToast } from '@chakra-ui/react'
import type { AdminEvent, AdminGame, AdminLatestUpdate, AdminStaff, AdminTimelineEvent } from '../../lib/admin/adminEntries'
import { mapLatestUpdateError, mapSupabaseError } from '../../lib/admin/adminErrorMessages'
import { supabase } from '../../lib/supabase'
import { PARTNERS_UPDATED_EVENT } from '../usePartners'
import type { SupabasePartner } from '../../types/player'
import type { useAdminEvents } from './useAdminEvents'
import type { useAdminGames } from './useAdminGames'
import type { useAdminLatestUpdates } from './useAdminLatestUpdates'
import type { useAdminStaff } from './useAdminStaff'
import type { useAdminTimeline } from './useAdminTimeline'

interface UseAdminListActionsOptions {
  games: ReturnType<typeof useAdminGames>
  events: ReturnType<typeof useAdminEvents>
  latestUpdates: ReturnType<typeof useAdminLatestUpdates>
  staff: ReturnType<typeof useAdminStaff>
  timeline: ReturnType<typeof useAdminTimeline>
  partners: SupabasePartner[]
  refreshPartners: () => Promise<void>
}

/**
 * Quick changes made straight from an admin list, without opening the modal:
 * the "visible on website" switches and the move up/down buttons. No confirmation is asked.
 */
export function useAdminListActions({ games, events, latestUpdates, staff, timeline, partners, refreshPartners }: UseAdminListActionsOptions) {
  const toast = useToast()

  const toggleLatestUpdateVisibility = async (item: AdminLatestUpdate) => {
    if (!supabase) return
    const { error } = await supabase.from('latest_updates').update({ is_visible: !item.is_visible }).eq('id', item.id)
    if (error) toast({ title: 'Unable to update visibility', description: mapLatestUpdateError(error), status: 'error', isClosable: true })
    else { await latestUpdates.reload(); window.dispatchEvent(new Event('latest-updates-updated')) }
  }

  const toggleGameVisibility = async (item: AdminGame) => {
    if (!supabase) return
    const { error } = await supabase.from('games').update({ is_visible: !item.is_visible }).eq('id', item.id)
    if (error) { console.error('Game visibility update failed:', error); toast({ title: 'Unable to update visibility', description: error.message, status: 'error', isClosable: true }) }
    else { await games.reload(); window.dispatchEvent(new Event('games-updated')) }
  }

  const togglePartnerVisibility = async (item: SupabasePartner) => {
    if (!supabase) return
    const { error } = await supabase.from('partners').update({ is_visible: !item.is_visible }).eq('id', item.id)
    if (error) { console.error('Partner visibility update failed:', error); toast({ title: 'Unable to update visibility', description: mapSupabaseError(error), status: 'error', isClosable: true }); return }
    await refreshPartners()
    window.dispatchEvent(new Event(PARTNERS_UPDATED_EVENT))
  }

  const toggleEventVisibility = async (item: AdminEvent) => {
    if (!supabase) return
    const { error } = await supabase.from('events').update({ is_visible: !item.is_visible }).eq('id', item.id)
    if (error) toast({ title: 'Unable to update visibility', description: mapSupabaseError(error), status: 'error', isClosable: true })
    else { await events.reload(); window.dispatchEvent(new Event('events-updated')) }
  }

  const toggleStaffVisibility = async (item: AdminStaff) => {
    if (!supabase) return
    const { error } = await supabase.from('staff').update({ is_visible: !item.is_visible }).eq('id', item.id)
    if (error) toast({ title: 'Unable to update visibility', description: mapSupabaseError(error), status: 'error', isClosable: true })
    else await staff.reload()
  }

  const toggleTimelineVisibility = async (item: AdminTimelineEvent) => {
    if (!supabase) return
    const nextVisible = !item.is_visible
    const { error } = await supabase.from('timeline_events').update({ is_visible: nextVisible }).eq('id', item.id)
    if (error) {
      console.error('Timeline visibility update failed:', error)
      toast({ title: 'Unable to update visibility', description: error.message, status: 'error', isClosable: true })
      return
    }
    timeline.setEvents((current) => current.map((event) => event.id === item.id ? { ...event, is_visible: nextVisible } : event))
  }

  /** Swaps the sort_order of a game with its neighbour above or below. */
  const moveGame = async (item: AdminGame, direction: 'up' | 'down') => {
    if (!supabase) return
    const index = games.games.findIndex((game) => game.id === item.id)
    const neighbor = games.games[index + (direction === 'up' ? -1 : 1)]
    if (!neighbor) return
    const first = await supabase.from('games').update({ sort_order: neighbor.sort_order }).eq('id', item.id)
    const second = await supabase.from('games').update({ sort_order: item.sort_order }).eq('id', neighbor.id)
    if (first.error || second.error) {
      const error = first.error || second.error
      console.error('Game reorder failed:', error)
      toast({ title: 'Unable to reorder games', description: error?.message, status: 'error', isClosable: true })
      return
    }
    await games.reload()
    window.dispatchEvent(new Event('games-updated'))
  }

  /** Swaps the sort_order of a partner with its neighbour above or below. */
  const movePartner = async (item: SupabasePartner, direction: 'up' | 'down') => {
    if (!supabase) return
    const index = partners.findIndex((partner) => partner.id === item.id)
    const neighbor = partners[index + (direction === 'up' ? -1 : 1)]
    if (!neighbor) return
    const first = await supabase.from('partners').update({ sort_order: neighbor.sort_order }).eq('id', item.id)
    const second = await supabase.from('partners').update({ sort_order: item.sort_order }).eq('id', neighbor.id)
    if (first.error || second.error) { const error = first.error || second.error; console.error('Partner reorder failed:', error); toast({ title: 'Unable to reorder partners', description: mapSupabaseError(error ?? {}), status: 'error', isClosable: true }); return }
    await refreshPartners()
    window.dispatchEvent(new Event(PARTNERS_UPDATED_EVENT))
  }

  const moveEvent = async (item: AdminEvent, direction: 'up' | 'down') => {
    if (!supabase) return
    const index = events.events.findIndex((event) => event.id === item.id)
    const neighbor = events.events[index + (direction === 'up' ? -1 : 1)]
    if (!neighbor) return
    const first = await supabase.from('events').update({ sort_order: neighbor.sort_order }).eq('id', item.id)
    const second = await supabase.from('events').update({ sort_order: item.sort_order }).eq('id', neighbor.id)
    if (first.error || second.error) { toast({ title: 'Unable to reorder events', description: mapSupabaseError(first.error || second.error || {}), status: 'error', isClosable: true }); return }
    await events.reload()
    window.dispatchEvent(new Event('events-updated'))
  }

  const moveStaff = async (item: AdminStaff, direction: 'up' | 'down') => {
    if (!supabase) return
    const index = staff.staff.findIndex((member) => member.id === item.id)
    const neighbor = staff.staff[index + (direction === 'up' ? -1 : 1)]
    if (!neighbor) return
    const first = await supabase.from('staff').update({ sort_order: neighbor.sort_order }).eq('id', item.id)
    const second = await supabase.from('staff').update({ sort_order: item.sort_order }).eq('id', neighbor.id)
    if (first.error || second.error) { toast({ title: 'Unable to reorder staff', description: mapSupabaseError(first.error || second.error || {}), status: 'error', isClosable: true }); return }
    await staff.reload()
  }

  return { toggleLatestUpdateVisibility, toggleGameVisibility, togglePartnerVisibility, toggleEventVisibility, toggleStaffVisibility, toggleTimelineVisibility, moveGame, movePartner, moveEvent, moveStaff }
}
