'use client'

import { Center, Spinner } from '@chakra-ui/react'
import { Suspense } from 'react'
import { AdminAccessGate } from '../../../components/organisms/AdminAccessGate'
import { AdminDashboardPage } from '../../../components/pages/AdminDashboardPage'

export function AdminRoute() {
  return (
    // AdminDashboardPage reads ?tab= via useSearchParams, which Next.js requires inside Suspense.
    <Suspense fallback={<Center minH="50vh"><Spinner size="lg" color="brand.500" /></Center>}>
      <AdminAccessGate>
        <AdminDashboardPage />
      </AdminAccessGate>
    </Suspense>
  )
}
