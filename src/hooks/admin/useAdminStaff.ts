import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import type { AdminStaff } from '../../lib/admin/adminEntries'
import { mapSupabaseError } from '../../lib/admin/adminErrorMessages'
import { supabase } from '../../lib/supabase'

/** All staff members (including hidden) for the admin Staffs tab, in display order. */
export function useAdminStaff({ isAuthenticated, role }: { isAuthenticated: boolean; role: string }) {
  const toast = useToast()
  const [staff, setStaff] = useState<AdminStaff[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const reload = async () => {
    if (!supabase || !isAuthenticated || role !== 'admin') return
    setIsLoading(true)
    const { data, error } = await supabase.from('staff').select('id,full_name,role_title,bio,photo_url,is_visible,sort_order,created_at,updated_at').order('sort_order', { ascending: true }).order('created_at', { ascending: true })
    if (error) {
      console.error('Staff load failed:', error)
      setStaff([])
      toast({ title: 'Unable to load staff', description: mapSupabaseError(error), status: 'error', isClosable: true })
    } else setStaff((data ?? []) as AdminStaff[])
    setIsLoading(false)
  }

  useEffect(() => { void reload() }, [isAuthenticated, role])

  return { staff, isLoading, reload }
}
