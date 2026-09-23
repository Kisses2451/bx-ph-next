'use client'

import NextLink from 'next/link'
import { ArrowIcon } from '../atoms/ArrowIcon'
import { MarqueeTicker } from '../atoms/MarqueeTicker'
import { ScrollReveal } from '../atoms/ScrollReveal'
import { openJoinFlow } from '../../lib/joinFlow'

/**
 * Full-width maroon "Ready to rise?" banner near the bottom of the home page, with diagonal stripes,
 * a large "Start application" button (opens the join modal, falls back to /join), the three steps of
 * the application, and a black ticker along the bottom edge listing the game titles.
 */
export function JoinCallToActionSection({ gameTitles }: { gameTitles: string[] }) {
  const tickerItems = [{ label: 'Recruitment open', accent: true }, ...gameTitles.map((label) => ({ label })), { label: 'Apply today', accent: true }]

  return (
    <section className="join-cta" aria-labelledby="join-cta-title">
      <div className="join-cta__stripes" aria-hidden="true" />
      <div className="shared-container join-cta__inner bx-display-container">
        <ScrollReveal variant="slide-left" className="bx-display-container">
          <p className="bx-eyebrow join-cta__eyebrow">Ready to rise?</p>
          <h2 id="join-cta-title" className="join-cta__title bx-display">Bring your game<br />to the front line.</h2>
          <p className="join-cta__text bx-prose">Share your profile, upload a headshot, and confirm your application before we review your next opportunity.</p>
        </ScrollReveal>
        <div className="join-cta__action">
          <NextLink href="/join" className="join-cta__button bx-shine" onClick={openJoinFlow}>Start application <ArrowIcon size={32} /></NextLink>
          <ol className="join-cta__steps" aria-label="Application steps">
            <li>01 Notice</li>
            <li>02 Form</li>
            <li>03 Review</li>
          </ol>
        </div>
      </div>
      <div className="join-cta__ticker"><MarqueeTicker items={tickerItems} label="Recruitment" durationSeconds={24} /></div>
    </section>
  )
}
