import { EventCountdown } from '../atoms/EventCountdown'
import { FeedItemTypeBadge } from '../atoms/FeedItemTypeBadge'
import { googleCalendarUrl, mapsUrl } from '../../lib/eventLinks'
import { feedItemTime, formatManilaDate } from '../../lib/feedDates'
import type { HomeFeedItem } from '../../types/homeFeed'

/**
 * The big tile in the home feed, framed by a moving gold/maroon border. Shows the date, a huge title with
 * the first word drifting as an outlined watermark behind it, and, for events, a live countdown plus
 * "Add to calendar" and "Directions" links.
 */
export function FeedFeaturedCard({ item }: { item: HomeFeedItem }) {
  const date = feedItemTime(item)
  const watermark = item.title.trim().split(/\s+/)[0]?.slice(0, 10) ?? ''
  const titleId = `feed-featured-${item.id}`

  return (
    <div className="bx-gradient-border">
      <article className="bx-gradient-border__inner feed-featured" aria-labelledby={titleId}>
        <span className="feed-featured__watermark bx-outline-text bx-drift" aria-hidden="true">{watermark}</span>

        <div className="feed-featured__top">
          <div className="feed-featured__labels">
            <FeedItemTypeBadge type={item.type} />
            <span className="feed-featured__kicker">{item.type === 'event' ? 'Up next' : 'Latest'}</span>
          </div>
          {date ? (
            <p className="feed-featured__date">
              <span className="feed-featured__day">{formatManilaDate(date, { day: '2-digit' })}</span>
              <span className="feed-featured__month">{formatManilaDate(date, { month: 'short', year: 'numeric' })} · {formatManilaDate(date, { weekday: 'short' })}</span>
            </p>
          ) : null}
        </div>

        <div className="feed-featured__body">
          <h3 id={titleId} className="feed-featured__title bx-display">{item.title}</h3>
          {item.type === 'event' && item.location ? (
            <p className="feed-featured__meta">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
              {item.location}
            </p>
          ) : null}
          {item.description ? <p className="feed-featured__desc bx-prose">{item.description}</p> : null}
        </div>

        {item.type === 'event' ? (
          <div className="feed-featured__bottom">
            <EventCountdown eventDate={item.date} />
            <div className="feed-featured__actions">
              <a className="bx-btn bx-btn--primary bx-btn--sm" href={googleCalendarUrl(item.title, item.date, item.location)} target="_blank" rel="noopener noreferrer">Add to calendar</a>
              {item.location ? <a className="bx-btn bx-btn--ghost bx-btn--sm" href={mapsUrl(item.location)} target="_blank" rel="noopener noreferrer">Directions</a> : null}
            </div>
          </div>
        ) : null}
      </article>
    </div>
  )
}
