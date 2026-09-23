import type { Metadata } from 'next'
import { AboutPage } from '../../components/pages/AboutPage'
import { getAboutPageData } from '../../server/publicData'

export const metadata: Metadata = { title: 'About Us' }
export const revalidate = 60

export default async function Page() {
  const data = await getAboutPageData()
  return <AboutPage initialStats={data.stats} initialTimeline={data.timeline} initialStaff={data.staff} />
}
