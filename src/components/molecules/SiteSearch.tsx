'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

const siteIndex = [
  { label: 'Home', path: '/', keywords: ['home', 'updates', 'club', 'recruitment', 'news'] },
  { label: 'About Us', path: '/about', keywords: ['about', 'team', 'staff', 'club', 'mission', 'milestones', 'history'] },
  { label: 'Partners', path: '/partners', keywords: ['partners', 'sponsors', 'allies', 'brands'] },
  { label: 'Join Now', path: '/join', keywords: ['join', 'apply', 'application', 'players', 'register', 'tryouts'] },
  { label: 'Events', path: '/#latest-updates', keywords: ['events', 'calendar', 'schedule', 'showcase'] },
  { label: 'Latest Updates', path: '/#latest-updates', keywords: ['updates', 'news', 'recruitment', 'academy', 'scouting'] },
  { label: 'Admin Dashboard', path: '/admin', keywords: ['admin', 'dashboard', 'management'] },
] as const

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
}

/**
 * Navbar search box. Matches the typed text against a fixed list of site pages and keywords (no server
 * search) and lists links to the matching pages. On narrow screens it collapses to a magnifier button that
 * opens the field in a bar under the header. Escape or a click outside closes it.
 */
export function SiteSearch() {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const resultsId = useId()

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    return siteIndex.filter((item) => item.label.toLowerCase().includes(normalized) || item.keywords.some((keyword) => keyword.includes(normalized)))
  }, [query])

  useEffect(() => { setQuery(''); setIsExpanded(false) }, [pathname])

  useEffect(() => {
    if (!isExpanded && !query) return
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { setIsExpanded(false); setQuery('') } }
    const handlePointerDown = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) { setIsExpanded(false); setQuery('') } }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => { document.removeEventListener('keydown', handleKeyDown); document.removeEventListener('pointerdown', handlePointerDown) }
  }, [isExpanded, query])

  const open = () => { setIsExpanded(true); window.setTimeout(() => inputRef.current?.focus(), 0) }
  const showResults = query.trim().length > 0

  return (
    <div ref={rootRef} className={`site-search${isExpanded ? ' site-search--expanded' : ''}`} role="search">
      <button type="button" className="site-search__toggle" aria-label="Open website search" aria-expanded={isExpanded} onClick={open}><SearchIcon /></button>
      <div className="site-search__field">
        <span className="site-search__icon"><SearchIcon /></span>
        <input
          ref={inputRef}
          type="search"
          aria-label="Search the website"
          aria-controls={showResults ? resultsId : undefined}
          placeholder="Search website"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {showResults ? (
        <ul id={resultsId} className="site-search__results" aria-label="Search results">
          {results.length === 0 ? <li className="site-search__empty">No matching pages</li> : results.map((item) => (
            <li key={item.label}><NextLink href={item.path} onClick={() => { setQuery(''); setIsExpanded(false) }}>{item.label}</NextLink></li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
