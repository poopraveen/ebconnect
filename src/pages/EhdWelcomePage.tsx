/**
 * EHD Welcome Page — Electronic Health Declaration
 * Content mirrors the old UAT system (case number + DOB + Proceed).
 * Design updated to match the new Singlife Figma design system.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

// ─── Masthead (white variant for EHD) ────────────────────────────────────────

function EhdMasthead() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-line-medium h-[70px] flex items-center px-6 lg:px-[120px]">
      <div className="flex items-center gap-2">
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#FF0008" strokeWidth="1.5" fill="none" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180
            const x1 = 20 + 12 * Math.cos(angle)
            const y1 = 20 + 12 * Math.sin(angle)
            const x2 = 20 + 18 * Math.cos(angle)
            const y2 = 20 + 18 * Math.sin(angle)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF0008" strokeWidth="1.5" strokeLinecap="round" />
          })}
          <circle cx="20" cy="20" r="7" fill="#FF0008" />
        </svg>
        <span className="text-brand-red font-display font-bold text-xl tracking-wide">Singlife</span>
      </div>
    </header>
  )
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────

function HeroBanner() {
  return (
    <div className="relative w-full h-[180px] lg:h-[220px] overflow-hidden mt-[70px]">
      {/* Background — dark overlay over a warm office photo approximated with gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        }}
      />
      {/* Decorative burst (faint) */}
      <svg
        className="absolute right-0 top-0 opacity-10"
        width="400" height="220" viewBox="0 0 400 220" fill="none"
        aria-hidden="true"
      >
        <circle cx="340" cy="110" r="160" stroke="white" strokeWidth="1" fill="none" />
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i * 20 * Math.PI) / 180
          return (
            <line
              key={i}
              x1={340 + 105 * Math.cos(a)} y1={110 + 105 * Math.sin(a)}
              x2={340 + 160 * Math.cos(a)} y2={110 + 160 * Math.sin(a)}
              stroke="white" strokeWidth="1.2" strokeLinecap="round"
            />
          )
        })}
        <circle cx="340" cy="110" r="55" fill="white" fillOpacity="0.06" />
      </svg>
      {/* Title */}
      <div className="relative z-10 h-full flex items-center px-6 lg:px-[120px]">
        <h1 className="text-white font-display font-semibold text-[28px] lg:text-[32px] tracking-[0.4px]">
          Electronic Health Declaration
        </h1>
      </div>
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

// ─── "Can't find Case Number?" help panel ────────────────────────────────────

function CaseNumberHelp() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="self-start flex items-center gap-1.5 text-[13px] font-sans text-brand-red hover:text-red-700 transition-colors"
        aria-expanded={open}
      >
        {open ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 9.5l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 4.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {open ? 'Close' : "Can't find Case Number?"}
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3 bg-[#F4F6F9] rounded-xl p-4">
          <p className="text-[13px] font-sans text-text-primary leading-[1.6]">
            Your <strong>Case Number</strong> can be found in the email invitation sent to you by your
            insurance agent or Singlife. It typically follows the format:
          </p>
          {/* Sample case number card */}
          <div className="bg-white rounded-lg border border-line-medium p-4 flex flex-col gap-2">
            <span className="text-[11px] font-sans font-semibold text-text-sub uppercase tracking-[0.5px]">
              Sample email excerpt
            </span>
            <div className="flex flex-col gap-1 pl-3 border-l-2 border-brand-red">
              <span className="text-[12px] font-sans text-text-sub">Dear Insured Person,</span>
              <span className="text-[12px] font-sans text-text-primary leading-[1.6]">
                Please complete your health declaration using the details below:
              </span>
              <span className="text-[13px] font-sans font-semibold text-text-primary">
                Case Number: <span className="text-brand-red font-display tracking-widest">EHD-2025-00123</span>
              </span>
            </div>
          </div>
          <p className="text-[12px] font-sans text-text-sub leading-[1.5]">
            If you cannot locate your case number, please contact your insurance agent or call
            Singlife at <strong>+65 6827 9988</strong>.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Date of Birth Input — single date field with placeholder dd/mm/yyyy ─────

interface DobFieldProps {
  value: string   // internal ISO: YYYY-MM-DD
  onChange: (iso: string) => void
  error?: boolean
}

function DobField({ value, onChange, error }: DobFieldProps) {
  // Display as DD/MM/YYYY; store as YYYY-MM-DD
  const [display, setDisplay] = useState(() => {
    if (!value) return ''
    const [y, m, d] = value.split('-')
    return `${d}/${m}/${y}`
  })

  function handleChange(raw: string) {
    // Auto-insert slashes
    let clean = raw.replace(/[^\d/]/g, '')
    // strip extra slashes
    const digits = clean.replace(/\//g, '')
    let formatted = digits
    if (digits.length > 2) formatted = digits.slice(0, 2) + '/' + digits.slice(2)
    if (digits.length > 4) formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8)
    setDisplay(formatted)

    // Parse to ISO if complete
    const parts = formatted.split('/')
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      onChange(`${parts[2]}-${parts[1]}-${parts[0]}`)
    } else {
      onChange('')
    }
  }

  return (
    <input
      type="text"
      id="dob"
      name="dob"
      inputMode="numeric"
      placeholder="dd/mm/yyyy"
      maxLength={10}
      value={display}
      onChange={e => handleChange(e.target.value)}
      className={`input-underline${error ? ' error' : ''}`}
      autoComplete="off"
      aria-label="Insured Person Date of Birth"
    />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EhdWelcomePage() {
  const navigate = useNavigate()
  const [caseId, setCaseId] = useState('')
  const [dob, setDob] = useState('')   // ISO YYYY-MM-DD
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValid = caseId.trim().length >= 3 && dob.length === 10

  async function handleProceed(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || loading) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/uat-ext/pub/ebconnect/external/authenticate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: '',
          caseId: caseId.trim().toUpperCase(),
          dob,
        }),
      })

      const data = await res.json()

      if (data.respCode === '00') {
        // Store the full API response for downstream pages
        sessionStorage.setItem('ehd_case_ref', caseId.trim().toUpperCase())
        sessionStorage.setItem('ehd_auth_response', JSON.stringify(data))
        navigate('/ehd/userInfo')
      } else {
        setError(
          data.errorDetails?.[0]?.message
            ?? data.respDesc
            ?? 'The case number or date of birth you entered does not match our records. Please try again.'
        )
      }
    } catch {
      setError('Unable to connect. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col">
      <EhdMasthead />
      <HeroBanner />

      {/* Main content */}
      <main className="flex-1 pb-[60px]">
        {/* Welcome section — grey background */}
        <div className="bg-[#F4F6F9] px-6 lg:px-[120px] py-8">
          <h2 className="text-[22px] font-display font-semibold text-text-primary tracking-[0.33px]">
            Welcome
          </h2>
          <div className="w-12 h-[3px] bg-brand-red rounded-full mt-2 mb-0" />
        </div>

        {/* White card section */}
        <div className="bg-white px-6 lg:px-[120px] py-10 shadow-sm">
          <div className="max-w-[700px]">
            <h3 className="text-[20px] font-display font-semibold text-text-primary tracking-[0.3px] mb-2">
              Electronic Health Declaration
            </h3>
            <p className="text-[14px] font-sans text-text-primary leading-[1.6] mb-8">
              To continue, please enter your case number and date of birth for verification.
            </p>

            <form onSubmit={handleProceed} noValidate className="flex flex-col gap-0">
              {/* Fields row — side by side on desktop */}
              <div className="flex flex-col sm:flex-row sm:gap-10 gap-6 mb-6">
                {/* Case Number */}
                <div className="flex flex-col gap-2 flex-1 max-w-[280px]">
                  <label htmlFor="caseId" className="text-[14px] font-sans text-text-primary">
                    <strong>Case Number:</strong>
                  </label>
                  <input
                    id="caseId"
                    type="text"
                    name="caseId"
                    placeholder="Enter your Case Number"
                    value={caseId}
                    onChange={e => { setCaseId(e.target.value); setError('') }}
                    className={`input-underline${error ? ' error' : ''}`}
                    autoComplete="off"
                    autoCapitalize="characters"
                    aria-required="true"
                  />
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-2 flex-1 max-w-[280px]">
                  <label htmlFor="dob" className="text-[14px] font-sans text-text-primary">
                    <strong>Insured Person Date of Birth:</strong>
                  </label>
                  <DobField value={dob} onChange={v => { setDob(v); setError('') }} error={!!error} />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 mb-5">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[1px]">
                    <circle cx="8" cy="8" r="7" stroke="#FB3234" strokeWidth="1.4" />
                    <path d="M8 4.5v4" stroke="#FB3234" strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="8" cy="11" r="0.8" fill="#FB3234" />
                  </svg>
                  <p className="text-[13px] text-text-error font-sans leading-snug">{error}</p>
                </div>
              )}

              {/* Buttons row */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={`
                    h-[44px] px-10 rounded-full text-[14px] font-semibold font-display text-white
                    tracking-[0.21px] transition-colors flex items-center gap-2 shrink-0
                    ${isValid && !loading
                      ? 'bg-brand-red hover:bg-red-700 cursor-pointer'
                      : 'bg-brand-red-light cursor-not-allowed'}
                  `}
                >
                  {loading ? (
                    <>
                      <SpinnerIcon />
                      Please wait…
                    </>
                  ) : (
                    'Proceed'
                  )}
                </button>

                {/* Can't find Case Number */}
                <CaseNumberHelp />
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
