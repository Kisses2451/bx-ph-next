'use client'

import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { LAST_APPLICANT_KEY } from '../../lib/applicant'

/** "Application submitted" confirmation page ( /apply/success ) with a Return home button. */
export function ApplicationSuccessPage() {
  // Shows the applicant's name if one was saved in sessionStorage under LAST_APPLICANT_KEY.
  const [applicant, setApplicant] = useState<{ name?: string } | null>(null)

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(LAST_APPLICANT_KEY)
      if (stored) {
        setApplicant(JSON.parse(stored))
        window.sessionStorage.removeItem(LAST_APPLICANT_KEY)
      }
    } catch {
      setApplicant(null)
    }
  }, [])

  return (
    <section className="simple-page shared-container simple-page--center" aria-labelledby="success-title">
      <p className="bx-eyebrow">Application</p>
      <h1 id="success-title" className="simple-page__title">Submitted successfully</h1>
      <p className="simple-page__text">{applicant?.name ? `${applicant.name} has been added to the recruitment queue.` : 'Your player profile has been submitted successfully.'}</p>
      <NextLink href="/" className="bx-btn bx-btn--primary">Return home</NextLink>
    </section>
  )
}
