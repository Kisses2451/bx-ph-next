import { Button, Flex, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'

export type TableCardViewMode = 'table' | 'card'

interface TableCardViewToggleProps {
  value: TableCardViewMode
  onChange: (next: TableCardViewMode) => void
}

const TableIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-11Z" />
    <path d="M4 10h16M9 5v14M15 5v14" />
  </Icon>
)

const GridIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <rect x="4" y="4" width="6" height="6" rx="1.5" />
    <rect x="14" y="4" width="6" height="4" rx="1.5" />
    <rect x="14" y="12" width="6" height="8" rx="1.5" />
    <rect x="4" y="12" width="6" height="8" rx="1.5" />
  </Icon>
)

/** Two-button switch that lets admins show a list as a table or as a grid of cards. */
export function TableCardViewToggle({ value, onChange }: TableCardViewToggleProps) {
  const border = useColorModeValue('gray.200', 'whiteAlpha.200')
  const activeBg = useColorModeValue('brand.500', 'brand.300')
  const activeColor = useColorModeValue('white', 'gray.900')
  const inactiveBg = useColorModeValue('white', 'gray.800')
  const inactiveColor = useColorModeValue('gray.700', 'gray.200')

  const sharedProps = {
    borderRadius: 0,
    border: 'none',
    _focus: { boxShadow: 'none' },
    minW: '44px',
    w: '44px',
    h: '44px',
    px: 0,
    py: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <Flex border="1px solid" borderColor={border} borderRadius="lg" overflow="hidden" bg={inactiveBg}>
      <Tooltip label="Table view" aria-label="Table view tooltip">
        <Button
          {...sharedProps}
          onClick={() => onChange('table')}
          bg={value === 'table' ? activeBg : inactiveBg}
          color={value === 'table' ? activeColor : inactiveColor}
          fontWeight="semibold"
          aria-label="Toggle table view"
          borderRight="1px solid"
          borderColor={border}
          leftIcon={<TableIcon boxSize={4} />}
        />
      </Tooltip>
      <Tooltip label="Card view" aria-label="Card view tooltip">
        <Button
          {...sharedProps}
          onClick={() => onChange('card')}
          bg={value === 'card' ? activeBg : inactiveBg}
          color={value === 'card' ? activeColor : inactiveColor}
          fontWeight="semibold"
          aria-label="Toggle card view"
          leftIcon={<GridIcon boxSize={4} />}
        />
      </Tooltip>
    </Flex>
  )
}
