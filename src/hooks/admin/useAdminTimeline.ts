import { useEffect, useState } from 'react'
import type { AdminTimelineEvent } from '../../lib/admin/adminEntries'
import { supabase } from '../../lib/supabase'

/**
 * All About-page milestones (including hidden) for the admin Timeline tab, oldest first.
 * `setEvents` lets saves/deletes update the list without reloading.
 */
export function useAdminTimeline({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [events, setEvents] = useState<AdminTimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !supabase) return
    let ignore = false
    setIsLoading(true)
    supabase.from('timeline_events').select('*').order('year', { ascending: true }).order('month', { ascending: true, nullsFirst: true }).order('created_at', { ascending: true }).then(({ data, error: loadError }) => {
      if (ignore) return
      if (loadError) {
        console.error('Timeline load failed:', loadError)
        setError('Timeline unavailable right now')
        setEvents([])
      } else {
        setError('')
        setEvents((data ?? []) as AdminTimelineEvent[])
      }
      setIsLoading(false)
    })
    return () => { ignore = true }
  }, [isAuthenticated])

  return { events, setEvents, isLoading, error }
}
