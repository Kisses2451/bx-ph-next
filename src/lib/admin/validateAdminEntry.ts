// Validation rules for every admin add/edit form. Returns { fieldName: message } for each problem;
// an empty object means the form can be saved.
import { DEPARTMENTS_BY_GAME, type PlayerGame } from '../../types/player'
import { readValue, type AdminEntryKind, type AdminFormErrors } from './adminEntries'

/**
 * @param hasNewGameLogoFile true when the admin picked a new logo file in the game form
 *   (a game needs a logo, either an existing URL or a new file).
 */
export function validateAdminEntry(kind: AdminEntryKind, draft: Record<string, any>, hasNewGameLogoFile: boolean) {
  const errors: AdminFormErrors = {}

  if (kind === 'player') {
    if (!readValue(draft, 'first_name').trim()) errors.first_name = 'First name is required.'
    if (!readValue(draft, 'last_name').trim()) errors.last_name = 'Last name is required.'
    if (!readValue(draft, 'email').trim()) errors.email = 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(readValue(draft, 'email').trim())) errors.email = 'Enter a valid email.'
    if (readValue(draft, 'contact_number') && !/^(09\d{9}|\+639\d{9})$/.test(readValue(draft, 'contact_number').trim())) errors.contact_number = 'Use 09XXXXXXXXX or +639XXXXXXXXX.'
    if (readValue(draft, 'contact_link') && !/^https?:\/\/(www\.)?(facebook\.com|fb\.com|instagram\.com)\/.+/i.test(readValue(draft, 'contact_link').trim())) errors.contact_link = 'Use a Facebook, fb.com, or Instagram URL.'
    if (!['CODM', 'HOK'].includes(readValue(draft, 'main_game'))) errors.main_game = 'Choose CODM or HOK.'
    const allowedDepartments = DEPARTMENTS_BY_GAME[readValue(draft, 'main_game') as PlayerGame] ?? []
    if (!allowedDepartments.includes(readValue(draft, 'department') as never)) errors.department = 'Department is required.'
    if (!readValue(draft, 'in_game_name').trim()) errors.in_game_name = 'IGN is required.'
    if (!readValue(draft, 'uid').trim()) errors.uid = 'UID is required.'
  }

  if (kind === 'update') {
    if (!readValue(draft, 'title').trim()) errors.title = 'Title is required.'
    if (!readValue(draft, 'detail').trim()) errors.detail = 'Detail is required.'
    if (readValue(draft, 'tag').trim().length > 40) errors.tag = 'Tag must be 40 characters or fewer.'
    if (readValue(draft, 'title').trim().length > 120) errors.title = 'Title must be 120 characters or fewer.'
    if (readValue(draft, 'detail').trim().length > 400) errors.detail = 'Description must be 400 characters or fewer.'
    if (!readValue(draft, 'published_at').trim() || Number.isNaN(new Date(readValue(draft, 'published_at')).getTime())) errors.published_at = 'Published date is required.'
    if (!Number.isInteger(Number(draft.sort_order))) errors.sort_order = 'Sort order must be a whole number.'
  }

  if (kind === 'game') {
    if (!readValue(draft, 'title').trim()) errors.title = 'Title is required.'
    if (readValue(draft, 'title').trim().length > 60) errors.title = 'Name must be 60 characters or fewer.'
    if (!readValue(draft, 'tag').trim()) errors.tag = 'Genre is required.'
    if (readValue(draft, 'tag').trim().length > 40) errors.tag = 'Genre must be 40 characters or fewer.'
    if (readValue(draft, 'description').trim().length > 400) errors.description = 'Information must be 400 characters or fewer.'
    if (!readValue(draft, 'image_url') && !readValue(draft, 'imageUrl') && !readValue(draft, 'image') && !hasNewGameLogoFile) errors.image = 'A game logo is required.'
    if (Boolean(draft.is_visible ?? true) && !readValue(draft, 'image_url') && !readValue(draft, 'imageUrl') && !readValue(draft, 'image') && !hasNewGameLogoFile) errors.image = 'A visible game must have a logo.'
  }

  if (kind === 'partner') {
    if (!readValue(draft, 'name').trim()) errors.name = 'Name is required.'
    if (readValue(draft, 'name').trim().length > 120) errors.name = 'Name must be 120 characters or fewer.'
    if (readValue(draft, 'category').trim().length > 40) errors.category = 'Category must be 40 characters or fewer.'
    if (readValue(draft, 'description').trim().length > 400) errors.description = 'Description must be 400 characters or fewer.'
    if (readValue(draft, 'website').trim() && !/^https?:\/\//i.test(readValue(draft, 'website').trim())) errors.website = 'Website must start with http:// or https://.'
    if (readValue(draft, 'website').trim().length > 300) errors.website = 'Website must be 300 characters or fewer.'
    if (Boolean(draft.is_visible ?? true) && !readValue(draft, 'logo') && !readValue(draft, 'imageUrl')) errors.logo = 'A visible partner must have a logo.'
  }

  if (kind === 'event') {
    if (!readValue(draft, 'title').trim()) errors.title = 'Title is required.'
    if (!readValue(draft, 'date').trim()) errors.date = 'Date is required.'
    if (readValue(draft, 'title').trim().length > 120) errors.title = 'Title must be 120 characters or fewer.'
    if (readValue(draft, 'location').trim().length > 120) errors.location = 'Location must be 120 characters or fewer.'
    if (readValue(draft, 'description').trim().length > 400) errors.description = 'Description must be 400 characters or fewer.'
    if (readValue(draft, 'imageUrl').trim().length > 500) errors.image = 'Image URL must be 500 characters or fewer.'
    if (!Number.isInteger(Number(draft.sort_order))) errors.sort_order = 'Sort order must be a whole number.'
  }

  if (kind === 'staff') {
    if (!readValue(draft, 'name').trim()) errors.name = 'Name is required.'
    if (readValue(draft, 'name').trim().length > 120) errors.name = 'Name must be 120 characters or fewer.'
    if (readValue(draft, 'role').trim().length > 80) errors.role = 'Role must be 80 characters or fewer.'
    if (readValue(draft, 'bio').trim().length > 400) errors.bio = 'Bio must be 400 characters or fewer.'
    if (readValue(draft, 'imageUrl').trim().length > 500) errors.image = 'Photo URL must be 500 characters or fewer.'
    if (!Number.isInteger(Number(draft.sort_order))) errors.sort_order = 'Sort order must be a whole number.'
  }

  if (kind === 'timeline') {
    const year = Number(draft.year)
    if (!Number.isInteger(year) || year < 1990 || year > new Date().getFullYear() + 1) errors.year = `Enter a year from 1990 to ${new Date().getFullYear() + 1}.`
    if (!readValue(draft, 'title').trim()) errors.title = 'Title is required.'
    if (readValue(draft, 'title').trim().length > 80) errors.title = 'Title must be 80 characters or fewer.'
    if (readValue(draft, 'description').trim().length > 300) errors.description = 'Description must be 300 characters or fewer.'
  }

  return errors
}
