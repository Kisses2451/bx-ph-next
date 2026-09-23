import { SimpleGrid } from '@chakra-ui/react'
import type { ReactNode } from 'react'

/** Responsive grid (1 / 2 / 3 columns) that holds AdminItemCards in the admin "card" view. */
export function AdminCardGrid({ children }: { children: ReactNode }) {
  return <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>{children}</SimpleGrid>
}
