'use client'

import { useRef } from 'react'
import { ArrowIcon } from '../atoms/ArrowIcon'
import type { PublicTimelineEvent } from '../../hooks/usePublicTimeline'

interface MilestoneTimelineSectionProps {
  events: PublicTimelineEvent[]
  isLoading: boolean
  hasError: boolean
}

const monthName = (month: number) => new Date(2000, month - 1).toLocaleString('en', { month: 'long' })

/**
 * "KEY MILESTONES" on the About page: a horizontal, swipeable track of milestones (oldest first) along a line
 * that fills maroon-to-gold. The newest milestone gets a solid gold marker and "Latest" label.
 * Prev/next buttons scroll the track. Shows placeholders while loading, a short message on error,
 * and nothing if there are no milestones.
 */
export function MilestoneTimelineSection({ events, isLoading, hasError }: MilestoneTimelineSectionProps) {
  const listRef = useRef<HTMLOListElement>(null)
  const mostRecentId = events[events.length - 1]?.id
  const scroll = (direction: 1 | -1) => listRef.current?.scrollBy({ left: direction * 340, behavior: 'smooth' })

  if (!isLoading && !hasError && events.length === 0) return null

  return (
    <section className="about-milestones" aria-labelledby="about-milestones-title">
      <div className="shared-container">
        <div className="about-milestones__head bx-display-container">
          <div>
            <p className="bx-eyebrow">Our journey</p>
            <h2 id="about-milestones-title" className="bx-section-title bx-display">Key milestones</h2>
          </div>
          {!isLoading && !hasError && events.length > 1 ? (
            <div className="about-milestones__nav">
              <button type="button" aria-label="Earlier milestones" onClick={() => scroll(-1)}><ArrowIcon className="about-milestones__prev" /></button>
              <button type="button" aria-label="Later milestones" onClick={() => scroll(1)}><ArrowIcon /></button>
            </div>
          ) : null}
        </div>

        {hasError ? <p className="about-milestones__desc">Timeline unavailable right now.</p> : null}
        {isLoading && !hasError ? <div className="about-milestones__skeleton" aria-hidden="true"><span /><span /><span /></div> : null}
        {!isLoading && !hasError ? (
          <div className="about-milestones__track bx-display-container">
            <div className="about-milestones__line" aria-hidden="true" />
            <div className="about-milestones__line-fill" aria-hidden="true" />
            <ol ref={listRef} className="about-milestones__list" tabIndex={0} aria-label="Milestones, oldest first">
              {events.map((item) => {
                const isLatest = item.id === mostRecentId
                return (
                  <li key={item.id} className={isLatest ? 'about-milestones__item about-milestones__item--latest' : 'about-milestones__item'}>
                    <span className="about-milestones__node" aria-hidden="true" />
                    <time className="about-milestones__year bx-display" dateTime={`${item.year}${item.month ? `-${String(item.month).padStart(2, '0')}` : ''}`}>{item.year}</time>
                    <p className="about-milestones__month">{[item.month ? monthName(item.month) : null, isLatest ? 'Latest' : null].filter(Boolean).join(' · ')}</p>
                    <h3 className="about-milestones__title">{item.title}</h3>
                    {item.description ? <p className="about-milestones__desc">{item.description}</p> : null}
                  </li>
                )
              })}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  )
}
