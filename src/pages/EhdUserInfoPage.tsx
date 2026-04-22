/**
 * EHD User Info Page — /ehd/userInfo
 *
 * Mirrors the old UAT system's app-user-info component with modern Singlife design:
 *  • Policy info card (policy number + company name)
 *  • "Thank you" intro text
 *  • Insured Person card(s) — Employee / Dependent
 *  • Verification checkbox
 *  • Important Note disclosure banner
 *  • Proceed button (disabled until checkbox ticked)
 *  • Modal warning if trying to proceed without checkbox
 *
 * Data source: sessionStorage.ehd_auth_response (set during /ehd authenticate call)
 * Also calls: POST /uat-ext/pub/ebconnect/external/categoryData/ on mount
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CaseDetail {
  policyNumber: string
  companyName: string
  employeeIc: string
  employeeFirstName: string | null
  employeeLastName: string
  employeeDob: string
  insuredIc: string
  insuredFirstName: string | null
  insuredLastName: string
  insuredDob: string
  relationship: string
  employeeEmail: string
  caseData: {
    case: Record<string, string>
    life: Record<string, string>
  }
}

interface AuthResponse {
  respCode: string
  caseDetail: CaseDetail
}

// ─── Masthead (white Singlife bar) ────────────────────────────────────────────

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
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)' }}
      />
      <svg className="absolute right-0 top-0 opacity-10" width="400" height="220" viewBox="0 0 400 220" fill="none" aria-hidden="true">
        <circle cx="340" cy="110" r="160" stroke="white" strokeWidth="1" fill="none" />
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i * 20 * Math.PI) / 180
          return (
            <line key={i}
              x1={340 + 105 * Math.cos(a)} y1={110 + 105 * Math.sin(a)}
              x2={340 + 160 * Math.cos(a)} y2={110 + 160 * Math.sin(a)}
              stroke="white" strokeWidth="1.2" strokeLinecap="round"
            />
          )
        })}
        <circle cx="340" cy="110" r="55" fill="white" fillOpacity="0.06" />
      </svg>
      <div className="relative z-10 h-full flex items-center px-6 lg:px-[120px]">
        <h1 className="text-white font-display font-semibold text-[28px] lg:text-[32px] tracking-[0.4px]">
          Electronic Health Declaration
        </h1>
      </div>
    </div>
  )
}

// ─── Person Icon ──────────────────────────────────────────────────────────────

function PersonIcon({ active }: { active?: boolean }) {
  return (
    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-white/20' : 'bg-[#F4F6F9]'}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="10" r="5" stroke={active ? 'white' : '#434343'} strokeWidth="1.5" />
        <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke={active ? 'white' : '#434343'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// ─── Tick Icon ────────────────────────────────────────────────────────────────

function TickIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="1.5" />
      <path d="M8 14l4.5 4.5L20 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Confirmation Modal ───────────────────────────────────────────────────────

function ConfirmModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-card w-full max-w-[480px] mx-4 overflow-hidden">
        <div className="p-8 flex flex-col gap-5 text-center">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-[#FFF0F0] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" stroke="#FF0008" strokeWidth="1.5" />
                <path d="M14 8v7" stroke="#FF0008" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="14" cy="19" r="1.2" fill="#FF0008" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-[16px] font-display font-semibold text-text-primary tracking-[0.24px]">
              Verification Required
            </h3>
            <p className="text-[13px] font-sans text-text-sub leading-[1.6]">
              To proceed further, you must verify your information.
              Please inform your Human Resource representative if your personal information is incorrect.
            </p>
          </div>
          <div className="border-t border-line-medium pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-[44px] rounded-full bg-brand-red text-white text-[14px] font-semibold font-display hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EhdUserInfoPage() {
  const navigate = useNavigate()
  const [authData, setAuthData] = useState<AuthResponse | null>(null)
  const [verified, setVerified] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [categoryLoading, setCategoryLoading] = useState(true)

  const caseRef = sessionStorage.getItem('ehd_case_ref') ?? ''

  useEffect(() => {
    const raw = sessionStorage.getItem('ehd_auth_response')
    if (!raw) { navigate('/ehd'); return }
    setAuthData(JSON.parse(raw))

    // Fetch category data (fire-and-forget; stored for next step)
    fetch('/uat-ext/pub/ebconnect/external/categoryData/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId: '' }),
    })
      .then(r => r.json())
      .then(data => {
        console.log('[categoryData] received', data)
        sessionStorage.setItem('ehd_category_data', JSON.stringify(data))
      })
      .catch(err => console.error('[categoryData] error', err))
      .finally(() => setCategoryLoading(false))
  }, [navigate])

  function handleProceed() {
    if (!verified) { setShowModal(true); return }
    navigate('/ehd/questions')
  }

  if (!authData) return null

  const detail = authData.caseDetail
  const isSelf = detail.relationship === 'SELF'

  function displayName(first: string | null, last: string) {
    return first ? `${first} ${last}` : last
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col">
      <EhdMasthead />
      <HeroBanner />

      <main className="flex-1 flex flex-col pb-[60px]">

        {/* ── Policy Info Bar ─────────────────────────────────────────────── */}
        <div className="bg-[#E8EFF8] px-6 lg:px-[120px] py-6">
          <div className="max-w-[900px]">
            <h3 className="text-[14px] font-display font-semibold text-text-primary tracking-[0.21px] mb-3">
              Policy info
            </h3>
            <div className="w-10 h-[2px] bg-brand-red rounded-full mb-4" />
            <div className="flex flex-wrap gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-sans font-semibold text-text-sub uppercase tracking-[0.5px]">
                  Policy Number
                </span>
                <span className="text-[15px] font-display font-semibold text-text-primary">
                  {detail.policyNumber}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-sans font-semibold text-text-sub uppercase tracking-[0.5px]">
                  Company Name
                </span>
                <span className="text-[15px] font-display font-semibold text-text-primary">
                  {detail.companyName}
                </span>
              </div>
              {caseRef && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-sans font-semibold text-text-sub uppercase tracking-[0.5px]">
                    Case Reference
                  </span>
                  <span className="text-[15px] font-display font-semibold text-text-primary tracking-widest">
                    {caseRef}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Main content ────────────────────────────────────────────────── */}
        <div className="bg-white px-6 lg:px-[120px] py-10 shadow-sm">
          <div className="max-w-[900px] flex flex-col gap-8">

            {/* Thank you heading */}
            <div className="flex flex-col gap-3">
              <h2 className="text-[20px] font-display font-semibold text-text-primary tracking-[0.3px]">
                Thank you for choosing to make an Electronic Health Declaration
              </h2>
              <p className="text-[14px] font-sans text-text-primary leading-[1.7]">
                This electronic health declaration form may take <strong>10 to 20 mins</strong> to complete.
                <br />
                <strong>Please be prepared to complete the form in <u>one sitting</u>.</strong>
              </p>
            </div>

            {/* ── Insured Person section ──────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-[16px] font-display font-semibold text-text-primary tracking-[0.24px]">
                  Insured Person
                </h3>
                <div className="w-10 h-[2px] bg-brand-red rounded-full" />
              </div>

              {/* Person cards row */}
              <div className="flex flex-wrap gap-4">
                {/* Employee card — always shown, always active */}
                <div className="flex items-center gap-4 bg-[#1a61bd] text-white rounded-xl px-6 py-5 min-w-[260px] flex-1">
                  <PersonIcon active />
                  <div className="flex flex-col flex-1">
                    <span className="text-[12px] font-sans opacity-80 uppercase tracking-[0.5px]">Employee</span>
                    <span className="text-[18px] font-display font-semibold tracking-[0.5px] mt-0.5">
                      {displayName(detail.employeeFirstName, detail.employeeLastName)}
                    </span>
                  </div>
                  <TickIcon />
                </div>

                {/* Dependent card — only shown when relationship is not SELF */}
                {!isSelf && (
                  <div className="flex items-center gap-4 bg-white border border-line-medium rounded-xl px-6 py-5 min-w-[260px] flex-1">
                    <PersonIcon />
                    <div className="flex flex-col flex-1">
                      <span className="text-[12px] font-sans text-text-sub uppercase tracking-[0.5px]">
                        {detail.relationship.charAt(0) + detail.relationship.slice(1).toLowerCase()}
                      </span>
                      <span className="text-[18px] font-display font-semibold text-text-primary tracking-[0.5px] mt-0.5">
                        {displayName(detail.insuredFirstName, detail.insuredLastName)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Verification checkbox ───────────────────────────────────── */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[14px] font-sans text-text-primary">
                I/We verify that the above information is
              </span>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="agreement_confirmation"
                    checked={verified}
                    onChange={e => setVerified(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    verified ? 'bg-brand-red border-brand-red' : 'bg-white border-line-dark'
                  }`}>
                    {verified && (
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path d="M1 4l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[14px] font-sans font-semibold text-text-primary">Correct</span>
              </label>
            </div>

          </div>
        </div>

        {/* ── Important Note banner ────────────────────────────────────────── */}
        <div className="bg-[#1a1a2e] px-6 lg:px-[120px] py-8">
          <div className="max-w-[900px] flex items-start gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 2L1 16h16L9 2z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M9 7v4" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="9" cy="13" r="0.8" fill="white" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-white font-display font-semibold text-[15px] underline tracking-[0.22px]">
                IMPORTANT NOTE:
              </h4>
              <p className="text-white/80 font-sans text-[13px] leading-[1.7]">
                Pursuant to section 23(5) of the insurance act 1966, you are to disclose in this form,
                fully and faithfully, all the facts which you know or ought to know, otherwise, nothing
                may be payable under the Policy.
              </p>
            </div>
          </div>
        </div>

        {/* ── Proceed button ───────────────────────────────────────────────── */}
        <div className="bg-white px-6 lg:px-[120px] py-8 flex justify-center shadow-sm">
          <button
            type="button"
            onClick={handleProceed}
            disabled={categoryLoading}
            className={`h-[48px] px-16 rounded-full text-[15px] font-semibold font-display text-white
              tracking-[0.22px] transition-colors flex items-center gap-2
              ${categoryLoading
                ? 'bg-brand-red-light cursor-not-allowed'
                : 'bg-brand-red hover:bg-red-700 cursor-pointer'}
            `}
          >
            {categoryLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading…
              </>
            ) : (
              'Proceed'
            )}
          </button>
        </div>

      </main>

      <Footer />

      {/* Confirmation modal */}
      {showModal && <ConfirmModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
