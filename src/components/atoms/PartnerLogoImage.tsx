'use client'

import { useState } from 'react'

/** Up to two initials from a name, e.g. "Volt Gaming" → "VG". */
export function nameInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '?'
}

interface PartnerLogoImageProps {
  name: string
  logoUrl: string | null
  /** Use "" when the name is already announced next to the logo, so screen readers don't hear it twice. */
  alt?: string
}

/** A partner's logo, or their initials in gold if there is no logo or it fails to load. Sized by its parent. */
export function PartnerLogoImage({ name, logoUrl, alt = `${name} logo` }: PartnerLogoImageProps) {
  const [failed, setFailed] = useState(!logoUrl)
  if (failed || !logoUrl) return <span className="partner-logo__monogram" aria-hidden={alt === '' ? true : undefined}>{nameInitials(name)}</span>
  // Plain <img>: partner logos are external URLs of unknown size, so next/image would need every host allow-listed.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={logoUrl} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
}
