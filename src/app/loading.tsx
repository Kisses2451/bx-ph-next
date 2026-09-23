// Shown while a route segment loads.
export default function Loading() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="page-loading__spinner" aria-hidden="true" />
      <span>Loading page…</span>
    </div>
  )
}
