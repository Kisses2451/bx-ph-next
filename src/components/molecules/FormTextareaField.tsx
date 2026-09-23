import { FormControl, FormErrorMessage, FormLabel, Textarea } from '@chakra-ui/react'
import { CharacterCount } from '../atoms/CharacterCount'

interface FormTextareaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  /** Hard limit; typing stops here and a "12/400" counter is shown. */
  maxLength: number
  /** Validation message. When set, the field turns red and shows it below the counter. */
  error?: string
  isRequired?: boolean
  /** Counter style, see <CharacterCount>. */
  counterTone?: 'default' | 'subtle'
  subtleColor?: string
}

/** Labelled multi-line text box with a character counter and error message. Used by admin entry forms. */
export function FormTextareaField({ label, value, onChange, maxLength, error, isRequired, counterTone, subtleColor }: FormTextareaFieldProps) {
  return (
    <FormControl isInvalid={Boolean(error)} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Textarea maxLength={maxLength} value={value} onChange={(event) => onChange(event.target.value)} />
      <CharacterCount value={value} max={maxLength} tone={counterTone} subtleColor={subtleColor} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
