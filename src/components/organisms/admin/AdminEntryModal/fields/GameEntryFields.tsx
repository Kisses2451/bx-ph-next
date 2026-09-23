import { SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { FormTextareaField } from '../../../../molecules/FormTextareaField'
import { FormTextField } from '../../../../molecules/FormTextField'
import { GameLogoDropzoneField } from '../../../../molecules/GameLogoDropzoneField'
import { VisibleOnWebsiteToggle } from '../../../../molecules/VisibleOnWebsiteToggle'
import { readValue } from '../../../../../lib/admin/adminEntries'
import type { EntryFieldsProps } from './entryFieldTypes'

interface GameEntryFieldsProps extends EntryFieldsProps {
  /** Current logo URL to preview. */
  imageValue: string
  /** New logo picked in this form (uploaded on save). */
  gameLogoFile: File | null
  /** Size/warning of the converted logo after saving. */
  gameLogoInfo: { size: number; warning?: string } | null
  onGameLogoChange: (file: File | null) => void
  onGameLogoRemove: () => void
}

/** Add/edit form fields for a game: logo, name, genre (with suggestions), visibility and description. */
export function GameEntryFields({ draft, errors, updateField, setDraftValue, mutedColor, imageValue, gameLogoFile, gameLogoInfo, onGameLogoChange, onGameLogoRemove }: GameEntryFieldsProps) {
  return (
    <Stack spacing={4}>
      <GameLogoDropzoneField value={readValue(draft, 'image_url') || imageValue} file={gameLogoFile} error={errors.image} onChange={onGameLogoChange} onRemove={onGameLogoRemove} />
      <Text fontSize="sm" color={mutedColor}>Any size is accepted. We convert it to a square 800x800 image automatically.</Text>
      {gameLogoInfo ? <Text fontSize="sm" color={mutedColor}>Converted: 800x800, {(gameLogoInfo.size / 1024).toFixed(1)} KB{gameLogoInfo.warning ? ` - ${gameLogoInfo.warning}` : ''}</Text> : null}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormTextField label="Game name" maxLength={60} gridColumn={{ base: 'auto', md: '1 / -1' }} value={readValue(draft, 'title')} onChange={(value) => updateField('title', value)} error={errors.title} />
        <FormTextField label="Genre" maxLength={40} list="game-genre-suggestions" value={readValue(draft, 'tag') || readValue(draft, 'genre')} onChange={(value) => updateField('tag', value)} error={errors.tag}>
          <datalist id="game-genre-suggestions"><option value="FPS" /><option value="MOBA" /><option value="Battle Royale" /><option value="MMORPG" /><option value="Sports" /><option value="Strategy" /><option value="Fighting" /><option value="Racing" /></datalist>
        </FormTextField>
        <VisibleOnWebsiteToggle isChecked={Boolean(draft.is_visible ?? true)} onChange={(checked) => setDraftValue('is_visible', checked)} />
      </SimpleGrid>
      <FormTextareaField label="Information shown when visitors click the logo" maxLength={400} value={readValue(draft, 'description')} onChange={(value) => updateField('description', value)} error={errors.description} />
    </Stack>
  )
}
