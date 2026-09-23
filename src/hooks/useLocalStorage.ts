import { useEffect, useState } from 'react'

// Encapsulates browser persistence so auth and list state survive reloads.
// Next.js renders on the server first, where localStorage doesn't exist, so the
// stored value is loaded after mount to keep server and client HTML identical.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored) setValue(JSON.parse(stored) as T)
    } catch {
      // Ignore unreadable or unavailable storage and keep the initial value.
    }
    setHasLoaded(true)
  }, [key])

  useEffect(() => {
    if (!hasLoaded) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or blocked; nothing else to do.
    }
  }, [hasLoaded, key, value])

  return [value, setValue] as const
}
