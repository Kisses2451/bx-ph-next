import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { photoError, photoRequired, validateApplicationFields, type JoinApplicationFields } from '../../../lib/joinApplication'
import type { Database } from '../../../types/database'

/**
 * POST /api/apply — receives the "Join now" form (multipart: text fields, optional `photo`, `turnstileToken`)
 * and saves it as a pending player.
 *
 * Checks, in order: a simple per-visitor rate limit, the hidden spam-trap field, the Cloudflare Turnstile CAPTCHA
 * (when TURNSTILE_SECRET_KEY is set), the same field rules the form uses, and the photo's type and size.
 * It then uploads the photo to player-photos/applications/ and inserts the row.
 *
 * With SUPABASE_SERVICE_ROLE_KEY set (server-only, never NEXT_PUBLIC_), it writes with that key, so the database
 * can stop accepting applications directly from browsers (see supabase/migrations/*_require_server_submissions.sql).
 * Without it, it uses the public anon key and the existing "Visitors submit applications" policy.
 */
export const runtime = 'nodejs'

const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const recentSubmissions = new Map<string, number[]>()

/** Best effort: counts per server instance, so it slows down scripts but is not a hard guarantee. */
function isRateLimited(key: string) {
  const now = Date.now()
  const hits = (recentSubmissions.get(key) ?? []).filter((time) => now - time < RATE_WINDOW_MS)
  hits.push(now)
  recentSubmissions.set(key, hits)
  if (recentSubmissions.size > 5000) recentSubmissions.clear()
  return hits.length > RATE_LIMIT
}

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
    const result = (await response.json()) as { success?: boolean }
    return result.success === true
  } catch {
    return false
  }
}

function databaseErrorMessage(code?: string) {
  if (code === '23505') return 'This UID is already registered for that game. If you applied before, please wait for our review.'
  if (code === '23514') return 'One of your answers is not in the expected format. Please go back, check your details and try again.'
  if (code === '42501') return 'We could not accept this application. Please make sure both confirmations are ticked and try again.'
  return 'Unable to submit your application right now. Please try again in a moment.'
}

const text = (form: FormData, key: string) => String(form.get(key) ?? '').trim()
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const key = serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return fail('Applications are not available right now.', 503)

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip')
  if (isRateLimited(ip || 'unknown')) return fail('Too many applications from this connection. Please try again in a few minutes.', 429)

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return fail('The application could not be read. Please try again.')
  }

  // Bots fill every field; people never see this one. Pretend it worked so the bot moves on.
  if (text(form, 'website')) return NextResponse.json({ ok: true })

  if (!(await verifyTurnstile(text(form, 'turnstileToken'), ip))) return fail('Please complete the "I am human" check and try again.')

  const fields: JoinApplicationFields = {
    mainGame: text(form, 'mainGame') as JoinApplicationFields['mainGame'],
    privacyAccepted: text(form, 'privacyAccepted') === 'true',
    eligibilityConfirmed: text(form, 'eligibilityConfirmed') === 'true',
    firstName: text(form, 'firstName'),
    lastName: text(form, 'lastName'),
    contactNumber: text(form, 'contactNumber'),
    email: text(form, 'email'),
    dateOfBirth: text(form, 'dateOfBirth'),
    contactLink: text(form, 'contactLink'),
    registrationSource: text(form, 'registrationSource') as JoinApplicationFields['registrationSource'],
    department: text(form, 'department') as JoinApplicationFields['department'],
    inGameName: text(form, 'inGameName'),
    uid: text(form, 'uid'),
    playerId: text(form, 'playerId'),
  }
  const errors = validateApplicationFields(fields)
  const firstError = Object.values(errors)[0]
  if (firstError) return fail(firstError)

  const photo = form.get('photo')
  const hasPhoto = photo instanceof File && photo.size > 0
  if (hasPhoto) {
    const message = photoError(photo)
    if (message) return fail(message)
  } else if (photoRequired(fields.mainGame)) {
    return fail('Upload a profile picture.')
  }

  const supabase = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'player-photos'
  let photoPath: string | null = null

  if (hasPhoto) {
    const extension = photo.type === 'image/png' ? 'png' : photo.type === 'image/webp' ? 'webp' : 'jpg'
    photoPath = `applications/${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage.from(bucket).upload(photoPath, photo, { contentType: photo.type, cacheControl: '3600', upsert: false })
    if (uploadError) {
      console.error('Application photo upload failed:', uploadError.message)
      return fail('Your photo could not be uploaded. Please try a different image.', 500)
    }
  }

  const { error } = await supabase.from('players').insert({
    status: 'pending',
    consent_privacy: fields.privacyAccepted,
    consent_eligibility: fields.eligibilityConfirmed,
    main_game: fields.mainGame,
    first_name: fields.firstName,
    last_name: fields.lastName,
    contact_number: fields.contactNumber,
    email: fields.email,
    date_of_birth: fields.dateOfBirth,
    contact_link: fields.contactLink,
    registration_source: fields.registrationSource,
    department: fields.department || 'Clan',
    in_game_name: fields.inGameName,
    uid: fields.uid,
    player_id: fields.mainGame === 'CODM' ? fields.playerId : null,
    photo_path: photoPath,
  })

  if (error) {
    console.error('Application insert failed:', error.code, error.message)
    // Only the service key may delete; with the anon key the photo stays until an admin runs the photo clean-up.
    if (photoPath && serviceKey) await supabase.storage.from(bucket).remove([photoPath])
    return fail(databaseErrorMessage(error.code), error.code === '23505' ? 409 : 400)
  }

  return NextResponse.json({ ok: true })
}
