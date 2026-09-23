import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import { TableCardViewToggle, type TableCardViewMode } from './TableCardViewToggle'

interface AdminPanelToolbarProps {
  /** Tab heading, e.g. "Games". */
  title: string
  /** Optional muted line under the heading. */
  description?: string
  /** Button text, e.g. "Add Game". */
  addLabel: string
  onAdd: () => void
  /** Current table/card view. Leave out for tabs without a view switch (a plain Add button is shown). */
  viewMode?: TableCardViewMode
  onViewModeChange?: (next: TableCardViewMode) => void
}

/** Header row of an admin tab: title on the left; table/card switch and "Add …" button on the right. */
export function AdminPanelToolbar({ title, description, addLabel, onAdd, viewMode, onViewModeChange }: AdminPanelToolbarProps) {
  const muted = 'var(--text-muted)'
  const heading = <Heading as="h3" size="md">{title}</Heading>
  return (
    <Flex justify="space-between" align="center" gap={3} direction={{ base: 'column', md: 'row' }}>
      {description ? <Box>{heading}<Text fontSize="sm" color={muted}>{description}</Text></Box> : heading}
      {viewMode && onViewModeChange ? (
        <HStack>
          <TableCardViewToggle value={viewMode} onChange={onViewModeChange} />
          <Button leftIcon={<AddIcon />} className="btn-primary" colorScheme="brand" onClick={onAdd}>{addLabel}</Button>
        </HStack>
      ) : <Button className="btn-primary" onClick={onAdd}>{addLabel}</Button>}
    </Flex>
  )
}
