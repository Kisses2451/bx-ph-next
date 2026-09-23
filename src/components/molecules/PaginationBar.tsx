import { Button, Flex, HStack, Text } from '@chakra-ui/react'

interface PaginationBarProps {
  /** Current page, starting at 1. */
  page: number
  pageSize: number
  totalItems: number
  /** Plural noun shown after the total, e.g. "players". */
  itemLabel: string
  onPrevious: () => void
  onNext: () => void
}

/** "Page 2 of 5 · 120 players" text with Previous / Next buttons. */
export function PaginationBar({ page, pageSize, totalItems, itemLabel, onPrevious, onNext }: PaginationBarProps) {
  const pageCount = Math.ceil(totalItems / pageSize)
  return (
    <Flex justify="space-between" align="center" mt={4}>
      <Text fontSize="sm">Page {page} of {Math.max(1, pageCount)} · {totalItems} {itemLabel}</Text>
      <HStack>
        <Button size="sm" onClick={onPrevious} isDisabled={page === 1}>Previous</Button>
        <Button size="sm" onClick={onNext} isDisabled={page >= pageCount}>Next</Button>
      </HStack>
    </Flex>
  )
}
