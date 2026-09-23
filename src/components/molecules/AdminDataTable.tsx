import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface AdminDataTableProps {
  /** Header text for each column, left to right. */
  columns: string[]
  /** The table rows (<Tr> elements). */
  children: ReactNode
}

/** Square-cornered table on the page background with a muted header row and a row hover, used for every list in the admin dashboard. */
export function AdminDataTable({ columns, children }: AdminDataTableProps) {
  return (
    <TableContainer className="admin-table">
      <Table variant="simple">
        <Thead><Tr>{columns.map((column) => <Th key={column}>{column}</Th>)}</Tr></Thead>
        <Tbody>{children}</Tbody>
      </Table>
    </TableContainer>
  )
}
