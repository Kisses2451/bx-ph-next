import type { HomeFeedItem } from '../types/homeFeed'

const TIME_ZONE = 'Asia/Manila'

/**
 * The moment a feed item happens. Event dates are stored as YYYY-MM-DD, so they are read as the
 * start of that day in Philippine time; update dates are full timestamps. Returns null when missing or invalid.
 */
export function feedItemTime(item: HomeFeedItem): Date | null {
  if (!item.date) return null
  const date = /^\d{4}-\d{2}-\d{2}$/.test(item.date) ? new Date(`${item.date}T00:00:00+08:00`) : new Date(item.date)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Formats a date in Philippine time, so the server and the browser always print the same text. */
export function formatManilaDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-PH', { timeZone: TIME_ZONE, ...options }).format(date)
}
