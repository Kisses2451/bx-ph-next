import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface LatestUpdateRecord {
  id: string
  tag: string | null
  title: string
  description: string | null
  published_at: string | null
  updated_at: string | null
  is_visible?: boolean
  sort_order?: number
}

export function useLatestUpdates(initialUpdates?: LatestUpdateRecord[]) {
  const [updates, setUpdates] = useState<LatestUpdateRecord[]>(initialUpdates ?? [])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let ignore = false

    if (initialUpdates) {
      setUpdates(initialUpdates)
      setIsLoading(false)
      return () => { ignore = true }
    }

    const load = async () => {
      if (!supabase) {
        setIsLoading(false)
        return
      }

      const result = await supabase
        .from('latest_updates')
        .select('id,tag,title,description,published_at,updated_at')
        .eq('is_visible', true)
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false })

      if (ignore) return
      if (result.error) {
        console.error('Latest updates load failed:', result.error)
        setError(result.error)
      } else {
        setUpdates((result.data ?? []) as LatestUpdateRecord[])
      }
      setIsLoading(false)
    }

    void load()
    window.addEventListener('latest-updates-updated', load)
    return () => { ignore = true; window.removeEventListener('latest-updates-updated', load) }
  }, [initialUpdates])

  return { updates, latestUpdate: updates[0] ?? null, isLoading, error }
}