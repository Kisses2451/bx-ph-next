import { HStack } from '@chakra-ui/react'
import { ActionIconButton, DeleteActionIcon, EditActionIcon } from '../atoms/ActionIconButton'

interface EditDeleteActionsProps {
  /** What the row is, used in the button labels: "game" → "Edit game" / "Delete game". */
  itemNoun: string
  onEdit: () => void
  onDelete: () => void
}

/** Edit + delete icon buttons for an admin table row or card. Clicks don't open the row. */
export function EditDeleteActions({ itemNoun, onEdit, onDelete }: EditDeleteActionsProps) {
  return (
    <HStack onClick={(event) => event.stopPropagation()}>
      <ActionIconButton label={`Edit ${itemNoun}`} icon={<EditActionIcon />} onClick={onEdit} />
      <ActionIconButton label={`Delete ${itemNoun}`} icon={<DeleteActionIcon />} onClick={onDelete} />
    </HStack>
  )
}
