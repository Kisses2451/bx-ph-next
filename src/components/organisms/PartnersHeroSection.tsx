import type { CSSProperties } from 'react'
import { ArrowIcon } from '../atoms/ArrowIcon'
import { PartnerLogoImage } from '../atoms/PartnerLogoImage'
import { partnershipContactHref } from '../../config/site'
import type { PublicPartner } from '../../hooks/usePartners'

const delay = (ms: number) => ({ '--bx-delay': `${ms}ms` }) as CSSProperties

/** One endless row of logo tiles. Decorative: the real, clickable list is the partner wall below. */
function LogoRow({ partners, reverse, seconds }: { partners: PublicPartner[]; reverse?: boolean; seconds: number }) {
  // Repeat short lists so one copy is wider than the screen; two copies make the loop seamless.
  const repeated = Array.from({ length: Math.max(1, Math.ceil(8 / partners.length)) }, () => partners).flat()
  const tiles = (copy: number) => repeated.map((partner, index) => (
    <span key={`${copy}-${index}`} className="partners-hero__tile"><PartnerLogoImage name={partner.name} logoUrl={partner.logoUrl} alt="" /></span>
  ))
  return (
    <div className="bx-marquee partners-hero__row">
      <div className={`bx-marquee-track${reverse ? ' bx-marquee-track--reverse' : ''}`} style={{ '--bx-marquee-duration': `${seconds}s` } as CSSProperties}>
        {tiles(0)}{tiles(1)}
      </div>
    </div>
  )
}

/**
 * Top of the Partners page: giant "PARTNERS." title and intro, then two rows of partner logos scrolling in
 * opposite directions (hidden while there are no partners). A "Become a partner" bar appears only when
 * `partnershipContactHref` is set in config/site.ts.
 */
export function PartnersHeroSection({ partners }: { partners: PublicPartner[] }) {
  const half = Math.ceil(partners.length / 2)
  const secondRow = partners.length > 3 ? [...partners.slice(half), ...partners.slice(0, half)] : [...partners].reverse()

  return (
    <section className="partners-hero" aria-labelledby="partners-title">
      <div className="shared-container partners-hero__head bx-display-container">
        <div className="partners-hero__heading">
          <p className="bx-eyebrow bx-rise-in">Strategic partners</p>
          <h1 id="partners-title" className="partners-hero__title bx-display bx-mask-in" style={delay(150)}>Partners<span>.</span></h1>
        </div>
        <p className="partners-hero__intro bx-prose bx-rise-in" style={delay(350)}>Partnerships that strengthen the player pathway, support community growth, and move the club forward.</p>
      </div>

      {partners.length > 0 ? (
        <div className="partners-hero__rows bx-rise-in" style={delay(500)} aria-hidden="true">
          <LogoRow partners={partners} seconds={40} />
          <LogoRow partners={secondRow} seconds={48} reverse />
        </div>
      ) : null}

      {partnershipContactHref ? (
        <div className="shared-container">
          <div className="partners-hero__cta">
            <span className="partners-hero__cta-text">Want your brand in front of our players?</span>
            <a href={partnershipContactHref} className="bx-btn bx-btn--primary bx-shine">Become a partner <ArrowIcon /></a>
          </div>
        </div>
      ) : null}
    </section>
  )
}
