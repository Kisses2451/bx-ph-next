import type { Metadata } from 'next'
import { JoinPage } from '../../components/pages/JoinPage'

// /join and /apply show the same page; the join modal opens automatically on both.
export const metadata: Metadata = { title: 'Join Now' }

export default function Page() {
  return <JoinPage />
}
