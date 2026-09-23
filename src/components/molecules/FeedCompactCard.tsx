import { FeedItemTypeBadge } from '../atoms/FeedItemTypeBadge'
import { feedItemTime, formatManilaDate } from '../../lib/feedDates'
import type { HomeFeedItem } from '../../types/homeFeed'

/** Smaller card beside the big feed tile: type badge, date, title, and location or description. */
export function FeedCompactCard({ item }: { item: HomeFeedItem }) {
  const date = feedItemTime(item)
  return (
    <article className="feed-compact">
      <div className="feed-compact__head">
        <FeedItemTypeBadge type={item.type} />
        {date ? <span className="feed-compact__date">{formatManilaDate(date, { month: 'short', day: 'numeric', year: 'numeric' })}</span> : null}
      </div>
      <div className="feed-compact__body">
        <h3 className="feed-compact__title">{item.title}</h3>
        {item.type === 'event' && item.location ? <p className="feed-compact__meta">{item.location}</p> : null}
        {item.description ? <p className="feed-compact__desc bx-prose">{item.description}</p> : null}
      </div>
    </article>
  )
}
