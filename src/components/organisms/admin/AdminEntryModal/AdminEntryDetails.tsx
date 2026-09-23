import { Box, Stack, Text } from '@chakra-ui/react'
import type { AdminEntryKind } from '../../../../lib/admin/adminEntries'

interface AdminEntryDetailsProps {
  kind: AdminEntryKind
  item: Record<string, any>
}

/** Read-only "View entry" layout: a summary box on the left and label/value rows on the right. */
export function AdminEntryDetails({ kind, item }: AdminEntryDetailsProps) {
  const surface = 'var(--surface)'
  const border = 'var(--border)'
  const softBg = 'var(--surface-2)'
  const muted = 'var(--text-muted)'

  // Which fields to list for each kind of record, as [label, value] pairs.
  const detailMap = {
    player: [
      ['Name', item.full_name || `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim()],
      ['Email', item.email],
      ['Game', item.main_game],
      ['Department', item.department],
      ['IGN', item.in_game_name],
      ['UID', item.uid],
      ['Status', item.status],
    ],
    update: [
      ['Title', item.title],
      ['Tag', item.tag],
      ['Detail', item.detail],
    ],
    game: [
      ['Title', item.title],
      ['Genre', item.tag ?? item.genre],
      ['Description', item.description],
    ],
    partner: [
      ['Name', item.name],
      ['Category', item.category],
      ['Website', item.website ?? item.website_url],
      ['Description', item.description],
    ],
    event: [
      ['Title', item.title],
      ['Date', item.event_date ?? item.date],
      ['Location', item.location],
      ['Description', item.description],
    ],
    timeline: [
      ['Year', item.year],
      ['Month', item.month ? new Date(2000, item.month - 1).toLocaleString('en', { month: 'long' }) : 'None'],
      ['Title', item.title],
      ['Description', item.description || 'No description provided.'],
      ['Visible', item.is_visible ? 'Yes' : 'No'],
    ],
    staff: [
      ['Name', item.name],
      ['Role', item.role],
      ['Bio', item.bio],
    ],
  } as const

  const summaryTitle = item.full_name || item.name || item.title || item.category || 'Entry'
  const summaryText = kind === 'player'
    ? item.department || item.main_game || 'Player'
    : kind === 'staff'
      ? item.role || 'Staff member'
      : kind === 'partner'
        ? item.category || 'Partner'
        : kind === 'event'
          ? (item.event_date ?? item.date) || 'Event'
          : kind === 'game'
            ? (item.tag ?? item.genre) || 'Game'
            : item.tag || 'Update'

  return (
    <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'minmax(180px, 220px) minmax(0, 1fr)' }} gap={4} alignItems="start">
      <Box borderRadius="xl" border="1px solid" borderColor={border} bg={softBg} p={4}>
        <Text fontSize="xs" letterSpacing="wide" textTransform="uppercase" color={muted} fontWeight="bold">Summary</Text>
        <Text fontSize="lg" fontWeight="bold" mt={3}>{summaryTitle}</Text>
        <Text color={muted} mt={2}>{summaryText}</Text>
      </Box>

      <Box borderRadius="xl" border="1px solid" borderColor={border} bg={surface} p={4}>
        <Stack spacing={3}>
          {detailMap[kind].map(([label, value]) => (
            <Box key={label} display="grid" gridTemplateColumns={{ base: '1fr', sm: '130px minmax(0, 1fr)' }} gap={{ base: 1, sm: 4 }} alignItems="start">
              <Text fontWeight="bold" color={muted}>{label}:</Text>
              <Text className="bx-prose" whiteSpace="pre-wrap">{String(value ?? '—')}</Text>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
