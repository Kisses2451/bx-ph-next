import { MarqueeTicker, type MarqueeTickerItem } from '../atoms/MarqueeTicker'
import type { SupabaseGame } from '../../types/player'

export const STRIP_MODE: 'scrolling' | 'off' = 'scrolling'
const FALLBACK_TITLES = ['Call of Duty: Mobile', 'Honor of Kings']

interface GamesMarqueeStripProps {
  games: SupabaseGame[]
  gamesLoading: boolean
  gamesError: boolean
}

/**
 * Scrolling strip under the home hero: every featured game title plus a gold "Recruitment open".
 * Shows fallback titles while games load or if loading fails. Set STRIP_MODE to 'off' to hide it.
 */
export function GamesMarqueeStrip({ games, gamesLoading, gamesError }: GamesMarqueeStripProps) {
  if (STRIP_MODE === 'off') return null
  const titles = gamesLoading || gamesError || games.length === 0 ? FALLBACK_TITLES : games.map((game) => game.title)
  const items: MarqueeTickerItem[] = [...titles.map((label) => ({ label })), { label: 'Recruitment open', accent: true }]

  return (
    <div className="games-strip">
      <MarqueeTicker items={items} label="Featured games and recruitment status" durationSeconds={30} />
    </div>
  )
}
