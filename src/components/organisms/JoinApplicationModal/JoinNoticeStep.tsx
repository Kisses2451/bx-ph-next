import type { JoinApplicationForm, MainGame } from './joinApplicationForm'

interface JoinNoticeStepProps {
  form: JoinApplicationForm
  onSelectGame: (game: MainGame) => void
  onUpdate: (key: keyof JoinApplicationForm, value: boolean) => void
  onContinue: () => void
}

const GAMES: { value: Exclude<MainGame, ''>; label: string }[] = [
  { value: 'CODM', label: 'Call of Duty: Mobile (CODM)' },
  { value: 'HOK', label: 'Honor of Kings (HOK)' },
]

/** Step 1: privacy notice, eligibility declaration, main-game choice and the two required checkboxes. */
export function JoinNoticeStep({ form, onSelectGame, onUpdate, onContinue }: JoinNoticeStepProps) {
  const canContinue = Boolean(form.mainGame && form.privacyAccepted && form.eligibilityConfirmed)
  return (
    <>
      <div className="join__body">
        <section className="join__notice" aria-labelledby="join-privacy-title">
          <p id="join-privacy-title" className="bx-eyebrow">Data privacy notice</p>
          <p>By checking the box, I consent to the collection and processing of my personal information for membership registration, identification, and internal records, in compliance with the Data Privacy Act of 2012 (RA 10173). My data will not be shared without consent unless required by law.</p>
        </section>
        <section className="join__notice join__notice--accent" aria-labelledby="join-eligibility-title">
          <p id="join-eligibility-title" className="bx-eyebrow">Eligibility declaration</p>
          <p>By checking the box, I declare that all information I provide in this form is true, accurate, and complete to the best of my knowledge. I understand that providing false or misleading information may result in the denial, suspension, or termination of my membership in the organization.</p>
        </section>

        <fieldset className="bx-fieldset">
          <legend className="bx-field__label">Main game <span aria-hidden="true">*</span></legend>
          <div className="bx-choices bx-choices--2">
            {GAMES.map((game) => (
              <label key={game.value} className="bx-choice">
                <input type="radio" name="join-main-game" value={game.value} checked={form.mainGame === game.value} onChange={() => onSelectGame(game.value)} />
                <span>{game.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="bx-check"><input type="checkbox" checked={form.privacyAccepted} onChange={(event) => onUpdate('privacyAccepted', event.target.checked)} /><span>I have read and agree to the Data Privacy Notice.</span></label>
        <label className="bx-check"><input type="checkbox" checked={form.eligibilityConfirmed} onChange={(event) => onUpdate('eligibilityConfirmed', event.target.checked)} /><span>I confirm that I meet all eligibility requirements.</span></label>
      </div>
      <div className="join__footer join__footer--stack">
        <button type="button" className="bx-btn bx-btn--primary join__wide" disabled={!canContinue} onClick={onContinue}>Continue to application</button>
        {!canContinue ? <p className="join__hint">Select a main game and tick both boxes to continue.</p> : null}
      </div>
    </>
  )
}
