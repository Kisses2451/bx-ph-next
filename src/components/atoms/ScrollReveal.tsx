import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export type ScrollRevealVariant = 'fade-up' | 'slide-left' | 'slide-right' | 'scale-in' | 'mask-line'

interface ScrollRevealProps {
  children: ReactNode
  variant?: ScrollRevealVariant
  index?: number
  className?: string
}

let hiddenWarningShown = false

/**
 * Fades/slides its children in the first time they scroll into view.
 * Content already on screen, reduced-motion users and no-JS visitors see it immediately.
 * `index` staggers items in a list (used by the CSS as --i).
 */
export function ScrollReveal({ children, variant = 'fade-up', index = 0, className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let observer: IntersectionObserver | null = null
    let fallbackTimer: number | undefined
    let revealed = false
    const reveal = () => {
      if (revealed) return
      revealed = true
      element.removeAttribute('data-reveal')
      element.setAttribute('data-revealed', 'true')
      observer?.unobserve(element)
      if (fallbackTimer) window.clearTimeout(fallbackTimer)
    }

    try {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const belowFold = element.getBoundingClientRect().top >= window.innerHeight
      if (!document.documentElement.classList.contains('js') || reducedMotion || !belowFold || typeof IntersectionObserver === 'undefined') {
        reveal()
        return
      }

      element.setAttribute('data-reveal', 'pending')
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) reveal()
      }, { rootMargin: '0px 0px 120px', threshold: 0.01 })
      observer.observe(element)
      fallbackTimer = window.setTimeout(reveal, 1200)
      if ((process.env.NODE_ENV !== 'production')) {
        window.setTimeout(() => {
          if (!revealed && !hiddenWarningShown && getComputedStyle(element).opacity === '0') {
            hiddenWarningShown = true
            console.warn('Reveal still hidden after 2 seconds', element)
          }
        }, 2000)
      }
    } catch (error) {
      if ((process.env.NODE_ENV !== 'production')) console.warn('Reveal initialization failed', error)
      reveal()
    }

    return () => {
      observer?.unobserve(element)
      if (fallbackTimer) window.clearTimeout(fallbackTimer)
    }
  }, [])

  return <div ref={ref} className={`reveal reveal--${variant} ${className}`.trim()} style={{ '--i': index } as CSSProperties}>{children}</div>
}
