'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { DEPARTMENTS_BY_GAME } from '../../../types/player'
import { turnstileSiteKey } from '../../atoms/TurnstileWidget'
import { SiteDialog } from '../../molecules/SiteDialog'
import { emptyJoinApplicationForm, validateJoinApplication, type JoinApplicationForm, type JoinFlowStep, type MainGame } from './joinApplicationForm'
import { JoinApplicationFormStep } from './JoinApplicationFormStep'
import { JoinNoticeStep } from './JoinNoticeStep'
import { JoinReviewStep } from './JoinReviewStep'
import { JoinSuccessStep } from './JoinSuccessStep'

export type { JoinFlowStep } from './joinApplicationForm'

const TITLES: Record<JoinFlowStep, string> = { notice: 'Before you apply.', form: 'Application form', review: 'Review your application', success: 'Application received' }

/**
 * Site-wide "Join now" application pop-up, mounted once in SiteLayoutTemplate.
 * Opens automatically on /join and /apply, or when anything dispatches the `open-join-flow` window event.
 * Steps: notice → form → review → success (see the Join*Step files next to this one).
 * On submit it posts everything, photo included, to /api/apply (app/api/apply/route.ts), which checks the
 * CAPTCHA and the answers again and saves the application as a pending player.
 */
export function JoinApplicationModal() {
  const pathname = usePathname()
  const [step, setStep] = useState<JoinFlowStep>('notice')
  const [isOpen, setIsOpen] = useState(pathname === '/join' || pathname === '/apply')
  const [form, setForm] = useState<JoinApplicationForm>(emptyJoinApplicationForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [confirmingDiscard, setConfirmingDiscard] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const open = () => { setStep('notice'); setConfirmingDiscard(false); setIsOpen(true) }
    window.addEventListener('open-join-flow', open)
    return () => window.removeEventListener('open-join-flow', open)
  }, [])

  useEffect(() => {
    if (!form.photo) { setPhotoPreview(''); return }
    const url = URL.createObjectURL(form.photo)
    setPhotoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [form.photo])

  const resetAndClose = () => {
    setIsOpen(false); setStep('notice'); setForm(emptyJoinApplicationForm); setErrors({}); setSubmitError(''); setIsSubmitting(false); setCaptchaToken(''); setConfirmingDiscard(false)
  }

  // Closing with answers filled in asks first, so nobody loses a half-finished application by accident.
  const close = () => {
    const hasData = Object.entries(form).some(([key, value]) => key !== 'privacyAccepted' && key !== 'eligibilityConfirmed' && Boolean(value))
    if (hasData && step !== 'success' && !confirmingDiscard) { setConfirmingDiscard(true); return }
    resetAndClose()
  }

  const update = (key: keyof JoinApplicationForm, value: string | boolean | File | null) => {
    const nextForm = { ...form, [key]: value } as JoinApplicationForm
    setForm(nextForm)
    setErrors((current) => ({ ...current, [key]: validateJoinApplication(nextForm)[key as string] ?? '' }))
  }

  const selectGame = (game: MainGame) => {
    setForm((current) => ({ ...current, mainGame: game, department: game === 'HOK' ? DEPARTMENTS_BY_GAME.HOK[0] : '', playerId: '' }))
    setErrors({})
  }

  const review = () => {
    const nextErrors = validateJoinApplication(form)
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) { document.getElementById(`join-${firstError}`)?.focus(); return }
    setStep('review')
  }

  const submit = async () => {
    if (turnstileSiteKey && !captchaToken) { setSubmitError('Please complete the "I am human" check first.'); return }
    setIsSubmitting(true); setSubmitError('')
    try {
      const body = new FormData()
      for (const [key, value] of Object.entries(form)) {
        if (key === 'photo' || key === 'honeypot') continue
        body.set(key, String(value))
      }
      if (form.photo) body.set('photo', form.photo)
      body.set('website', form.honeypot)
      body.set('turnstileToken', captchaToken)
      const response = await fetch('/api/apply', { method: 'POST', body })
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to submit your application right now. Please try again in a moment.')
      setStep('success')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your application right now. Please try again in a moment.')
      setCaptchaToken('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const revalidateField = (key: keyof JoinApplicationForm) => setErrors((current) => ({ ...current, [key]: validateJoinApplication(form)[key as string] ?? '' }))

  return (
    <SiteDialog isOpen={isOpen} onClose={close} labelledBy="join-flow-title" size={step === 'form' ? 'xl' : 'lg'} closeOnBackdrop={false} className={`join join--${step}`}>
      <div className="join__head">
        <p className="bx-eyebrow">Bloodlust Philippines membership</p>
        <h2 id="join-flow-title" className="join__title">
          {step === 'notice' ? <>Before you <span className="join__title-accent">apply.</span></> : TITLES[step]}
        </h2>
      </div>

      {confirmingDiscard ? (
        <div className="join__confirm" role="alertdialog" aria-labelledby="join-discard-title">
          <p id="join-discard-title" className="join__confirm-title">Discard this application?</p>
          <p>Your answers and selected photo will be lost.</p>
          <div className="join__confirm-actions">
            <button type="button" autoFocus className="bx-btn bx-btn--ghost bx-btn--sm" onClick={() => setConfirmingDiscard(false)}>Keep editing</button>
            <button type="button" className="bx-btn bx-btn--primary bx-btn--sm" onClick={resetAndClose}>Discard</button>
          </div>
        </div>
      ) : null}

      {step === 'notice' && <JoinNoticeStep form={form} onSelectGame={selectGame} onUpdate={update} onContinue={() => setStep('form')} />}
      {step === 'form' && <JoinApplicationFormStep form={form} errors={errors} photoPreview={photoPreview} fileInputRef={fileInputRef} onUpdate={update} onFieldBlur={revalidateField} onBack={() => setStep('notice')} onReview={review} />}
      {step === 'review' && <JoinReviewStep form={form} photoPreview={photoPreview} submitError={submitError} isSubmitting={isSubmitting} onCaptchaToken={setCaptchaToken} onEdit={() => setStep('form')} onSubmit={submit} />}
      {step === 'success' && <JoinSuccessStep onClose={resetAndClose} />}
    </SiteDialog>
  )
}
