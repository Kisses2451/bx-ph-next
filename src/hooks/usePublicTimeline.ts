import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export type PublicTimelineEvent = { id: string; year: number; month: number | null; title: string; description: string | null; is_visible: boolean; created_at: string }

function sortTimelineEvents(a: PublicTimelineEvent, b: PublicTimelineEvent) {
  return a.year - b.year || (a.month ?? 0) - (b.month ?? 0) || a.created_at.localeCompare(b.created_at)
}

/** Loads the visible "Key milestones" for the About page, oldest first. */
export function usePublicTimeline(initialEvents?: PublicTimelineEvent[]) {
  const [events, setEvents] = useState<PublicTimelineEvent[]>(initialEvents ?? [])
  const [isLoading, setIsLoading] = useState(!initialEvents)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let ignore = false
    // The server already rendered this data (app/**/page.tsx, refreshed every 60 s), so skip the first
    // browser fetch.
    if (initialEvents) return
    if (!supabase) { setIsLoading(false); return }
    supabase.from('timeline_events').select('id,year,month,title,description,is_visible,created_at').eq('is_visible', true).order('year', { ascending: true }).order('month', { ascending: true, nullsFirst: true }).order('created_at', { ascending: true }).then(({ data, error }) => {
      if (ignore) return
      if (error) {
        console.error('Timeline load failed:', error)
        setHasError(true)
      } else {
        setEvents(((data ?? []) as PublicTimelineEvent[]).sort(sortTimelineEvents))
      }
      setIsLoading(false)
    })
    return () => { ignore = true }
  }, [])

  return { events, isLoading, hasError }
}
