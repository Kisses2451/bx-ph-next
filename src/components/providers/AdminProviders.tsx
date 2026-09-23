'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { theme } from '../../theme'
import { ConfirmDialogProvider } from './ConfirmDialogProvider'

/**
 * Chakra UI and the confirm dialog, for the admin dashboard only (mounted by app/admin/layout.tsx).
 * Keeping Chakra out of the public pages means visitors never download it.
 */
export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
