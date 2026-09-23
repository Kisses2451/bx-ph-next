import { SimpleGrid, Stack } from '@chakra-ui/react'
import { FormTextareaField } from '../../../../molecules/FormTextareaField'
import { FormTextField } from '../../../../molecules/FormTextField'
import { ImageUploadField } from '../../../../molecules/ImageUploadField'
import { VisibleOnWebsiteToggle } from '../../../../molecules/VisibleOnWebsiteToggle'
import { readValue } from '../../../../../lib/admin/adminEntries'
import type { EntryFieldsProps, EntryImageFieldProps } from './entryFieldTypes'

/** Add/edit form fields for a latest update: title, tag, publish date, visibility, order, detail and image. */
export function LatestUpdateEntryFields({ draft, errors, updateField, setDraftValue, imageValue, isImageUploading, onImageFileChange }: EntryFieldsProps & EntryImageFieldProps) {
  return (
    <Stack spacing={4}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormTextField label="Title" maxLength={120} gridColumn={{ base: 'auto', md: '1 / -1' }} value={readValue(draft, 'title')} onChange={(value) => updateField('title', value)} error={errors.title} />
        <FormTextField label="Tag" maxLength={40} value={readValue(draft, 'tag')} onChange={(value) => updateField('tag', value)} error={errors.tag} />
        <FormTextField label="Published at" type="datetime-local" value={readValue(draft, 'published_at')} onChange={(value) => updateField('published_at', value)} error={errors.published_at} />
        <VisibleOnWebsiteToggle isChecked={Boolean(draft.is_visible ?? true)} onChange={(checked) => setDraftValue('is_visible', checked)} />
        <FormTextField label="Sort order" type="number" value={readValue(draft, 'sort_order')} onChange={(value) => updateField('sort_order', value)} error={errors.sort_order} />
      </SimpleGrid>
      <FormTextareaField label="Detail" maxLength={400} value={readValue(draft, 'detail')} onChange={(value) => updateField('detail', value)} error={errors.detail} />
      <ImageUploadField label="Image upload" value={imageValue} onChange={(value) => updateField('imageUrl', value)} allowUpload isUploading={isImageUploading} error={errors.image} onFileChange={onImageFileChange} entityType="latestUpdate" />
    </Stack>
  )
}
