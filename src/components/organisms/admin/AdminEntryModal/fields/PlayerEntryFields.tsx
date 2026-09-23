import { FormControl, FormLabel, Input, Select, SimpleGrid, Stack } from '@chakra-ui/react'
import { CharacterCount } from '../../../../atoms/CharacterCount'
import { FormTextField } from '../../../../molecules/FormTextField'
import { SegmentedControl } from '../../../../molecules/SegmentedControl'
import { readValue } from '../../../../../lib/admin/adminEntries'
import { DEPARTMENTS_BY_GAME, type PlayerGame } from '../../../../../types/player'
import type { EntryFieldsProps } from './entryFieldTypes'

const GAME_OPTIONS = [{ value: 'CODM', label: 'CODM' }, { value: 'HOK', label: 'HOK' }]
const STATUS_OPTIONS = [{ value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }]

/** Add/edit form fields for a player: personal details, then game, department and status as click-to-select buttons, IGN/UID. */
export function PlayerEntryFields({ draft, errors, updateField, mutedColor }: EntryFieldsProps) {
  return (
    <Stack spacing={4}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormTextField label="First name" value={readValue(draft, 'first_name')} onChange={(value) => updateField('first_name', value)} error={errors.first_name} />
        <FormTextField label="Last name" value={readValue(draft, 'last_name')} onChange={(value) => updateField('last_name', value)} error={errors.last_name} />
        <FormTextField label="Email" type="email" value={readValue(draft, 'email')} onChange={(value) => updateField('email', value)} error={errors.email} />
        <FormTextField label="Phone" value={readValue(draft, 'contact_number')} onChange={(value) => updateField('contact_number', value)} error={errors.contact_number} />
        <FormTextField label="Date of birth" type="date" value={readValue(draft, 'date_of_birth')} onChange={(value) => updateField('date_of_birth', value)} />
        <FormTextField label="Contact link" value={readValue(draft, 'contact_link')} onChange={(value) => updateField('contact_link', value)} error={errors.contact_link} />
        <FormControl><FormLabel>Registration source</FormLabel><Select value={readValue(draft, 'registration_source')} onChange={(e) => updateField('registration_source', e.target.value)}><option>Online Recruitment</option><option>LAN Event</option></Select></FormControl>
        <SegmentedControl label="Main game" options={GAME_OPTIONS} value={readValue(draft, 'main_game')} error={errors.main_game} onChange={(next) => {
          // Switching game resets the department if the old one isn't offered for the new game.
          const mainGame = next as PlayerGame
          const allowed = DEPARTMENTS_BY_GAME[mainGame]
          updateField('main_game', mainGame)
          if (!allowed.includes(readValue(draft, 'department') as never)) updateField('department', allowed[0])
        }} />
        <SegmentedControl label="Department" options={(DEPARTMENTS_BY_GAME[readValue(draft, 'main_game') as PlayerGame] ?? []).map((department) => ({ value: department, label: department }))} value={readValue(draft, 'department') || 'Clan'} onChange={(next) => updateField('department', next)} />
        <FormControl><FormLabel>In-game name</FormLabel><Input maxLength={40} value={readValue(draft, 'in_game_name')} onChange={(e) => updateField('in_game_name', e.target.value)} /><CharacterCount value={readValue(draft, 'in_game_name')} max={40} tone="subtle" subtleColor={mutedColor} /></FormControl>
        <FormTextField label="UID" maxLength={40} value={readValue(draft, 'uid')} onChange={(value) => updateField('uid', value)} error={errors.uid} />
        {readValue(draft, 'main_game') === 'CODM' ? <FormControl><FormLabel>Player ID</FormLabel><Input maxLength={40} value={readValue(draft, 'player_id')} onChange={(e) => updateField('player_id', e.target.value)} /></FormControl> : null}
        <SegmentedControl label="Status" options={STATUS_OPTIONS} value={readValue(draft, 'status') || 'pending'} onChange={(next) => updateField('status', next)} />
      </SimpleGrid>
    </Stack>
  )
}
