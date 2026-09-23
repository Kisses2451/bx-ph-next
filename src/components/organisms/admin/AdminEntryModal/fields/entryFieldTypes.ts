/** Props every "…EntryFields" form section receives from AdminEntryForm. */
export interface EntryFieldsProps {
  /** The form values being edited. */
  draft: Record<string, any>
  /** Validation messages by field name. */
  errors: Record<string, string>
  /** Set a text field and clear its error. */
  updateField: (key: string, value: string) => void
  /** Set any value (e.g. a switch) without touching errors. */
  setDraftValue: (key: string, value: unknown) => void
  /** Colour-mode aware muted text colour for hints and counters. */
  mutedColor: string
}

/** Extra props for forms that have an ImageUploadField. */
export interface EntryImageFieldProps {
  /** Current image URL to preview. */
  imageValue: string
  isImageUploading: boolean
  onImageFileChange: (file: File | null) => void | Promise<void>
}
