import { TurnstileWidget } from '../../atoms/TurnstileWidget'
import type { JoinApplicationForm } from './joinApplicationForm'

interface JoinReviewStepProps {
  form: JoinApplicationForm
  photoPreview: string
  /** Error from the last submit attempt, shown above the summary. */
  submitError: string
  isSubmitting: boolean
  /** Receives the CAPTCHA token ('' when it expires). */
  onCaptchaToken: (token: string) => void
  onEdit: () => void
  onSubmit: () => void
}

/** Step 3: read-only summary of everything entered, the "I am human" check, and "Edit" / "Confirm & submit". */
export function JoinReviewStep({ form, photoPreview, submitError, isSubmitting, onCaptchaToken, onEdit, onSubmit }: JoinReviewStepProps) {
  const basic: [string, string][] = [
    ['Name', `${form.firstName} ${form.lastName}`],
    ['Email', form.email],
    ['Contact number', form.contactNumber],
    ['Date of birth', form.dateOfBirth],
    ['Contact link', form.contactLink],
    ['Registered at', form.registrationSource],
  ]
  const game: [string, string][] = [
    ['Main game', form.mainGame],
    ['Department', form.department],
    ['IGN', form.inGameName],
    ['UID', form.uid],
    ...(form.mainGame === 'CODM' ? [['Player ID', form.playerId] as [string, string]] : []),
  ]
  const list = (rows: [string, string][]) => <dl className="join__summary">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl>

  return (
    <>
      <div className="join__body">
        <p>Please check that everything is correct before you submit.</p>
        {submitError ? <p className="join__error" role="alert">{submitError}</p> : null}
        <div className="join__grid">
          <section className="join__card" aria-labelledby="join-review-basic"><h3 id="join-review-basic" className="join__section-title">Basic information</h3>{list(basic)}</section>
          <section className="join__card" aria-labelledby="join-review-game">
            <h3 id="join-review-game" className="join__section-title">Game information</h3>{list(game)}
            {/* eslint-disable-next-line @next/next/no-img-element -- local preview (blob: URL) */}
            {photoPreview ? <img className="join__review-photo" src={photoPreview} alt="Your application photo" /> : null}
          </section>
        </div>
        <TurnstileWidget onToken={onCaptchaToken} />
      </div>
      <div className="join__footer">
        <button type="button" className="bx-btn bx-btn--ghost bx-btn--sm" onClick={onEdit} disabled={isSubmitting}>Edit information</button>
        <button type="button" className="bx-btn bx-btn--primary bx-btn--sm" onClick={onSubmit} disabled={isSubmitting} aria-busy={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Confirm & submit'}</button>
      </div>
    </>
  )
}
