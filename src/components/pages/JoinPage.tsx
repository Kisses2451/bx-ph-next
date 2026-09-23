'use client'

import NextLink from 'next/link'
import { openJoinFlow } from '../../lib/joinFlow'
import { ArrowIcon } from '../atoms/ArrowIcon'

/**
 * Join page ( /join and /apply ): a short intro. The application form itself is the JoinApplicationModal,
 * which opens automatically on these URLs; the button re-opens it if the visitor closed it.
 */
export function JoinPage() {
  return (
    <section className="simple-page shared-container" aria-labelledby="join-page-title">
      <p className="bx-eyebrow">Join now</p>
      <h1 id="join-page-title" className="simple-page__title">Become part of the Bloodlust roster.</h1>
      <p className="simple-page__text bx-prose">Share your profile, upload a headshot, and confirm your application before we review your next opportunity.</p>
      <NextLink href="/join" className="bx-btn bx-btn--primary bx-shine" onClick={openJoinFlow}>Start application <ArrowIcon /></NextLink>
    </section>
  )
}
