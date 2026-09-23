import type { PlayerStatusValue } from '../../types/player'

/** Pill showing a player's application status with a coloured dot: approved (green), rejected (red), pending (gold, dot pulses). */
export function PlayerStatusBadge({ status }: { status: PlayerStatusValue }) {
  const tone = status === 'approved' || status === 'rejected' ? status : 'pending'
  return <span className={`status-pill status-pill--${tone}`}><span className="status-pill__dot" aria-hidden="true" />{status}</span>
}
