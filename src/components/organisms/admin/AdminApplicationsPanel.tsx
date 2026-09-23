import { Button, Divider, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { DeleteActionIcon, RejectActionIcon } from '../../atoms/ActionIconButton'
import { AdminCardGrid } from '../../molecules/AdminCardGrid'
import { AdminItemCard } from '../../molecules/AdminItemCard'
import { EmptyStatePanel } from '../../molecules/EmptyStatePanel'
import { SkeletonRows } from '../../atoms/SkeletonRows'
import { useConfirm } from '../../providers/ConfirmDialogProvider'
import type { AdminApplication } from '../../../hooks/admin/useAdminApplications'

/**
 * Admin "Applications" tab: the review queue of pending players submitted through the Join form, with Approve,
 * Reject and Delete, plus a tool that deletes photos no player record uses any more.
 */
export function AdminApplicationsPanel({ applications, photoUrls, isLoading, onApprove, onReject, onDelete, onReload, onCleanUpPhotos, isCleaningPhotos }: { applications: AdminApplication[]; photoUrls: Record<string, string>; isLoading: boolean; onApprove: (item: AdminApplication) => void; onReject: (item: AdminApplication) => void; onDelete: (item: AdminApplication) => void; onReload: () => void; onCleanUpPhotos: () => void; isCleaningPhotos: boolean }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const confirm = useConfirm()
  const confirmAction = async (item: AdminApplication, action: 'approve' | 'reject' | 'delete') => {
    const fullName = `${item.first_name} ${item.last_name}`
    const accepted = await confirm({ title: action === 'delete' ? 'Delete this application?' : `${action === 'approve' ? 'Approve' : 'Reject'} ${fullName}?`, message: action === 'approve' ? 'They move to the Players tab as an approved player.' : action === 'reject' ? 'They stay in the Players tab with a rejected status.' : 'This cannot be undone.', confirmLabel: action[0].toUpperCase() + action.slice(1), cancelLabel: 'Cancel', tone: action === 'approve' ? 'default' : 'danger' })
    if (!accepted) return
    if (action === 'approve') onApprove(item)
    else if (action === 'reject') onReject(item)
    else onDelete(item)
  }
  return (
    <Stack spacing={6}>
      <Heading as="h2" size="md">Applications</Heading>
      {isLoading ? <SkeletonRows count={4} bg="var(--surface-2)" /> : applications.length === 0 ? <EmptyStatePanel message="No applications in the queue." /> : <AdminCardGrid>
        {applications.map((item) => {
          const fullName = `${item.first_name} ${item.last_name}`
          const isExpanded = expandedId === item.id
          return <AdminItemCard key={item.id} onClick={() => setExpandedId(isExpanded ? null : item.id)}>
            <Flex align="center" gap={4}>
              {item.photo_path && photoUrls[item.photo_path] ? <Image src={photoUrls[item.photo_path]} alt={`${fullName} photo`} boxSize="72px" objectFit="cover" /> : null}
              <Stack spacing={1}>
                <Text fontWeight="bold" fontSize="lg">{fullName}</Text>
                <Text color="var(--text-muted)">{item.main_game} · {item.department ?? 'Clan'} · {item.status ?? 'pending'}</Text>
                <Text fontSize="sm" color="var(--text-muted)">{item.email}</Text>
              </Stack>
            </Flex>
            {isExpanded ? <Stack spacing={1} mt={4} color="var(--text-muted)" fontSize="sm"><Text>IGN: {item.in_game_name || '—'}</Text><Text>UID: {item.uid || '—'}</Text><Text>Player ID: {item.player_id || '—'}</Text><Text>Contact: {item.contact_number || '—'}</Text><Text>Submitted: {new Date(item.created_at).toLocaleString()}</Text></Stack> : null}
            <Divider my={4} />
            <Flex gap={2} wrap="wrap">
              <Button size="sm" variant="outline" onClick={() => setExpandedId(isExpanded ? null : item.id)}>{isExpanded ? 'Hide details' : 'View'}</Button>
              {item.status !== 'approved' && item.status !== 'rejected' ? <Button size="sm" colorScheme="brand" onClick={() => void confirmAction(item, 'approve')}>Approve</Button> : null}
              {item.status !== 'rejected' ? <Button size="sm" variant="outline" leftIcon={<RejectActionIcon />} onClick={() => void confirmAction(item, 'reject')}>Reject</Button> : null}
              <Button size="sm" variant="ghost" leftIcon={<DeleteActionIcon />} onClick={() => void confirmAction(item, 'delete')}>Delete</Button>
            </Flex>
          </AdminItemCard>
        })}
      </AdminCardGrid>}
      {!isLoading ? <Button alignSelf="flex-start" variant="link" colorScheme="brand" onClick={onReload}>Refresh applications</Button> : null}
      <Divider />
      <Stack spacing={2} align="flex-start">
        <Text fontWeight="bold">Unused photos</Text>
        <Text fontSize="sm" color="var(--text-muted)">Deletes application photos that no player record uses (for example from applications that failed to save), older than one day.</Text>
        <Button size="sm" variant="outline" isLoading={isCleaningPhotos} onClick={async () => { if (await confirm({ title: 'Delete unused photos?', message: 'Photos not linked to any player and older than one day will be deleted. This cannot be undone.', confirmLabel: 'Delete unused photos', cancelLabel: 'Cancel', tone: 'danger' })) onCleanUpPhotos() }}>Clean up unused photos</Button>
      </Stack>
    </Stack>
  )
}