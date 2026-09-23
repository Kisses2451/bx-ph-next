import { Badge, Button, Divider, Stack, Switch, Td, Text, Tr } from '@chakra-ui/react'
import { SkeletonRows } from '../../atoms/SkeletonRows'
import { AdminCardGrid } from '../../molecules/AdminCardGrid'
import { AdminDataTable } from '../../molecules/AdminDataTable'
import { AdminItemCard } from '../../molecules/AdminItemCard'
import { AdminPanelToolbar } from '../../molecules/AdminPanelToolbar'
import { EditDeleteActions } from '../../molecules/EditDeleteActions'
import { EmptyStatePanel } from '../../molecules/EmptyStatePanel'
import type { AdminPanelBaseProps } from './adminPanelTypes'
import type { AdminLatestUpdate } from '../../../lib/admin/adminEntries'

interface AdminLatestUpdatesPanelProps extends AdminPanelBaseProps {
  updates: AdminLatestUpdate[]
  isLoading: boolean
  onToggleVisibility: (item: AdminLatestUpdate) => void
}

/** Admin "Latest Updates" tab: news items shown in the home page feed and announcement pop-up. */
export function AdminLatestUpdatesPanel({ updates, isLoading, viewMode, onViewModeChange, onOpen, onDelete, onToggleVisibility }: AdminLatestUpdatesPanelProps) {
  const skeletonBg = 'var(--surface-2)'
  return (
    <Stack spacing={6}>
      <AdminPanelToolbar title="Latest Updates" addLabel="Add Update" onAdd={() => onOpen(null, 'add')} viewMode={viewMode} onViewModeChange={onViewModeChange} />
      {isLoading ? <SkeletonRows bg={skeletonBg} />
        : updates.length === 0 ? <EmptyStatePanel message="No latest updates yet"><Button mt={3} className="btn-primary" onClick={() => onOpen(null, 'add')}>Add Update</Button></EmptyStatePanel>
          : viewMode === 'table' ? (
            <AdminDataTable columns={['Title', 'Tag', 'Summary', 'Visible', 'Actions']}>
              {updates.map((item) => (
                <Tr key={item.id} onClick={() => onOpen(item, 'view')} _hover={{ bg: 'gray.50' }} cursor="pointer">
                  <Td>{item.title}</Td>
                  <Td>{item.tag ?? '—'}</Td>
                  <Td>{item.description ?? '—'}</Td>
                  <Td><Switch isChecked={item.is_visible} onChange={() => void onToggleVisibility(item)} aria-label={`Toggle ${item.title} visibility`} /></Td>
                  <Td><EditDeleteActions itemNoun="update" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} /></Td>
                </Tr>
              ))}
            </AdminDataTable>
          ) : (
            <AdminCardGrid>
              {updates.map((item) => (
                <AdminItemCard key={item.id} onClick={() => onOpen(item, 'view')}>
                  <Text fontWeight="bold" fontSize="lg">{item.title}</Text>
                  <Badge colorScheme="brand" mt={2}>{item.tag}</Badge>
                  <Text mt={3}>{item.description ?? '—'}</Text>
                  <Divider my={3} />
                  <EditDeleteActions itemNoun="update" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} />
                </AdminItemCard>
              ))}
            </AdminCardGrid>
          )}
    </Stack>
  )
}
