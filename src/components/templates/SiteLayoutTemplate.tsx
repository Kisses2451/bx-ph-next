import type { ReactNode } from 'react'
import { JoinApplicationModal } from '../organisms/JoinApplicationModal/JoinApplicationModal'
import { SiteFooter } from '../organisms/SiteFooter'
import { SiteNavbar } from '../organisms/SiteNavbar'

interface SiteLayoutTemplateProps {
  /** The current page, rendered in <main> between the navbar and footer. */
  children: ReactNode
}

/**
 * The frame around every page: sticky navbar on top, page content, footer at the bottom.
 * Also mounts the "Join now" application pop-up once so any page can open it.
 */
export function SiteLayoutTemplate({ children }: SiteLayoutTemplateProps) {
  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteNavbar />
      <main id="main-content" className="site-main">{children}</main>
      <SiteFooter />
      <JoinApplicationModal />
    </div>
  )
}
