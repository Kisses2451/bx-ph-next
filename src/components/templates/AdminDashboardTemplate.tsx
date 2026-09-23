import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import type { ReactNode } from 'react'

export interface AdminDashboardTab {
  /** Text on the tab button, e.g. "Players". */
  label: string
  /** What the tab shows when selected. */
  content: ReactNode
}

interface AdminDashboardTemplateProps {
  tabs: AdminDashboardTab[]
  /** Index of the selected tab in `tabs`. */
  activeTabIndex: number
  onTabChange: (index: number) => void
  onSignOut: () => void
  /** Signed-in admin's email, shown next to Sign out. Hidden when null. */
  adminEmail?: string | null
  /** Extra elements rendered after the tabs, e.g. the add/edit modal. */
  children?: ReactNode
}

/**
 * Admin page frame: "MANAGEMENT CENTER" header (with "CENTER" outlined), the signed-in email and Sign out,
 * then a flat tab bar whose selected tab gets a gold underline, and the selected tab's content.
 */
export function AdminDashboardTemplate({ tabs, activeTabIndex, onTabChange, onSignOut, adminEmail, children }: AdminDashboardTemplateProps) {
  return (
    <div className="admin-console shared-container">
      <header className="admin-header bx-display-container">
        <div className="bx-display-container">
          <p className="bx-eyebrow">Admin dashboard</p>
          <h1 className="admin-header__title bx-display">Management <span className="bx-outline-text">Center</span></h1>
        </div>
        <div className="admin-header__account">
          {adminEmail ? (
            <div className="admin-header__who">
              <span className="admin-header__who-label">Signed in as</span>
              <span className="admin-header__who-email">{adminEmail}</span>
            </div>
          ) : null}
          <button type="button" className="bx-btn bx-btn--ghost bx-btn--sm" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <Tabs index={activeTabIndex} onChange={onTabChange} variant="unstyled">
        <TabList className="admin-tabs__list">
          {tabs.map((tab) => <Tab key={tab.label} className="admin-tabs__tab">{tab.label}</Tab>)}
        </TabList>
        <TabPanels className="admin-tabs__panels">
          {tabs.map((tab) => <TabPanel key={tab.label} p={0}>{tab.content}</TabPanel>)}
        </TabPanels>
      </Tabs>
      {children}
    </div>
  )
}
