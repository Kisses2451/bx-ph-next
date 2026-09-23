import { Badge } from '@chakra-ui/react'

/** Badge for a player's department: Community is purple, Clan (and anything else) is blue. Empty shows "—". */
export function DepartmentBadge({ department }: { department: string | null | undefined }) {
  return <Badge colorScheme={department === 'Community' ? 'purple' : 'blue'}>{department || '—'}</Badge>
}
