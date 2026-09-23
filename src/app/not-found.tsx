import type { Metadata } from 'next'
import NextLink from 'next/link'

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } }

/** Shown for unknown URLs (a real 404, so search engines don't index broken links as the home page). */
export default function NotFound() {
  return (
    <section className="simple-page shared-container simple-page--center" aria-labelledby="not-found-title">
      <p className="bx-eyebrow">Error 404</p>
      <h1 id="not-found-title" className="simple-page__title">Page not found</h1>
      <p className="simple-page__text">The page you are looking for does not exist or has moved.</p>
      <NextLink href="/" className="bx-btn bx-btn--primary">Back to home</NextLink>
    </section>
  )
}
