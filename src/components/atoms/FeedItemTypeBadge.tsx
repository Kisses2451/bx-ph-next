/** Label on home feed cards: gold "EVENT" with a calendar icon, or maroon "UPDATE" with an info icon. */
export function FeedItemTypeBadge({ type }: { type: 'update' | 'event' }) {
  return (
    <span className={`feed-badge feed-badge--${type}`}>
      {type === 'event'
        ? <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
        : <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>}
      {type === 'event' ? 'Event' : 'Update'}
    </span>
  )
}
