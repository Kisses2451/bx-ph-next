import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SupabaseEvent } from '../types/player'

/**
 * Loads visible events dated today or later (Manila time), soonest first, for the home page feed.
 * Reloads when the admin dashboard fires the `events-updated` window event.
 */
export function useUpcomingEvents(initialEvents?: SupabaseEvent[]) {
  const [events, setEvents] = useState<SupabaseEvent[]>(initialEvents ?? [])
  const [isLoading, setIsLoading] = useState(!initialEvents)

  useEffect(() => {
    let ignore = false
    const loadEvents = async () => {
      setIsLoading(true)
      if (!supabase) {
        setIsLoading(false)
        return
      }
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
      const { data, error } = await supabase.from('events').select('id,title,event_date,location,description,image_url').eq('is_visible', true).gte('event_date', today).order('event_date', { ascending: true }).order('sort_order', { ascending: true })
      if (ignore) return
      if (error) console.error('Events load failed:', error)
      else setEvents((data ?? []) as SupabaseEvent[])
      setIsLoading(false)
    }
    // The server already rendered this data (app/**/page.tsx, refreshed every 60 s), so skip the first
    // browser fetch and only reload on Retry or when the admin dashboard announces a change.
    if (!initialEvents) void loadEvents()
    window.addEventListener('events-updated', loadEvents)
    return () => { ignore = true; window.removeEventListener('events-updated', loadEvents) }
  }, [])

  return { events, isLoading }
}
