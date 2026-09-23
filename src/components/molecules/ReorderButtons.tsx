import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { HStack } from '@chakra-ui/react'
import { ActionIconButton } from '../atoms/ActionIconButton'

interface ReorderButtonsProps {
  /** Used in the labels: "game" → "Move game up". */
  itemNoun: string
  onMoveUp: () => void
  onMoveDown: () => void
  /** Disables "up" on the first row. */
  isFirst: boolean
  /** Disables "down" on the last row. */
  isLast: boolean
}

/** Up/down arrow buttons that change an item's display order on the website. */
export function ReorderButtons({ itemNoun, onMoveUp, onMoveDown, isFirst, isLast }: ReorderButtonsProps) {
  return (
    <HStack>
      <ActionIconButton label={`Move ${itemNoun} up`} icon={<ChevronUpIcon />} onClick={onMoveUp} isDisabled={isFirst} />
      <ActionIconButton label={`Move ${itemNoun} down`} icon={<ChevronDownIcon />} onClick={onMoveDown} isDisabled={isLast} />
    </HStack>
  )
}
