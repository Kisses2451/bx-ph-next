import { Box, Button, Image, Link, Text } from '@chakra-ui/react'
import { useState, type MouseEventHandler } from 'react'
import { ScrollReveal } from '../atoms/ScrollReveal'

type BrandLogoTileProps = {
  logoUrl: string | null | undefined
  name: string
  href?: string | null
  onClick?: MouseEventHandler<HTMLElement>
  interactive?: boolean
  tone?: 'partner' | 'game'
  index?: number
}

function monogram(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '?'
}

/**
 * Square tile showing a partner or game logo. If the image is missing or fails to load,
 * the name's initials are shown instead. With `href` it becomes an external link.
 */
export function BrandLogoTile({ logoUrl, name, href, onClick, interactive = false, tone = 'partner', index = 0 }: BrandLogoTileProps) {
  const [imageFailed, setImageFailed] = useState(!logoUrl)

  const isInteractive = interactive || Boolean(href || onClick)
  const TileElement = onClick ? Button : Box
  const tile = <TileElement type={onClick ? 'button' : undefined} onClick={onClick} className={`logo-tile logo-tile--${tone}${isInteractive ? ' logo-tile--interactive logo-tile--muted' : ''}`}>
    {imageFailed ? <Text className="logo-tile__monogram" aria-hidden="true">{monogram(name)}</Text> : <Image src={logoUrl ?? undefined} alt={`${name} logo`} crossOrigin="anonymous" width="800" height="800" loading="lazy" decoding="async" objectFit="contain" onError={() => setImageFailed(true)} />}
  </TileElement>

  return <ScrollReveal variant="scale-in" index={index}>{href ? <Link href={href} isExternal target="_blank" rel="noopener noreferrer" aria-label={name} className="logo-tile__link">{tile}</Link> : tile}</ScrollReveal>
}
