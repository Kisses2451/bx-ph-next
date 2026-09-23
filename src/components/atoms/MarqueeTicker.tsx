import { Fragment, type CSSProperties } from 'react'

export interface MarqueeTickerItem {
  label: string
  /** Shown in the gold accent colour, e.g. "Recruitment open". */
  accent?: boolean
}

interface MarqueeTickerProps {
  items: MarqueeTickerItem[]
  /** Describes the list for screen readers, e.g. "Featured games". */
  label: string
  /** Seconds for one full loop; bigger is slower. */
  durationSeconds?: number
  /** Scroll left-to-right instead of right-to-left. */
  reverse?: boolean
}

/**
 * Endless horizontal ticker of uppercase labels separated by diamonds. Pauses on hover and stops for
 * reduced-motion users. Screen readers get the list once; the moving copies are hidden from them.
 */
export function MarqueeTicker({ items, label, durationSeconds = 30, reverse = false }: MarqueeTickerProps) {
  if (items.length === 0) return null
  // Repeat short lists so one copy is wider than the screen; the track holds two identical copies for a seamless loop.
  const repeated = Array.from({ length: Math.max(1, Math.ceil(8 / items.length)) }, () => items).flat()
  const copy = (copyIndex: number) => repeated.map((item, index) => (
    <Fragment key={`${copyIndex}-${index}`}>
      <span className={item.accent ? 'bx-ticker__item bx-ticker__item--accent' : 'bx-ticker__item'}>{item.label}</span>
      <span className="bx-ticker__sep">◆</span>
    </Fragment>
  ))

  return (
    <div className="bx-marquee bx-ticker">
      {/* Plain CSS instead of Chakra's VisuallyHidden: Emotion's server-inserted <style> here caused a hydration mismatch. */}
      <ul className="bx-sr-only" aria-label={label}>{items.map((item, index) => <li key={index}>{item.label}</li>)}</ul>
      <div aria-hidden="true" className={`bx-marquee-track${reverse ? ' bx-marquee-track--reverse' : ''}`} style={{ '--bx-marquee-duration': `${durationSeconds}s` } as CSSProperties}>
        {copy(0)}{copy(1)}
      </div>
    </div>
  )
}
