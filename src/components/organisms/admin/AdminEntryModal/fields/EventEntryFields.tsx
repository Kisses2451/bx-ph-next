import { SimpleGrid, Stack } from '@chakra-ui/react'
import { FormTextareaField } from '../../../../molecules/FormTextareaField'
import { FormTextField } from '../../../../molecules/FormTextField'
import { ImageUploadField } from '../../../../molecules/ImageUploadField'
import { VisibleOnWebsiteToggle } from '../../../../molecules/VisibleOnWebsiteToggle'
import { readValue } from '../../../../../lib/admin/adminEntries'
import type { EntryFieldsProps, EntryImageFieldProps } from './entryFieldTypes'

/** Add/edit form fields for an event: title, date, location, visibility, order, description and image. */
export function EventEntryFields({ draft, errors, updateField, setDraftValue, imageValue, isImageUploading, onImageFileChange }: EntryFieldsProps & EntryImageFieldProps) {
  return (
    <Stack spacing={4}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormTextField label="Title" gridColumn={{ base: 'auto', md: '1 / -1' }} value={readValue(draft, 'title')} onChange={(value) => updateField('title', value)} error={errors.title} />
        <FormTextField label="Date" type="date" value={readValue(draft, 'date')} onChange={(value) => updateField('date', value)} error={errors.date} />
        <FormTextField label="Location" maxLength={120} value={readValue(draft, 'location')} onChange={(value) => updateField('location', value)} error={errors.location} />
        <VisibleOnWebsiteToggle isChecked={Boolean(draft.is_visible ?? true)} onChange={(checked) => setDraftValue('is_visible', checked)} />
        <FormTextField label="Sort order" type="number" value={readValue(draft, 'sort_order')} onChange={(value) => updateField('sort_order', value)} error={errors.sort_order} />
      </SimpleGrid>
      <FormTextareaField label="Description" maxLength={400} value={readValue(draft, 'description')} onChange={(value) => updateField('description', value)} error={errors.description} />
      <ImageUploadField label="Image upload" value={imageValue} onChange={(value) => updateField('imageUrl', value)} allowUpload isUploading={isImageUploading} error={errors.image} onFileChange={onImageFileChange} entityType="event" />
    </Stack>
  )
}
