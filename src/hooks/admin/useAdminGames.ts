import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import type { AdminGame } from '../../lib/admin/adminEntries'
import { supabase } from '../../lib/supabase'

/** All games (visible and hidden) for the admin Games tab, in display order. */
export function useAdminGames({ isAuthenticated }: { isAuthenticated: boolean }) {
  const toast = useToast()
  const [games, setGames] = useState<AdminGame[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const reload = async () => {
    if (!supabase) return
    setIsLoading(true)
    const { data, error } = await supabase.from('games').select('id,title,tag,description,image_url,is_visible,sort_order,created_at,updated_at').order('sort_order').order('created_at')
    if (error) {
      console.error('Games load failed:', error)
      toast({ title: 'Unable to load games', description: error.message, status: 'error', isClosable: true })
    } else setGames((data ?? []) as AdminGame[])
    setIsLoading(false)
  }

  useEffect(() => { if (isAuthenticated) void reload() }, [isAuthenticated])

  return { games, isLoading, reload }
}
