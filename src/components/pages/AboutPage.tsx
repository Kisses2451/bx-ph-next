'use client'

import { siteFoundedYear } from '../../config/site'
import { aboutPageContent } from '../../data/siteContent'
import { usePublicStats } from '../../hooks/usePublicStats'
import { usePublicTimeline } from '../../hooks/usePublicTimeline'
import { AboutIntroSection } from '../organisms/AboutIntroSection'
import { AboutPillarsSection } from '../organisms/AboutPillarsSection'
import { AboutStorySection } from '../organisms/AboutStorySection'
import { JoinCallToActionSection } from '../organisms/JoinCallToActionSection'
import { MilestoneTimelineSection } from '../organisms/MilestoneTimelineSection'
import { MissionVisionSection } from '../organisms/MissionVisionSection'
import type { PublicStats } from '../../hooks/usePublicStats'
import type { PublicTimelineEvent } from '../../hooks/usePublicTimeline'
import type { PublicStaff } from '../../types/publicStaff'
import { StaffRosterSection } from '../organisms/StaffRosterSection'

/**
 * About page ( /about ), top to bottom: monument heading with live stats, the story, mission & vision split,
 * the horizontal milestone track, the three pillars, and the "Ready to rise?" join banner.
 */
export function AboutPage({ initialStats, initialTimeline, initialStaff = [] }: { initialStats?: PublicStats; initialTimeline?: PublicTimelineEvent[]; initialStaff?: PublicStaff[] }) {
  const { stats: publicStats, isLoading: statsLoading, error: statsError } = usePublicStats(initialStats)
  const timeline = usePublicTimeline(initialTimeline)

  // Founded year comes from config/site.ts (same as the home hero); game and member counts are live from Supabase.
  const stats = aboutPageContent.stats.map((stat) => {
    if (stat.label === 'YEAR FOUNDED') return { ...stat, value: siteFoundedYear }
    if (stat.label === 'ACTIVE GAME TITLES') return { ...stat, value: publicStats.games === null ? '—' : String(publicStats.games), static: false }
    if (stat.label === 'MEMBERS') return { ...stat, value: publicStats.members === null ? '—' : String(publicStats.members), static: false }
    return stat
  })

  return (
    <>
      <AboutIntroSection stats={stats} statsLoading={statsLoading} statsError={Boolean(statsError)} />
      <AboutStorySection />
      <MissionVisionSection />
      <MilestoneTimelineSection events={timeline.events} isLoading={timeline.isLoading} hasError={timeline.hasError} />
      <AboutPillarsSection />
      <StaffRosterSection staff={initialStaff} />
      <JoinCallToActionSection gameTitles={aboutPageContent.story.games.map((game) => game.label)} />
    </>
  )
}
