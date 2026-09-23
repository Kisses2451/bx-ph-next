'use client'

import { useState } from 'react'
import { ScrollReveal } from '../atoms/ScrollReveal'
import type { SupabaseGame } from '../../types/player'

interface FeaturedGamesSectionProps {
  games: SupabaseGame[]
  isLoading: boolean
  hasError: boolean
  onRetry: () => void
  /** Eyebrow number, "001" or "002" depending on whether the feed is shown above. */
  sectionNumber: string
}

/** "Call of Duty: Mobile" → "CODM", "Honor of Kings" → "HOK". Used as the watermark and the no-logo fallback. */
function titleInitials(title: string) {
  return title.split(/[\s:]+/).filter(Boolean).map((word) => word[0]).join('').toUpperCase().slice(0, 4) || '?'
}

/**
 * "FEATURED GAMES" expanding accordion on the home page. One tall panel per game: the panel under the
 * pointer (or focused / tapped) widens to show its logo, genre and description, while the others shrink
 * to a vertical title. On tablets and phones the panels stack and all show their details.
 * Shows skeleton panels while loading, a Retry button on error, and nothing when there are no games.
 */
export function FeaturedGamesSection({ games, isLoading, hasError, onRetry, sectionNumber }: FeaturedGamesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({})

  if (!isLoading && !hasError && games.length === 0) return null

  return (
    <section className="featured-games" aria-labelledby="featured-games-title">
      <div className="shared-container">
        <div className="featured-games__head bx-display-container">
          <ScrollReveal variant="scale-in">
            <p className="bx-eyebrow">{sectionNumber} / Featured games</p>
            <h2 id="featured-games-title" className="bx-section-title bx-display">Where we<br /><span className="bx-outline-text">compete.</span></h2>
          </ScrollReveal>
          {!isLoading && !hasError && games.length > 1 ? <p className="featured-games__hint">Hover or tap a title to open it.</p> : null}
        </div>

        {isLoading ? (
          <div className="games-accordion" aria-hidden="true">{[1, 2, 3].map((item) => <div key={item} className="games-accordion__skeleton" />)}</div>
        ) : hasError ? (
          <div className="featured-games__state">
            <p className="bx-section-intro">Featured games are unavailable right now.</p>
            <button type="button" className="bx-btn bx-btn--ghost bx-btn--sm" style={{ marginTop: 16 }} onClick={onRetry}>Retry</button>
          </div>
        ) : (
          <ul className="games-accordion">
            {games.map((game, index) => {
              const isActive = index === activeIndex
              const initials = titleInitials(game.title)
              const showLogo = Boolean(game.image_url) && !failedLogos[game.id]
              return (
                <li key={game.id} className={`games-accordion__item${isActive ? ' is-active' : ''}`}>
                  <button type="button" className="games-panel bx-display-container" aria-expanded={isActive} onClick={() => setActiveIndex(index)} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)}>
                    <span className="games-panel__watermark bx-outline-text" aria-hidden="true">{initials}</span>
                    <span className="games-panel__top">
                      <span className="games-panel__number">{String(index + 1).padStart(2, '0')}</span>
                      {game.tag ? <span className="games-panel__genre">{game.tag}</span> : null}
                    </span>
                    <span className="games-panel__bottom">
                      <span className="games-panel__logo">
                        {showLogo
                          ? <img src={game.image_url ?? undefined} alt="" loading="lazy" decoding="async" onError={() => setFailedLogos((current) => ({ ...current, [game.id]: true }))} />
                          : <span className="games-panel__monogram" aria-hidden="true">{initials}</span>}
                      </span>
                      <span className="games-panel__title">{game.title}</span>
                      {game.description ? <span className="games-panel__desc">{game.description}</span> : null}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
