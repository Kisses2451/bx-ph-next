'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, type StorageManager } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { theme } from '../../theme'
import { ConfirmDialogProvider } from './ConfirmDialogProvider'

/** The site is dark-only: always report "dark" to Chakra and never store a choice. */
const darkOnly: StorageManager = { type: 'localStorage', ssr: false, get: () => 'dark', set: () => undefined }

/**
 * Chakra UI and the confirm dialog, for the admin dashboard only (mounted by app/admin/layout.tsx).
 * Keeping Chakra out of the public pages means visitors never download it.
 */
export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme} colorModeManager={darkOnly}>
        <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
