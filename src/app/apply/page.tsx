import type { Metadata } from 'next'
import { JoinPage } from '../../components/pages/JoinPage'

export const metadata: Metadata = { title: 'Join Now' }

export default function Page() {
  return <JoinPage />
}
