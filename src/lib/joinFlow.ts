import type { MouseEvent } from 'react'

/**
 * Opens the site-wide "Join now" modal (JoinApplicationModal listens for the `open-join-flow` event).
 * Use it as the onClick of a link to /join or /apply: the link still works without JavaScript.
 */
export function openJoinFlow(event: MouseEvent<HTMLElement>) {
  event.preventDefault()
  window.dispatchEvent(new CustomEvent('open-join-flow', { detail: event.currentTarget }))
}
