import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface PublicStats {
  members: number | null
  games: number | null
}

function readStat(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed) && parsed >= 0) return parsed
  }
  return null
}

export function usePublicStats(initialStats: PublicStats = { members: null, games: null }) {
  const hasServerStats = initialStats.members !== null && initialStats.games !== null
  const [stats, setStats] = useState<PublicStats>(initialStats)
  const [isLoading, setIsLoading] = useState(!hasServerStats)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let ignore = false
    // The server already sent the numbers (refreshed every 60 s); only fetch here if it could not.
    if (hasServerStats) return
    const load = async () => {
      if (!supabase) {
        setError(new Error('Supabase is not configured'))
        setIsLoading(false)
        return
      }
      setError(null)
      const { data, error: rpcError } = await supabase.rpc('get_public_stats')
      if (ignore) return
      if (rpcError) {
        setError(rpcError)
      } else {
        const row = Array.isArray(data) ? data[0] : data
        const nextStats = {
          members: readStat(row?.members),
          games: readStat(row?.games),
        }
        if (nextStats.members === null || nextStats.games === null) {
          setError(new Error('Public stats response is invalid'))
        } else {
          setStats(nextStats)
        }
      }
      setIsLoading(false)
    }
    void load()
    return () => { ignore = true }
  }, [hasServerStats])

  return { stats, isLoading, error }
}