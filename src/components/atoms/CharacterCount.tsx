import { Text } from '@chakra-ui/react'

interface CharacterCountProps {
  /** Current text; its length is shown. */
  value: string
  /** Maximum allowed characters, shown after the slash. */
  max: number
  /** "default" = small grey text; "subtle" = extra-small muted text (used by compact fields). */
  tone?: 'default' | 'subtle'
  /** Muted colour for the "subtle" tone (colour-mode aware value from the parent). */
  subtleColor?: string
}

/** Right-aligned "12/400" counter shown under text inputs that have a length limit. */
export function CharacterCount({ value, max, tone = 'default', subtleColor }: CharacterCountProps) {
  if (tone === 'subtle') return <Text fontSize="xs" color={subtleColor} textAlign="right">{value.length}/{max}</Text>
  return <Text fontSize="sm" color="gray.500" textAlign="right">{value.length}/{max}</Text>
}
