import { Box, Image, Text } from '@chakra-ui/react'
import type { useAdminEntryEditor } from '../../../../hooks/admin/useAdminEntryEditor'
import { entryImageValue, entryPreviewTitle } from './entryDisplay'
import { EventEntryFields } from './fields/EventEntryFields'
import { GameEntryFields } from './fields/GameEntryFields'
import { LatestUpdateEntryFields } from './fields/LatestUpdateEntryFields'
import { PartnerEntryFields } from './fields/PartnerEntryFields'
import { PlayerEntryFields } from './fields/PlayerEntryFields'
import { StaffEntryFields } from './fields/StaffEntryFields'
import { TimelineEntryFields } from './fields/TimelineEntryFields'

/** Add/edit layout inside the entry modal: image preview on the left, the fields for this kind of record on the right. */
export function AdminEntryForm({ editor }: { editor: ReturnType<typeof useAdminEntryEditor> }) {
  const surface = 'var(--surface)'
  const border = 'var(--border)'
  const softBg = 'var(--surface-2)'
  const muted = 'var(--text-muted)'
  const { modalState, modalDraft } = editor
  if (!modalState || !modalDraft) return null

  const kind = modalState.kind
  const imageValue = entryImageValue(kind, modalDraft)
  const previewTitle = entryPreviewTitle(kind, modalDraft)
  const fieldProps = { draft: modalDraft, errors: editor.formErrors, updateField: editor.updateField, setDraftValue: editor.setDraftValue, mutedColor: muted }
  const imageProps = { imageValue, isImageUploading: editor.isImageUploading, onImageFileChange: editor.handleImageUpload }

  const fields = kind === 'player' ? <PlayerEntryFields {...fieldProps} />
    : kind === 'update' ? <LatestUpdateEntryFields {...fieldProps} {...imageProps} />
      : kind === 'game' ? <GameEntryFields {...fieldProps} imageValue={imageValue} gameLogoFile={editor.gameLogoFile} gameLogoInfo={editor.gameLogoInfo} onGameLogoChange={editor.selectGameLogoFile} onGameLogoRemove={editor.removeGameLogo} />
        : kind === 'partner' ? <PartnerEntryFields {...fieldProps} {...imageProps} partnerLogoInfo={editor.partnerLogoInfo} />
          : kind === 'event' ? <EventEntryFields {...fieldProps} {...imageProps} />
            : kind === 'staff' ? <StaffEntryFields {...fieldProps} {...imageProps} />
              : kind === 'timeline' ? <TimelineEntryFields {...fieldProps} />
                : null

  return (
    <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: 'minmax(220px, 280px) minmax(0, 1fr)' }} gap={6} alignItems="start">
      <Box borderRadius="xl" border="1px solid" borderColor={border} bg={softBg} p={4}>
        <Text fontSize="xs" letterSpacing="wide" textTransform="uppercase" color={muted} fontWeight="bold">Preview</Text>
        <Box mt={3} borderRadius="xl" border="1px solid" borderColor={border} bg={surface} overflow="hidden" minH="180px" display="flex" alignItems="center" justifyContent="center">
          {imageValue ? (
            <Box width="220px" maxW="100%" aspectRatio={kind === 'partner' ? '3 / 2' : undefined} display="flex" alignItems="center" justifyContent="center" bg={kind === 'partner' ? 'var(--surface-2)' : undefined}><Image src={imageValue} alt={`${previewTitle} preview`} objectFit={kind === 'partner' ? 'contain' : 'cover'} maxW={kind === 'partner' ? '70%' : '100%'} maxH={kind === 'partner' ? '60%' : '220px'} w={kind === 'partner' ? '160px' : '100%'} h={kind === 'partner' ? '96px' : '220px'} /></Box>
          ) : (
            <Text color={muted} fontWeight="medium" px={4} textAlign="center">{previewTitle}</Text>
          )}
        </Box>
        <Text mt={3} fontSize="xs" color={muted}>
          {kind === 'player' ? 'Player avatar' : kind === 'staff' ? 'Staff portrait' : 'Media image'}
        </Text>
      </Box>

      <Box>{fields}</Box>
    </Box>
  )
}
