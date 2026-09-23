import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react'

interface NumberedInfoCardProps {
  number: string
  title: string
  description: string
  label?: string
  watermark?: boolean
}

/**
 * Card with a number ("01"), title and description. With `watermark` the number is drawn large
 * and faint in the corner (used for Mission/Vision); otherwise it is a small accent label.
 */
export function NumberedInfoCard({ number, title, description, label, watermark = false }: NumberedInfoCardProps) {
  const bg = useColorModeValue('var(--surface)', 'var(--surface)')
  const border = useColorModeValue('var(--border)', 'var(--border)')
  const numberColor = useColorModeValue('var(--accent)', 'var(--accent)')
  const titleColor = useColorModeValue('var(--text)', 'var(--text)')
  const descriptionColor = useColorModeValue('var(--text-muted)', 'var(--text-muted)')

  return (
    <Box
      as="article"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="0"
      p={{ base: 5, md: 6 }}
      minH="220px"
      textAlign="left"
      transition="border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{
        borderColor: useColorModeValue('brand.400', 'brand.300'),
        transform: 'translateY(-2px)',
        boxShadow: '0 18px 32px rgba(0, 0, 0, 0.08)',
      }}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      position="relative"
      overflow="hidden"
    >
      <Text
        fontSize={watermark ? '5rem' : 'sm'}
        letterSpacing="0.2em"
        textTransform="uppercase"
        color={watermark ? 'var(--border)' : numberColor}
        fontWeight="700"
        fontFamily="var(--font-sans)"
        lineHeight={watermark ? '1' : undefined}
        position={watermark ? 'absolute' : undefined}
        top={watermark ? 3 : undefined}
        right={watermark ? 4 : undefined}
        aria-hidden={watermark ? 'true' : undefined}
      >
        {number}
      </Text>

      {label ? <Text fontSize="xs" letterSpacing="0.2em" textTransform="uppercase" color="var(--accent)" fontWeight="700" fontFamily="var(--font-sans)">{label}</Text> : null}

      <Heading
        as="h3"
        mt={label ? 3 : 4}
        fontSize="lg"
        lineHeight="1.2"
        textTransform="uppercase"
        letterSpacing="0.02em"
        color={titleColor}
        fontWeight={watermark ? '700' : '600'}
        fontFamily="var(--font-sans)"
      >
        {title}
      </Heading>

      <Text
        mt={4}
        color={descriptionColor}
        fontSize="md"
        lineHeight="1.7"
        fontFamily="var(--font-sans)"
      >
        {description}
      </Text>
    </Box>
  )
}
