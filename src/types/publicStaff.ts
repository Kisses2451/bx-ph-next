/** A staff member as shown on the About page (from public.staff, visible rows only). */
export interface PublicStaff {
  id: string
  name: string
  role: string | null
  bio: string | null
  photoUrl: string | null
}
