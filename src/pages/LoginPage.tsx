import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Masthead from '../components/Masthead'
import Footer from '../components/Footer'
import BurstBackground from '../components/BurstBackground'
import { loginAS } from '../api/stub'

// Singlife logo for the login card
function SinglifeCardLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#FF0008" strokeWidth="1.5" fill="none" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const x1 = 20 + 12 * Math.cos(angle)
          const y1 = 20 + 12 * Math.sin(angle)
          const x2 = 20 + 18 * Math.cos(angle)
          const y2 = 20 + 18 * Math.sin(angle)
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF0008" strokeWidth="1.5" strokeLinecap="round" />
          )
        })}
        <circle cx="20" cy="20" r="7" fill="#FF0008" />
      </svg>
      <span className="text-brand-red font-bold text-lg" style={{ fontFamily: '"Open Sans", sans-serif' }}>
        Singlife
      </span>
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [nric, setNric] = useState('')
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValid = nric.trim().length > 0 && mobile.trim().length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError('')

    try {
      const res = await loginAS({ nricLast4: nric.trim(), mobileNumber: mobile.trim() })
      if (res.success) {
        // Store token + context for subsequent pages
        sessionStorage.setItem('as_token', res.token ?? '')
        sessionStorage.setItem('agent_name', res.agentName ?? '')
        sessionStorage.setItem('company_name', res.companyName ?? '')
        navigate('/review')
      } else {
        setError(res.errorMessage ?? 'An error occurred. Please try again.')
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Stub: agent/company names come from URL params in real flow
  const agentName = new URLSearchParams(window.location.search).get('agent') ?? '{Agent Name}'
  const companyName = new URLSearchParams(window.location.search).get('company') ?? '{Company Name}'

  return (
    <div className="min-h-screen bg-page-bg relative overflow-hidden">
      <BurstBackground />
      <Masthead />

      {/* Main content — vertically and horizontally centred */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-[70px] pb-[40px] px-4">
        {/* Header text */}
        <div className="flex flex-col items-center gap-4 text-center mb-11 w-full max-w-[600px]">
          <h1 className="text-[18px] font-semibold font-sans text-text-primary tracking-[0.27px]">
            Review Application – Authorised Signatory
          </h1>
          <p className="text-[14px] font-normal font-sans text-text-primary leading-[1.4] tracking-[0.21px]">
            <span className="font-semibold">{agentName}</span> has submitted your group insurance
            application for <span className="font-semibold">{companyName}</span>. Enter your details
            to start reviewing the application.
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-card w-full max-w-[383px] p-6 flex flex-col gap-6">
          {/* Singlife logo */}
          <div className="flex justify-center py-2">
            <SinglifeCardLogo />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            {/* NRIC field */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-sans text-text-primary tracking-[0.21px]">
                NRIC/ID No. (Last 4 characters only){' '}
                <span className="text-text-error">*</span>
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="567A"
                value={nric}
                onChange={(e) => { setNric(e.target.value); setError('') }}
                className={`input-underline uppercase${error ? ' error' : ''}`}
                autoComplete="off"
              />
            </div>

            {/* Mobile Number field */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-sans text-text-primary tracking-[0.21px]">
                Mobile Number <span className="text-brand-red">*</span>
              </label>
              <input
                type="tel"
                placeholder="12345678"
                value={mobile}
                onChange={(e) => { setMobile(e.target.value); setError('') }}
                className={`input-underline${error ? ' error' : ''}`}
                autoComplete="off"
              />
            </div>

            {/* Inline error */}
            {error && (
              <p className="text-[13px] text-text-error font-sans leading-snug -mt-3">{error}</p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`
                w-full h-[44px] rounded-full text-[14px] font-semibold font-display text-white
                tracking-[0.21px] transition-colors flex items-center justify-center gap-2
                ${isValid && !loading ? 'bg-brand-red hover:bg-red-700 cursor-pointer' : 'bg-brand-red-light cursor-not-allowed'}
              `}
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Verifying…
                </>
              ) : (
                'Start review'
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
