import { ScrollReveal } from '../atoms/ScrollReveal'

const missionVisionCards = [
  { number: '01', label: 'Mission', title: 'Empowering Players', description: 'To build a strong, supportive esports community that empowers players, members and creators through growth, exposure, and partnerships. Bloodlust Philippines nurtures competitive and creative talents in a positive and inclusive environment.' },
  { number: '02', label: 'Vision', title: 'Forging Legacy', description: 'To make Bloodlust Philippines a respected name in global esports — promoting excellence, unity, and sportsmanship across multiple game titles and creating a thriving ecosystem for all gamers.' },
]

/**
 * Mission & vision on the About page as a full-width split: the mission on the page background, the vision on
 * solid maroon. Each half has a huge outlined "01" / "02" watermark in its corner.
 */
export function MissionVisionSection() {
  return (
    <section className="about-purpose" aria-label="Mission and vision">
      {missionVisionCards.map((card, index) => (
        <article key={card.number} className={index === 1 ? 'about-purpose__card about-purpose__card--accent bx-display-container' : 'about-purpose__card bx-display-container'}>
          <span className="about-purpose__watermark bx-outline-text bx-display" aria-hidden="true">{card.number}</span>
          <p className="bx-eyebrow about-purpose__eyebrow">{card.number} / {card.label}</p>
          <ScrollReveal variant={index === 0 ? 'slide-right' : 'slide-left'}>
            <div className="about-purpose__content bx-display-container">
              <h2 className="about-purpose__title bx-display">{card.title}</h2>
              <p className="about-purpose__text bx-prose">{card.description}</p>
            </div>
          </ScrollReveal>
        </article>
      ))}
    </section>
  )
}
