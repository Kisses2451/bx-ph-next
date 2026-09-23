import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import type { AdminLatestUpdate } from '../../lib/admin/adminEntries'
import { mapLatestUpdateError } from '../../lib/admin/adminErrorMessages'
import { supabase } from '../../lib/supabase'

/** All latest updates (including hidden) for the admin Latest Updates tab, newest first. */
export function useAdminLatestUpdates({ isAuthenticated, role }: { isAuthenticated: boolean; role: string }) {
  const toast = useToast()
  const [updates, setUpdates] = useState<AdminLatestUpdate[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const reload = async () => {
    if (!supabase || !isAuthenticated || role !== 'admin') return
    setIsLoading(true)
    const { data, error } = await supabase.from('latest_updates').select('id,tag,title,description,published_at,is_visible,sort_order,created_at,updated_at').order('published_at', { ascending: false }).order('sort_order', { ascending: true })
    if (error) {
      console.error('Latest updates load failed:', error)
      setUpdates([])
      toast({ title: 'Unable to load latest updates', description: mapLatestUpdateError(error), status: 'error', isClosable: true })
    } else setUpdates((data ?? []) as AdminLatestUpdate[])
    setIsLoading(false)
  }

  useEffect(() => { void reload() }, [isAuthenticated, role])

  return { updates, isLoading, reload }
}
