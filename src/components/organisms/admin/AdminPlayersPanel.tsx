import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Divider, Flex, HStack, Stack, Td, Text, Tr, Heading } from '@chakra-ui/react'
import { ActionIconButton, ApproveActionIcon, DeleteActionIcon, EditActionIcon, RejectActionIcon } from '../../atoms/ActionIconButton'
import { DepartmentBadge } from '../../atoms/DepartmentBadge'
import { PlayerAvatar } from '../../atoms/PlayerAvatar'
import { PlayerStatusBadge } from '../../atoms/PlayerStatusBadge'
import { SkeletonRows } from '../../atoms/SkeletonRows'
import { AdminCardGrid } from '../../molecules/AdminCardGrid'
import { AdminDataTable } from '../../molecules/AdminDataTable'
import { AdminItemCard } from '../../molecules/AdminItemCard'
import { EmptyStatePanel } from '../../molecules/EmptyStatePanel'
import { PaginationBar } from '../../molecules/PaginationBar'
import { PlayerCountsSummary } from '../../molecules/PlayerCountsSummary'
import { TableCardViewToggle } from '../../molecules/TableCardViewToggle'
import { AdminPlayerFilterBar } from './AdminPlayerFilterBar'
import type { AdminPanelBaseProps } from './adminPanelTypes'
import type { useAdminPlayers } from '../../../hooks/admin/useAdminPlayers'
import { playerDisplayName, playerInitials } from '../../../lib/admin/playerHelpers'
import type { SupabasePlayer } from '../../../types/player'

interface AdminPlayersPanelProps extends AdminPanelBaseProps {
  /** State and actions from useAdminPlayers. */
  players: ReturnType<typeof useAdminPlayers>
  onApprove: (playerId: string) => void
  onReject: (playerId: string) => void
}

/** Row/card callbacks shared by the table and the card grid. */
interface PlayerListProps {
  rows: SupabasePlayer[]
  photoUrls: Record<string, string>
  onOpen: AdminPanelBaseProps['onOpen']
  onDelete: (id: string) => void
  onApprove: (playerId: string) => void
  onReject: (playerId: string) => void
}

/** Opening a player for viewing also passes its signed photo URL so the modal can preview it. */
function withPhotoUrl(player: SupabasePlayer, photoUrls: Record<string, string>) {
  return { ...player, photoUrl: player.photo_path ? photoUrls[player.photo_path] : '' }
}

function PlayersTable({ rows, photoUrls, onOpen, onDelete, onApprove, onReject }: PlayerListProps) {
  return (
    <AdminDataTable columns={['Player', 'Game', 'Department', 'IGN / UID', 'Status', 'Date', 'Actions']}>
      {rows.map((player) => (
        <Tr key={player.id} onClick={() => onOpen(withPhotoUrl(player, photoUrls), 'view')} _hover={{ bg: 'gray.50' }} cursor="pointer">
          <Td>
            <Flex align="center" gap={3}>
              <PlayerAvatar photoUrl={player.photo_path ? photoUrls[player.photo_path] : undefined} name={player.full_name || 'Player'} initials={playerInitials(player)} size="sm" />
              <Box>
                <Text fontWeight="bold">{playerDisplayName(player)}</Text>
                <Text fontSize="sm" color="gray.500">{player.email}</Text>
                {!player.photo_path && player.photo_drive_url ? <Text as="a" href={player.photo_drive_url} target="_blank" rel="noreferrer" fontSize="xs" color="brand.500" onClick={(event) => event.stopPropagation()}>Open legacy photo</Text> : null}
              </Box>
            </Flex>
          </Td>
          <Td>{player.main_game}</Td>
          <Td><DepartmentBadge department={player.department} /></Td>
          <Td>{player.in_game_name || '—'} / {player.uid || '—'}</Td>
          <Td><PlayerStatusBadge status={player.status} /></Td>
          <Td>{new Date(player.created_at).toLocaleDateString()}</Td>
          <Td>
            <HStack spacing={2} onClick={(event) => event.stopPropagation()}>
              <ActionIconButton label="Edit player" icon={<EditActionIcon />} onClick={() => onOpen(player, 'edit')} />
              <ActionIconButton label="Approve player" colorScheme="brand" icon={<ApproveActionIcon />} onClick={() => onApprove(player.id)} />
              <ActionIconButton label="Reject player" colorScheme="red" icon={<RejectActionIcon />} onClick={() => onReject(player.id)} />
              <ActionIconButton label="Delete player" colorScheme="gray" variant="ghost" icon={<DeleteActionIcon />} onClick={() => onDelete(player.id)} />
            </HStack>
          </Td>
        </Tr>
      ))}
    </AdminDataTable>
  )
}

function PlayersCardGrid({ rows, photoUrls, onOpen, onDelete, onApprove, onReject }: PlayerListProps) {
  return (
    <AdminCardGrid>
      {rows.map((player) => (
        <AdminItemCard key={player.id} onClick={() => onOpen(withPhotoUrl(player, photoUrls), 'view')}>
          <Flex align="center" justify="space-between" mb={4}>
            <PlayerAvatar photoUrl={player.photo_path ? photoUrls[player.photo_path] : undefined} name={player.full_name || 'Player'} initials={playerInitials(player)} size="md" />
            <PlayerStatusBadge status={player.status} />
          </Flex>
          <Text fontWeight="bold" fontSize="lg">{playerDisplayName(player)}</Text>
          <Text color="gray.500">{player.main_game} · <DepartmentBadge department={player.department} /></Text>
          <Text my={2} fontSize="sm">{player.in_game_name || '—'} · {player.uid || '—'}</Text>
          <Text my={2} fontSize="sm">{player.email}</Text>
          <Text fontSize="sm" color="gray.500">Applied: {new Date(player.created_at).toLocaleDateString()}</Text>
          {!player.photo_path && player.photo_drive_url ? <Text as="a" href={player.photo_drive_url} target="_blank" rel="noreferrer" fontSize="sm" color="brand.500" onClick={(event) => event.stopPropagation()}>Open legacy photo</Text> : null}
          <Divider my={3} />
          <HStack spacing={2} flexWrap="wrap" onClick={(event) => event.stopPropagation()}>
            <ActionIconButton label="Edit player" icon={<EditActionIcon />} onClick={() => onOpen(player, 'edit')} />
            <ActionIconButton label="Approve player" colorScheme="brand" icon={<ApproveActionIcon />} onClick={() => onApprove(player.id)} />
            <ActionIconButton label="Reject player" colorScheme="red" icon={<RejectActionIcon />} onClick={() => onReject(player.id)} />
            <ActionIconButton label="Delete player" icon={<DeleteActionIcon />} onClick={() => onDelete(player.id)} />
          </HStack>
        </AdminItemCard>
      ))}
    </AdminCardGrid>
  )
}

/** Admin "Players" tab: counts summary, search & filters, player list (table or cards) with paging. */
export function AdminPlayersPanel({ players, viewMode, onViewModeChange, onOpen, onDelete, onApprove, onReject }: AdminPlayersPanelProps) {
  const skeletonBg = 'var(--surface-2)'
  const { filters } = players
  const listProps: PlayerListProps = { rows: players.players, photoUrls: players.photoUrls, onOpen, onDelete, onApprove, onReject }

  return (
    <Stack spacing={6}>
      <PlayerCountsSummary counts={players.counts} />

      <AdminPlayerFilterBar
        searchTerm={filters.searchTerm}
        setSearchTerm={filters.setSearchTerm}
        departmentFilter={filters.departmentFilter}
        setDepartmentFilter={filters.setDepartmentFilter}
        statusFilter={filters.statusFilter}
        setStatusFilter={filters.setStatusFilter}
        gameFilter={filters.gameFilter}
        setGameFilter={filters.setGameFilter}
        datePreset={filters.datePreset}
        setDatePreset={filters.setDatePreset}
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        onFromDateChange={filters.setFromDate}
        onToDateChange={filters.setToDate}
        onClear={filters.clearFilters}
        resultsCount={players.total}
        hasInvalidDateRange={filters.hasInvalidDateRange}
      />
      <Flex className="admin-player-toolbar" justify="flex-end" align="center" gap={3} direction={{ base: 'column', sm: 'row' }}>
        <TableCardViewToggle value={viewMode} onChange={onViewModeChange} />
        <Button leftIcon={<AddIcon />} className="btn-primary" colorScheme="brand" onClick={() => onOpen(null, 'add')}>Add Player</Button>
      </Flex>

      {players.isLoading ? <SkeletonRows count={5} rowHeight="64px" bg={skeletonBg} />
        : players.error ? <EmptyStatePanel tone="error" message={players.error}><Button mt={3} onClick={() => void players.reload()}>Retry</Button></EmptyStatePanel>
          : players.players.length === 0 ? <EmptyStatePanel message="No players found"><Button variant="link" colorScheme="brand" mt={2} onClick={filters.clearFilters}>Clear filters</Button></EmptyStatePanel>
            : <>
              {viewMode === 'table' ? <PlayersTable {...listProps} /> : <PlayersCardGrid {...listProps} />}
              <PaginationBar page={players.page} pageSize={players.pageSize} totalItems={players.total} itemLabel="players" onPrevious={() => players.setPage((page) => Math.max(1, page - 1))} onNext={() => players.setPage((page) => page + 1)} />
            </>}
      <Box className="admin-readonly-section">
        <Heading as="h2" size="md">Admins</Heading>
        <Text color="var(--text-muted)" mt={1} fontSize="sm">Read-only account access. Add new admins in the Supabase dashboard.</Text>
        <Stack spacing={2} mt={4}>
          {players.admins.length === 0 ? <Text color="var(--text-muted)">No admin records found.</Text> : players.admins.map((admin) => <Box key={admin.id ?? admin.user_id} border="1px solid" borderColor="var(--border)" bg="var(--surface-2)" p={3}><Text fontWeight="bold">{admin.email ?? admin.user_id}</Text><Text fontSize="sm" color="var(--text-muted)">{admin.role} {admin.created_at ? `· ${new Date(admin.created_at).toLocaleDateString()}` : ''}</Text></Box>)}
        </Stack>
      </Box>
    </Stack>
  )
}
