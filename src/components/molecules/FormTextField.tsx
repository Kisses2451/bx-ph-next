import { FormControl, FormErrorMessage, FormLabel, Input, type GridItemProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface FormTextFieldProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  /** Validation message. When set, the field turns red and shows it below the input. */
  error?: string
  type?: 'text' | 'email' | 'date' | 'datetime-local' | 'number'
  maxLength?: number
  min?: number
  max?: number
  /** id of a <datalist> with suggestions (pass the <datalist> as `children`). */
  list?: string
  isRequired?: boolean
  /** Lets the field span the full width of a SimpleGrid, e.g. { base: 'auto', md: '1 / -1' }. */
  gridColumn?: GridItemProps['gridColumn']
  /** Rendered right after the input: a <CharacterCount>, a <datalist>, a hint… */
  children?: ReactNode
}

/** Labelled single-line input with an error message underneath. Used by all admin entry forms. */
export function FormTextField({ label, value, onChange, error, type, maxLength, min, max, list, isRequired, gridColumn, children }: FormTextFieldProps) {
  return (
    <FormControl isInvalid={Boolean(error)} isRequired={isRequired} gridColumn={gridColumn}>
      <FormLabel>{label}</FormLabel>
      <Input type={type} maxLength={maxLength} min={min} max={max} list={list} value={value} onChange={(event) => onChange(event.target.value)} />
      {children}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
