import { Card, CardBody } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface AdminItemCardProps {
  /** Opens the item (read-only view) when the card is clicked. */
  onClick: () => void
  children: ReactNode
}

/** Clickable bordered card for one record in the admin "card" view. */
export function AdminItemCard({ onClick, children }: AdminItemCardProps) {
  return (
    <Card borderRadius="xl" border="1px solid" borderColor="gray.200" onClick={onClick} _hover={{ boxShadow: 'md' }} cursor="pointer">
      <CardBody>{children}</CardBody>
    </Card>
  )
}
