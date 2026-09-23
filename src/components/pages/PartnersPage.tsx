'use client'

import { usePartners } from '../../hooks/usePartners'
import { JoinCallToActionSection } from '../organisms/JoinCallToActionSection'
import { PartnerLogoWall } from '../organisms/PartnerLogoWall'
import { PartnersHeroSection } from '../organisms/PartnersHeroSection'
import type { PublicPartner } from '../../hooks/usePartners'

/** Partners page ( /partners ): hero with scrolling logo rows, the tiered partner wall, and the join banner. */
export function PartnersPage({ initialPartners }: { initialPartners?: PublicPartner[] }) {
  const { partners, isLoading, error, retry } = usePartners(initialPartners)
  return (
    <>
      <PartnersHeroSection partners={error ? [] : partners} />
      <PartnerLogoWall partners={partners} isLoading={isLoading} error={error} onRetry={retry} />
      <JoinCallToActionSection gameTitles={[]} />
    </>
  )
}
