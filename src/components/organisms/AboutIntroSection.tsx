import type { CSSProperties } from 'react'
import { AnimatedStatValue } from '../atoms/AnimatedStatValue'
import { aboutPageContent } from '../../data/siteContent'

/** Delay for a staggered entrance animation (read by .bx-mask-in / .bx-rise-in in motion.css). */
const delay = (ms: number) => ({ '--bx-delay': `${ms}ms` }) as CSSProperties

export interface AboutStat {
  value: string
  label: string
  /** true = show the value as-is (no count-up). */
  static: boolean
  /** Internal note for editors (not shown on the page). */
  todo?: string
}

interface AboutIntroSectionProps {
  stats: AboutStat[]
  statsLoading: boolean
  /** When live stats failed, live values show "—" and a notice appears. */
  statsError: boolean
}

/**
 * Opening section of the About page: a screen-tall "ABOUT BLOODLUST." heading that wipes in line by line,
 * the intro sentence, and a full-width band of four stats (founded, games, members, PH) that count up on view.
 * The second stat is highlighted in gold.
 */
export function AboutIntroSection({ stats, statsLoading, statsError }: AboutIntroSectionProps) {
  const { header } = aboutPageContent
  return (
    <section className="about-monument" aria-labelledby="about-title">
      <div className="shared-container about-monument__copy bx-display-container">
        <p className="bx-eyebrow bx-rise-in">{header.eyebrow}</p>
        <h1 id="about-title" className="about-monument__title bx-display" aria-label={`${header.headingPrimary} ${header.headingAccent}`}>
          <span aria-hidden="true" className="bx-mask-in">{header.headingPrimary}</span>
          <span aria-hidden="true" className="about-monument__title-accent bx-mask-in" style={delay(200)}>{header.headingAccent}.</span>
        </h1>
        <p className="about-monument__intro bx-rise-in" style={delay(450)}>{header.intro}</p>
      </div>
      <div>
        <ul className="about-monument__stats" aria-label="Bloodlust at a glance">
          {stats.map((stat, index) => (
            <li key={stat.label} className={index === 1 ? 'about-monument__stat about-monument__stat--accent bx-rise-in' : 'about-monument__stat bx-rise-in'} style={delay(600 + index * 120)}>
              <AnimatedStatValue value={statsError && !statsLoading && !stat.static ? '—' : stat.value} staticValue={statsLoading || stat.static} />
              <span className="about-monument__stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>
        {statsError && !statsLoading ? <p className="about-monument__stats-note">Live stats unavailable right now.</p> : null}
      </div>
    </section>
  )
}
