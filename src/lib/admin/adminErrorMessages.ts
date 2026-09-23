// Turns Supabase/Postgres error codes into messages an admin can act on.

/** 23505 = duplicate, 42501 = not allowed by row-level security, 23514 = failed a check constraint. */
export function mapSupabaseError(error: { code?: string; message?: string }) {
  if (error.code === '23505') return 'This UID is already registered for that game.'
  if (error.code === '42501') return 'Admin permission required.'
  if (error.code === '23514') return error.message?.match(/\(([^)]+)\)/)?.[1] ? `Invalid value for ${error.message.match(/\(([^)]+)\)/)?.[1]}.` : 'A field value is outside the allowed limits.'
  return error.message || 'Something went wrong. Please try again.'
}

/** Same as mapSupabaseError but with wording for latest updates. */
export function mapLatestUpdateError(error: { code?: string; message?: string }) {
  if (error.code === '23505') return 'This update conflicts with an existing record.'
  if (error.code === '42501') return 'Admin permission required.'
  if (error.code === '23514') return 'A field value is outside the allowed limits.'
  return error.message || 'Something went wrong. Please try again.'
}
