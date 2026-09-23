import { Button, HStack, Stack, Switch, Td, Text, Tr } from '@chakra-ui/react'
import { SkeletonRows } from '../../atoms/SkeletonRows'
import { VisibilityBadge } from '../../atoms/VisibilityBadge'
import { AdminCardGrid } from '../../molecules/AdminCardGrid'
import { AdminDataTable } from '../../molecules/AdminDataTable'
import { AdminItemCard } from '../../molecules/AdminItemCard'
import { AdminPanelToolbar } from '../../molecules/AdminPanelToolbar'
import { EditDeleteActions } from '../../molecules/EditDeleteActions'
import { EmptyStatePanel } from '../../molecules/EmptyStatePanel'
import type { AdminPanelBaseProps } from './adminPanelTypes'
import type { AdminTimelineEvent } from '../../../lib/admin/adminEntries'

interface AdminTimelinePanelProps extends AdminPanelBaseProps {
  events: AdminTimelineEvent[]
  isLoading: boolean
  /** Load error message, shown instead of the table. */
  error: string
  onToggleVisibility: (item: AdminTimelineEvent) => void
}

/** Admin "Timeline" tab: the "Key milestones" shown on the About page. */
export function AdminTimelinePanel({ events, isLoading, error, viewMode, onViewModeChange, onOpen, onDelete, onToggleVisibility }: AdminTimelinePanelProps) {
  const skeletonBg = 'var(--surface-2)'
  const muted = 'var(--text-muted)'

  const content = isLoading ? <SkeletonRows bg={skeletonBg} />
    : error ? <Text color={muted}>{error}</Text>
      : events.length === 0 ? <EmptyStatePanel message="No milestones yet"><Button className="btn-primary" mt={3} onClick={() => onOpen(null, 'add')}>Add Milestone</Button></EmptyStatePanel>
        : viewMode === 'card' ? <AdminCardGrid>{events.map((item) => <AdminItemCard key={item.id} onClick={() => onOpen(item, 'view')}><Text fontWeight="bold" fontSize="lg">{item.title}</Text><Text color={muted}>{item.year}{item.month ? ` · ${new Date(2000, item.month - 1).toLocaleString('en', { month: 'short' })}` : ''}</Text><Text mt={3}>{item.description || '—'}</Text><HStack mt={4}><VisibilityBadge isVisible={item.is_visible} /><Switch isChecked={item.is_visible} onChange={() => void onToggleVisibility(item)} aria-label={`Toggle ${item.title} visibility`} /><EditDeleteActions itemNoun="milestone" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} /></HStack></AdminItemCard>)}</AdminCardGrid> : (
          <AdminDataTable columns={['Year', 'Month', 'Title', 'Description', 'Visible', 'Actions']}>
            {events.map((item) => <Tr key={item.id}><Td>{item.year}</Td><Td>{item.month ? new Date(2000, item.month - 1).toLocaleString('en', { month: 'short' }) : '—'}</Td><Td fontWeight="bold">{item.title}</Td><Td maxW="280px" isTruncated>{item.description || '—'}</Td><Td><HStack><VisibilityBadge isVisible={item.is_visible} /><Switch isChecked={item.is_visible} onChange={() => void onToggleVisibility(item)} aria-label={`Toggle ${item.title} visibility`} /></HStack></Td><Td><EditDeleteActions itemNoun="milestone" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} /></Td></Tr>)}
          </AdminDataTable>
        )

  return (
    <Stack spacing={6}>
      <AdminPanelToolbar title="Timeline" addLabel="Add Milestone" onAdd={() => onOpen(null, 'add')} viewMode={viewMode} onViewModeChange={onViewModeChange} />
      {content}
    </Stack>
  )
}
