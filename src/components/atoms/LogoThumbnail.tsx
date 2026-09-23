import { Box, Image } from '@chakra-ui/react'

/** 48×32 logo preview for admin tables and cards. Falls back to the first two letters of the name. */
export function LogoThumbnail({ src, name }: { src: string | null | undefined; name: string }) {
  return <Image src={src || undefined} alt={`${name} logo`} width="48px" height="32px" objectFit="contain" fallback={<Box width="48px" height="32px" display="grid" placeItems="center" color="gray.500" fontWeight="bold">{name.slice(0, 2).toUpperCase()}</Box>} />
}
