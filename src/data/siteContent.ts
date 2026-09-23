import type { PartnerItem } from '../types/player'

export const aboutPageContent = {
  header: {
    eyebrow: 'EST. PHILIPPINES',
    headingPrimary: 'ABOUT',
    headingAccent: 'BLOODLUST',
    intro: 'A Philippine-based esports organization built on passion, discipline, and the drive to compete at the highest level.',
  },
  stats: [
    { value: '2025', label: 'YEAR FOUNDED', static: true, todo: 'TODO: Confirm 2020 vs 2021; the home hero says 2021.' },
    { value: '3', label: 'ACTIVE GAME TITLES', static: false },
    { value: '300+', label: 'MEMBERS', static: false },
    { value: 'PH', label: 'PHILIPPINES', static: true },
  ],
  story: {
    railLabel: 'OUR STORY',
    eyebrow: 'HOW IT STARTED',
    headingPrimary: 'FROM PASSION',
    headingSecondary: 'TO PURPOSE',
    paragraphs: [
      'Bloodlust Philippines was born from a shared love of competitive gaming. What started as a small group of dedicated players has grown into a full-fledged esports organization competing across multiple titles.',
      'We believe that every player deserves a platform — a place to grow, compete, and be recognized. That belief drives everything we do, from recruiting new talent to building partnerships that elevate the entire community.',
    ],
    games: [
      { label: 'CODM', todo: 'TODO: Add a confirmed local CODM logo if available.' },
      { label: 'POINT BLANK', todo: 'TODO: Confirm this title is real for Bloodlust Philippines.' },
      { label: 'HONOR OF KINGS', todo: 'TODO: Add a confirmed local Honor of Kings logo if available.' },
    ],
  },
}

export const initialPartners: PartnerItem[] = [
  {
    id: 'p1',
    name: 'Volt Gaming',
    category: 'Hardware & Performance',
    website: 'https://www.example.com',
    description: 'Provides elite gaming setup and performance support for training camps and events.',
    logo: 'https://placehold.co/200x80/8a233d/ffffff?text=Volt+Gaming',
  },
  {
    id: 'p2',
    name: 'Summit Media',
    category: 'Broadcast & Content',
    website: 'https://www.example.com',
    description: 'Helps amplify club stories, community initiatives, and high-visibility match coverage.',
    logo: 'https://placehold.co/200x80/1f1f1f/ffffff?text=Summit+Media',
  },
  {
    id: 'p3',
    name: 'North Peak Nutrition',
    category: 'Performance Wellness',
    website: 'https://www.example.com',
    description: 'Supports player health, recovery moments, and nutrition planning during campaigns.',
    logo: 'https://placehold.co/200x80/ffd700/1a090d?text=North+Peak',
  },
]

