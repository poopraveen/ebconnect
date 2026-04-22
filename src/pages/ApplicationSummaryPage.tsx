import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Masthead from '../components/Masthead'
import Footer from '../components/Footer'
import BurstBackground from '../components/BurstBackground'
import CompanyCard from '../components/CompanyCard'
import ProfileCard from '../components/ProfileCard'
import AgentCard from '../components/AgentCard'
import DeclarationStack from '../components/DeclarationStack'
import SubmitButton from '../components/SubmitButton'

import { fetchApplicationSummary, submitReview } from '../api/stub'
import type { ApplicationSummary, Declaration } from '../api/types'

export default function ApplicationSummaryPage() {
  const navigate = useNavigate()
  const token = sessionStorage.getItem('as_token') ?? 'stub'

  const [summary, setSummary] = useState<ApplicationSummary | null>(null)
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [loadingPage, setLoadingPage] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    fetchApplicationSummary(token).then((data) => {
      setSummary(data)
      setDeclarations(data.declarations)
      setLoadingPage(false)
    })
  }, [token])

  function handleDeclarationComplete(id: string) {
    setDeclarations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: true } : d))
    )
  }

  const allDeclarationsDone = declarations.length > 0 && declarations.every((d) => d.completed)

  async function handleSubmit() {
    setSubmitAttempted(true)
    if (!allDeclarationsDone) {
      setSubmitError('Please complete all declarations before proceeding.')
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await submitReview({
        token,
        declarationIds: declarations.map((d) => d.id),
      })
      if (res.success) {
        navigate('/thank-you')
      } else {
        setSubmitError(res.errorMessage ?? 'Submission failed. Please try again.')
      }
    } catch {
      setSubmitError('Unable to connect. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loadingPage) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-text-sub">
          <svg className="animate-spin h-8 w-8 text-brand-red" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-[14px] font-sans">Loading application…</span>
        </div>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="min-h-screen bg-page-bg relative overflow-x-hidden">
      <BurstBackground opacity={0.08} />
      <div className="relative z-10 flex flex-col min-h-screen">
      <Masthead />

      <main className="pt-[134px] pb-[80px] px-4">
        <div className="mx-auto w-full max-w-[792px] flex flex-col gap-6">

          {/* Page title */}
          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] font-semibold font-sans text-text-primary tracking-[0.36px]">
              Review your application
            </h1>
            <p className="text-[14px] font-semibold font-sans text-text-primary">
              Check that all details are correct.
            </p>
          </div>

          {/* Company card — Figma: "Frame 427322982 / Frame 427322983" */}
          <CompanyCard
            companyName={summary.companyName}
            coveragePeriod={summary.coveragePeriod}
            totalEmployees={summary.totalEmployees}
            totalAnnualPremium={summary.totalAnnualPremium}
          />

          {/* Profile cards — Figma: "Profile Cards" */}
          {summary.profileSections.map((section, idx) => (
            <ProfileCard
              key={section.id}
              section={section}
              defaultExpanded={idx === 0}
            />
          ))}

          {/* Agent card — Figma: "Agent Card" */}
          <AgentCard contact={summary.agentContact} />

          {/* Declaration stack — Figma: "Decleration Stack" + "Declaration_AS AD" */}
          <DeclarationStack
            declarations={declarations}
            showErrors={submitAttempted}
            onComplete={handleDeclarationComplete}
          />

          {/* Submit error */}
          {submitError && (
            <p className="text-[13px] text-text-error font-sans">{submitError}</p>
          )}

          {/* Submit button — Figma: "Button" (Primary Large) */}
          <div className="flex justify-center">
            <SubmitButton
              onClick={handleSubmit}
              disabled={!allDeclarationsDone}
              loading={submitting}
            />
          </div>

        </div>
      </main>

      <Footer />
      </div>
    </div>
  )
}
