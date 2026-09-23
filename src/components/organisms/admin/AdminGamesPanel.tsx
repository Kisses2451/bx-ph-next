import { Badge, Button, Divider, Stack, Switch, Td, Text, Tr } from '@chakra-ui/react'
import { LogoThumbnail } from '../../atoms/LogoThumbnail'
import { SkeletonRows } from '../../atoms/SkeletonRows'
import { VisibilityBadge } from '../../atoms/VisibilityBadge'
import { AdminCardGrid } from '../../molecules/AdminCardGrid'
import { AdminDataTable } from '../../molecules/AdminDataTable'
import { AdminItemCard } from '../../molecules/AdminItemCard'
import { AdminPanelToolbar } from '../../molecules/AdminPanelToolbar'
import { EditDeleteActions } from '../../molecules/EditDeleteActions'
import { EmptyStatePanel } from '../../molecules/EmptyStatePanel'
import { ReorderButtons } from '../../molecules/ReorderButtons'
import type { AdminPanelBaseProps } from './adminPanelTypes'
import type { AdminGame } from '../../../lib/admin/adminEntries'

interface AdminGamesPanelProps extends AdminPanelBaseProps {
  games: AdminGame[]
  isLoading: boolean
  onToggleVisibility: (item: AdminGame) => void
  onMove: (item: AdminGame, direction: 'up' | 'down') => void
}

/** Admin "Games" tab: game titles and logos shown on the home page, with visibility and order controls. */
export function AdminGamesPanel({ games, isLoading, viewMode, onViewModeChange, onOpen, onDelete, onToggleVisibility, onMove }: AdminGamesPanelProps) {
  const skeletonBg = 'var(--surface-2)'

  // Note: loading and empty states are only shown in table view (card view just shows the cards).
  const gamesTable = isLoading ? <SkeletonRows bg={skeletonBg} />
    : games.length === 0 ? <EmptyStatePanel message="No games yet"><Button mt={3} className="btn-primary" onClick={() => onOpen(null, 'add')}>Add Game</Button></EmptyStatePanel>
      : (
        <AdminDataTable columns={['Logo', 'Name', 'Genre', 'Visible', 'Order', 'Actions']}>
          {games.map((item, index) => (
            <Tr key={item.id} onClick={() => onOpen(item, 'view')} _hover={{ bg: 'gray.50' }} cursor="pointer">
              <Td><LogoThumbnail src={item.image_url} name={item.title} />{!item.image_url ? <Badge mt={1} colorScheme="orange">No logo</Badge> : null}{item.image_url && !/\/games\/[^/]+\.(webp|png)(?:\?|$)/i.test(item.image_url) ? <Text fontSize="xs" color="gray.500">Re-upload to make square</Text> : null}</Td>
              <Td>{item.title}</Td>
              <Td>{item.tag || '—'}</Td>
              <Td><Switch isChecked={item.is_visible} onChange={() => void onToggleVisibility(item)} aria-label={`Toggle ${item.title} visibility`} /></Td>
              <Td><ReorderButtons itemNoun="game" onMoveUp={() => void onMove(item, 'up')} onMoveDown={() => void onMove(item, 'down')} isFirst={index === 0} isLast={index === games.length - 1} /></Td>
              <Td><EditDeleteActions itemNoun="game" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} /></Td>
            </Tr>
          ))}
        </AdminDataTable>
      )

  const gamesCards = (
    <AdminCardGrid>
      {games.map((item) => (
        <AdminItemCard key={item.id} onClick={() => onOpen(item, 'view')}>
          <LogoThumbnail src={item.image_url} name={item.title} />
          {!item.image_url ? <Badge mt={1} colorScheme="orange">No logo</Badge> : null}
          <Text fontWeight="bold" fontSize="lg">{item.title}</Text>
          <Text color="gray.500">{item.tag}</Text>
          <VisibilityBadge isVisible={item.is_visible} mt={2} />
          <Text mt={3}>{item.description || '—'}</Text>
          <Divider my={3} />
          <EditDeleteActions itemNoun="game" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} />
        </AdminItemCard>
      ))}
    </AdminCardGrid>
  )

  return (
    <Stack spacing={6}>
      <AdminPanelToolbar title="Games" addLabel="Add Game" onAdd={() => onOpen(null, 'add')} viewMode={viewMode} onViewModeChange={onViewModeChange} />
      {viewMode === 'table' ? gamesTable : gamesCards}
    </Stack>
  )
}
