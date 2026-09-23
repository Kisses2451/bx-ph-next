import type { ReactNode } from 'react'
import { AdminProviders } from '../../components/providers/AdminProviders'
import '../../styles/admin.css'

/** Everything under /admin gets Chakra UI (the dashboard is built with it); public pages do not load it. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>
}
