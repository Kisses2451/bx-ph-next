import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, CloseButton, FormControl, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement, Select, SimpleGrid, Stack, Text } from '@chakra-ui/react'

import type { AdminPlayerDatePreset } from '../../../lib/admin/adminEntries'

export type { AdminPlayerDatePreset }

interface AdminPlayerFilterBarProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  departmentFilter: string
  setDepartmentFilter: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  gameFilter: string
  setGameFilter: (value: string) => void
  datePreset: AdminPlayerDatePreset
  setDatePreset: (value: AdminPlayerDatePreset) => void
  fromDate: string
  toDate: string
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  onClear: () => void
  resultsCount: number
  hasInvalidDateRange: boolean
}

const departmentOptions = ['All departments', 'Clan', 'Community']
const statusOptions = ['All statuses', 'pending', 'approved', 'rejected']
const dateOptions: Array<[AdminPlayerDatePreset, string]> = [['all', 'All time'], ['7', 'Last 7 days'], ['30', 'Last 30 days'], ['custom', 'Custom Date Range']]

/**
 * Search and filter controls above the admin player list: text search, department, status, game,
 * date range (with custom From/To dates) and a Clear button, plus the number of matching players.
 */
export function AdminPlayerFilterBar({ searchTerm, setSearchTerm, departmentFilter, setDepartmentFilter, statusFilter, setStatusFilter, gameFilter, setGameFilter, datePreset, setDatePreset, fromDate, toDate, onFromDateChange, onToDateChange, onClear, resultsCount, hasInvalidDateRange }: AdminPlayerFilterBarProps) {
  const panelBg = 'var(--surface)'
  const panelBorder = 'var(--border)'
  const controlBg = 'var(--surface-2)'
  const controlBorder = 'var(--border-strong)'
  const controlColor = 'var(--text)'
  const placeholderColor = 'var(--text-muted)'
  const iconColor = 'var(--text-muted)'
  const labelColor = 'var(--text-muted)'
  const isActive = Boolean(searchTerm.trim() || departmentFilter !== 'all' || statusFilter !== 'all' || gameFilter !== 'all' || datePreset !== 'all')
  const controlProps = { h: '44px', borderRadius: 'md', bg: controlBg, color: controlColor, borderColor: controlBorder, _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' } }

  return <Box className="admin-filter-panel" bg={panelBg} borderRadius="xl" border="1px solid" borderColor={panelBorder} p={{ base: 3, md: 4 }} w="100%">
    <Stack spacing={3}>
      <Text fontSize="sm" fontWeight="bold">Player search &amp; filters</Text>
      <Box className="admin-filter-row" display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(5, minmax(0, 1fr))', lg: 'minmax(220px, 1fr) repeat(4, minmax(130px, 0.3fr)) auto' }} gap={3} sx={{ '& > .player-search-control': { gridColumn: { base: 'auto', md: '1 / -1', lg: 'auto' } } }}>
        <FormControl className="player-search-control" minW={0}><FormLabel srOnly htmlFor="player-search">Search players</FormLabel><InputGroup><InputLeftElement pointerEvents="none" h="44px" pl={3}><SearchIcon color={iconColor} /></InputLeftElement><Input id="player-search" aria-label="Search name, email, IGN, or UID" placeholder="Search name, email, IGN, or UID" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} {...controlProps} pl={10} pr={searchTerm ? 10 : 4} _placeholder={{ color: placeholderColor }} />{searchTerm ? <InputRightElement h="44px" pr={2}><CloseButton aria-label="Clear player search" size="sm" onClick={() => setSearchTerm('')} /></InputRightElement> : null}</InputGroup></FormControl>
        <FormControl><FormLabel srOnly htmlFor="player-department-filter">Department</FormLabel><Select id="player-department-filter" aria-label="Filter by department" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} {...controlProps}>{departmentOptions.map((value) => <option key={value} value={value === 'All departments' ? 'all' : value}>{value}</option>)}</Select></FormControl>
        <FormControl><FormLabel srOnly htmlFor="player-status-filter">Status</FormLabel><Select id="player-status-filter" aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} {...controlProps}>{statusOptions.map((value) => <option key={value} value={value === 'All statuses' ? 'all' : value}>{value}</option>)}</Select></FormControl>
        <FormControl><FormLabel srOnly htmlFor="player-game-filter">Game</FormLabel><Select id="player-game-filter" aria-label="Filter by game" value={gameFilter} onChange={(event) => setGameFilter(event.target.value)} {...controlProps}><option value="all">All games</option><option value="CODM">CODM</option><option value="HOK">HOK</option></Select></FormControl>
        <FormControl><FormLabel srOnly htmlFor="player-date-filter">Date</FormLabel><Select id="player-date-filter" aria-label="Filter by date" value={datePreset} onChange={(event) => setDatePreset(event.target.value as AdminPlayerDatePreset)} {...controlProps}>{dateOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></FormControl>
        <Button aria-label="Clear player filters" variant="ghost" onClick={onClear} isDisabled={!isActive} h="44px" px={4}>Clear</Button>
      </Box>
      {datePreset === 'custom' ? <Box borderTop="1px solid" borderColor={panelBorder} pt={3}><SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}><FormControl><FormLabel htmlFor="player-from-date" fontSize="xs" color={labelColor} mb={1}>From</FormLabel><Input id="player-from-date" aria-label="Filter from date" type="date" value={fromDate} onChange={(event) => onFromDateChange(event.target.value)} {...controlProps} /></FormControl><FormControl><FormLabel htmlFor="player-to-date" fontSize="xs" color={labelColor} mb={1}>To</FormLabel><Input id="player-to-date" aria-label="Filter to date" type="date" value={toDate} onChange={(event) => onToDateChange(event.target.value)} {...controlProps} /></FormControl></SimpleGrid>{hasInvalidDateRange ? <Text role="alert" color="red.500" fontSize="sm" mt={2}>From date cannot be later than To date.</Text> : null}</Box> : null}
      <Text fontSize="sm" color={placeholderColor}>{resultsCount} {resultsCount === 1 ? 'player' : 'players'}</Text>
    </Stack>
  </Box>
}
