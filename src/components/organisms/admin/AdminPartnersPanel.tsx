import { Badge, Button, Divider, Link, Stack, Switch, Td, Text, Tr } from '@chakra-ui/react'
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
import type { SupabasePartner } from '../../../types/player'

interface AdminPartnersPanelProps extends AdminPanelBaseProps {
  partners: SupabasePartner[]
  isLoading: boolean
  error: unknown
  onRetry: () => void
  onToggleVisibility: (item: SupabasePartner) => void
  onMove: (item: SupabasePartner, direction: 'up' | 'down') => void
}

/** Admin "Partners" tab: partner logos for the Partners page, with visibility and order controls. */
export function AdminPartnersPanel({ partners, isLoading, error, onRetry, viewMode, onViewModeChange, onOpen, onDelete, onToggleVisibility, onMove }: AdminPartnersPanelProps) {
  const skeletonBg = 'var(--surface-2)'
  const errorMessage = error instanceof Error && error.message === 'Supabase is not configured' ? 'Supabase is not configured.' : 'Partners are unavailable right now.'

  return (
    <Stack spacing={6}>
      <AdminPanelToolbar title="Partners" description="Visitors only see the logo. Name and category are for internal use and accessibility." addLabel="Add Partner" onAdd={() => onOpen(null, 'add')} viewMode={viewMode} onViewModeChange={onViewModeChange} />
      {isLoading ? <SkeletonRows bg={skeletonBg} />
        : error ? <EmptyStatePanel tone="error" message={errorMessage}><Button mt={3} onClick={onRetry}>Retry</Button></EmptyStatePanel>
          : partners.length === 0 ? <EmptyStatePanel message="No partners yet"><Button mt={3} className="btn-primary" onClick={() => onOpen(null, 'add')}>Add Partner</Button></EmptyStatePanel>
            : viewMode === 'table' ? (
              <AdminDataTable columns={['Logo', 'Name', 'Category', 'Website', 'Visible', 'Order', 'Actions']}>
                {partners.map((item, index) => (
                  <Tr key={item.id} onClick={() => onOpen(item, 'view')} _hover={{ bg: 'gray.50' }} cursor="pointer">
                    <Td><LogoThumbnail src={item.logo_url} name={item.name} />{!item.logo_url ? <Badge mt={1} colorScheme="orange">No logo</Badge> : null}{item.logo_url && !/\/partners\/[^/]+\.(webp|png)(?:\?|$)/i.test(item.logo_url) ? <Text fontSize="xs" color="gray.500">Re-upload to make square</Text> : null}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.category}</Td>
                    <Td>{item.website_url ? <Link href={item.website_url} isExternal rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>{item.website_url}</Link> : '—'}</Td>
                    <Td><Switch isChecked={item.is_visible} onChange={() => void onToggleVisibility(item)} aria-label={`Toggle ${item.name} visibility`} /></Td>
                    <Td><ReorderButtons itemNoun="partner" onMoveUp={() => void onMove(item, 'up')} onMoveDown={() => void onMove(item, 'down')} isFirst={index === 0} isLast={index === partners.length - 1} /></Td>
                    <Td><EditDeleteActions itemNoun="partner" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} /></Td>
                  </Tr>
                ))}
              </AdminDataTable>
            ) : (
              <AdminCardGrid>
                {partners.map((item) => (
                  <AdminItemCard key={item.id} onClick={() => onOpen(item, 'view')}>
                    <LogoThumbnail src={item.logo_url} name={item.name} />
                    {!item.logo_url ? <Badge mt={1} colorScheme="orange">No logo</Badge> : null}
                    <Text fontWeight="bold" fontSize="lg">{item.name}</Text>
                    <Text color="gray.500">{item.category}</Text>
                    <VisibilityBadge isVisible={item.is_visible} mt={2} />
                    <Text mt={3}>{item.description}</Text>
                    {item.website_url ? <Link mt={2} fontSize="sm" color="brand.500" href={item.website_url} isExternal rel="noopener noreferrer">{item.website_url}</Link> : <Text mt={2} fontSize="sm">No website</Text>}
                    <Divider my={3} />
                    <EditDeleteActions itemNoun="partner" onEdit={() => onOpen(item, 'edit')} onDelete={() => onDelete(item.id)} />
                  </AdminItemCard>
                ))}
              </AdminCardGrid>
            )}
    </Stack>
  )
}
