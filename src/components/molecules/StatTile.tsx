import type { CSSProperties } from 'react'

export type StatTileTone = 'default' | 'gold' | 'green' | 'red'

interface StatTileProps {
  label: string
  value: number
  /** Small text at the top right, e.g. "68%". */
  note?: string
  /** Colour of the number and bar. */
  tone?: StatTileTone
  /** 0–100: fills the bar under the number. No bar when omitted. */
  percent?: number
}

/** Dashboard stat box: uppercase label (and optional note) on top, a big number, and an optional fill bar that grows in. */
export function StatTile({ label, value, note, tone = 'default', percent }: StatTileProps) {
  return (
    <div className={tone === 'default' ? 'admin-stat' : `admin-stat admin-stat--${tone}`}>
      <div className="admin-stat__top"><span>{label}</span>{note ? <span>{note}</span> : null}</div>
      <div className="admin-stat__value">{value.toLocaleString('en')}</div>
      {percent === undefined ? null : <div className="admin-stat__bar" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(100, percent))}%` } as CSSProperties} /></div>}
    </div>
  )
}
