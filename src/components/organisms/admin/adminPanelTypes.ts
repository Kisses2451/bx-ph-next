import type { TableCardViewMode } from '../../molecules/TableCardViewToggle'
import type { AdminEntryModalMode } from '../../../lib/admin/adminEntries'

/** Props every admin tab panel receives from AdminDashboardPage. */
export interface AdminPanelBaseProps {
  viewMode: TableCardViewMode
  onViewModeChange: (next: TableCardViewMode) => void
  /** Opens the entry modal: `item` null + 'add' for a new record, or a record with 'view' / 'edit'. */
  onOpen: (item: Record<string, any> | null, mode: AdminEntryModalMode) => void
  /** Asks for confirmation, then deletes the record with this id. */
  onDelete: (id: string) => void
}
