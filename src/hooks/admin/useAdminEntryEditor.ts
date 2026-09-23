import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useConfirm } from '../../components/providers/ConfirmDialogProvider'
import {
  createEmptyAdminEntry,
  defaultUpdateForm,
  itemIsDirty,
  readValue,
  sortTimelineEvents,
  type AdminEntryKind,
  type AdminEntryModalMode,
  type AdminEntryModalState,
  type AdminFormErrors,
  type AdminTimelineEvent,
} from '../../lib/admin/adminEntries'
import { mapLatestUpdateError, mapSupabaseError } from '../../lib/admin/adminErrorMessages'
import { eventStoragePath, gameStoragePath, partnerStoragePath, staffStoragePath } from '../../lib/admin/siteMediaPaths'
import { validateAdminEntry } from '../../lib/admin/validateAdminEntry'
import { normalizeLogoToSquare, type NormalizedLogo } from '../../lib/images'
import { supabase, uploadPartnerLogo, uploadPlayerPhoto } from '../../lib/supabase'
import { PARTNERS_UPDATED_EVENT } from '../usePartners'
import type { SupabasePartner } from '../../types/player'
import type { useAdminEvents } from './useAdminEvents'
import type { useAdminGames } from './useAdminGames'
import type { useAdminLatestUpdates } from './useAdminLatestUpdates'
import type { useAdminPlayers } from './useAdminPlayers'
import type { useAdminStaff } from './useAdminStaff'
import type { useAdminTimeline } from './useAdminTimeline'

/** A pending "Are you sure?" question; `onConfirm` runs only if the admin confirms. */
type ConfirmAction = {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
}

/** Result of an image processed/uploaded in the form, shown as "Converted: 800x800, 42 KB". */
type ConvertedImageInfo = { size: number; warning?: string }

interface UseAdminEntryEditorOptions {
  players: ReturnType<typeof useAdminPlayers>
  games: ReturnType<typeof useAdminGames>
  events: ReturnType<typeof useAdminEvents>
  latestUpdates: ReturnType<typeof useAdminLatestUpdates>
  staff: ReturnType<typeof useAdminStaff>
  timeline: ReturnType<typeof useAdminTimeline>
  partners: SupabasePartner[]
  refreshPartners: () => Promise<void>
}

/**
 * The admin add / edit / view modal and every change it can make:
 * - open/close the modal, track the form (draft) and its validation errors;
 * - save (insert or update) each kind of record, uploading and replacing images in storage;
 * - delete records (and their images) and approve/reject players.
 * Every save and delete asks for confirmation first. After a change the affected list is reloaded
 * and a window event (e.g. `games-updated`) tells the public pages to refresh.
 */
export function useAdminEntryEditor({ players, games, events, latestUpdates, staff, timeline, partners, refreshPartners }: UseAdminEntryEditorOptions) {
  const toast = useToast()
  const confirm = useConfirm()
  const [modalState, setModalState] = useState<AdminEntryModalState | null>(null)
  const [modalDraft, setModalDraft] = useState<Record<string, any> | null>(null)
  const [formErrors, setFormErrors] = useState<AdminFormErrors>({})
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)
  // Image state per kind. Game/event/staff files are uploaded on save; player/partner files upload as soon as they are picked.
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [gameLogoFile, setGameLogoFile] = useState<File | null>(null)
  const [gameLogoInfo, setGameLogoInfo] = useState<ConvertedImageInfo | null>(null)
  const [gameLogoProcessing, setGameLogoProcessing] = useState(false)
  const [gameSaving, setGameSaving] = useState(false)
  const [eventImageFile, setEventImageFile] = useState<File | null>(null)
  const [staffImageFile, setStaffImageFile] = useState<File | null>(null)
  const [partnerUploadedPath, setPartnerUploadedPath] = useState<string | null>(null)
  const [partnerSaving, setPartnerSaving] = useState(false)
  const [partnerProcessing, setPartnerProcessing] = useState(false)
  const [partnerLogoInfo, setPartnerLogoInfo] = useState<ConvertedImageInfo | null>(null)
  const [timelineSaving, setTimelineSaving] = useState(false)

  // Show the confirmation dialog whenever a new ConfirmAction is queued.
  useEffect(() => {
    if (!confirmAction) return
    const action = confirmAction
    let cancelled = false
    void confirm({
      title: action.title,
      message: action.description,
      confirmLabel: action.confirmLabel,
      cancelLabel: 'Cancel',
      tone: 'danger',
    }).then((confirmed) => {
      if (cancelled) return
      setConfirmAction(null)
      if (confirmed) void action.onConfirm()
    })
    return () => { cancelled = true }
  }, [confirm, confirmAction])

  // ---------------------------------------------------------------- open / close

  /** Opens the modal. `item` null = empty "Add" form. Database column names are mapped to form field names. */
  const openModal = (kind: AdminEntryKind, item: Record<string, any> | null, mode: AdminEntryModalMode) => {
    const baseItem = item && kind === 'staff'
      ? { ...item, name: item.name ?? item.full_name ?? '', role: item.role ?? item.role_title ?? '', bio: item.bio ?? '', imageUrl: item.imageUrl ?? item.photo_url ?? '', image: item.image ?? item.photo_url ?? '' }
      : item && kind === 'update'
      ? { ...item, detail: item.detail ?? item.description ?? '', published_at: item.published_at ? String(item.published_at).slice(0, 16) : defaultUpdateForm.published_at }
      : item && kind === 'partner'
      ? { ...item, website: item.website ?? item.website_url ?? '', logo: item.logo ?? item.logo_url ?? '', imageUrl: item.imageUrl ?? item.logo_url ?? '' }
      : item && kind === 'event'
      ? { ...item, date: item.date ?? item.event_date ?? '', imageUrl: item.imageUrl ?? item.image_url ?? '', image: item.image ?? item.image_url ?? '' }
      : item && kind === 'game'
      ? { ...item, tag: item.tag ?? item.genre ?? '', imageUrl: item.imageUrl ?? item.image_url ?? '', image: item.image ?? item.image_url ?? '' }
      : item ? { ...item } : createEmptyAdminEntry(kind)
    setModalState({ kind, mode, item: baseItem })
    setModalDraft(baseItem)
    setFormErrors({})
    if (kind === 'game') setGameLogoFile(null)
    if (kind === 'event') setEventImageFile(null)
    if (kind === 'staff') setStaffImageFile(null)
  }

  const closeModal = () => {
    setModalState(null)
    setModalDraft(null)
    setFormErrors({})
    setEventImageFile(null)
    setStaffImageFile(null)
  }

  /** Close button / overlay click: asks before throwing away unsaved changes. */
  const handleModalClose = () => {
    if (modalState && modalDraft && modalState.mode !== 'view' && itemIsDirty(modalDraft, modalState.item)) {
      setConfirmAction({
        title: 'Discard unsaved changes?',
        description: 'You have unsaved changes in this form. Are you sure you want to close it?',
        confirmLabel: 'Discard',
        onConfirm: () => {
          closeModal()
          setConfirmAction(null)
        },
      })
      return
    }
    closeModal()
  }

  // ---------------------------------------------------------------- form editing

  /** Sets one form field and clears its error. */
  const updateField = (key: string, value: string) => {
    setModalDraft((current) => ({ ...current, [key]: value }))
    setFormErrors((current) => ({ ...current, [key]: '' }))
  }

  /** Sets one form field without touching errors (used by switches). */
  const setDraftValue = (key: string, value: unknown) => {
    setModalDraft((current) => ({ ...current, [key]: value }))
  }

  /** Called when an image is picked (or removed) in an ImageUploadField. */
  const handleImageUpload = async (file: File | null) => {
    if (!modalState) return
    if (!file) {
      const imageKey = modalState.kind === 'player' ? 'photoUrl' : 'imageUrl'
      updateField(imageKey, '')
      if (modalState.kind === 'partner') updateField('logo', '')
      if (modalState.kind === 'event') setEventImageFile(null)
      if (modalState.kind === 'staff') setStaffImageFile(null)
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormErrors((current) => ({ ...current, image: 'Only JPG, PNG, and WEBP images are allowed.' }))
      return
    }

    if (file.size > (modalState.kind === 'partner' ? 10 : 5) * 1024 * 1024) {
      setFormErrors((current) => ({ ...current, image: modalState.kind === 'partner' ? 'Logo files must be 10 MB or smaller.' : 'Image must be 5MB or smaller.' }))
      return
    }

    // Event and staff images are kept in memory and uploaded when the form is saved.
    if (modalState.kind === 'event') {
      setEventImageFile(file)
      setIsImageUploading(false)
      setFormErrors((current) => ({ ...current, image: '' }))
      return
    }

    if (modalState.kind === 'staff') {
      setStaffImageFile(file)
      setIsImageUploading(false)
      setFormErrors((current) => ({ ...current, image: '' }))
      return
    }

    if (modalState.kind === 'partner') setPartnerProcessing(true)
    setIsImageUploading(true)
    setFormErrors((current) => ({ ...current, image: '' }))

    const result = modalState.kind === 'partner' ? await uploadPartnerLogo(file) : await uploadPlayerPhoto(file)
    setIsImageUploading(false)
    if (modalState.kind === 'partner') setPartnerProcessing(false)

    if (!result.success || !result.publicUrl) {
      setFormErrors((current) => ({ ...current, image: result.message }))
      return
    }

    const key = modalState.kind === 'player' ? 'photoUrl' : 'imageUrl'
    updateField(key, result.publicUrl)
    if (modalState.kind === 'partner') {
      updateField('logo', result.publicUrl)
      setPartnerUploadedPath(result.path ?? null)
      if (modalState.kind === 'partner' && 'normalized' in result) {
        const normalized = result.normalized as NormalizedLogo | undefined
        if (normalized) setPartnerLogoInfo({ size: normalized.blob.size, warning: normalized.warning })
      }
    }
  }

  /** Game logo picked or removed in the GameLogoDropzoneField. */
  const selectGameLogoFile = (file: File | null) => {
    setGameLogoInfo(null)
    setGameLogoFile(file)
  }

  const removeGameLogo = () => {
    setGameLogoInfo(null)
    setGameLogoFile(null)
    updateField('image_url', '')
  }

  // ---------------------------------------------------------------- save (one function per kind)
  // Each returns true when the modal should close, false to keep it open (e.g. after an error).

  const savePlayer = async (state: AdminEntryModalState, draft: Record<string, any>) => {
    if (!supabase) return false
    const payload = {
      first_name: readValue(draft, 'first_name').trim(),
      last_name: readValue(draft, 'last_name').trim(),
      email: readValue(draft, 'email').trim(),
      contact_number: readValue(draft, 'contact_number').trim() || null,
      date_of_birth: readValue(draft, 'date_of_birth') || null,
      contact_link: readValue(draft, 'contact_link').trim() || null,
      registration_source: readValue(draft, 'registration_source'),
      main_game: readValue(draft, 'main_game'),
      department: readValue(draft, 'department') || 'Clan',
      in_game_name: readValue(draft, 'in_game_name').trim(),
      uid: readValue(draft, 'uid').trim(),
      player_id: readValue(draft, 'player_id').trim() || null,
      status: readValue(draft, 'status'),
    }
    const result = state.mode === 'add'
      ? await supabase.from('players').insert(payload)
      : await supabase.from('players').update(payload).eq('id', draft.id)
    if (result.error) {
      console.error('Player save failed:', result.error)
      toast({ title: 'Unable to save player', description: mapSupabaseError(result.error), status: 'error', isClosable: true })
      return false
    }
    await players.reload()
    await players.reloadCounts()
    toast({ title: state.mode === 'add' ? 'Player added' : 'Player updated', description: `${payload.first_name} ${payload.last_name} was saved.`, status: 'success', isClosable: true })
    return true
  }

  const saveLatestUpdate = async (state: AdminEntryModalState, draft: Record<string, any>) => {
    if (!supabase) return false
    const payload = { tag: readValue(draft, 'tag').trim() || null, title: readValue(draft, 'title').trim(), description: readValue(draft, 'detail').trim() || null, published_at: new Date(readValue(draft, 'published_at')).toISOString(), is_visible: Boolean(draft.is_visible ?? true), sort_order: Number(draft.sort_order ?? 0) }
    const result = state.mode === 'add'
      ? await supabase.from('latest_updates').insert(payload).select().single()
      : await supabase.from('latest_updates').update(payload).eq('id', draft.id).select().single()
    if (result.error) {
      toast({ title: 'Unable to save latest update', description: mapLatestUpdateError(result.error), status: 'error', isClosable: true })
      return false
    }
    await latestUpdates.reload()
    window.dispatchEvent(new Event('latest-updates-updated'))
    toast({ title: state.mode === 'add' ? 'Update added' : 'Update saved', description: `${payload.title} was saved.`, status: 'success', isClosable: true })
    return true
  }

  const saveGame = async (state: AdminEntryModalState, draft: Record<string, any>) => {
    if (!supabase) return false
    setGameSaving(true)
    const oldUrl = readValue(draft, 'image_url') || readValue(draft, 'imageUrl') || readValue(draft, 'image')
    let imageUrl = oldUrl || null
    let uploadedPath: string | null = null
    if (gameLogoFile) {
      setGameLogoProcessing(true)
      let normalized: NormalizedLogo
      try { normalized = await normalizeLogoToSquare(gameLogoFile) } catch (error) { toast({ title: 'Unable to process logo', description: error instanceof Error ? error.message : 'Unable to process the logo.', status: 'error', isClosable: true }); setGameLogoProcessing(false); setGameSaving(false); return false }
      setGameLogoInfo({ size: normalized.blob.size, warning: normalized.warning })
      const extension = normalized.format
      uploadedPath = `games/${crypto.randomUUID()}.${extension}`
      const uploadResult = await supabase.storage.from('site-media').upload(uploadedPath, normalized.blob, { contentType: normalized.blob.type, cacheControl: '3600', upsert: false })
      if (uploadResult.error) {
        console.error('Game logo upload failed:', uploadResult.error)
        toast({ title: 'Unable to upload logo', description: uploadResult.error.message, status: 'error', isClosable: true })
        setGameSaving(false)
        setGameLogoProcessing(false)
        return false
      }
      imageUrl = supabase.storage.from('site-media').getPublicUrl(uploadedPath).data.publicUrl
    }
    const payload = { title: readValue(draft, 'title').trim(), tag: readValue(draft, 'tag').trim(), description: readValue(draft, 'description').trim() || null, image_url: imageUrl, is_visible: Boolean(draft.is_visible ?? true), sort_order: state.mode === 'add' ? Math.max(-1, ...games.games.map((item) => item.sort_order)) + 1 : Number(draft.sort_order ?? 0) }
    const result = state.mode === 'add'
      ? await supabase.from('games').insert(payload).select().single()
      : await supabase.from('games').update(payload).eq('id', draft.id).select().single()
    if (result.error) {
      if (uploadedPath) await supabase.storage.from('site-media').remove([uploadedPath])
      console.error('Game save failed:', result.error)
      toast({ title: 'Unable to save game', description: result.error.message, status: 'error', isClosable: true })
      setGameSaving(false)
      return false
    }
    if (gameLogoFile && state.mode === 'edit') {
      const oldPath = gameStoragePath(oldUrl)
      if (oldPath) await supabase.storage.from('site-media').remove([oldPath])
    }
    await games.reload()
    window.dispatchEvent(new Event('games-updated'))
    toast({ title: state.mode === 'add' ? 'Game added' : 'Game updated', description: `${payload.title} was saved.`, status: 'success', isClosable: true })
    setGameSaving(false)
    setGameLogoProcessing(false)
    return true
  }

  const savePartner = async (state: AdminEntryModalState, draft: Record<string, any>) => {
    if (!supabase) return false
    setPartnerSaving(true)
    const name = readValue(draft, 'name').trim()
    const category = readValue(draft, 'category').trim() || null
    const description = readValue(draft, 'description').trim() || null
    const websiteUrl = readValue(draft, 'website').trim() || null
    const logoUrl = readValue(draft, 'logo') || readValue(draft, 'imageUrl') || null
    const basePayload = { name, category, description, website_url: websiteUrl, logo_url: logoUrl, is_visible: Boolean(draft.is_visible ?? true) }
    const originalPartner = state.item
    // When editing, only send the columns that actually changed.
    const changedPayload = Object.fromEntries(Object.entries(basePayload).filter(([key, value]) => {
      const originalKey = key === 'website_url' ? 'website_url' : key
      return state.mode === 'add' || value !== (originalPartner[originalKey] ?? null)
    }))
    const result = state.mode === 'add'
      ? await supabase.from('partners').insert({ ...basePayload, sort_order: Math.max(-1, ...partners.map((item) => item.sort_order)) + 1 }).select().single()
      : await supabase.from('partners').update(changedPayload).eq('id', draft.id).select().single()
    if (result.error) {
      if (partnerUploadedPath) await supabase.storage.from('site-media').remove([partnerUploadedPath])
      console.error('Partner save failed:', result.error)
      toast({ title: 'Unable to save partner', description: mapSupabaseError(result.error), status: 'error', isClosable: true })
      setPartnerSaving(false)
      return false
    }
    const oldPath = partnerStoragePath(readValue(state.item, 'logo_url') || readValue(state.item, 'logo') || readValue(state.item, 'imageUrl'))
    if (oldPath && oldPath !== partnerUploadedPath && oldPath !== partnerStoragePath(logoUrl)) await supabase.storage.from('site-media').remove([oldPath])
    await refreshPartners()
    window.dispatchEvent(new Event(PARTNERS_UPDATED_EVENT))
    toast({ title: state.mode === 'add' ? 'Partner added' : 'Partner updated', description: `${name} was saved.`, status: 'success', isClosable: true })
    setPartnerUploadedPath(null)
    setPartnerSaving(false)
    return true
  }

  const saveEvent = async (state: AdminEntryModalState, draft: Record<string, any>) => {
    if (!supabase) return false
    setIsImageUploading(Boolean(eventImageFile))
    const oldUrl = readValue(draft, 'image_url') || readValue(draft, 'imageUrl') || readValue(draft, 'image')
    let imageUrl = oldUrl || null
    let uploadedPath: string | null = null
    if (eventImageFile) {
      let normalized: NormalizedLogo
      try { normalized = await normalizeLogoToSquare(eventImageFile) } catch (error) { toast({ title: 'Unable to process event image', description: error instanceof Error ? error.message : 'Unable to process the event image.', status: 'error', isClosable: true }); setIsImageUploading(false); return false }
      uploadedPath = `events/${crypto.randomUUID()}.${normalized.format}`
      const uploadResult = await supabase.storage.from('site-media').upload(uploadedPath, normalized.blob, { contentType: normalized.blob.type, cacheControl: '3600', upsert: false })
      if (uploadResult.error) { toast({ title: 'Unable to upload event image', description: mapSupabaseError(uploadResult.error), status: 'error', isClosable: true }); setIsImageUploading(false); return false }
      imageUrl = supabase.storage.from('site-media').getPublicUrl(uploadedPath).data.publicUrl
    }
    const payload = { title: readValue(draft, 'title').trim(), event_date: readValue(draft, 'date'), location: readValue(draft, 'location').trim() || null, description: readValue(draft, 'description').trim() || null, image_url: imageUrl, is_visible: Boolean(draft.is_visible ?? true), sort_order: Number(draft.sort_order ?? 0) }
    const result = state.mode === 'add'
      ? await supabase.from('events').insert(payload).select().single()
      : await supabase.from('events').update(payload).eq('id', draft.id).select().single()
    if (result.error) {
      if (uploadedPath) await supabase.storage.from('site-media').remove([uploadedPath])
      toast({ title: 'Unable to save event', description: mapSupabaseError(result.error), status: 'error', isClosable: true })
      setIsImageUploading(false)
      return false
    }
    const oldPath = eventStoragePath(oldUrl)
    if (oldPath && oldPath !== uploadedPath) await supabase.storage.from('site-media').remove([oldPath])
    await events.reload()
    window.dispatchEvent(new Event('events-updated'))
    toast({ title: state.mode === 'add' ? 'Event added' : 'Event updated', description: `${payload.title} was saved.`, status: 'success', isClosable: true })
    setIsImageUploading(false)
    return true
  }

  const saveStaff = async (state: AdminEntryModalState, draft: Record<string, any>) => {
    if (!supabase) return false
    setIsImageUploading(Boolean(staffImageFile))
    const oldUrl = readValue(draft, 'photo_url') || readValue(draft, 'imageUrl') || readValue(draft, 'image')
    let photoUrl = oldUrl || null
    let uploadedPath: string | null = null
    if (staffImageFile) {
      let normalized: NormalizedLogo
      try { normalized = await normalizeLogoToSquare(staffImageFile) } catch (error) { toast({ title: 'Unable to process staff photo', description: error instanceof Error ? error.message : 'Unable to process the staff photo.', status: 'error', isClosable: true }); setIsImageUploading(false); return false }
      uploadedPath = `staff/${crypto.randomUUID()}.${normalized.format}`
      const uploadResult = await supabase.storage.from('site-media').upload(uploadedPath, normalized.blob, { contentType: normalized.blob.type, cacheControl: '3600', upsert: false })
      if (uploadResult.error) { toast({ title: 'Unable to upload staff photo', description: mapSupabaseError(uploadResult.error), status: 'error', isClosable: true }); setIsImageUploading(false); return false }
      photoUrl = supabase.storage.from('site-media').getPublicUrl(uploadedPath).data.publicUrl
    }
    const payload = { full_name: readValue(draft, 'name').trim(), role_title: readValue(draft, 'role').trim() || null, bio: readValue(draft, 'bio').trim() || null, photo_url: photoUrl, is_visible: Boolean(draft.is_visible ?? true), sort_order: Number(draft.sort_order ?? 0) }
    const result = state.mode === 'add'
      ? await supabase.from('staff').insert(payload).select().single()
      : await supabase.from('staff').update(payload).eq('id', draft.id).select().single()
    if (result.error) {
      if (uploadedPath) await supabase.storage.from('site-media').remove([uploadedPath])
      toast({ title: 'Unable to save staff member', description: mapSupabaseError(result.error), status: 'error', isClosable: true })
      setIsImageUploading(false)
      return false
    }
    const oldPath = staffStoragePath(oldUrl)
    if (oldPath && oldPath !== uploadedPath) await supabase.storage.from('site-media').remove([oldPath])
    await staff.reload()
    setIsImageUploading(false)
    toast({ title: state.mode === 'add' ? 'Staff member added' : 'Staff member updated', description: `${payload.full_name} was saved.`, status: 'success', isClosable: true })
    return true
  }

  const saveTimelineEvent = async (state: AdminEntryModalState, draft: Record<string, any>) => {
    if (!supabase) return true
    setTimelineSaving(true)
    const payload = { year: Number(draft.year), month: draft.month ? Number(draft.month) : null, title: readValue(draft, 'title').trim(), description: readValue(draft, 'description').trim() || null, is_visible: Boolean(draft.is_visible) }
    const result = state.mode === 'add'
      ? await supabase.from('timeline_events').insert(payload).select().single()
      : await supabase.from('timeline_events').update(payload).eq('id', draft.id).select().single()
    if (result.error) {
      console.error('Timeline save failed:', result.error)
      toast({ title: 'Unable to save milestone', description: result.error.message, status: 'error', isClosable: true })
      setTimelineSaving(false)
      return false
    }
    timeline.setEvents((current) => state.mode === 'add' ? [...current, result.data as AdminTimelineEvent].sort(sortTimelineEvents) : current.map((item) => item.id === draft.id ? result.data as AdminTimelineEvent : item).sort(sortTimelineEvents))
    toast({ title: state.mode === 'add' ? 'Milestone added' : 'Milestone updated', status: 'success', isClosable: true })
    setTimelineSaving(false)
    return true
  }

  const saversByKind: Record<AdminEntryKind, (state: AdminEntryModalState, draft: Record<string, any>) => Promise<boolean>> = {
    player: savePlayer,
    update: saveLatestUpdate,
    game: saveGame,
    partner: savePartner,
    event: saveEvent,
    staff: saveStaff,
    timeline: saveTimelineEvent,
  }

  /** Save button: validate, ask "Are you sure?", then run the saver for this kind and close on success. */
  const handleSaveModal = () => {
    if (!modalState || !modalDraft) return
    const errors = validateAdminEntry(modalState.kind, modalDraft, Boolean(gameLogoFile))
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const state = modalState
    setConfirmAction({
      title: state.mode === 'add' ? 'Are you sure you want to add this entry?' : 'Are you sure you want to save these changes?',
      description: state.mode === 'add'
        ? 'This will create a new item in the dashboard.'
        : 'This change will be applied to the current record.',
      confirmLabel: 'Confirm',
      onConfirm: async () => {
        const draft = { ...modalDraft }
        const shouldClose = await saversByKind[state.kind](state, draft)
        if (!shouldClose) return
        closeModal()
        setGameLogoFile(null)
        setConfirmAction(null)
      },
    })
  }

  // ---------------------------------------------------------------- delete (one function per kind)
  // Each returns false when something failed.

  const deletePlayer = async (id: string) => {
    if (!supabase) return false
    // Look up the photo first so the applicant's picture (personal data) is removed together with the record.
    const { data: photoRow } = await supabase.from('players').select('photo_path').eq('id', id).maybeSingle()
    const { error } = await supabase.from('players').delete().eq('id', id)
    if (error) {
      console.error('Player delete failed:', error)
      toast({ title: 'Unable to delete player', description: mapSupabaseError(error), status: 'error', isClosable: true })
      return false
    }
    if (photoRow?.photo_path) await supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'player-photos').remove([photoRow.photo_path])
    await players.reload()
    await players.reloadCounts()
    toast({ title: 'Player deleted', description: 'The player record was removed.', status: 'info', isClosable: true })
    return true
  }

  const deleteLatestUpdate = async (id: string) => {
    if (!supabase) return false
    const { error } = await supabase.from('latest_updates').delete().eq('id', id)
    if (error) {
      toast({ title: 'Unable to delete latest update', description: mapLatestUpdateError(error), status: 'error', isClosable: true })
      return false
    }
    await latestUpdates.reload()
    window.dispatchEvent(new Event('latest-updates-updated'))
    toast({ title: 'Update deleted', description: 'The entry was removed from the feed.', status: 'info', isClosable: true })
    return true
  }

  const deleteGame = async (id: string) => {
    if (!supabase) return false
    const game = games.games.find((item) => item.id === id)
    const { error } = await supabase.from('games').delete().eq('id', id)
    if (error) {
      console.error('Game delete failed:', error)
      toast({ title: 'Unable to delete game', description: error.message, status: 'error', isClosable: true })
      return false
    }
    const logoPath = gameStoragePath(game?.image_url)
    if (logoPath) await supabase.storage.from('site-media').remove([logoPath])
    await games.reload()
    window.dispatchEvent(new Event('games-updated'))
    toast({ title: 'Game deleted', description: 'The game item was removed.', status: 'info', isClosable: true })
    return true
  }

  const deletePartner = async (id: string) => {
    if (!supabase) return false
    const partner = partners.find((item) => item.id === id)
    const { error } = await supabase.from('partners').delete().eq('id', id)
    if (error) {
      console.error('Partner delete failed:', error)
      toast({ title: 'Unable to delete partner', description: mapSupabaseError(error), status: 'error', isClosable: true })
      return false
    }
    const oldPath = partnerStoragePath(partner?.logo_url)
    if (oldPath) await supabase.storage.from('site-media').remove([oldPath])
    await refreshPartners()
    window.dispatchEvent(new Event(PARTNERS_UPDATED_EVENT))
    toast({ title: 'Partner deleted', description: 'The partner was removed.', status: 'info', isClosable: true })
    return true
  }

  const deleteEvent = async (id: string) => {
    if (!supabase) return false
    const event = events.events.find((item) => item.id === id)
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) {
      toast({ title: 'Unable to delete event', description: mapSupabaseError(error), status: 'error', isClosable: true })
      return false
    }
    const imagePath = eventStoragePath(event?.image_url)
    if (imagePath) await supabase.storage.from('site-media').remove([imagePath])
    await events.reload()
    window.dispatchEvent(new Event('events-updated'))
    toast({ title: 'Event deleted', description: 'The event was removed.', status: 'info', isClosable: true })
    return true
  }

  const deleteStaff = async (id: string) => {
    if (!supabase) return false
    const member = staff.staff.find((item) => item.id === id)
    const { error } = await supabase.from('staff').delete().eq('id', id)
    if (error) {
      toast({ title: 'Unable to delete staff member', description: mapSupabaseError(error), status: 'error', isClosable: true })
      return false
    }
    const photoPath = staffStoragePath(member?.photo_url)
    if (photoPath) await supabase.storage.from('site-media').remove([photoPath])
    await staff.reload()
    toast({ title: 'Staff removed', description: 'The staff record was removed.', status: 'info', isClosable: true })
    return true
  }

  const deleteTimelineEvent = async (id: string) => {
    if (!supabase) return true
    const { error } = await supabase.from('timeline_events').delete().eq('id', id)
    if (error) {
      console.error('Timeline delete failed:', error)
      toast({ title: 'Unable to delete milestone', description: error.message, status: 'error', isClosable: true })
      return false
    }
    timeline.setEvents((current) => current.filter((item) => item.id !== id))
    toast({ title: 'Milestone deleted', status: 'info', isClosable: true })
    return true
  }

  const deletersByKind: Record<AdminEntryKind, (id: string) => Promise<boolean>> = {
    player: deletePlayer,
    update: deleteLatestUpdate,
    game: deleteGame,
    partner: deletePartner,
    event: deleteEvent,
    staff: deleteStaff,
    timeline: deleteTimelineEvent,
  }

  /** Delete button: asks "Are you sure?" (suggesting hiding instead where possible), then deletes. */
  const handleDeleteEntry = (kind: AdminEntryKind, id: string) => {
    const gameName = kind === 'game' ? games.games.find((item) => item.id === id)?.title ?? 'this game' : ''
    setConfirmAction({
      title: kind === 'timeline' ? 'Delete this milestone? This cannot be undone.' : kind === 'game' ? `Delete ${gameName}? This can't be undone.` : kind === 'partner' ? `Delete ${partners.find((item) => item.id === id)?.name ?? 'partner'}?` : 'Are you sure you want to delete this entry? This cannot be undone.',
      description: kind === 'timeline' ? 'You can hide a milestone instead by turning off Visible on website.' : kind === 'game' ? 'You can hide it instead.' : kind === 'partner' ? "This can't be undone. You can hide it instead." : 'This action removes the record immediately from the dashboard.',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        const succeeded = await deletersByKind[kind](id)
        if (!succeeded) return
        setConfirmAction(null)
      },
    })
  }

  /** Approve / Reject buttons on a player row. */
  const handlePlayerApprove = (playerId: string, action: 'approve' | 'reject') => {
    setConfirmAction({
      title: action === 'approve' ? 'Approve player?' : 'Reject player?',
      description: action === 'approve'
        ? 'Are you sure you want to approve this application?'
        : 'Are you sure you want to reject this application?',
      confirmLabel: action === 'approve' ? 'Approve' : 'Reject',
      onConfirm: async () => {
        if (!supabase) return
        const player = players.players.find((item) => item.id === playerId)
        const { error } = await supabase.from('players').update({ status: action === 'approve' ? 'approved' : 'rejected' }).eq('id', playerId)
        if (error) {
          console.error('Player status update failed:', error)
          toast({ title: 'Unable to update player', description: mapSupabaseError(error), status: 'error', isClosable: true })
          return
        }
        await players.reload()
        await players.reloadCounts()
        toast({ title: action === 'approve' ? 'Application approved' : 'Application rejected', description: `${player?.full_name ?? 'Player'} was ${action === 'approve' ? 'approved' : 'rejected'}.`, status: action === 'approve' ? 'success' : 'warning', isClosable: true })
        setConfirmAction(null)
      },
    })
  }

  return {
    modalState,
    modalDraft,
    formErrors,
    openModal,
    handleModalClose,
    handleSaveModal,
    handleDeleteEntry,
    handlePlayerApprove,
    updateField,
    setDraftValue,
    handleImageUpload,
    selectGameLogoFile,
    removeGameLogo,
    gameLogoFile,
    gameLogoInfo,
    partnerLogoInfo,
    isImageUploading,
    /** Disable the Save button while anything is uploading or saving. */
    isSaveDisabled: timelineSaving || gameSaving || gameLogoProcessing || partnerSaving || isImageUploading || partnerProcessing,
    /** Show a spinner on the Save button. */
    isSaving: timelineSaving || gameSaving || gameLogoProcessing || partnerSaving || partnerProcessing,
  }
}
