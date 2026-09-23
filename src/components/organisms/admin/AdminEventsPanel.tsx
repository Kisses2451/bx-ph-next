import { Button, Divider, Stack, Switch, Td, Text, Tr } from '@chakra-ui/react'
import { SkeletonRows } from '../../atoms/SkeletonRows'
import { AdminCardGrid } from '../../molecules/AdminCardGrid'
import { AdminDataTable } from '../../molecules/AdminDataTable'
import { AdminItemCard } from '../../molecules/AdminItemCard'
import { AdminPanelToolbar } from '../../molecules/AdminPanelToolbar'
import { EditDeleteActions } from '../../molecules/EditDeleteActions'
import { EmptyStatePanel } from '../../molecules/EmptyStatePanel'
import { ReorderButtons } from '../../molecules/ReorderButtons'
import type { AdminPanelBaseProps } from './adminPanelTypes'
import type { AdminEvent } from '../../../lib/admin/adminEntries'

interface AdminEventsPanelProps extends AdminPanelBaseProps {
  events: AdminEvent[]
  isLoading: boolean
  onToggleVisibility: (item: AdminEvent) => void
  onMove: (item: AdminEvent, direction: 'up' | 'down') => void
}

/** Admin "Events" tab: events shown in the home page feed once they are upcoming. */
export function AdminEventsPanel({ events, isLoading, viewMode, onViewModeChange, onOpen, onDelete, onToggleVisibility, onMove }: AdminEventsPanelProps) {
  const skeletonBg = 'var(--surface-2)'
  return (
    <Stack spacing={6}>
      <AdminPanelToolbar title="Events" addLabel="Add Event" onAdd={() => onOpen(null, 'add')} viewMode={viewMode} onViewModeChange={onViewModeChange} />
      {isLoading ? <SkeletonRows bg={skeletonBg} />
        : events.length === 0 ? <EmptyStatePanel message="No events yet"><Button mt={3} className="btn-primary" onClick={() => onOpen(null, 'add')}>Add Event</Button></EmptyStatePanel>
          : viewMode === 'table' ? (
            <AdminDataTable columns={['Title', 'Date', 'Location', 'Visible', 'Order', 'Actions']}>
              {events.map((item, index) => (
                <Tr key={item.id} onClick={() => onOpen(item, 'view')} _hover={{ bg: 'gray.50' }} cursor="pointer">
                  <Td>{item.title}</Td>
                  <Td>{item.event_date}</Td>
                  <Td>{item.location ?? '—'}</Td>
                  <Td><Switch isChecked={item.is_visible} onChange={() => void onToggleVisibility(item)} aria-label={`Toggle ${item.title} visibility`} /></Td>
                  <Td><ReorderButtons itemNoun="event" onMoveUp={() => void onMove(item, 'up')} onMoveDown={() => void onMove(item, 'down')} isFirst={index === 0} isLast={index === events.length - 1} /></Td>
                  <Td><EditDeleteActions itemNoun="event" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} /></Td>
                </Tr>
              ))}
            </AdminDataTable>
          ) : (
            <AdminCardGrid>
              {events.map((item) => (
                <AdminItemCard key={item.id} onClick={() => onOpen(item, 'view')}>
                  <Text fontWeight="bold" fontSize="lg">{item.title}</Text>
                  <Text color="gray.500">{item.event_date} • {item.location ?? 'Location to be announced'}</Text>
                  <Text mt={3}>{item.description ?? '—'}</Text>
                  <Divider my={3} />
                  <EditDeleteActions itemNoun="event" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} />
                </AdminItemCard>
              ))}
            </AdminCardGrid>
          )}
    </Stack>
  )
}
