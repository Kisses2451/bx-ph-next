'use client'

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'

interface SiteDialogProps {
  isOpen: boolean
  /** Called for Escape, the close button and (when allowed) a click on the dark backdrop. */
  onClose: () => void
  /** id of the element that names the dialog (usually its heading). */
  labelledBy: string
  /** id of the element that describes the dialog, if any. */
  describedBy?: string
  /** md ≈ 520px, lg ≈ 760px, xl ≈ 1100px wide. Always full width on phones. */
  size?: 'md' | 'lg' | 'xl'
  /** Clicking the backdrop closes the dialog. Off for forms, so answers are not lost by accident. */
  closeOnBackdrop?: boolean
  /** Element to focus when the dialog opens (defaults to the first focusable element). */
  initialFocusRef?: RefObject<HTMLElement | null>
  className?: string
  children: ReactNode
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Accessible pop-up window used on the public site (join form, latest-update announcement) without Chakra UI.
 * Renders into <body>, locks page scrolling, keeps keyboard focus inside while open, closes on Escape and gives
 * focus back to whatever opened it. Content scrolls inside the panel on small screens.
 */
export function SiteDialog({ isOpen, onClose, labelledBy, describedBy, size = 'md', closeOnBackdrop = true, initialFocusRef, className, children }: SiteDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const [mounted, setMounted] = useState(false)
  onCloseRef.current = onClose

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isOpen) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      const target = initialFocusRef?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panelRef.current
      target?.focus()
    }, 0)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); onCloseRef.current(); return }
      if (event.key !== 'Tab' || !panelRef.current) return
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((item) => item.offsetParent !== null)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [isOpen, initialFocusRef])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="site-dialog" onMouseDown={(event) => { if (closeOnBackdrop && event.target === event.currentTarget) onClose() }}>
      <div
        ref={panelRef}
        className={`site-dialog__panel site-dialog__panel--${size}${className ? ` ${className}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
      >
        <button type="button" className="site-dialog__close" aria-label="Close" onClick={onClose}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
