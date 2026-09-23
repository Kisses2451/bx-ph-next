// Small helpers the entry modal uses to pick what to show for a record.
import { readValue, type AdminEntryKind } from '../../../../lib/admin/adminEntries'

/** The image URL to preview for a form, whichever field the record stores it in. */
export function entryImageValue(kind: AdminEntryKind, draft: Record<string, any>) {
  const source = kind === 'player'
    ? readValue(draft, 'photoUrl') || readValue(draft, 'imageUrl')
    : readValue(draft, 'image_url') || readValue(draft, 'imageUrl') || readValue(draft, 'logo') || readValue(draft, 'image')
  return typeof source === 'string' ? source : ''
}

/** The record's own name or title, e.g. "Juan Dela Cruz" or "Summer Cup"; empty when it has none yet. */
export function entryName(kind: AdminEntryKind, draft: Record<string, any>): string {
  if (kind === 'player') {
    const fullName = [readValue(draft, 'first_name'), readValue(draft, 'last_name')].filter(Boolean).join(' ')
    return String(readValue(draft, 'name') || fullName || '')
  }
  if (kind === 'update' || kind === 'game' || kind === 'event' || kind === 'timeline') return String(readValue(draft, 'title') || '')
  return String(readValue(draft, 'name') || '')
}

const PREVIEW_FALLBACKS: Record<AdminEntryKind, string> = { player: 'Player', update: 'Update', game: 'Game', partner: 'Partner', event: 'Event', timeline: 'Milestone', staff: 'Staff member' }

/** Text shown in the preview box when there is no image yet, e.g. the game's title or "Game". */
export function entryPreviewTitle(kind: AdminEntryKind, draft: Record<string, any>) {
  return entryName(kind, draft) || PREVIEW_FALLBACKS[kind]
}
