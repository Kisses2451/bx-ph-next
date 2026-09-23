import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react'

interface EditorialSectionHeaderProps {
  number?: string
  label?: string
  subLabel: string
  headingPartOne: string
  headingPartTwo: string
  intro: string
  centered?: boolean
  showUnderline?: boolean
  headingLevel?: 'h1' | 'h2' | 'h3'
}

/**
 * Big two-line uppercase section heading with a small eyebrow label above it and an optional
 * intro paragraph below. The second heading line is shown in the brand accent colour.
 */
export function EditorialSectionHeader({
  number,
  label,
  subLabel,
  headingPartOne,
  headingPartTwo,
  intro,
  centered = false,
  showUnderline = false,
  headingLevel = 'h1',
}: EditorialSectionHeaderProps) {
  const eyebrowColor = useColorModeValue('var(--maroon-text)', 'var(--maroon-text)')
  const subLabelColor = useColorModeValue('var(--text-muted)', 'var(--text-muted)')
  const introColor = useColorModeValue('var(--text-muted)', 'var(--text-muted)')
  const accentColor = useColorModeValue('brand.700', 'brand.200')

  return (
    <Box w="100%" textAlign={centered ? 'center' : 'left'}>
      <Text
        fontSize="xs"
        letterSpacing="0.36em"
        textTransform="uppercase"
        color={eyebrowColor}
        fontWeight="bold"
        fontFamily="var(--font-sans)"
        mb={3}
      >
        {number && label ? `${number} / ${label}` : subLabel}
      </Text>

      {number && label ? <Text fontSize="xs" letterSpacing="0.28em" textTransform="uppercase" color={subLabelColor} fontWeight="600" fontFamily="var(--font-sans)" mb={4}>{subLabel}</Text> : null}

      <Heading
        as={headingLevel}
        fontSize={{ base: 'clamp(2.2rem, 5vw, 4.5rem)', md: 'clamp(2.8rem, 4vw, 5.5rem)' }}
        lineHeight="0.95"
        textTransform="uppercase"
        letterSpacing="0.02em"
        fontWeight="700"
        mb={4}
      >
        <Box as="span" display="block">{headingPartOne}</Box>
        <Box as="span" display="block" color={accentColor}>{headingPartTwo}</Box>
      </Heading>

      {centered || showUnderline ? <Box aria-hidden="true" w="48px" h="3px" bg="brand.500" mx={centered ? 'auto' : 0} mb={5} /> : null}

      <Text
        maxW="60ch"
        color={introColor}
        fontSize={{ base: 'md', md: 'lg' }}
        lineHeight="1.7"
        fontFamily="var(--font-sans)"
        m={0}
        mx={centered ? 'auto' : 0}
      >
        {intro}
      </Text>
    </Box>
  )
}
