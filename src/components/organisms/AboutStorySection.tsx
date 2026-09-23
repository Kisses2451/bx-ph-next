'use client'

import { useEffect, useRef } from 'react'
import { ScrollReveal } from '../atoms/ScrollReveal'
import { aboutPageContent } from '../../data/siteContent'

/**
 * "FROM PASSION TO PURPOSE" story block on the About page. Left: a vertical "OUR STORY" rail, the big two-line
 * title and game title chips. Right: the story paragraphs, which start dim and light up one by one as they
 * scroll into the middle of the screen. Text lives in data/siteContent.ts.
 */
export function AboutStorySection() {
  const story = aboutPageContent.story
  const bodyRef = useRef<HTMLDivElement>(null)

  // Sets data-lit="true" on each paragraph once it reaches the middle band of the screen (CSS fades it to full strength).
  useEffect(() => {
    const paragraphs = bodyRef.current?.querySelectorAll<HTMLElement>('.about-origin__paragraph')
    if (!paragraphs?.length) return
    const lightAll = () => paragraphs.forEach((paragraph) => { paragraph.dataset.lit = 'true' })
    if (typeof IntersectionObserver === 'undefined') { lightAll(); return }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) (entry.target as HTMLElement).dataset.lit = 'true'
    }), { rootMargin: '-35% 0px -35% 0px' })
    paragraphs.forEach((paragraph) => observer.observe(paragraph))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="about-origin" aria-labelledby="about-story-title">
      <p className="about-origin__rail" aria-hidden="true">{story.railLabel}</p>
      <div className="shared-container about-origin__grid">
        <ScrollReveal variant="slide-right" className="about-origin__head bx-display-container">
          <div>
            <p className="bx-eyebrow">{story.eyebrow}</p>
            <h2 id="about-story-title" className="about-origin__title bx-display">
              {story.headingPrimary}<br /><span className="about-origin__title-accent">{story.headingSecondary}</span>
            </h2>
          </div>
          <ul className="about-origin__chips" aria-label="Active game titles">
            {story.games.map((game) => <li key={game.label}>{game.label}</li>)}
          </ul>
        </ScrollReveal>
        <div ref={bodyRef} className="about-origin__body">
          {story.paragraphs.map((paragraph) => <p key={paragraph} className="about-origin__paragraph bx-prose">{paragraph}</p>)}
        </div>
      </div>
    </section>
  )
}
