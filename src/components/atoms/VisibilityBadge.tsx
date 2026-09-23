import { Badge } from '@chakra-ui/react'

/** "Visible" (green) or "Hidden" (grey) badge for items that can be hidden from the public website. */
export function VisibilityBadge({ isVisible, mt }: { isVisible: boolean; mt?: number }) {
  return <Badge mt={mt} colorScheme={isVisible ? 'green' : 'gray'}>{isVisible ? 'Visible' : 'Hidden'}</Badge>
}
