import type { SupabasePlayer } from '../../types/player'

/** Removes characters that would break the Supabase `.or()` search filter. */
export function sanitizePlayerSearch(value: string) {
  return value.trim().replace(/[%,()\\]/g, '')
}

/** A date as YYYY-MM-DD in Philippine time (Asia/Manila). */
export function manilaDate(value: Date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(value)
}

/** "JD" for Juan Dela Cruz; "?" when both names are empty. */
export function playerInitials(player: SupabasePlayer) {
  return `${player.first_name?.[0] ?? ''}${player.last_name?.[0] ?? ''}`.toUpperCase() || '?'
}

/** Full name if saved, otherwise "first last". */
export function playerDisplayName(player: SupabasePlayer) {
  return player.full_name || `${player.first_name} ${player.last_name}`
}
