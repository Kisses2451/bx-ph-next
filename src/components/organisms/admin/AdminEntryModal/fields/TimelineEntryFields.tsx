import { FormControl, FormLabel, Select, SimpleGrid, Stack } from '@chakra-ui/react'
import { CharacterCount } from '../../../../atoms/CharacterCount'
import { FormTextareaField } from '../../../../molecules/FormTextareaField'
import { FormTextField } from '../../../../molecules/FormTextField'
import { VisibleOnWebsiteToggle } from '../../../../molecules/VisibleOnWebsiteToggle'
import { readValue } from '../../../../../lib/admin/adminEntries'
import type { EntryFieldsProps } from './entryFieldTypes'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Add/edit form fields for an About-page milestone: year, optional month, title, description and visibility. */
export function TimelineEntryFields({ draft, errors, updateField, setDraftValue, mutedColor }: EntryFieldsProps) {
  const isVisible = readValue(draft, 'is_visible') === true || readValue(draft, 'is_visible') === 'true'
  return (
    <Stack spacing={4}>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
        <FormTextField label="Year" type="number" min={1990} max={new Date().getFullYear() + 1} isRequired value={readValue(draft, 'year')} onChange={(value) => updateField('year', value)} error={errors.year} />
        <FormControl>
          <FormLabel>Month</FormLabel>
          <Select value={readValue(draft, 'month')} onChange={(e) => updateField('month', e.target.value)}>
            <option value="">None</option>
            {MONTHS.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
          </Select>
        </FormControl>
      </SimpleGrid>
      <FormTextField label="Title" maxLength={80} isRequired value={readValue(draft, 'title')} onChange={(value) => updateField('title', value)} error={errors.title}>
        <CharacterCount value={readValue(draft, 'title')} max={80} tone="subtle" subtleColor={mutedColor} />
      </FormTextField>
      <FormTextareaField label="Description" maxLength={300} value={readValue(draft, 'description')} onChange={(value) => updateField('description', value)} error={errors.description} counterTone="subtle" subtleColor={mutedColor} />
      <VisibleOnWebsiteToggle layout="spread" isChecked={isVisible} onChange={(checked) => setDraftValue('is_visible', checked)} />
    </Stack>
  )
}
