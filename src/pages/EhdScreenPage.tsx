/**
 * EHD Screen Page
 * Shows the insured person's details and the list of health declaration sections.
 * User selects each section to complete their declaration.
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Masthead from '../components/Masthead'
import Footer from '../components/Footer'
import type { EhdSummary, EhdSection } from '../api/types'

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EhdSection['status'] }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-bg text-success-text text-[12px] font-semibold font-sans">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5.5" stroke="#00AC95" strokeWidth="1" />
          <path d="M3.5 6l1.8 1.8L8.5 4" stroke="#00AC95" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Completed
      </span>
    )
  }
  if (status === 'in_progress') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E1] text-[#B07D00] text-[12px] font-semibold font-sans">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <circle cx="5" cy="5" r="4.5" stroke="#B07D00" strokeWidth="1" />
          <path d="M5 2.5v2.75l1.5 1" stroke="#B07D00" strokeWidth="1" strokeLinecap="round" />
        </svg>
        In Progress
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F6F9] text-text-sub text-[12px] font-semibold font-sans">
      Not Started
    </span>
  )
}

// ─── Progress Ring ────────────────────────────────────────────────────────────

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? completed / total : 0
  const r = 24
  const circ = 2 * Math.PI * r
  const dash = pct * circ
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#EAEAEA" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          stroke={pct === 1 ? '#00AC95' : '#FF0008'}
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[13px] font-bold font-display text-text-primary">
        {completed}/{total}
      </span>
    </div>
  )
}

// ─── Person Details Card ──────────────────────────────────────────────────────

function PersonCard({ summary }: { summary: EhdSummary }) {
  const p = summary.insuredPerson
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-brand-red flex items-center justify-center text-white font-display font-bold text-[16px] shrink-0">
            {p.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold font-display text-text-primary tracking-[0.24px]">
              {p.name}
            </span>
            <span className="text-[12px] font-sans text-text-sub">{p.nric}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-sans text-text-sub uppercase tracking-[0.5px]">Case Ref</span>
          <p className="text-[13px] font-semibold font-display text-text-primary tracking-[0.5px]">
            {summary.caseRefNumber}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-line-medium" />

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {[
          { label: 'Policy Number', value: p.policyNumber },
          { label: 'Product', value: p.productName },
          { label: 'Sum Assured', value: `S$ ${p.sumAssured.toLocaleString()}` },
          { label: 'Mobile (registered)', value: p.mobileNumber },
        ].map(item => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[11px] font-sans text-text-sub uppercase tracking-[0.5px]">
              {item.label}
            </span>
            <span className="text-[13px] font-sans text-text-primary font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section Row ──────────────────────────────────────────────────────────────

interface SectionRowProps {
  section: EhdSection
  index: number
  onStart: (id: string) => void
}

function SectionRow({ section, index, onStart }: SectionRowProps) {
  const isLocked = index > 0 // unlock progressively — first always open
  const canStart = !isLocked || section.status !== 'not_started'

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
        section.status === 'completed'
          ? 'border-success-border bg-success-bg'
          : 'border-line-medium bg-white hover:border-brand-red cursor-pointer'
      }`}
      onClick={() => onStart(section.id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onStart(section.id)}
    >
      {/* Step number */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold font-display ${
        section.status === 'completed'
          ? 'bg-success-complete text-white'
          : 'bg-[#F4F6F9] text-text-primary'
      }`}>
        {section.status === 'completed'
          ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          : index + 1}
      </div>

      {/* Text */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className={`text-[14px] font-semibold font-display tracking-[0.21px] ${
          section.status === 'completed' ? 'text-success-text' : 'text-text-primary'
        }`}>
          {section.title}
        </span>
        <span className="text-[12px] font-sans text-text-sub leading-[1.5] mt-0.5 truncate">
          {section.description}
        </span>
        <span className="text-[11px] font-sans text-text-sub mt-1">
          {section.questionCount} question{section.questionCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Status + chevron */}
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={section.status} />
        {section.status !== 'completed' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="#8A8988" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EhdScreenPage() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<EhdSummary | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('ehd_summary')
    if (!raw) {
      navigate('/ehd')
      return
    }
    setSummary(JSON.parse(raw))
  }, [navigate])

  function handleSectionStart(sectionId: string) {
    sessionStorage.setItem('ehd_section_id', sectionId)
    navigate('/ehd/questions')
  }

  function handleProceed() {
    const allDone = summary?.sections.every(s => s.status === 'completed')
    if (allDone) {
      navigate('/ehd/otp')
    }
  }

  if (!summary) return null

  const allDone = summary.sections.every(s => s.status === 'completed')

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Masthead />

      <main className="flex-1 pt-[70px] pb-[60px] px-4 flex flex-col items-center">
        <div className="w-full max-w-[720px] flex flex-col gap-6 mt-8">

          {/* Page title */}
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-semibold font-display text-text-primary tracking-[0.3px]">
              Health Declaration
            </h1>
            <p className="text-[13px] font-sans text-text-sub leading-[1.6]">
              Please complete all sections below. Your answers are saved as you go.
            </p>
          </div>

          {/* Person card */}
          <PersonCard summary={summary} />

          {/* Progress summary */}
          <div className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-5">
            <ProgressRing completed={summary.completedSections} total={summary.totalSections} />
            <div className="flex flex-col flex-1">
              <span className="text-[14px] font-semibold font-display text-text-primary">
                {summary.completedSections === summary.totalSections
                  ? 'All sections completed!'
                  : `${summary.totalSections - summary.completedSections} section${summary.totalSections - summary.completedSections !== 1 ? 's' : ''} remaining`}
              </span>
              <span className="text-[12px] font-sans text-text-sub mt-0.5">
                {summary.completedSections} of {summary.totalSections} sections complete
              </span>
            </div>
            {allDone && (
              <button
                onClick={handleProceed}
                className="h-[40px] px-6 rounded-full bg-brand-red text-white text-[13px] font-semibold font-display hover:bg-red-700 transition-colors"
              >
                Submit & Verify
              </button>
            )}
          </div>

          {/* Section list */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[13px] font-semibold font-display text-text-sub uppercase tracking-[0.5px]">
              Declaration Sections
            </h2>
            {summary.sections.map((section, i) => (
              <SectionRow
                key={section.id}
                section={section}
                index={i}
                onStart={handleSectionStart}
              />
            ))}
          </div>

          {/* Important notice */}
          <div className="flex items-start gap-3 bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-0.5" aria-hidden="true">
              <circle cx="9" cy="9" r="8" stroke="#B07D00" strokeWidth="1.3" />
              <path d="M9 5v5" stroke="#B07D00" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="9" cy="13" r="0.9" fill="#B07D00" />
            </svg>
            <p className="text-[12px] font-sans text-[#5D4000] leading-[1.6]">
              <span className="font-semibold">Important:</span> Ensure all your answers are truthful and accurate.
              Withholding or misrepresenting information may affect the validity of your insurance policy.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
