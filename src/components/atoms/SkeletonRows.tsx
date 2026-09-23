import { Box, Stack } from '@chakra-ui/react'

interface SkeletonRowsProps {
  /** How many placeholder rows to draw. */
  count?: number
  /** Height of each row, e.g. "56px". */
  rowHeight?: string
  /** Background of each row (colour-mode aware value from the parent). */
  bg: string
}

/** Grey placeholder bars shown while a list or table is loading. */
export function SkeletonRows({ count = 3, rowHeight = '56px', bg }: SkeletonRowsProps) {
  return <Stack spacing={3}>{Array.from({ length: count }, (_, index) => <Box key={index} h={rowHeight} bg={bg} borderRadius="md" />)}</Stack>
}
