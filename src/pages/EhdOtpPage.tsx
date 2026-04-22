/**
 * EHD OTP Page
 * User verifies their identity by entering a 6-digit OTP
 * sent to their registered mobile number.
 */

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Masthead from '../components/Masthead'
import Footer from '../components/Footer'
import { ehdVerifyOtp, ehdResendOtp } from '../api/stub'
import type { EhdSummary } from '../api/types'

// ─── OTP Input — 6 individual boxes ──────────────────────────────────────────

interface OtpBoxesProps {
  value: string[]
  onChange: (val: string[]) => void
  disabled?: boolean
  hasError?: boolean
}

function OtpBoxes({ value, onChange, disabled, hasError }: OtpBoxesProps) {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null))

  function handleChange(index: number, char: string) {
    const digit = char.replace(/\D/g, '').slice(-1)
    const next = [...value]
    next[index] = digit
    onChange(next)
    if (digit && index < 5) refs[index + 1].current?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        const next = [...value]
        next[index - 1] = ''
        onChange(next)
        refs[index - 1].current?.focus()
      } else {
        const next = [...value]
        next[index] = ''
        onChange(next)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs[index - 1].current?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      refs[index + 1].current?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = Array(6).fill('')
    text.split('').forEach((c, i) => { next[i] = c })
    onChange(next)
    const focusIdx = Math.min(text.length, 5)
    refs[focusIdx].current?.focus()
  }

  return (
    <div className="flex items-center gap-3" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onFocus={e => e.target.select()}
          aria-label={`OTP digit ${i + 1}`}
          className={`
            w-11 h-14 text-center text-[20px] font-bold font-display rounded-xl border-2 transition-colors
            focus:outline-none disabled:opacity-50
            ${hasError
              ? 'border-text-error bg-[#FFF0F0] text-text-error'
              : value[i]
                ? 'border-brand-red bg-white text-text-primary'
                : 'border-line-dark bg-white text-text-primary focus:border-brand-red'
            }
          `}
        />
      ))}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

// ─── Shield Checkmark ─────────────────────────────────────────────────────────

function SuccessIcon() {
  return (
    <div className="w-20 h-20 rounded-full bg-success-bg flex items-center justify-center">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 4L6 10v10c0 7.18 5.95 13.9 14 16 8.05-2.1 14-8.82 14-16V10L20 4z" fill="#00AC95" fillOpacity="0.2" stroke="#00AC95" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13 20l5 5 9-10" stroke="#00AC95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ─── Countdown resend timer ───────────────────────────────────────────────────

function useResendTimer(initialSeconds = 60) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (seconds <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  function reset() { setSeconds(initialSeconds); setCanResend(false) }

  return { seconds, canResend, reset }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EhdOtpPage() {
  const navigate = useNavigate()
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)
  const { seconds, canResend, reset } = useResendTimer(60)

  const summaryRaw = sessionStorage.getItem('ehd_summary')
  const summary: EhdSummary | null = summaryRaw ? JSON.parse(summaryRaw) : null
  const caseRef = sessionStorage.getItem('ehd_case_ref') ?? ''
  const maskedMobile = summary?.insuredPerson.mobileNumber ?? '+65 **** XXXX'

  const otp = digits.join('')
  const otpComplete = otp.length === 6

  async function handleVerify() {
    if (!otpComplete || loading) return
    setLoading(true)
    setError('')

    try {
      const res = await ehdVerifyOtp({ caseRefNumber: caseRef, otpCode: otp })
      if (res.success) {
        setSuccess(true)
        // Clear EHD session data after small delay
        setTimeout(() => {
          sessionStorage.removeItem('ehd_case_ref')
          sessionStorage.removeItem('ehd_summary')
          sessionStorage.removeItem('ehd_section_id')
          sessionStorage.removeItem('ehd_answers')
        }, 500)
      } else {
        setError(res.errorMessage ?? 'The code you entered is incorrect. Please try again.')
        setDigits(Array(6).fill(''))
      }
    } catch {
      setError('Unable to verify. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!canResend || resending) return
    setResending(true)
    setError('')
    setDigits(Array(6).fill(''))
    try {
      await ehdResendOtp(caseRef)
      reset()
    } catch {
      setError('Unable to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen bg-page-bg flex flex-col">
        <Masthead />
        <main className="flex-1 flex flex-col items-center justify-center pt-[70px] pb-[60px] px-4">
          <div className="bg-white rounded-2xl shadow-card w-full max-w-[480px] p-10 flex flex-col items-center gap-6 text-center">
            <SuccessIcon />
            <div className="flex flex-col gap-2">
              <h1 className="text-[22px] font-semibold font-display text-text-primary tracking-[0.33px]">
                Declaration Submitted
              </h1>
              <p className="text-[14px] font-sans text-text-sub leading-[1.6]">
                Your Electronic Health Declaration has been successfully submitted to Singlife.
                We will review your responses and be in touch if any additional information is required.
              </p>
            </div>
            <div className="w-full bg-[#F4F6F9] rounded-xl p-4 flex flex-col gap-3 text-left">
              <div className="flex justify-between">
                <span className="text-[12px] text-text-sub font-sans">Case Reference</span>
                <span className="text-[12px] font-semibold font-display text-text-primary">{caseRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-text-sub font-sans">Insured Person</span>
                <span className="text-[12px] font-semibold font-display text-text-primary">{summary?.insuredPerson.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-text-sub font-sans">Submitted On</span>
                <span className="text-[12px] font-semibold font-display text-text-primary">
                  {new Date().toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
            <p className="text-[12px] font-sans text-text-sub text-center leading-[1.6]">
              A confirmation email will be sent to your registered email address.
            </p>
            <button
              type="button"
              onClick={() => navigate('/ehd')}
              className="h-[44px] px-8 rounded-full bg-brand-red text-white text-[14px] font-semibold font-display hover:bg-red-700 transition-colors"
            >
              Done
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ── OTP Entry ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Masthead />

      <main className="flex-1 flex flex-col items-center justify-center pt-[70px] pb-[60px] px-4">
        <div className="w-full max-w-[480px] flex flex-col gap-6">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-card p-8 flex flex-col gap-7">
            {/* Header */}
            <div className="flex flex-col items-center gap-3 text-center">
              {/* OTP icon */}
              <div className="w-14 h-14 rounded-full bg-[#FFF0F0] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <rect x="3" y="8" width="22" height="16" rx="2.5" stroke="#FF0008" strokeWidth="1.5" />
                  <path d="M9 8V6a5 5 0 0110 0v2" stroke="#FF0008" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="14" cy="16" r="2.5" fill="#FF0008" />
                  <path d="M14 18.5v2" stroke="#FF0008" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-[20px] font-semibold font-display text-text-primary tracking-[0.3px]">
                  Verify Your Identity
                </h1>
                <p className="text-[13px] font-sans text-text-sub leading-[1.6]">
                  We've sent a 6-digit verification code to your registered mobile number
                </p>
                <p className="text-[14px] font-semibold font-display text-text-primary">
                  {maskedMobile}
                </p>
              </div>
            </div>

            {/* OTP boxes */}
            <div className="flex flex-col items-center gap-4">
              <OtpBoxes
                value={digits}
                onChange={v => { setDigits(v); setError('') }}
                disabled={loading}
                hasError={!!error}
              />
              {error && (
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#FB3234" strokeWidth="1.3" />
                    <path d="M8 4.5v4" stroke="#FB3234" strokeWidth="1.3" strokeLinecap="round" />
                    <circle cx="8" cy="11" r="0.8" fill="#FB3234" />
                  </svg>
                  <p className="text-[12px] text-text-error font-sans">{error}</p>
                </div>
              )}
            </div>

            {/* Verify button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={!otpComplete || loading}
              className={`
                w-full h-[44px] rounded-full text-white text-[14px] font-semibold font-display
                tracking-[0.21px] transition-colors flex items-center justify-center gap-2
                ${otpComplete && !loading
                  ? 'bg-brand-red hover:bg-red-700 cursor-pointer'
                  : 'bg-brand-red-light cursor-not-allowed'}
              `}
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Verifying…
                </>
              ) : (
                'Verify & Submit'
              )}
            </button>

            {/* Resend */}
            <div className="flex items-center justify-center gap-1 text-[13px] font-sans text-text-sub">
              Didn't receive the code?
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-brand-red font-semibold hover:text-red-700 transition-colors ml-1"
                >
                  {resending ? 'Sending…' : 'Resend OTP'}
                </button>
              ) : (
                <span className="ml-1 text-text-sub">
                  Resend in <span className="font-semibold text-text-primary">{seconds}s</span>
                </span>
              )}
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-3 bg-white rounded-xl border border-line-medium px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5" aria-hidden="true">
              <path d="M8 2L2 4.5v5C2 13 5 15.5 8 16.5 11 15.5 14 13 14 9.5v-5L8 2z" stroke="#8A8988" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M5.5 8l2 2 3-3.5" stroke="#8A8988" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[11px] font-sans text-text-sub leading-[1.6]">
              This verification code is valid for <strong>10 minutes</strong>. Never share this code with anyone,
              including Singlife staff.
            </p>
          </div>

          {/* Wrong number? */}
          <p className="text-[12px] font-sans text-text-sub text-center leading-[1.6]">
            Registered mobile number incorrect?{' '}
            <button
              type="button"
              onClick={() => navigate('/ehd')}
              className="text-text-error underline"
            >
              Contact Singlife
            </button>{' '}
            to update your details.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
