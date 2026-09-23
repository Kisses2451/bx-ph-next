import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { LatestUpdateRecord } from './useLatestUpdates'

// ---- Settings: change these to control when the "latest update" pop-up appears ----
type AnnouncementFrequency = 'per-session' | 'per-update' | 'always'
/** per-session: once per browser tab session · per-update: once per new/edited update · always: every visit. */
const ANNOUNCEMENT_FREQUENCY: AnnouncementFrequency = 'per-session'
/** Pages where the pop-up may appear. */
const ANNOUNCEMENT_ROUTES = ['/']
/** Whether signed-in admins also see it. */
const SHOW_TO_ADMINS = false
const ANNOUNCEMENT_SESSION_KEY = 'bx.announcement.seen'
const ANNOUNCEMENT_UPDATE_KEY = 'bx.announcement.lastSeen'
let storageUnavailableShown = false

interface UseLatestUpdateAnnouncementOptions {
  latestUpdate: LatestUpdateRecord | null
  updatesLoading: boolean
  updatesError: unknown
  isAuthenticated: boolean
}

/**
 * Decides whether to open the LatestUpdateAnnouncementModal, and remembers that the visitor saw it
 * (in sessionStorage or localStorage, see ANNOUNCEMENT_FREQUENCY). Add `?announcement=1` to the URL to force it.
 */
export function useLatestUpdateAnnouncement({ latestUpdate, updatesLoading, updatesError, isAuthenticated }: UseLatestUpdateAnnouncementOptions) {
  const pathname = usePathname() ?? '/'
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (updatesLoading || updatesError || !latestUpdate || !ANNOUNCEMENT_ROUTES.includes(pathname) || (!SHOW_TO_ADMINS && isAuthenticated)) return
    const forceShow = new URLSearchParams(window.location.search).get('announcement') === '1'
    const seenValue = `${latestUpdate.id}:${latestUpdate.updated_at ?? ''}`
    let shouldShow = forceShow || ANNOUNCEMENT_FREQUENCY === 'always'

    if (!shouldShow) {
      try {
        const storage = ANNOUNCEMENT_FREQUENCY === 'per-session' ? window.sessionStorage : window.localStorage
        const key = ANNOUNCEMENT_FREQUENCY === 'per-session' ? ANNOUNCEMENT_SESSION_KEY : ANNOUNCEMENT_UPDATE_KEY
        shouldShow = storage.getItem(key) !== seenValue
      } catch {
        shouldShow = !storageUnavailableShown
      }
    }

    if (!shouldShow) return
    const timer = window.setTimeout(() => {
      if (document.querySelector('[role="dialog"]')) return
      setIsOpen(true)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [isAuthenticated, latestUpdate, pathname, updatesError, updatesLoading])

  const close = () => {
    if (latestUpdate && ANNOUNCEMENT_FREQUENCY !== 'always') {
      const seenValue = `${latestUpdate.id}:${latestUpdate.updated_at ?? ''}`
      try {
        const storage = ANNOUNCEMENT_FREQUENCY === 'per-session' ? window.sessionStorage : window.localStorage
        const key = ANNOUNCEMENT_FREQUENCY === 'per-session' ? ANNOUNCEMENT_SESSION_KEY : ANNOUNCEMENT_UPDATE_KEY
        storage.setItem(key, seenValue)
      } catch {
        storageUnavailableShown = true
      }
    }
    setIsOpen(false)
  }

  return { isOpen, close }
}
