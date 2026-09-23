// Rules for the "Join now" application that both the browser (to show errors early) and the server route
// app/api/apply/route.ts (to reject bad data) use. Keep them in one place so the two never disagree.
import { DEPARTMENTS_BY_GAME } from '../types/player'

export type MainGame = 'CODM' | 'HOK' | ''
export type RegistrationSource = 'Online Recruitment' | 'LAN Event' | ''

/** The text answers of an application (the photo is handled separately). */
export type JoinApplicationFields = {
  mainGame: MainGame
  privacyAccepted: boolean
  eligibilityConfirmed: boolean
  firstName: string
  lastName: string
  contactNumber: string
  email: string
  dateOfBirth: string
  contactLink: string
  registrationSource: RegistrationSource
  department: 'Clan' | 'Community' | ''
  inGameName: string
  uid: string
  playerId: string
}

export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Philippine mobile number: 09XXXXXXXXX or +639XXXXXXXXX. */
const phonePattern = /^(09\d{9}|\+639\d{9})$/
/** Facebook or Instagram profile URL. */
const socialPattern = /^https?:\/\/(www\.)?(facebook\.com|fb\.com|instagram\.com)\/.+/i

/** A photo is required for CODM applications and optional for HOK (same rule as the database). */
export function photoRequired(mainGame: MainGame) {
  return mainGame === 'CODM'
}

/** Checks a photo's type and size. Returns an error message, or '' when it is fine. */
export function photoError(file: { type: string; size: number }) {
  if (!(PHOTO_TYPES as readonly string[]).includes(file.type)) return 'Use a JPG, PNG or WEBP image.'
  if (file.size > PHOTO_MAX_BYTES) return 'The photo must be 5MB or smaller.'
  return ''
}

/** Returns an error message per invalid field, keyed by field name. An empty object means the answers are valid. */
export function validateApplicationFields(fields: JoinApplicationFields) {
  const errors: Record<string, string> = {}
  if (fields.mainGame !== 'CODM' && fields.mainGame !== 'HOK') errors.mainGame = 'Choose your main game.'
  if (!fields.privacyAccepted) errors.privacyAccepted = 'Please accept the Data Privacy Notice.'
  if (!fields.eligibilityConfirmed) errors.eligibilityConfirmed = 'Please confirm you meet the eligibility requirements.'
  if (!fields.firstName.trim() || fields.firstName.trim().length > 60) errors.firstName = 'First name is required (up to 60 characters).'
  if (!fields.lastName.trim() || fields.lastName.trim().length > 60) errors.lastName = 'Last name is required (up to 60 characters).'
  if (!phonePattern.test(fields.contactNumber.trim())) errors.contactNumber = 'Use 09XXXXXXXXX or +639XXXXXXXXX.'
  if (!emailPattern.test(fields.email.trim()) || fields.email.trim().length > 254) errors.email = 'Enter a valid email address.'
  const birth = new Date(fields.dateOfBirth)
  if (!fields.dateOfBirth || Number.isNaN(birth.getTime()) || birth >= new Date() || birth <= new Date('1900-01-01')) errors.dateOfBirth = 'Enter a valid past date.'
  if (!socialPattern.test(fields.contactLink.trim()) || fields.contactLink.trim().length > 300) errors.contactLink = 'Use a Facebook, fb.com, or Instagram URL.'
  if (fields.registrationSource !== 'Online Recruitment' && fields.registrationSource !== 'LAN Event') errors.registrationSource = 'Choose a registration source.'
  if (!fields.inGameName.trim() || fields.inGameName.trim().length > 40) errors.inGameName = 'In Game Name is required (up to 40 characters).'
  if (!fields.uid.trim() || fields.uid.trim().length > 40) errors.uid = 'Unique ID is required (up to 40 characters).'
  const allowedDepartments: readonly string[] = fields.mainGame ? DEPARTMENTS_BY_GAME[fields.mainGame] : []
  if (!fields.department || !allowedDepartments.includes(fields.department)) errors.department = 'Choose a department.'
  if (fields.mainGame === 'CODM' && (!fields.playerId.trim() || fields.playerId.trim().length > 40)) errors.playerId = 'Player ID is required.'
  return errors
}
