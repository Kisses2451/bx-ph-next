import type { Metadata } from 'next'
import { ApplicationSuccessPage } from '../../../components/pages/ApplicationSuccessPage'

export const metadata: Metadata = { title: 'Application submitted' }

export default function Page() {
  return <ApplicationSuccessPage />
}
