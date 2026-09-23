/** Step 4: thank-you message after the application was saved. */
export function JoinSuccessStep({ onClose }: { onClose: () => void }) {
  return (
    <div className="join__body join__success">
      <p className="join__success-title">Thank you for applying.</p>
      <p>Your application has been received. Our team will review it and contact you through the details you gave.</p>
      <button type="button" className="bx-btn bx-btn--primary bx-btn--sm" onClick={onClose}>Close</button>
    </div>
  )
}
