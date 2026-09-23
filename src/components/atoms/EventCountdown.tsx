'use client'

import { useEffect, useState } from 'react'

const MINUTE = 60_000

/**
 * Live "04 DAYS · 12 HRS · 36 MIN" countdown to an event date (YYYY-MM-DD, start of the day in Philippine time).
 * Updates every minute and shows "Happening today" once the day has started. It renders an empty box of the
 * same height on the server, then fills in after the page loads, so server and browser HTML always match.
 */
export function EventCountdown({ eventDate }: { eventDate: string }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), MINUTE)
    return () => window.clearInterval(timer)
  }, [])

  const target = Date.parse(`${eventDate}T00:00:00+08:00`)
  if (now === null || Number.isNaN(target)) return <div className="event-countdown" aria-hidden="true" />

  const remaining = target - now
  if (remaining <= 0) return <div className="event-countdown"><span className="event-countdown__today"><span className="bx-pulse-dot" aria-hidden="true" />Happening today</span></div>

  const days = Math.floor(remaining / (24 * 60 * MINUTE))
  const hours = Math.floor((remaining / (60 * MINUTE)) % 24)
  const minutes = Math.floor((remaining / MINUTE) % 60)
  const cells = [[days, 'Days'], [hours, 'Hrs'], [minutes, 'Min']] as const

  return (
    <div className="event-countdown" role="timer" aria-label={`Starts in ${days} days, ${hours} hours and ${minutes} minutes`}>
      {cells.map(([value, label]) => (
        <div key={label} className="event-countdown__cell" aria-hidden="true">
          <span className="event-countdown__value">{String(value).padStart(2, '0')}</span>
          <span className="event-countdown__label">{label}</span>
        </div>
      ))}
    </div>
  )
}
