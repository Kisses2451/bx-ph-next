import { SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { FormTextareaField } from '../../../../molecules/FormTextareaField'
import { FormTextField } from '../../../../molecules/FormTextField'
import { ImageUploadField } from '../../../../molecules/ImageUploadField'
import { VisibleOnWebsiteToggle } from '../../../../molecules/VisibleOnWebsiteToggle'
import { readValue } from '../../../../../lib/admin/adminEntries'
import type { EntryFieldsProps, EntryImageFieldProps } from './entryFieldTypes'

interface PartnerEntryFieldsProps extends EntryFieldsProps, EntryImageFieldProps {
  /** Size/warning of the logo after it was converted to a square. */
  partnerLogoInfo: { size: number; warning?: string } | null
}

/** Add/edit form fields for a partner: name, category, website, description, logo and visibility. */
export function PartnerEntryFields({ draft, errors, updateField, setDraftValue, mutedColor, imageValue, isImageUploading, onImageFileChange, partnerLogoInfo }: PartnerEntryFieldsProps) {
  return (
    <Stack spacing={4}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormTextField label="Name" maxLength={120} value={readValue(draft, 'name')} onChange={(value) => updateField('name', value)} error={errors.name} />
        <FormTextField label="Category" maxLength={40} list="partner-category-suggestions" value={readValue(draft, 'category')} onChange={(value) => updateField('category', value)} error={errors.category}>
          <datalist id="partner-category-suggestions"><option value="Sponsor" /><option value="Community Partner" /><option value="Media Partner" /><option value="Tournament Partner" /></datalist>
        </FormTextField>
      </SimpleGrid>
      <FormTextField label="Website" maxLength={300} value={readValue(draft, 'website')} onChange={(value) => updateField('website', value)} error={errors.website} />
      <FormTextareaField label="Description" maxLength={400} value={readValue(draft, 'description')} onChange={(value) => updateField('description', value)} error={errors.description} />
      <ImageUploadField label="Image upload" value={imageValue} onChange={(value) => updateField('imageUrl', value)} allowUpload isUploading={isImageUploading} error={errors.logo || errors.image} onFileChange={onImageFileChange} entityType="partner" maxSizeMB={10} />
      <Text fontSize="sm" color={mutedColor}>Any size is accepted. We convert it to a square 800x800 image automatically.</Text>
      {partnerLogoInfo ? <Text fontSize="sm" color={mutedColor}>Converted: 800x800, {(partnerLogoInfo.size / 1024).toFixed(1)} KB{partnerLogoInfo.warning ? ` - ${partnerLogoInfo.warning}` : ''}</Text> : null}
      <VisibleOnWebsiteToggle layout="spread" isChecked={Boolean(draft.is_visible ?? true)} onChange={(checked) => setDraftValue('is_visible', checked)} />
    </Stack>
  )
}
