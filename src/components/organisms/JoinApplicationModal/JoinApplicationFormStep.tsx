import type { RefObject } from 'react'
import { photoRequired } from '../../../lib/joinApplication'
import { DEPARTMENTS_BY_GAME } from '../../../types/player'
import type { JoinApplicationForm } from './joinApplicationForm'

interface JoinApplicationFormStepProps {
  form: JoinApplicationForm
  errors: Record<string, string>
  photoPreview: string
  fileInputRef: RefObject<HTMLInputElement | null>
  onUpdate: (key: keyof JoinApplicationForm, value: string | boolean | File | null) => void
  /** Re-validates one field when the user leaves it. */
  onFieldBlur: (key: keyof JoinApplicationForm) => void
  onBack: () => void
  onReview: () => void
}

/** Step 2: the application itself. Left column = personal details, right column = game details and photo. */
export function JoinApplicationFormStep({ form, errors, photoPreview, fileInputRef, onUpdate, onFieldBlur, onBack, onReview }: JoinApplicationFormStepProps) {
  // One labelled text input bound to a form key; the input's id (join-<key>) lets the error summary focus it.
  const field = (key: keyof JoinApplicationForm, label: string, options: { type?: string; placeholder?: string; autoComplete?: string; hint?: string } = {}) => {
    const id = `join-${key}`
    const error = errors[key]
    return (
      <div className="bx-field">
        <label className="bx-field__label" htmlFor={id}>{label} <span aria-hidden="true">*</span></label>
        <input
          id={id}
          className="bx-input"
          type={options.type ?? 'text'}
          value={String(form[key] ?? '')}
          placeholder={options.placeholder}
          autoComplete={options.autoComplete}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : options.hint ? `${id}-hint` : undefined}
          onChange={(event) => onUpdate(key, event.target.value)}
          onBlur={() => onFieldBlur(key)}
        />
        {options.hint ? <p id={`${id}-hint`} className="bx-field__hint">{options.hint}</p> : null}
        {error ? <p id={`${id}-error`} className="bx-field__error">{error}</p> : null}
      </div>
    )
  }
  const needsPhoto = photoRequired(form.mainGame)

  return (
    <>
      <div className="join__body">
        <div className="join__grid">
          <section className="join__column" aria-labelledby="join-basic-title">
            <h3 id="join-basic-title" className="join__section-title">Basic information</h3>
            <div className="join__pair">{field('firstName', 'First name', { autoComplete: 'given-name' })}{field('lastName', 'Last name', { autoComplete: 'family-name' })}</div>
            {field('contactNumber', 'Contact number', { type: 'tel', placeholder: '09XXXXXXXXX', autoComplete: 'tel' })}
            {field('email', 'Email address', { type: 'email', autoComplete: 'email' })}
            {field('dateOfBirth', 'Date of birth', { type: 'date', autoComplete: 'bday' })}
            {field('contactLink', 'Facebook or Instagram link', { type: 'url', placeholder: 'https://facebook.com/…' })}
            <fieldset className="bx-fieldset" aria-describedby={errors.registrationSource ? 'join-registrationSource-error' : undefined}>
              <legend className="bx-field__label">Where did you register? <span aria-hidden="true">*</span></legend>
              <div className="bx-choices bx-choices--2">
                {(['Online Recruitment', 'LAN Event'] as const).map((source, index) => (
                  <label key={source} className="bx-choice">
                    <input id={index === 0 ? 'join-registrationSource' : undefined} type="radio" name="join-registration-source" value={source} checked={form.registrationSource === source} onChange={() => onUpdate('registrationSource', source)} />
                    <span>{source}</span>
                  </label>
                ))}
              </div>
              {errors.registrationSource ? <p id="join-registrationSource-error" className="bx-field__error">{errors.registrationSource}</p> : null}
            </fieldset>
          </section>

          <section className="join__column" aria-labelledby="join-game-title">
            <h3 id="join-game-title" className="join__section-title">Game information · {form.mainGame}</h3>
            {form.mainGame ? (
              <fieldset className="bx-fieldset" aria-describedby={errors.department ? 'join-department-error' : undefined}>
                <legend className="bx-field__label">Which department are you applying for? <span aria-hidden="true">*</span></legend>
                <div className="bx-choices bx-choices--2">
                  {DEPARTMENTS_BY_GAME[form.mainGame].map((department, index) => (
                    <label key={department} className="bx-choice">
                      <input id={index === 0 ? 'join-department' : undefined} type="radio" name="join-department" value={department} checked={form.department === department} onChange={() => onUpdate('department', department)} />
                      <span>{department}</span>
                    </label>
                  ))}
                </div>
                {form.mainGame === 'HOK' ? <p className="bx-field__hint">Only Clan is open for Honor of Kings right now.</p> : null}
                {errors.department ? <p id="join-department-error" className="bx-field__error">{errors.department}</p> : null}
              </fieldset>
            ) : null}
            {field('inGameName', 'In-game name (IGN)')}
            {field('uid', 'Unique ID (UID)')}
            {form.mainGame === 'CODM' ? field('playerId', 'Player ID', { hint: 'CODM › Settings › User Settings' }) : null}

            <div className="bx-field">
              <label className="bx-field__label" htmlFor="join-photo">Photo {needsPhoto ? <span aria-hidden="true">*</span> : <span className="bx-field__optional">(optional)</span>}</label>
              {needsPhoto ? <p className="join__notice join__notice--accent join__notice--small"><strong>Must read:</strong> white background, half-body photo, no selfies.</p> : null}
              <input
                ref={fileInputRef}
                id="join-photo"
                className="bx-input bx-input--file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-invalid={errors.photo ? true : undefined}
                aria-describedby={errors.photo ? 'join-photo-error' : 'join-photo-hint'}
                onChange={(event) => onUpdate('photo', event.target.files?.[0] ?? null)}
              />
              <p id="join-photo-hint" className="bx-field__hint">JPG, PNG or WEBP, up to 5MB.</p>
              {photoPreview ? (
                <div className="join__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local preview (blob: URL) */}
                  <img src={photoPreview} alt="Your selected photo" />
                  <button type="button" className="bx-btn bx-btn--ghost bx-btn--sm" onClick={() => { onUpdate('photo', null); if (fileInputRef.current) fileInputRef.current.value = '' }}>Remove</button>
                </div>
              ) : null}
              {errors.photo ? <p id="join-photo-error" className="bx-field__error">{errors.photo}</p> : null}
            </div>

            {/* Spam trap: hidden from people, filled in by bots. */}
            <input className="bx-sr-only" aria-hidden="true" tabIndex={-1} autoComplete="off" name="website" value={form.honeypot} onChange={(event) => onUpdate('honeypot', event.target.value)} />
          </section>
        </div>
      </div>
      <div className="join__footer">
        <button type="button" className="bx-btn bx-btn--ghost bx-btn--sm" onClick={onBack}>Back</button>
        <button type="button" className="bx-btn bx-btn--primary bx-btn--sm" onClick={onReview}>Review application</button>
      </div>
    </>
  )
}
