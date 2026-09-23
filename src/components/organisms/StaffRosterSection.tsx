import type { PublicStaff } from '../../types/publicStaff'
import { ScrollReveal } from '../atoms/ScrollReveal'

/** "Our staff" grid on the About page: photo (or initials), name, role and short bio. Hidden when nobody is visible. */
export function StaffRosterSection({ staff }: { staff: PublicStaff[] }) {
  if (staff.length === 0) return null

  return (
    <section className="staff-roster" aria-labelledby="staff-roster-title">
      <div className="shared-container">
        <p className="bx-eyebrow">The people behind the players</p>
        <h2 id="staff-roster-title" className="bx-section-title">Our staff</h2>
        <ul className="staff-roster__grid">
          {staff.map((member, index) => (
            <li key={member.id}>
              <ScrollReveal variant="fade-up" index={index}>
                <article className="staff-roster__card">
                  {member.photoUrl
                    // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded URL of unknown size
                    ? <img src={member.photoUrl} alt="" className="staff-roster__photo" loading="lazy" decoding="async" />
                    : <div className="staff-roster__photo staff-roster__photo--empty" aria-hidden="true">{member.name.slice(0, 2).toUpperCase()}</div>}
                  <h3 className="staff-roster__name">{member.name}</h3>
                  {member.role ? <p className="staff-roster__role">{member.role}</p> : null}
                  {member.bio ? <p className="staff-roster__bio">{member.bio}</p> : null}
                </article>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
