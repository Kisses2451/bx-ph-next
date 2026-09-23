import NextLink from 'next/link'
import { ArrowIcon } from '../atoms/ArrowIcon'
import { openJoinFlow } from '../../lib/joinFlow'

/** Maroon "Recruitment live / Join the roster" tile in the home feed. Opens the join modal (falls back to /join). */
export function RecruitmentLiveTile() {
  return (
    <NextLink href="/join" className="recruit-tile" onClick={openJoinFlow}>
      <span className="recruit-tile__status"><span className="bx-pulse-dot" aria-hidden="true" />Recruitment live</span>
      <span className="recruit-tile__row">
        <span className="recruit-tile__title">Join the<br />roster</span>
        <ArrowIcon size={48} />
      </span>
    </NextLink>
  )
}
