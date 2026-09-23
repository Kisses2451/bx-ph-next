'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'

type UserRole = 'guest' | 'admin'

type PlayerContextValue = {
  role: UserRole
  isAuthenticated: boolean
  /** Email of the signed-in user, or null when signed out. Shown in the admin dashboard header. */
  email: string | null
  authLoading: boolean
  authError: string | null
  login: (nextRole?: UserRole) => void
  logout: () => void
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined)

async function resolveAdminRole(client: NonNullable<typeof supabase>, userId: string) {
  const { data, error } = await client
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    console.error('Admin role lookup failed:', error)
    return 'guest'
  }

  if (!data) {
    return 'guest'
  }

  return data.role === 'admin' ? 'admin' : 'guest'
}

// Shared app state keeps the admin dashboard and application flow coordinated.
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<UserRole>('guest')
  const [email, setEmail] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const client = supabase

    if (!client) {
      setIsAuthenticated(false)
      setRole('guest')
      setAuthLoading(false)
      setAuthError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.')
      return
    }

    let ignore = false

    const syncSession = async () => {
      try {
        const { data: { session }, error } = await client.auth.getSession()
        if (error) {
          throw error
        }

        if (ignore) return

        const user = session?.user
        if (!user) {
          setEmail(null)
          setIsAuthenticated(false)
          setRole('guest')
          setAuthError(null)
          setAuthLoading(false)
          return
        }

        const nextRole = await resolveAdminRole(client, user.id)
        setIsAuthenticated(Boolean(user))
        setEmail(user.email ?? null)
        setRole(nextRole)
        setAuthError(null)
      } catch (error) {
        console.error('Supabase session sync failed:', error)
        if (!ignore) {
          setIsAuthenticated(false)
          setRole('guest')
          setAuthError('Unable to validate the admin session. Check your Supabase configuration and auth settings.')
        }
      } finally {
        if (!ignore) setAuthLoading(false)
      }
    }

    syncSession()

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user
      if (!user) {
        setEmail(null)
        setIsAuthenticated(false)
        setRole('guest')
        setAuthError(null)
        setAuthLoading(false)
        return
      }

      const nextRole = await resolveAdminRole(client, user.id)
      setIsAuthenticated(Boolean(user))
      setEmail(user.email ?? null)
      setRole(nextRole)
      setAuthError(null)
      setAuthLoading(false)
    })

    return () => {
      ignore = true
      subscription.unsubscribe()
    }
  }, [setIsAuthenticated, setRole])

  const login = useCallback((nextRole: UserRole = 'admin') => {
    setIsAuthenticated(true)
    setRole(nextRole)
  }, [setIsAuthenticated, setRole])

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setEmail(null)
    setIsAuthenticated(false)
    setRole('guest')
    setAuthError(null)
  }, [setIsAuthenticated, setRole])

  const value = useMemo<PlayerContextValue>(() => ({
    role,
    isAuthenticated,
    email,
    authLoading,
    authError,
    login,
    logout,
  }), [role, isAuthenticated, email, authLoading, authError, login, logout])

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayers() {
  const context = useContext(PlayerContext)

  if (!context) {
    throw new Error('usePlayers must be used within a PlayerProvider')
  }

  return context
}
