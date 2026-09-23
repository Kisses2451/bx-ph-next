'use client'

import { useEffect, useRef } from 'react'

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string
  remove: (widgetId: string) => void
}

declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise: Promise<void> | null = null

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve()
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => { scriptPromise = null; reject(new Error('Turnstile failed to load')) }
    document.head.appendChild(script)
  })
  return scriptPromise
}

/** The site key from .env.local; when it is empty the CAPTCHA is switched off everywhere. */
export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

/**
 * Cloudflare Turnstile "I am human" check. Calls `onToken` with a token when the visitor passes, and with ''
 * when the token expires or fails. Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set.
 */
export function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  useEffect(() => {
    if (!turnstileSiteKey || !containerRef.current) return
    let widgetId: string | null = null
    let cancelled = false
    loadTurnstile().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'dark',
        callback: (token: string) => onTokenRef.current(token),
        'expired-callback': () => onTokenRef.current(''),
        'error-callback': () => onTokenRef.current(''),
      })
    }).catch(() => onTokenRef.current(''))
    return () => { cancelled = true; if (widgetId && window.turnstile) window.turnstile.remove(widgetId) }
  }, [])

  if (!turnstileSiteKey) return null
  return <div ref={containerRef} className="turnstile" />
}
