import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import type { AdminEvent } from '../../lib/admin/adminEntries'
import { mapSupabaseError } from '../../lib/admin/adminErrorMessages'
import { supabase } from '../../lib/supabase'

/** All events (past, future, hidden) for the admin Events tab, by date. */
export function useAdminEvents({ isAuthenticated, role }: { isAuthenticated: boolean; role: string }) {
  const toast = useToast()
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const reload = async () => {
    if (!supabase || !isAuthenticated || role !== 'admin') return
    setIsLoading(true)
    const { data, error } = await supabase.from('events').select('id,title,event_date,location,description,image_url,is_visible,sort_order,created_at,updated_at').order('event_date', { ascending: true }).order('sort_order', { ascending: true })
    if (error) {
      console.error('Events load failed:', error)
      setEvents([])
      toast({ title: 'Unable to load events', description: mapSupabaseError(error), status: 'error', isClosable: true })
    } else setEvents((data ?? []) as AdminEvent[])
    setIsLoading(false)
  }

  useEffect(() => { void reload() }, [isAuthenticated, role])

  return { events, isLoading, reload }
}
