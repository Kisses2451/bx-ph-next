/**
 * Data loading for the public pages, run on the server only (the `server-only` import makes the build fail if a
 * client component ever imports this file). Each page in app/ calls one function here; the result is cached and
 * refreshed every 60 seconds (`revalidate` in the page files), so visitors' browsers never query the database.
 * A value of `undefined` means that query failed on the server, and the page then loads it in the browser instead.
 */
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'
import type { LatestUpdateRecord } from '../hooks/useLatestUpdates'
import type { PublicStats } from '../hooks/usePublicStats'
import type { PublicTimelineEvent } from '../hooks/usePublicTimeline'
import type { PublicPartner } from '../hooks/usePartners'
import type { SupabaseEvent, SupabaseGame } from '../types/player'

import type { PublicStaff } from '../types/publicStaff'

export type { PublicStaff }

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && key ? createClient<Database>(url, key, { auth: { persistSession: false } }) : null
}

export async function getHomePageData() {
  const client = getServerClient()
  if (!client) return { updates: undefined, games: undefined, events: undefined }

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  const [updates, games, events] = await Promise.all([
    client.from('latest_updates').select('id,tag,title,description,published_at,updated_at').eq('is_visible', true).order('published_at', { ascending: false }).order('created_at', { ascending: false }),
    client.from('games').select('id,title,tag,description,image_url').eq('is_visible', true).order('sort_order').order('created_at'),
    client.from('events').select('id,title,event_date,location,description,image_url').eq('is_visible', true).gte('event_date', today).order('event_date', { ascending: true }).order('sort_order', { ascending: true }),
  ])

  // undefined = this query failed on the server, so the page loads it again in the browser.
  return {
    updates: updates.error ? undefined : (updates.data ?? []) as LatestUpdateRecord[],
    games: games.error ? undefined : (games.data ?? []) as SupabaseGame[],
    events: events.error ? undefined : (events.data ?? []) as SupabaseEvent[],
  }
}

export async function getAboutPageData() {
  const client = getServerClient()
  if (!client) return { stats: { members: null, games: null } as PublicStats, timeline: undefined, staff: [] as PublicStaff[] }

  const [statsResult, timelineResult, staffResult] = await Promise.all([
    client.rpc('get_public_stats'),
    client.from('timeline_events').select('id,year,month,title,description,is_visible,created_at').eq('is_visible', true).order('year', { ascending: true }).order('month', { ascending: true, nullsFirst: true }).order('created_at', { ascending: true }),
    client.from('staff').select('id,full_name,role_title,bio,photo_url').eq('is_visible', true).order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
  ])
  const raw = Array.isArray(statsResult.data) ? statsResult.data[0] : statsResult.data
  const row = (raw && typeof raw === 'object' ? raw : null) as { members?: unknown; games?: unknown } | null
  const readStat = (value: unknown) => {
    const parsed = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
  }

  return {
    stats: { members: readStat(row?.members), games: readStat(row?.games) } as PublicStats,
    timeline: timelineResult.error ? undefined : (timelineResult.data ?? []) as PublicTimelineEvent[],
    staff: (staffResult.data ?? []).map((item) => ({ id: item.id, name: item.full_name, role: item.role_title, bio: item.bio, photoUrl: item.photo_url })) as PublicStaff[],
  }
}

export async function getPartnersPageData() {
  const client = getServerClient()
  if (!client) return undefined
  const { data, error } = await client.from('partners').select('id,name,logo_url,website_url').eq('is_visible', true).order('sort_order')
  if (error) return undefined
  return (data ?? []).map((item) => ({ id: item.id, name: item.name, logoUrl: item.logo_url, websiteUrl: item.website_url })) as PublicPartner[]
}