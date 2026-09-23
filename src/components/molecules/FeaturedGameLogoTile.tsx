import { BrandLogoTile } from './BrandLogoTile'
import type { SupabaseGame } from '../../types/player'

interface FeaturedGameLogoTileProps {
  game: SupabaseGame
}

/** A game's logo tile in the home page "Featured games" grid. */
export function FeaturedGameLogoTile({ game }: FeaturedGameLogoTileProps) {
  return <BrandLogoTile logoUrl={game.image_url} name={game.title} tone="game" />
}