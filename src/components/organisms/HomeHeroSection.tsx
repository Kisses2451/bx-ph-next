'use client'

import NextImage from 'next/image'
import NextLink from 'next/link'
import { useEffect, useState, type CSSProperties } from 'react'
import { ArrowIcon } from '../atoms/ArrowIcon'
import { siteFoundedYear, siteName } from '../../config/site'
import { usePlayers } from '../../context/PlayerContext'
import { openJoinFlow } from '../../lib/joinFlow'

/** Delay for a staggered entrance animation (read by .bx-mask-in / .bx-rise-in in motion.css). */
const delay = (ms: number) => ({ '--bx-delay': `${ms}ms` }) as CSSProperties

interface HomeHeroSectionProps {
  /** Number of visible game titles, shown as "03 active" in the status row. Hidden when 0. */
  gameCount: number
}

/**
 * Opening section of the home page: the title wipes in line by line over a faint grid with a scanning light,
 * the logo floats inside two slowly spinning rings, and a status row shows "Open recruitment".
 * "Apply now" opens the join modal; "Admin access" is shown to everyone except signed-in admins.
 * A scroll cue in the corner fades out after the first scroll.
 */
export function HomeHeroSection({ gameCount }: HomeHeroSectionProps) {
  const { role, authLoading } = usePlayers()
  const showAdminAccess = !authLoading && role !== 'admin'
  const [showScrollCue, setShowScrollCue] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) setShowScrollCue(false)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__grid" aria-hidden="true" />
      <div className="home-hero__scan" aria-hidden="true" />

      <div className="shared-container home-hero__inner">
        <div className="home-hero__copy bx-display-container">
          <p className="bx-eyebrow bx-rise-in">Performance recruitment system / Est. {siteFoundedYear}</p>
          <h1 id="home-hero-title" className="home-hero__title bx-display" aria-label={`${siteName} Corp.`}>
            <span aria-hidden="true" className="home-hero__title-line bx-mask-in">Bloodlust</span>
            <span aria-hidden="true" className="home-hero__title-line bx-outline-text bx-mask-in" style={delay(200)}>Philippines</span>
            <span aria-hidden="true" className="home-hero__title-line home-hero__title-line--small bx-mask-in" style={delay(400)}>Corp.</span>
          </h1>
          <p className="home-hero__lead bx-prose bx-rise-in" style={delay(600)}>
            Discover, review, and onboard standout talent through a streamlined player application portal.
          </p>
          <div className="home-hero__actions bx-rise-in" style={delay(800)}>
            <NextLink href="/apply" className="bx-btn bx-btn--primary bx-shine" onClick={openJoinFlow}>Apply now <ArrowIcon /></NextLink>
            {showAdminAccess ? <NextLink href="/admin" className="bx-btn bx-btn--ghost">Admin access</NextLink> : null}
          </div>
        </div>

        <div className="home-hero__emblem">
          <div className="home-hero__rings">
            <div className="home-hero__ring bx-spin" aria-hidden="true" />
            <div className="home-hero__ring home-hero__ring--inner bx-spin bx-spin--reverse" aria-hidden="true" />
            <NextImage src="/bx-logo.png" alt={`${siteName} logo`} width={300} height={300} priority className="home-hero__logo bx-float" />
          </div>
          <dl className="home-hero__status">
            <div>
              <dt>Status</dt>
              <dd className="home-hero__status-live"><span className="bx-pulse-dot" aria-hidden="true" />Open recruitment</dd>
            </div>
            {gameCount > 0 ? (
              <div className="home-hero__status-end">
                <dt>Titles</dt>
                <dd>{String(gameCount).padStart(2, '0')} active</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>

      <div className={`home-hero__scroll-cue${showScrollCue ? '' : ' home-hero__scroll-cue--hidden'}`} aria-hidden="true">
        <span className="home-hero__scroll-line" />
        SCROLL
      </div>
    </section>
  )
}
