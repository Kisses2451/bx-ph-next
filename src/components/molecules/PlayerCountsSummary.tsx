import type { AdminPlayerCounts } from '../../lib/admin/adminEntries'
import { StatTile } from './StatTile'

/**
 * Four stat tiles at the top of the admin Players tab: total, approved (green), pending (gold) and
 * rejected (red). Each status shows its share of the total as a percentage and a fill bar.
 */
export function PlayerCountsSummary({ counts }: { counts: AdminPlayerCounts }) {
  const share = (count: number) => (counts.total > 0 ? Math.round((count / counts.total) * 100) : 0)
  return (
    <section className="admin-stats" aria-label="Player summary">
      <StatTile label="Total players" value={counts.total} note="All time" percent={100} />
      <StatTile label="Approved" value={counts.approved} note={`${share(counts.approved)}%`} tone="green" percent={share(counts.approved)} />
      <StatTile label="Pending" value={counts.pending} note={`${share(counts.pending)}%`} tone="gold" percent={share(counts.pending)} />
      <StatTile label="Rejected" value={counts.rejected} note={`${share(counts.rejected)}%`} tone="red" percent={share(counts.rejected)} />
    </section>
  )
}
