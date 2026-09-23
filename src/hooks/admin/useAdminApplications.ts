import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { mapSupabaseError } from '../../lib/admin/adminErrorMessages'
import { supabase } from '../../lib/supabase'

/**
 * A join-form submission. There is no separate "applications" table: the Join form inserts into
 * public.players with status 'pending' (allowed for visitors by the RLS policy "Public can submit applications").
 * This hook is the review queue: it lists pending players; Approve / Reject change their status.
 */
export type AdminApplication = {
  id: string
  main_game: 'CODM' | 'HOK'
  first_name: string
  last_name: string
  contact_number: string | null
  email: string
  date_of_birth: string | null
  contact_link: string | null
  registration_source: string | null
  department: 'Clan' | 'Community' | null
  in_game_name: string | null
  uid: string | null
  player_id: string | null
  photo_path: string | null
  status: string | null
  created_at: string
}

const APPLICATION_SELECT = 'id,main_game,first_name,last_name,contact_number,email,date_of_birth,contact_link,registration_source,department,in_game_name,uid,player_id,photo_path,status,created_at'
const PHOTO_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'player-photos'

export function useAdminApplications({ isAuthenticated, role, onChanged }: { isAuthenticated: boolean; role: string; /** Called after approve/reject/delete, e.g. to refresh the Players tab and counts. */ onChanged?: () => void }) {
  const toast = useToast()
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const reload = async () => {
    if (!supabase || !isAuthenticated || role !== 'admin') return
    setIsLoading(true)
    const { data, error } = await supabase.from('players').select(APPLICATION_SELECT).eq('status', 'pending').order('created_at', { ascending: false })
    if (error) {
      toast({ title: 'Unable to load applications', description: mapSupabaseError(error), status: 'error', isClosable: true })
      setApplications([])
      setIsLoading(false)
      return
    }
    const rows = (data ?? []) as AdminApplication[]
    setApplications(rows)
    const paths = rows.map((row) => row.photo_path).filter((path): path is string => Boolean(path && !photoUrls[path]))
    if (paths.length) {
      const signed = await supabase.storage.from(PHOTO_BUCKET).createSignedUrls(paths, 3600)
      if (!signed.error) setPhotoUrls((current) => ({ ...current, ...Object.fromEntries(paths.map((path, index) => [path, signed.data?.[index]?.signedUrl]).filter((entry): entry is [string, string] => Boolean(entry[1]))) }))
    }
    setIsLoading(false)
  }

  // The players_stamp_review trigger fills reviewed_at / reviewed_by when the status changes.
  const setStatus = async (application: AdminApplication, status: 'approved' | 'rejected') => {
    if (!supabase) return
    const { error } = await supabase.from('players').update({ status }).eq('id', application.id)
    if (error) {
      toast({ title: status === 'approved' ? 'Unable to approve application' : 'Unable to reject application', description: mapSupabaseError(error), status: 'error', isClosable: true })
      return
    }
    toast({ title: status === 'approved' ? 'Application approved' : 'Application rejected', status: 'success', duration: 2500 })
    await reload()
    onChanged?.()
  }

  const approve = (application: AdminApplication) => setStatus(application, 'approved')
  const reject = (application: AdminApplication) => setStatus(application, 'rejected')

  const remove = async (application: AdminApplication) => {
    if (!supabase) return
    const { error } = await supabase.from('players').delete().eq('id', application.id)
    if (error) {
      toast({ title: 'Unable to delete application', description: mapSupabaseError(error), status: 'error', isClosable: true })
      return
    }
    if (application.photo_path) await supabase.storage.from(PHOTO_BUCKET).remove([application.photo_path])
    await reload()
    onChanged?.()
  }

  useEffect(() => { void reload() }, [isAuthenticated, role])

  // Deletes files in player-photos that no player row points at and that are older than a day (so an application
  // that is being submitted right now is never touched). Looks in the bucket root (older uploads) and applications/.
  const [isCleaningPhotos, setIsCleaningPhotos] = useState(false)
  const cleanUpOrphanPhotos = async () => {
    if (!supabase) return
    setIsCleaningPhotos(true)
    try {
      const used = new Set<string>()
      for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase.from('players').select('photo_path').not('photo_path', 'is', null).range(from, from + 999)
        if (error) throw error
        for (const row of data ?? []) if (row.photo_path) used.add(row.photo_path)
        if (!data || data.length < 1000) break
      }
      const cutoff = Date.now() - 24 * 60 * 60 * 1000
      const orphans: string[] = []
      for (const folder of ['', 'applications']) {
        for (let offset = 0; ; offset += 1000) {
          const { data, error } = await supabase.storage.from(PHOTO_BUCKET).list(folder, { limit: 1000, offset })
          if (error) throw error
          for (const file of data ?? []) {
            if (!file.id) continue // a sub-folder, not a file
            const path = folder ? `${folder}/${file.name}` : file.name
            const created = Date.parse(file.created_at ?? '')
            if (!used.has(path) && Number.isFinite(created) && created < cutoff) orphans.push(path)
          }
          if (!data || data.length < 1000) break
        }
      }
      for (let index = 0; index < orphans.length; index += 100) {
        const { error } = await supabase.storage.from(PHOTO_BUCKET).remove(orphans.slice(index, index + 100))
        if (error) throw error
      }
      toast({ title: orphans.length ? `Deleted ${orphans.length} unused photo${orphans.length === 1 ? '' : 's'}` : 'No unused photos found', status: 'success', duration: 3000 })
    } catch (error) {
      toast({ title: 'Photo clean-up failed', description: mapSupabaseError(error as { code?: string; message?: string }), status: 'error', isClosable: true })
    } finally {
      setIsCleaningPhotos(false)
    }
  }

  return { applications, photoUrls, isLoading, reload, approve, reject, remove, cleanUpOrphanPhotos, isCleaningPhotos }
}
