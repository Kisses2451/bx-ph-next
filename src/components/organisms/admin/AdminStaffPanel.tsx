import { Button, Divider, Stack, Switch, Td, Text, Tr } from '@chakra-ui/react'
import { SkeletonRows } from '../../atoms/SkeletonRows'
import { AdminCardGrid } from '../../molecules/AdminCardGrid'
import { AdminDataTable } from '../../molecules/AdminDataTable'
import { AdminItemCard } from '../../molecules/AdminItemCard'
import { AdminPanelToolbar } from '../../molecules/AdminPanelToolbar'
import { EditDeleteActions } from '../../molecules/EditDeleteActions'
import { EmptyStatePanel } from '../../molecules/EmptyStatePanel'
import type { AdminPanelBaseProps } from './adminPanelTypes'
import type { AdminStaff } from '../../../lib/admin/adminEntries'
import { ReorderButtons } from '../../molecules/ReorderButtons'

interface AdminStaffPanelProps extends AdminPanelBaseProps {
  staff: AdminStaff[]
  isLoading: boolean
  onToggleVisibility: (item: AdminStaff) => void
  onMove: (item: AdminStaff, direction: 'up' | 'down') => void
}

/** Admin "Staffs" tab: staff members with role, bio and photo. */
export function AdminStaffPanel({ staff, isLoading, viewMode, onViewModeChange, onOpen, onDelete, onToggleVisibility, onMove }: AdminStaffPanelProps) {
  const skeletonBg = 'var(--surface-2)'
  return (
    <Stack spacing={6}>
      <AdminPanelToolbar title="Staffs" addLabel="Add Staff" onAdd={() => onOpen(null, 'add')} viewMode={viewMode} onViewModeChange={onViewModeChange} />
      {isLoading ? <SkeletonRows bg={skeletonBg} />
        : staff.length === 0 ? <EmptyStatePanel message="No staff members yet"><Button mt={3} className="btn-primary" onClick={() => onOpen(null, 'add')}>Add Staff</Button></EmptyStatePanel>
          : viewMode === 'table' ? (
            <AdminDataTable columns={['Name', 'Role', 'Bio', 'Visible', 'Order', 'Actions']}>
              {staff.map((item, index) => (
                <Tr key={item.id} onClick={() => onOpen(item, 'view')} _hover={{ bg: 'gray.50' }} cursor="pointer">
                  <Td>{item.full_name}</Td>
                  <Td>{item.role_title ?? '—'}</Td>
                  <Td>{item.bio ?? '—'}</Td>
                  <Td><Switch isChecked={item.is_visible} onChange={() => void onToggleVisibility(item)} aria-label={`Toggle ${item.full_name} visibility`} /></Td>
                  <Td><ReorderButtons itemNoun="staff" onMoveUp={() => void onMove(item, 'up')} onMoveDown={() => void onMove(item, 'down')} isFirst={index === 0} isLast={index === staff.length - 1} /></Td>
                  <Td><EditDeleteActions itemNoun="staff" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} /></Td>
                </Tr>
              ))}
            </AdminDataTable>
          ) : (
            <AdminCardGrid>
              {staff.map((item) => (
                <AdminItemCard key={item.id} onClick={() => onOpen(item, 'view')}>
                  <Text fontWeight="bold" fontSize="lg">{item.full_name}</Text>
                  <Text color="gray.500">{item.role_title ?? '—'}</Text>
                  <Text mt={3}>{item.bio ?? '—'}</Text>
                  <Divider my={3} />
                  <EditDeleteActions itemNoun="staff" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} />
                </AdminItemCard>
              ))}
            </AdminCardGrid>
          )}
    </Stack>
  )
}
