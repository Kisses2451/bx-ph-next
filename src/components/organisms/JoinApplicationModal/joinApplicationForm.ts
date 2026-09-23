// Data shape, starting values and validation for the "Join now" form in the browser.
// The field rules themselves live in lib/joinApplication.ts, shared with the server route that saves applications.
import { photoError, photoRequired, validateApplicationFields, type JoinApplicationFields } from '../../../lib/joinApplication'

export type { MainGame, RegistrationSource } from '../../../lib/joinApplication'

/** The four screens of the join flow, in order. */
export type JoinFlowStep = 'notice' | 'form' | 'review' | 'success'

export type JoinApplicationForm = JoinApplicationFields & {
  photo: File | null
  /** Hidden anti-spam field. Real people never fill it; if it has a value the submission is ignored. */
  honeypot: string
}

export const emptyJoinApplicationForm: JoinApplicationForm = { mainGame: '', privacyAccepted: false, eligibilityConfirmed: false, firstName: '', lastName: '', contactNumber: '', email: '', dateOfBirth: '', contactLink: '', registrationSource: '', department: '', inGameName: '', uid: '', playerId: '', photo: null, honeypot: '' }

/** Returns an error message per invalid field, keyed by field name. An empty object means the form is valid. */
export function validateJoinApplication(form: JoinApplicationForm) {
  const errors = validateApplicationFields(form)
  // The notice step checks these two; they are not fields on the form step.
  delete errors.privacyAccepted
  delete errors.eligibilityConfirmed
  delete errors.mainGame
  if (form.photo) {
    const message = photoError(form.photo)
    if (message) errors.photo = message
  } else if (photoRequired(form.mainGame)) {
    errors.photo = 'Upload a profile picture.'
  }
  return errors
}
