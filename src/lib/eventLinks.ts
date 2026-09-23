/** "Add to Google Calendar" link for an all-day event on `eventDate` (YYYY-MM-DD). */
export function googleCalendarUrl(title: string, eventDate: string, location?: string | null) {
  const start = eventDate.replaceAll('-', '')
  const next = new Date(`${eventDate}T00:00:00Z`)
  next.setUTCDate(next.getUTCDate() + 1)
  const end = next.toISOString().slice(0, 10).replaceAll('-', '')
  const params = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${start}/${end}` })
  if (location) params.set('location', location)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Google Maps search link for a place name or address. */
export function mapsUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
}
