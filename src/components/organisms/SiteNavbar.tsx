'use client'

import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { siteName } from '../../config/site'
import { usePlayers } from '../../context/PlayerContext'
import { openJoinFlow } from '../../lib/joinFlow'
import { ActiveNavLink } from '../atoms/ActiveNavLink'
import { ArrowIcon } from '../atoms/ArrowIcon'
import { NavIcon, type NavIconName } from '../atoms/NavIcon'
import { SiteSearch } from '../molecules/SiteSearch'

type NavItem = { to: string; label: string; icon: NavIconName }

const publicItems: NavItem[] = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/partners', label: 'Partners', icon: 'partners' },
  { to: '/about', label: 'About Us', icon: 'about' },
]

/**
 * Sticky site header: logo, search, page links, Join Now button and (on narrow screens) a "More" menu with the
 * page links. Signed-in admins also get an Admin Dashboard link and a Log out button. Plain HTML + CSS
 * (styles/site.css): no UI library is loaded on the public pages.
 */
export function SiteNavbar() {
  const { isAuthenticated, logout } = usePlayers()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pageItems: NavItem[] = isAuthenticated ? [{ to: '/admin', label: 'Admin Dashboard', icon: 'dashboard' }, ...publicItems] : publicItems

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    const handlePointerDown = (event: PointerEvent) => { if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false) }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => { document.removeEventListener('keydown', handleKeyDown); document.removeEventListener('pointerdown', handlePointerDown) }
  }, [menuOpen])

  return (
    <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}${isAuthenticated ? ' site-header--admin' : ''}`}>
      <div className="shared-container site-header__row">
        <ActiveNavLink href="/" className="site-header__brand" aria-label={`${siteName} home`} end>
          <NextImage src="/bx-logo.png" alt="" width={40} height={40} priority />
          <span className="site-header__wordmark">{siteName}</span>
        </ActiveNavLink>

        <SiteSearch />

        <nav className="site-header__nav" aria-label="Primary navigation">
          {pageItems.map((item) => (
            <ActiveNavLink key={item.to} href={item.to} className="site-header__link" title={item.label}>
              <NavIcon name={item.icon} /><span className="site-header__link-label">{item.label}</span>
            </ActiveNavLink>
          ))}
        </nav>

        {isAuthenticated ? (
          <button type="button" className="site-header__link site-header__logout" onClick={logout} title="Log out">
            <NavIcon name="logout" /><span className="site-header__link-label">Log out</span>
          </button>
        ) : null}

        <ActiveNavLink href="/join" className="site-header__join bx-shine" onClick={openJoinFlow}>
          Join now <ArrowIcon size={16} className="site-header__join-arrow" />
        </ActiveNavLink>

        <div ref={menuRef} className="site-header__menu">
          <button type="button" className="site-header__menu-button" aria-label="More navigation" aria-expanded={menuOpen} aria-controls="site-header-menu" onClick={() => setMenuOpen((open) => !open)}>
            <span aria-hidden="true" />
          </button>
          {menuOpen ? (
            <ul id="site-header-menu" className="site-header__menu-list">
              {pageItems.map((item) => (
                <li key={item.to}><ActiveNavLink href={item.to}><NavIcon name={item.icon} />{item.label}</ActiveNavLink></li>
              ))}
              {isAuthenticated ? <li><button type="button" onClick={() => { setMenuOpen(false); logout() }}><NavIcon name="logout" />Log out</button></li> : null}
            </ul>
          ) : null}
        </div>
      </div>
    </header>
  )
}
