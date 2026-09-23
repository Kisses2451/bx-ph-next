import { WarningIcon } from '@chakra-ui/icons'
import { Box, Button, Portal, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

type ConfirmTone = 'danger' | 'default'

type ConfirmOptions = {
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  tone?: ConfirmTone
}

type ConfirmRequest = ConfirmOptions & { resolve: (confirmed: boolean) => void; opener: HTMLElement | null }

type ConfirmContextValue = { confirm: (options: ConfirmOptions) => Promise<boolean> }

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

/**
 * Provides `useConfirm()`: an async replacement for window.confirm() that shows a styled
 * dialog and resolves to true/false. Wrap the app in this once (see app/providers.tsx).
 *
 *   const confirm = useConfirm()
 *   if (await confirm({ title, message, confirmLabel: 'Delete', cancelLabel: 'Cancel', tone: 'danger' })) { … }
 */
export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ConfirmRequest | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const cancelRef = useRef<HTMLButtonElement | null>(null)
  const previousOverflowRef = useRef('')

  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setRequest({ ...options, tone: options.tone ?? 'default', resolve, opener: openerRef.current })
  }), [])

  const close = (confirmed: boolean) => {
    if (!request) return
    request.resolve(confirmed)
    const opener = request.opener
    setRequest(null)
    window.setTimeout(() => opener?.focus(), 0)
  }

  useEffect(() => {
    if (!request) return
    previousOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        close(false)
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.body.style.overflow = previousOverflowRef.current
    }
  }, [request])

  const border = useColorModeValue('rgba(55, 25, 28, 0.22)', 'rgba(255, 235, 215, 0.18)')
  const surface = useColorModeValue('#fffaf3', '#211719')
  const muted = useColorModeValue('rgba(55, 25, 28, 0.68)', 'rgba(255, 235, 215, 0.72)')

  return <ConfirmContext.Provider value={{ confirm }}>
    {children}
    {request && <Portal>
      <Box position="fixed" inset={0} zIndex={2000} display="flex" alignItems="center" justifyContent="center" p={{ base: 4, md: 6 }} bg="rgba(8, 5, 6, 0.72)" onMouseDown={(event) => { if (event.target === event.currentTarget) close(false) }}>
        <Box ref={panelRef} role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-message" w="full" maxW="430px" bg={surface} border="1px solid" borderColor={border} position="relative" boxShadow="0 20px 70px rgba(0,0,0,0.45)" sx={{ animation: 'confirm-dialog-in 150ms ease-out', '@media (prefers-reduced-motion: reduce)': { animation: 'none' }, '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px', bg: 'brand.500' }, '@keyframes confirm-dialog-in': { from: { opacity: 0, transform: 'scale(0.97)' }, to: { opacity: 1, transform: 'scale(1)' } } }} p={{ base: 5, md: 6 }}>
          <Stack spacing={5}>
            <Stack direction="row" spacing={3} align="flex-start">
              <Box color="accent.500" pt={1}><WarningIcon boxSize={5} /></Box>
              <Box>
                <Text id="confirm-dialog-title" fontFamily="heading" fontWeight="700" textTransform="uppercase" fontSize="lg">{request.title}</Text>
                <Text id="confirm-dialog-message" mt={2} color={muted} maxW="50ch">{request.message}</Text>
              </Box>
            </Stack>
            <Stack direction={{ base: 'column', sm: 'row' }} justify="flex-end" spacing={3}>
              <Button ref={cancelRef} variant="outline" onClick={() => close(false)} order={{ base: 2, sm: 1 }} _focusVisible={{ boxShadow: '0 0 0 3px var(--accent)' }}>{request.cancelLabel}</Button>
              <Button bg="brand.500" color="white" _hover={{ bg: 'brand.600' }} _focusVisible={{ boxShadow: '0 0 0 3px var(--accent)' }} onClick={() => close(true)} order={{ base: 1, sm: 2 }}>{request.confirmLabel}</Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Portal>}
  </ConfirmContext.Provider>
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) throw new Error('useConfirm must be used within ConfirmDialogProvider')
  return context.confirm
}
