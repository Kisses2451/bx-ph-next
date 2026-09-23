'use client'

import NextImage from 'next/image'
import NextLink from 'next/link'
import { ArrowIcon } from '../atoms/ArrowIcon'
import { ScrollReveal } from '../atoms/ScrollReveal'
import { siteName, socialLinks } from '../../config/site'
import { openJoinFlow } from '../../lib/joinFlow'

const exploreLinks = [
  { href: '/', label: 'Home' },
  { href: '/partners', label: 'Partners' },
  { href: '/about', label: 'About Us' },
]

/**
 * Site footer on every page: logo, tagline and "Join now" button, an Explore column of page links,
 * a Follow column (only when config/site.ts has socialLinks), a giant outlined "BLOODLUST" wordmark
 * that wipes in when scrolled into view, and the copyright line.
 */
export function SiteFooter() {
  return (
    <footer className="mega-footer">
      <div className="shared-container">
        <div className="mega-footer__grid">
          <div className="mega-footer__brand">
            <NextLink href="/" className="mega-footer__logo-link">
              <NextImage src="/bx-logo.png" alt="" width={56} height={56} />
              <span>{siteName}</span>
            </NextLink>
            <p className="mega-footer__tagline bx-prose">Fuel the fight, Respect the grind.</p>
            <NextLink href="/join" className="bx-btn bx-btn--primary bx-btn--sm" onClick={openJoinFlow}>Join now <ArrowIcon size={18} /></NextLink>
          </div>

          <nav className="mega-footer__col" aria-label="Footer">
            <p className="bx-eyebrow">Explore</p>
            <ul>{exploreLinks.map((link) => <li key={link.href}><NextLink href={link.href}>{link.label}</NextLink></li>)}</ul>
          </nav>

          {socialLinks.length > 0 ? (
            <div className="mega-footer__col">
              <p className="bx-eyebrow">Follow</p>
              <ul>{socialLinks.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a></li>)}</ul>
            </div>
          ) : null}
        </div>

        <ScrollReveal variant="mask-line">
          <div className="bx-display-container">
            <p className="mega-footer__wordmark bx-outline-text bx-display" aria-hidden="true">Bloodlust</p>
          </div>
        </ScrollReveal>

        <div className="mega-footer__bottom">
          <span>© {new Date().getFullYear()} {siteName} Corporation</span>
          <span>Fuel the fight, Respect the grind</span>
        </div>
      </div>
    </footer>
  )
}
