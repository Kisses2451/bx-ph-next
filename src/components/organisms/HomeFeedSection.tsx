'use client'

import { useState } from 'react'
import { MarqueeTicker } from '../atoms/MarqueeTicker'
import { ScrollReveal } from '../atoms/ScrollReveal'
import { FeedCompactCard } from '../molecules/FeedCompactCard'
import { FeedFeaturedCard } from '../molecules/FeedFeaturedCard'
import { RecruitmentLiveTile } from '../molecules/RecruitmentLiveTile'
import type { LatestUpdateRecord } from '../../hooks/useLatestUpdates'
import { feedItemTime, formatManilaDate } from '../../lib/feedDates'
import type { HomeFeedItem } from '../../types/homeFeed'
import type { SupabaseEvent } from '../../types/player'

type FeedFilter = 'all' | 'event' | 'update'
const FILTERS: { value: FeedFilter; label: string }[] = [{ value: 'all', label: 'All' }, { value: 'event', label: 'Events' }, { value: 'update', label: 'Updates' }]

interface HomeFeedSectionProps {
  /** Upcoming events, soonest first. */
  events: SupabaseEvent[]
  /** Visible latest updates, newest first. */
  updates: LatestUpdateRecord[]
}

/**
 * "001 / THE FEED." bento grid on the home page (anchor #latest-updates):
 * - the big tile shows the next event (or the newest update when there are no events);
 * - the card beside it shows the next item;
 * - the maroon tile opens the join modal;
 * - a ticker underneath lists everything.
 * When there are both events and updates, All / Events / Updates buttons filter the tiles.
 */
export function HomeFeedSection({ events, updates }: HomeFeedSectionProps) {
  const [filter, setFilter] = useState<FeedFilter>('all')

  const eventItems: HomeFeedItem[] = events.map((event) => ({ type: 'event', id: `event-${event.id}`, date: event.event_date, title: event.title, description: event.description, location: event.location }))
  const updateItems: HomeFeedItem[] = updates.map((update) => ({ type: 'update', id: `update-${update.id}`, date: update.published_at ?? '', tag: update.tag, title: update.title, description: update.description }))
  const allItems = [...eventItems, ...updateItems]
  if (allItems.length === 0) return null

  const hasBothKinds = eventItems.length > 0 && updateItems.length > 0
  const visibleItems = filter === 'event' ? eventItems : filter === 'update' ? updateItems : allItems
  const [featured, secondary] = visibleItems

  const tickerItems = allItems.map((item) => {
    if (item.type === 'update') return { label: `Update · ${item.title}` }
    const date = feedItemTime(item)
    return { label: ['Next event', item.title, date ? formatManilaDate(date, { month: 'short', day: 'numeric' }) : null, item.location].filter(Boolean).join(' · '), accent: true }
  })

  return (
    <section className="home-feed" id="latest-updates" aria-labelledby="home-feed-title">
      <div className="shared-container">
        <div className="home-feed__head bx-display-container">
          <ScrollReveal variant="slide-left">
            <p className="bx-eyebrow">001 / The feed</p>
            <h2 id="home-feed-title" className="bx-section-title bx-display">The feed.</h2>
            <p className="bx-section-intro">The latest word from Bloodlust Philippines, alongside what is coming up next.</p>
          </ScrollReveal>
          {hasBothKinds ? (
            <div className="home-feed__filters" role="group" aria-label="Filter the feed">
              {FILTERS.map((option) => <button key={option.value} type="button" className="bx-pill" aria-pressed={filter === option.value} onClick={() => setFilter(option.value)}>{option.label}</button>)}
            </div>
          ) : null}
        </div>

        <div className="home-feed__grid">
          {featured ? <ScrollReveal variant="scale-in" className="home-feed__main"><FeedFeaturedCard key={featured.id} item={featured} /></ScrollReveal> : null}
          <div className="home-feed__side">
            {secondary ? <ScrollReveal index={1} className="home-feed__side-item"><FeedCompactCard key={secondary.id} item={secondary} /></ScrollReveal> : null}
            <ScrollReveal index={2} className={`home-feed__side-item ${secondary ? 'home-feed__side-item--tile' : 'home-feed__side-item--fill'}`}><RecruitmentLiveTile /></ScrollReveal>
          </div>
        </div>

        <div className="home-feed__ticker"><MarqueeTicker items={tickerItems} label="Everything in the feed" durationSeconds={28} /></div>
      </div>
    </section>
  )
}
