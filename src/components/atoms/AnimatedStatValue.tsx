import { useEffect, useRef, useState } from 'react'
import { PhilippineFlagIcon } from './PhilippineFlagIcon'

interface AnimatedStatValueProps {
  /** Text to show, e.g. "300+". Numbers count up from 0; "PH" shows the flag; "—" shows as-is. */
  value: string
  /** When true the value is shown without the count-up animation. */
  staticValue: boolean
}

/** A big stat number that counts up once it scrolls into view (used on the About page stats row). */
export function AnimatedStatValue({ value, staticValue }: AnimatedStatValueProps) {
  const [display, setDisplay] = useState(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDisplay(value)
    if (staticValue || !ref.current || value === '—' || value === 'PH') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let started = false
    const startAnimation = () => {
      if (started) return
      started = true
      if (reduceMotion) { setDisplay(value); return }
      const target = Number.parseInt(value, 10)
      const suffix = value.replace(String(target), '')
      const start = performance.now()
      const animate = (now: number) => {
        const progress = Math.min((now - start) / 700, 1)
        setDisplay(`${Math.round(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`)
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }
    let observer: IntersectionObserver | null = null
    try {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        observer?.disconnect()
        startAnimation()
      }, { threshold: 0.45 })
      observer.observe(ref.current)
    } catch {
      startAnimation()
    }
    const initialCheck = window.setTimeout(() => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect && rect.top < window.innerHeight * 0.9 && rect.bottom > 0) startAnimation()
    }, 120)
    return () => { observer?.disconnect(); window.clearTimeout(initialCheck); started = true }
  }, [staticValue, value])

  return <div ref={ref} className="about-stat-value">{value === 'PH' ? <PhilippineFlagIcon /> : display}</div>
}
