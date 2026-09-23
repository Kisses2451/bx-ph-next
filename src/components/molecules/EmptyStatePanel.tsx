import { Box, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface EmptyStatePanelProps {
  /** The main line, e.g. "No games yet" or "Players are unavailable right now." */
  message: string
  /** "empty" = grey dashed box with bold text. "error" = red dashed box with red text. */
  tone?: 'empty' | 'error'
  /** Optional action under the message, e.g. an "Add game" or "Retry" button. */
  children?: ReactNode
}

/** Dashed placeholder box shown when an admin list has no items or failed to load. */
export function EmptyStatePanel({ message, tone = 'empty', children }: EmptyStatePanelProps) {
  return (
    <Box border="1px dashed" borderColor={tone === 'error' ? 'red.300' : 'gray.300'} borderRadius="xl" p={8} textAlign="center">
      {tone === 'error' ? <Text color="red.500">{message}</Text> : <Text fontWeight="bold">{message}</Text>}
      {children}
    </Box>
  )
}
