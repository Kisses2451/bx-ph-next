import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { IconButton, Tooltip } from '@chakra-ui/react'
import type { ReactElement } from 'react'

interface ActionIconButtonProps {
  label: string
  icon?: ReactElement
  colorScheme?: 'green' | 'red' | 'gray' | 'brand'
  variant?: 'solid' | 'outline' | 'ghost'
  isDisabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

/** Small icon-only button with a tooltip, used for row actions (edit, approve, delete…). Clicks don't bubble to the row. */
export function ActionIconButton({ label, icon, colorScheme = 'gray', variant = 'ghost', isDisabled = false, onClick }: ActionIconButtonProps) {
  const resolvedIcon = icon ?? <EditIcon />

  return (
    <Tooltip label={label} aria-label={label}>
      <IconButton
        size="sm"
        aria-label={label}
        colorScheme={colorScheme}
        variant={variant}
        isDisabled={isDisabled}
        icon={resolvedIcon}
        onClick={(event) => {
          event.stopPropagation()
          onClick?.(event)
        }}
      />
    </Tooltip>
  )
}

export function ApproveActionIcon() {
  return <CheckIcon />
}

export function RejectActionIcon() {
  return <CloseIcon />
}

export function DeleteActionIcon() {
  return <DeleteIcon />
}

export function EditActionIcon() {
  return <EditIcon />
}
