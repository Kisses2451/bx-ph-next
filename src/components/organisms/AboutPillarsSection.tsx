import { ArrowIcon } from '../atoms/ArrowIcon'
import { ScrollReveal } from '../atoms/ScrollReveal'

const aboutPillars = [
  { number: '01', title: 'Recruit', description: 'We identify and develop talent through focused scouting, evaluation, and a structured player pathway.' },
  { number: '02', title: 'Develop', description: 'We build a performance culture where training, feedback, and growth habits support long-term opportunity.' },
  { number: '03', title: 'Compete', description: 'We create competitive environments that turn readiness into results for players, staff, and partners.' },
]

/**
 * "How we work" on the About page: three full-width rows (Recruit, Develop, Compete) with a big number,
 * title and description. Hovering a row sweeps maroon across it from the left and nudges the arrow.
 */
export function AboutPillarsSection() {
  return (
    <section className="about-pillars" aria-labelledby="about-pillars-title">
      <div className="shared-container">
        <div className="about-pillars__head bx-display-container">
          <p className="bx-eyebrow">How we work</p>
          <h2 id="about-pillars-title" className="bx-section-title bx-display">Our pillars</h2>
        </div>
        <ol className="about-pillars__list bx-display-container">
          {aboutPillars.map((pillar, index) => (
            <li key={pillar.number}>
              <ScrollReveal variant="fade-up" index={index}>
                <div className="about-pillars__row">
                  <span className="about-pillars__number" aria-hidden="true">{pillar.number}</span>
                  <h3 className="about-pillars__title bx-display">{pillar.title}</h3>
                  <p className="about-pillars__desc bx-prose">{pillar.description}</p>
                  <ArrowIcon size={32} />
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
