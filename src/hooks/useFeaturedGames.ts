import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SupabaseGame } from '../types/player'

/**
 * Loads the visible games for the home page (title, genre tag, description and logo), in admin-defined order.
 * Reloads when the admin dashboard fires the `games-updated` window event. `retry` loads again after an error.
 */
export function useFeaturedGames(initialGames?: SupabaseGame[]) {
  const [games, setGames] = useState<SupabaseGame[]>(initialGames ?? [])
  const [isLoading, setIsLoading] = useState(!initialGames)
  const [hasError, setHasError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let ignore = false
    const loadGames = async () => {
      setIsLoading(true)
      setHasError(false)
      if (!supabase) {
        setIsLoading(false)
        return
      }
      const { data, error } = await supabase.from('games').select('id,title,tag,description,image_url').eq('is_visible', true).order('sort_order').order('created_at')
      if (ignore) return
      if (error) {
        console.error('Featured games load failed:', error)
        setHasError(true)
      } else setGames((data ?? []) as SupabaseGame[])
      setIsLoading(false)
    }
    // The server already rendered this data (app/**/page.tsx, refreshed every 60 s), so skip the first
    // browser fetch and only reload on Retry or when the admin dashboard announces a change.
    if (!initialGames || retryKey > 0) void loadGames()
    window.addEventListener('games-updated', loadGames)
    return () => { ignore = true; window.removeEventListener('games-updated', loadGames) }
  }, [retryKey])

  return { games, isLoading, hasError, retry: () => setRetryKey((key) => key + 1) }
}
