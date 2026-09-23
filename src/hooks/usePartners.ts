import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SupabasePartner } from '../types/player'

export const PARTNERS_UPDATED_EVENT = 'partners-updated'
export const PARTNER_SELECT = 'id,name,category,description,logo_url,website_url,is_visible,sort_order,created_at,updated_at'
export const PUBLIC_PARTNER_SELECT = 'id,name,logo_url,website_url'

export interface PublicPartner {
  id: string
  name: string
  logoUrl: string | null
  websiteUrl: string | null
}

export function useAdminPartners() {
  const [partners, setPartners] = useState<SupabasePartner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const [retryKey, setRetryKey] = useState(0)
  const retry = useCallback(() => setRetryKey((key) => key + 1), [])
  const load = useCallback(async () => {
    if (!supabase) { setError(new Error('Supabase is not configured')); setIsLoading(false); return }
    setIsLoading(true)
    const { data, error: queryError } = await supabase.from('partners').select(PARTNER_SELECT).order('sort_order', { ascending: true }).order('created_at', { ascending: true })
    if (queryError) setError(queryError)
    else setPartners((data ?? []) as SupabasePartner[])
    setIsLoading(false)
  }, [])
  useEffect(() => { void load() }, [load, retryKey])
  return { partners, isLoading, error, retry, refresh: load }
}

export function usePartners(initialPartners?: PublicPartner[]) {
  const [partners, setPartners] = useState<PublicPartner[]>(initialPartners ?? [])
  const [isLoading, setIsLoading] = useState(!initialPartners)
  const [error, setError] = useState<unknown>(null)
  const [retryKey, setRetryKey] = useState(0)
  const retry = useCallback(() => setRetryKey((key) => key + 1), [])

  useEffect(() => {
    let ignore = false
    const load = async () => {
      if (!supabase) {
        setError(new Error('Supabase is not configured'))
        setIsLoading(false)
        return
      }
      const { data, error: queryError } = await supabase
        .from('partners')
        .select(PUBLIC_PARTNER_SELECT)
        .eq('is_visible', true)
        .order('sort_order')
      if (ignore) return
      if (queryError) setError(queryError)
      else setPartners((data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        logoUrl: item.logo_url,
        websiteUrl: item.website_url,
      })))
      setIsLoading(false)
    }
    // The server already rendered this data (app/**/page.tsx, refreshed every 60 s), so skip the first
    // browser fetch and only reload on Retry or when the admin dashboard announces a change.
    if (!initialPartners || retryKey > 0) {
      setIsLoading(true)
      setError(null)
      void load()
    }
    const handleUpdate = () => { void load() }
    window.addEventListener(PARTNERS_UPDATED_EVENT, handleUpdate)
    return () => { ignore = true; window.removeEventListener(PARTNERS_UPDATED_EVENT, handleUpdate) }
  }, [retryKey])

  return { partners, isLoading, error, retry }
}