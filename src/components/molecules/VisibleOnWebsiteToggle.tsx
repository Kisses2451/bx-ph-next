import { FormControl, FormLabel, Switch } from '@chakra-ui/react'

interface VisibleOnWebsiteToggleProps {
  isChecked: boolean
  onChange: (isChecked: boolean) => void
  /** "inline" = switch then label, aligned with the inputs in a grid row. "spread" = label left, switch right, full width. */
  layout?: 'inline' | 'spread'
}

/** "Visible on website" switch used in admin forms to hide an item from the public site without deleting it. */
export function VisibleOnWebsiteToggle({ isChecked, onChange, layout = 'inline' }: VisibleOnWebsiteToggleProps) {
  if (layout === 'spread') {
    return (
      <FormControl display="flex" alignItems="center" justifyContent="space-between">
        <FormLabel mb={0}>Visible on website</FormLabel>
        <Switch isChecked={isChecked} onChange={(event) => onChange(event.target.checked)} />
      </FormControl>
    )
  }
  return (
    <FormControl display="flex" alignItems="center" gap={3} pt={8}>
      <Switch isChecked={isChecked} onChange={(event) => onChange(event.target.checked)} />
      <FormLabel mb={0}>Visible on website</FormLabel>
    </FormControl>
  )
}
