'use client'

import { lazy, Suspense } from 'react'
import { usePlayers } from '../../context/PlayerContext'
import { useFeaturedGames } from '../../hooks/useFeaturedGames'
import { useLatestUpdateAnnouncement } from '../../hooks/useLatestUpdateAnnouncement'
import { useLatestUpdates } from '../../hooks/useLatestUpdates'
import { useUpcomingEvents } from '../../hooks/useUpcomingEvents'
import type { LatestUpdateRecord } from '../../hooks/useLatestUpdates'
import type { SupabaseEvent, SupabaseGame } from '../../types/player'
import { GamesMarqueeStrip } from '../molecules/GamesMarqueeStrip'
import { FeaturedGamesSection } from '../organisms/FeaturedGamesSection'
import { HomeFeedSection } from '../organisms/HomeFeedSection'
import { HomeHeroSection } from '../organisms/HomeHeroSection'
import { JoinCallToActionSection } from '../organisms/JoinCallToActionSection'

// The announcement pop-up is only downloaded when it is about to open.
const LatestUpdateAnnouncementModal = lazy(() => import('../organisms/LatestUpdateAnnouncementModal').then((module) => ({ default: module.LatestUpdateAnnouncementModal })))

/**
 * Home page ( / ): hero, games strip, the feed (updates + upcoming events), featured games and
 * the join call-to-action. May pop up the newest update once per session.
 */
export function HomePage({ initialUpdates, initialGames, initialEvents }: { initialUpdates?: LatestUpdateRecord[]; initialGames?: SupabaseGame[]; initialEvents?: SupabaseEvent[] }) {
  const { isAuthenticated } = usePlayers()
  const { updates, latestUpdate, isLoading: updatesLoading, error: updatesError } = useLatestUpdates(initialUpdates)
  const featuredGames = useFeaturedGames(initialGames)
  const { events: upcomingEvents, isLoading: eventsLoading } = useUpcomingEvents(initialEvents)
  const announcement = useLatestUpdateAnnouncement({ latestUpdate, updatesLoading, updatesError, isAuthenticated })

  const feedLoading = updatesLoading || eventsLoading
  const hasFeed = !feedLoading && (updates.length > 0 || upcomingEvents.length > 0)
  const gameTitles = featuredGames.games.map((game) => game.title)

  return (
    <>
      <HomeHeroSection gameCount={featuredGames.games.length} />
      <GamesMarqueeStrip games={featuredGames.games} gamesLoading={featuredGames.isLoading} gamesError={featuredGames.hasError} />
      {hasFeed ? <HomeFeedSection events={upcomingEvents} updates={updates} /> : null}
      <FeaturedGamesSection games={featuredGames.games} isLoading={featuredGames.isLoading} hasError={featuredGames.hasError} onRetry={featuredGames.retry} sectionNumber={hasFeed ? '002' : '001'} />
      <JoinCallToActionSection gameTitles={gameTitles} />
      {latestUpdate && announcement.isOpen ? <Suspense fallback={null}><LatestUpdateAnnouncementModal update={latestUpdate} isOpen={announcement.isOpen} keepSection={hasFeed} onClose={announcement.close} /></Suspense> : null}
    </>
  )
}
