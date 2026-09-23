import type { ReactNode } from 'react'
import { ArrowIcon } from '../atoms/ArrowIcon'
import { PartnerLogoImage } from '../atoms/PartnerLogoImage'
import { ScrollReveal } from '../atoms/ScrollReveal'
import { partnershipContactHref } from '../../config/site'
import type { PublicPartner } from '../../hooks/usePartners'

interface PartnerLogoWallProps {
  partners: PublicPartner[]
  isLoading: boolean
  error: unknown
  onRetry: () => void
}

/** Links to the partner's site in a new tab; renders a plain box when there is no website. */
function PartnerLink({ partner, className, children }: { partner: PublicPartner; className: string; children: ReactNode }) {
  if (!partner.websiteUrl) return <div className={className} aria-label={partner.name} role="img">{children}</div>
  return <a className={className} href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} (opens in a new tab)`}>{children}</a>
}

/**
 * "The roster" wall on the Partners page, in tiers by sort order: the first partner fills a big spotlight
 * tile with an animated gold frame, the next four get medium tiles, the rest small tiles. A maroon
 * "Your logo here" tile closes the grid when `partnershipContactHref` is set in config/site.ts.
 * Handles loading, error (with Retry) and "coming soon" states.
 */
export function PartnerLogoWall({ partners, isLoading, error, onRetry }: PartnerLogoWallProps) {
  const [spotlight, ...rest] = partners

  let content: ReactNode
  if (isLoading) {
    content = <div className="partners-wall__grid" aria-hidden="true"><div className="partners-wall__skeleton partners-wall__spotlight" /><div className="partners-wall__skeleton partners-wall__tile--md" /><div className="partners-wall__skeleton partners-wall__tile--md" /></div>
  } else if (error) {
    content = <div className="partners-wall__state"><p>Partners are unavailable right now.</p><button type="button" className="bx-btn bx-btn--ghost bx-btn--sm" onClick={onRetry}>Retry</button></div>
  } else if (!spotlight) {
    content = <div className="partners-wall__state"><p className="partners-hero__cta-text">Partnership announcements are coming soon.</p></div>
  } else {
    content = (
      <ul className="partners-wall__grid" aria-label="Partners">
        <li className="partners-wall__spotlight bx-gradient-border">
          <PartnerLink partner={spotlight} className="partners-wall__spotlight-link bx-gradient-border__inner">
            <span className="partners-wall__spotlight-top"><span>Featured partner</span><span>01</span></span>
            <span className="partners-wall__spotlight-logo"><PartnerLogoImage name={spotlight.name} logoUrl={spotlight.logoUrl} alt="" /></span>
            <span className="partners-wall__spotlight-bottom"><span className="partners-wall__spotlight-name">{spotlight.name}</span>{spotlight.websiteUrl ? <ArrowIcon size={32} /> : null}</span>
          </PartnerLink>
        </li>
        {rest.map((partner, index) => (
          <li key={partner.id} className={index < 4 ? 'partners-wall__tile--md' : 'partners-wall__tile--sm'}>
            <ScrollReveal variant="scale-in" index={index}>
              <PartnerLink partner={partner} className={`partners-wall__tile ${index < 4 ? 'partners-wall__tile--md' : 'partners-wall__tile--sm'}`}>
                <PartnerLogoImage name={partner.name} logoUrl={partner.logoUrl} alt="" />
              </PartnerLink>
            </ScrollReveal>
          </li>
        ))}
        {partnershipContactHref ? (
          <li className="partners-wall__tile--sm">
            <a className="partners-wall__tile partners-wall__tile--sm partners-wall__tile--cta" href={partnershipContactHref}>Your logo here</a>
          </li>
        ) : null}
      </ul>
    )
  }

  return (
    <section className="partners-wall bx-display-container" aria-labelledby="partners-wall-title">
      <div className="shared-container bx-display-container">
        <p className="bx-eyebrow">The roster</p>
        <h2 id="partners-wall-title" className="partners-wall__title bx-display">Who backs us</h2>
        {content}
      </div>
    </section>
  )
}
