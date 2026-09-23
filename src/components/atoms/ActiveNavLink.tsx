'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

type ActiveNavLinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  /** Only mark the link active on an exact path match. */
  end?: boolean
}

function isActivePath(pathname: string, href: string, end: boolean) {
  if (href === '/' || end) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * A Next.js <Link> that knows when it points at the current page: it adds the
 * `active` class and `aria-current="page"` so the navbar can highlight it.
 */
export const ActiveNavLink = forwardRef<HTMLAnchorElement, ActiveNavLinkProps>(function ActiveNavLink(
  { href, className, end = false, ...props },
  ref,
) {
  const pathname = usePathname() ?? '/'
  const target = typeof href === 'string' ? href : href.pathname ?? '/'
  const active = isActivePath(pathname, target, end)

  return (
    <NextLink
      ref={ref}
      href={href}
      className={[className, active ? 'active' : ''].filter(Boolean).join(' ') || undefined}
      aria-current={active ? 'page' : undefined}
      {...props}
    />
  )
})
