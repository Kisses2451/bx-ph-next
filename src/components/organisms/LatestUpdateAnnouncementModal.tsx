'use client'

import { useRef } from 'react'
import type { LatestUpdateRecord } from '../../hooks/useLatestUpdates'
import { formatManilaDate } from '../../lib/feedDates'
import { SiteDialog } from '../molecules/SiteDialog'

interface LatestUpdateAnnouncementModalProps {
  update: LatestUpdateRecord
  isOpen: boolean
  /** Show "View all updates" (only when the feed section is on the page). */
  keepSection: boolean
  onClose: () => void
}

function formatDate(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : formatManilaDate(date, { dateStyle: 'long' })
}

/**
 * Pop-up shown on the home page announcing the newest "latest update". "View all updates" scrolls to the feed
 * (only when the feed is on the page). When it appears is decided by useLatestUpdateAnnouncement.
 */
export function LatestUpdateAnnouncementModal({ update, isOpen, keepSection, onClose }: LatestUpdateAnnouncementModalProps) {
  const continueRef = useRef<HTMLButtonElement>(null)
  const date = formatDate(update.published_at)

  const closeAndScroll = () => {
    onClose()
    window.setTimeout(() => document.getElementById('latest-updates')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  return (
    <SiteDialog isOpen={isOpen} onClose={onClose} labelledBy="latest-update-title" describedBy={update.description ? 'latest-update-description' : undefined} size="md" initialFocusRef={continueRef} className="announcement">
      <div className="announcement__head">
        <p className="bx-eyebrow">Latest update</p>
        {update.tag ? <span className="announcement__tag">{update.tag}</span> : null}
        <h2 id="latest-update-title" className="announcement__title">{update.title}</h2>
        {date ? <p className="announcement__date">{date}</p> : null}
      </div>
      {update.description ? <p id="latest-update-description" className="announcement__body bx-prose">{update.description}</p> : null}
      <div className="announcement__actions">
        {keepSection ? <button type="button" className="announcement__link" onClick={closeAndScroll}>View all updates</button> : <span />}
        <button ref={continueRef} type="button" className="bx-btn bx-btn--primary bx-btn--sm" onClick={onClose}>Continue</button>
      </div>
    </SiteDialog>
  )
}
