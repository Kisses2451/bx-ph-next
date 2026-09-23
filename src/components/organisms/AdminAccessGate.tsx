import { FormControl, FormLabel, Input, Spinner, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useState, type ReactNode } from 'react'
import { usePlayers } from '../../context/PlayerContext'
import { signInWithEmail, supabase } from '../../lib/supabase'

interface AdminAccessGateProps {
  children: ReactNode
}

/**
 * Shows `children` only to signed-in admins. Otherwise shows a spinner while the session is
 * checked, an admin sign-in form, or a "not authorized" message with a Sign out button.
 * Note: this only hides the UI in the browser; Supabase row-level security must protect the data.
 */
export function AdminAccessGate({ children }: AdminAccessGateProps) {
  const { isAuthenticated, role, authLoading, authError, login, logout } = usePlayers()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (authLoading) {
    return (
      <section className="admin-gate" aria-label="Admin access">
        <div className="admin-gate__card bx-gradient-border">
          <div className="admin-gate__inner bx-gradient-border__inner">
            <p className="bx-eyebrow">Restricted area</p>
            <Spinner size="lg" color="brand.500" alignSelf="center" />
            <Text textAlign="center">Checking admin session...</Text>
          </div>
        </div>
        <NextLink className="admin-gate__back" href="/">← Back to the website</NextLink>
      </section>
    )
  }

  if (isAuthenticated && role === 'admin') {
    return children
  }

  if (isAuthenticated && role !== 'admin') {
    return (
      <section className="admin-gate" aria-labelledby="admin-gate-title">
        <div className="admin-gate__card bx-gradient-border">
          <div className="admin-gate__inner bx-gradient-border__inner">
            <p className="bx-eyebrow">Restricted area</p>
            <h1 id="admin-gate-title" className="admin-gate__title bx-display">Admin <span className="bx-outline-text">access</span></h1>
            <p className="admin-gate__error" role="alert">You are signed in, but this account is not authorized for admin access.</p>
            <button type="button" className="bx-btn bx-btn--ghost" onClick={() => logout()}>Sign out</button>
          </div>
        </div>
        <NextLink className="admin-gate__back" href="/">← Back to the website</NextLink>
      </section>
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setFormError('')

    const result = await signInWithEmail(email, password)

    if (!result.success) {
      setFormError(result.message ?? 'Authentication failed.')
      setSubmitting(false)
      return
    }

    if (!supabase && process.env.NODE_ENV === 'development') {
      login('admin')
      setSubmitting(false)
      return
    }

    if (!supabase || !result.user?.id) {
      setFormError('This account is not authorized for admin access.')
      setSubmitting(false)
      return
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', result.user.id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Admin authorization lookup failed:', error)
      setFormError('Unable to validate admin access right now.')
      setSubmitting(false)
      return
    }

    if (data?.role !== 'admin') {
      setFormError('This account is not authorized for admin access.')
      setSubmitting(false)
      return
    }

    login('admin')
    setSubmitting(false)
  }

  return (
    <section className="admin-gate" aria-labelledby="admin-gate-title">
      <div className="admin-gate__card bx-gradient-border">
        <div className="admin-gate__inner bx-gradient-border__inner">
          <p className="bx-eyebrow">Restricted area</p>
          <h1 id="admin-gate-title" className="admin-gate__title bx-display">Admin <span className="bx-outline-text">access</span></h1>
          <p className="admin-gate__lead">Sign in with your admin account to manage the website.</p>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </FormControl>

              {(authError || formError) && <p className="admin-gate__error" role="alert">{authError ?? formError}</p>}

              <button type="submit" className="bx-btn bx-btn--primary bx-shine admin-gate__submit" disabled={submitting} aria-busy={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</button>
            </Stack>
          </form>
        </div>
      </div>
      <NextLink className="admin-gate__back" href="/">← Back to the website</NextLink>
    </section>
  )
}
