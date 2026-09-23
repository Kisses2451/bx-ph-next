import { Box, Image } from '@chakra-ui/react'

interface PlayerAvatarProps {
  /** Signed photo URL, if the player uploaded one. */
  photoUrl: string | undefined
  /** Used for the image alt text. */
  name: string
  /** Shown in a round badge when there is no photo, e.g. "JD". */
  initials: string
  /** "sm" = 36px (table rows), "md" = 48px (cards). */
  size?: 'sm' | 'md'
}

/** Round player photo, or the player's initials when no photo is available. */
export function PlayerAvatar({ photoUrl, name, initials, size = 'sm' }: PlayerAvatarProps) {
  if (photoUrl) return <Image src={photoUrl} alt={`${name} photo`} boxSize={size === 'sm' ? '36px' : '48px'} borderRadius="full" objectFit="cover" />
  return size === 'sm'
    ? <Box borderRadius="full" bg="brand.50" color="brand.500" px={2} py={1} fontSize="xs" fontWeight="bold">{initials}</Box>
    : <Box borderRadius="full" bg="brand.50" color="brand.500" px={3} py={2} fontWeight="bold">{initials}</Box>
}
