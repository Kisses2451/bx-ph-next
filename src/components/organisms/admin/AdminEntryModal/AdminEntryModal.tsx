import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import type { useAdminEntryEditor } from '../../../../hooks/admin/useAdminEntryEditor'
import type { AdminEntryKind, AdminEntryModalMode } from '../../../../lib/admin/adminEntries'
import { AdminEntryDetails } from './AdminEntryDetails'
import { AdminEntryForm } from './AdminEntryForm'
import { entryName } from './entryDisplay'

const KIND_LABELS: Record<AdminEntryKind, string> = { player: 'Player', update: 'Latest update', game: 'Game', partner: 'Partner', event: 'Event', staff: 'Staff', timeline: 'Milestone' }
const MODE_LABELS: Record<AdminEntryModalMode, string> = { view: 'View', add: 'New', edit: 'Edit' }

/**
 * The one modal the admin dashboard uses to view, add or edit any record (player, update, game,
 * partner, event, staff, milestone). All state and saving live in useAdminEntryEditor; this is the frame:
 * a 2px maroon-and-gold frame that slowly sweeps, an eyebrow like "Player / Edit", the record's name as the
 * title, and Cancel / Save in the footer.
 */
export function AdminEntryModal({ editor }: { editor: ReturnType<typeof useAdminEntryEditor> }) {
  const { modalState } = editor
  const isView = modalState?.mode === 'view'
  const name = modalState ? entryName(modalState.kind, isView ? modalState.item : editor.modalDraft ?? {}) : ''
  const title = !modalState ? '' : name || (modalState.mode === 'add' ? `New ${KIND_LABELS[modalState.kind].toLowerCase()}` : KIND_LABELS[modalState.kind])

  return (
    <Modal isOpen={Boolean(modalState)} onClose={editor.handleModalClose} isCentered size="xl">
      <ModalOverlay bg="rgba(0, 0, 0, 0.72)" />
      <ModalContent className="admin-modal" maxW="min(92vw, 1100px)" w="min(92vw, 1100px)" maxH="90dvh" overflow="hidden">
        <div className="admin-modal__inner bx-display-container">
          <ModalHeader display="flex" alignItems="flex-start" justifyContent="space-between" gap={4} borderBottom="1px solid var(--border)" px={{ base: 5, md: 8 }} py={5}>
            <div>
              {modalState ? <p className="bx-eyebrow">{KIND_LABELS[modalState.kind]} / {MODE_LABELS[modalState.mode]}</p> : null}
              <h2 className="admin-modal__title bx-display">{title}</h2>
            </div>
            <ModalCloseButton position="static" borderRadius={0} />
          </ModalHeader>
          <ModalBody p={{ base: 5, md: 8 }} overflowY="auto" flex="1 1 auto">
            {isView && modalState ? <AdminEntryDetails kind={modalState.kind} item={modalState.item} /> : <AdminEntryForm editor={editor} />}
          </ModalBody>
          {modalState && !isView ? (
            <ModalFooter display="flex" justifyContent="space-between" gap={4} borderTop="1px solid var(--border)" px={{ base: 5, md: 8 }} py={4}>
              <span className="admin-modal__footer-note">{modalState.mode === 'add' ? 'Creates a new record' : 'Changes save to the live site'}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="bx-btn bx-btn--ghost bx-btn--sm" onClick={editor.handleModalClose}>Cancel</button>
                <button type="button" className="bx-btn bx-btn--primary bx-btn--sm" disabled={editor.isSaveDisabled} aria-busy={editor.isSaving} onClick={editor.handleSaveModal}>
                  {editor.isSaving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </ModalFooter>
          ) : null}
        </div>
      </ModalContent>
    </Modal>
  )
}
