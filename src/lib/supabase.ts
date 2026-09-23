import { createClient, type Session, type User } from '@supabase/supabase-js'
import { normalizeLogoToSquare } from './images'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.')
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null

export const isSupabaseConfigured = Boolean(supabase)

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        demo: true,
        message: 'Supabase is not configured. Demo admin mode is active in development.',
        user: { id: 'demo-admin-user', email } as User,
        session: { access_token: 'demo-token' } as Session,
      }
    }

    return {
      success: false,
      message: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.',
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, user: data.user, session: data.session, message: 'Signed in successfully.' }
}

export async function signInWithOAuth(provider: 'google' | 'github') {
  if (!supabase) {
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        demo: true,
        message: `OAuth demo requested for ${provider}. Configure Supabase to enable live sign-in.`,
      }
    }

    return {
      success: false,
      message: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.',
    }
  }

  const { error } = await supabase.auth.signInWithOAuth({ provider })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: 'Redirecting to OAuth provider.' }
}

export function validateUploadedImage(file: File, maxSizeMB = 5) {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Only JPG, PNG, and WEBP images are allowed.' }
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, message: `Image must be ${maxSizeMB}MB or smaller.` }
  }

  return { valid: true, message: 'Image is valid.' }
}

export async function uploadPartnerLogo(file: File): Promise<{ success: boolean; path?: string; publicUrl?: string; message: string; normalized?: Awaited<ReturnType<typeof normalizeLogoToSquare>> }> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return { success: false, path: undefined, publicUrl: undefined, message: 'Only JPG, PNG, and WebP images are accepted. SVG and GIF files are not supported.' }
  if (file.size > 10 * 1024 * 1024) return { success: false, path: undefined, publicUrl: undefined, message: 'Logo files must be 10 MB or smaller.' }
  if (!supabase) return { success: false, path: undefined, publicUrl: undefined, message: 'Supabase is not configured.' }
  let normalized: Awaited<ReturnType<typeof normalizeLogoToSquare>>
  try {
    normalized = await normalizeLogoToSquare(file)
  } catch (error) {
    return { success: false, path: undefined, publicUrl: undefined, message: error instanceof Error ? error.message : 'Unable to process the logo.' }
  }
  const extension = normalized.format
  const path = `partners/${crypto.randomUUID()}.${extension}`
  try {
    const { error } = await supabase.storage.from('site-media').upload(path, normalized.blob, { contentType: normalized.blob.type, cacheControl: '3600', upsert: false })
    if (error) return { success: false, path: undefined, publicUrl: undefined, message: error.message }
    return { success: true, path, publicUrl: supabase.storage.from('site-media').getPublicUrl(path).data.publicUrl, message: 'Logo uploaded.', normalized }
  } catch (error) {
    await supabase.storage.from('site-media').remove([path])
    return { success: false, path: undefined, publicUrl: undefined, message: error instanceof Error ? error.message : 'Unable to process the image.' }
  }
}

export async function uploadPlayerPhoto(
  file: File,
): Promise<{ success: boolean; publicUrl?: string; path?: string; message: string }> {
  const validation = validateUploadedImage(file)
  if (!validation.valid) {
    return { success: false, publicUrl: undefined, message: validation.message }
  }

  if (!supabase) {
    return {
      success: true,
      publicUrl: URL.createObjectURL(file),
      path: undefined,
      message: 'Using a local preview URL because Supabase storage is not configured.',
    }
  }

  // The storage policy only lets visitors upload into the "applications/" folder, and never overwrite (no upsert).
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const fileName = `applications/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'player-photos'

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type })

  if (uploadError) {
    return { success: false, publicUrl: undefined, message: uploadError.message }
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)

  return {
    success: true,
    publicUrl: data.publicUrl,
    path: fileName,
    message: 'Photo uploaded.',
  }
}
