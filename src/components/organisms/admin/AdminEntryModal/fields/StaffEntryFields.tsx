import { SimpleGrid, Stack } from '@chakra-ui/react'
import { FormTextareaField } from '../../../../molecules/FormTextareaField'
import { FormTextField } from '../../../../molecules/FormTextField'
import { ImageUploadField } from '../../../../molecules/ImageUploadField'
import { VisibleOnWebsiteToggle } from '../../../../molecules/VisibleOnWebsiteToggle'
import { readValue } from '../../../../../lib/admin/adminEntries'
import type { EntryFieldsProps, EntryImageFieldProps } from './entryFieldTypes'

/** Add/edit form fields for a staff member: name, role, visibility, order, bio and photo. */
export function StaffEntryFields({ draft, errors, updateField, setDraftValue, imageValue, isImageUploading, onImageFileChange }: EntryFieldsProps & EntryImageFieldProps) {
  return (
    <Stack spacing={4}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormTextField label="Name" maxLength={120} value={readValue(draft, 'name')} onChange={(value) => updateField('name', value)} error={errors.name} />
        <FormTextField label="Role" maxLength={80} value={readValue(draft, 'role')} onChange={(value) => updateField('role', value)} error={errors.role} />
        <VisibleOnWebsiteToggle isChecked={Boolean(draft.is_visible ?? true)} onChange={(checked) => setDraftValue('is_visible', checked)} />
        <FormTextField label="Sort order" type="number" value={readValue(draft, 'sort_order')} onChange={(value) => updateField('sort_order', value)} error={errors.sort_order} />
      </SimpleGrid>
      <FormTextareaField label="Bio" maxLength={400} value={readValue(draft, 'bio')} onChange={(value) => updateField('bio', value)} error={errors.bio} />
      <ImageUploadField label="Image upload" value={imageValue} onChange={(value) => updateField('imageUrl', value)} allowUpload isUploading={isImageUploading} error={errors.image} onFileChange={onImageFileChange} entityType="staff" />
    </Stack>
  )
}
