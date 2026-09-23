export type PlayerStatus = 'Pending' | 'Approved' | 'Rejected' | 'Interview'

export interface PlayerRecord {
  id: string
  name: string
  department: 'Clan' | 'Community'
  email: string
  status: PlayerStatus
  dateApplied: string
  photoUrl?: string
  imageUrl?: string
  notes?: string
}

export type PlayerStatusValue = 'pending' | 'approved' | 'rejected'
export type PlayerGame = 'CODM' | 'HOK'
export type PlayerDepartment = 'Clan' | 'Community'
export const DEPARTMENTS_BY_GAME = {
  CODM: ['Clan', 'Community'],
  HOK: ['Clan'],
} as const
export type PlayerRoleValue = 'Clan' | 'Community' | 'Clash' | 'Mid' | 'Jungler' | 'Roamer' | 'Farm' | 'Versatile'

export interface SupabasePlayer {
  id: string
  full_name: string | null
  first_name: string
  last_name: string
  email: string
  contact_number: string | null
  date_of_birth: string | null
  contact_link: string | null
  registration_source: 'Online Recruitment' | 'LAN Event' | null
  main_game: PlayerGame
  department: 'Clan' | 'Community' | null
  role_lane: Exclude<PlayerRoleValue, 'Clan' | 'Community'> | null
  display_role: string | null
  in_game_name: string | null
  uid: string | null
  player_id: string | null
  photo_path: string | null
  photo_drive_url: string | null
  consent_privacy?: boolean
  consent_eligibility?: boolean
  status: PlayerStatusValue
  created_at: string
  updated_at?: string
}

export interface GameItem {
  id: string
  title: string
  genre: string
  status: 'Active' | 'Coming Soon'
  description: string
  image?: string
  imageUrl?: string
  featured?: boolean
}

export interface SupabaseGame {
  id: string
  title: string
  tag: string | null
  description: string | null
  image_url: string | null
  is_visible?: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export interface EventItem {
  id: string
  title: string
  date: string
  location: string
  description: string
  image?: string
  imageUrl?: string
}

export interface SupabaseEvent {
  id: string
  title: string
  event_date: string
  location: string | null
  description: string | null
  image_url: string | null
  is_visible: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface PartnerItem {
  id: string
  name: string
  category: string
  website: string
  description: string
  logo?: string
  imageUrl?: string
}

export interface SupabasePartner {
  id: string
  name: string
  category: string | null
  description: string | null
  logo_url: string | null
  website_url: string | null
  is_visible: boolean
  sort_order: number
  created_at: string
  updated_at?: string
}

export interface StaffMember {
  id: string
  name: string
  role: string
  bio: string
  image?: string
  imageUrl?: string
}

export interface SupabaseStaff {
  id: string
  full_name: string
  role_title: string | null
  bio: string | null
  photo_url: string | null
  is_visible: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface LatestUpdateItem {
  id: string
  title: string
  tag: string
  detail: string
  imageUrl?: string
}

export interface ApplicationPayload {
  name: string
  department: 'Clan' | 'Community'
  email: string
  photo?: File | null
}
