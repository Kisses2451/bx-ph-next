import type { Metadata } from 'next'
import { PartnersPage } from '../../components/pages/PartnersPage'
import { getPartnersPageData } from '../../server/publicData'

export const metadata: Metadata = { title: 'Partners' }
export const revalidate = 60

export default async function Page() {
  const partners = await getPartnersPageData()
  return <PartnersPage initialPartners={partners} />
}
