/**
 * Figma: "Profile Cards" component (collapsible)
 * Nodes: 2824:155497 (expanded table), 3605:169530 (Q&A / Beneficiary Owner variant)
 *
 * Supports two content modes driven by data:
 *  - Table mode:  section.profiles with Name / Email columns
 *  - Q&A mode:    section.questions with question / answer rows (+ optional sub-items)
 * Both modes may appear together when a section has both profiles and questions.
 */

import { useState } from 'react'
import type { ProfileSection, ProfileQuestion } from '../api/types'
import Tooltip from './Tooltip'

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 10L8 6L12 10" stroke="#FF0008" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="#FF0008" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Profile table (Name / Email rows) ────────────────────────────────────────

function ProfileTable({ section }: { section: ProfileSection }) {
  return (
    <div className="border border-line-medium rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex bg-table-alt border-b border-line-medium">
        <div className="flex-1 px-4 py-3">
          <span className="text-[14px] font-semibold font-sans text-text-primary">Name</span>
        </div>
        <div className="flex-1 px-4 py-3 text-right">
          <span className="text-[14px] font-semibold font-sans text-text-primary">Email</span>
        </div>
      </div>
      {/* Data rows */}
      {section.profiles.map((profile, idx) => (
        <div
          key={profile.id}
          className={`flex ${idx % 2 === 1 ? 'bg-table-alt' : 'bg-white'}`}
        >
          <div className="flex-1 px-4 py-3 flex items-center min-h-[57px]">
            <span className="text-[14px] font-normal font-sans text-text-primary">
              {profile.name}
            </span>
          </div>
          <div className="flex-1 px-4 py-3 flex items-center justify-end min-h-[57px]">
            <span className="text-[14px] font-semibold font-sans text-text-primary text-right">
              {profile.email}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Q&A rows (compliance / Beneficiary Owner questions) ─────────────────────

function QATable({ questions }: { questions: ProfileQuestion[] }) {
  return (
    <div className="border border-line-medium rounded-2xl overflow-hidden">
      {questions.map((q, idx) => (
        <div key={q.id}>
          {/* Question / answer row */}
          <div className={`flex gap-10 px-6 py-4 ${idx % 2 === 1 ? 'bg-table-alt' : 'bg-white'}`}>
            <p className="flex-1 text-[14px] font-normal font-sans text-text-primary leading-[1.6]">
              {q.question}
            </p>
            <p className="flex-1 text-[14px] font-semibold font-sans text-text-primary text-right">
              {q.answer}
            </p>
          </div>
          {/* Optional sub-items (e.g. Trading Code) */}
          {q.subItems?.map((sub) => (
            <div
              key={sub.label}
              className={`flex gap-10 px-6 py-3 border-t border-line-medium ${idx % 2 === 1 ? 'bg-table-alt' : 'bg-white'}`}
            >
              <p className="flex-1 text-[13px] font-normal font-sans text-text-sub leading-[1.6]">
                {sub.label}
              </p>
              <p className="flex-1 text-[13px] font-semibold font-sans text-text-primary text-right">
                {sub.answer}
              </p>
            </div>
          ))}
          {/* Divider between question groups */}
          {idx < questions.length - 1 && <hr className="border-t border-line-dark" />}
        </div>
      ))}
    </div>
  )
}

// ─── ProfileCard ──────────────────────────────────────────────────────────────

interface ProfileCardProps {
  section: ProfileSection
  defaultExpanded?: boolean
}

export default function ProfileCard({ section, defaultExpanded = false }: ProfileCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const badgeCount = section.profiles.length
  const hasQuestions = (section.questions?.length ?? 0) > 0

  return (
    <div className="bg-white rounded-2xl p-6 w-full">
      {/* Header row */}
      <div className="flex items-center justify-between h-[33px]">
        <div className="flex items-center gap-3">
          <span className="text-[16px] font-semibold font-sans text-text-primary tracking-[0.24px] whitespace-nowrap">
            {section.label}
          </span>
          {section.tooltip && <Tooltip text={section.tooltip} />}
          <span className="bg-success-bg border border-success-border text-success-text text-[12px] font-semibold font-display px-2 py-[2px] rounded-lg whitespace-nowrap">
            {badgeCount} Profile{badgeCount !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-[14px] font-semibold font-sans text-brand-red tracking-[0.21px]"
        >
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          <span>{expanded ? 'Collapse' : 'Expand'}</span>
        </button>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="mt-4 flex flex-col gap-6">
          {/* Name / Email table */}
          <ProfileTable section={section} />

          {/* Compliance Q&A (when questions present) */}
          {hasQuestions && (
            <div className="flex flex-col gap-2">
              <h4 className="text-[14px] font-semibold font-sans text-text-primary tracking-[0.21px]">
                Compliance Information
              </h4>
              <QATable questions={section.questions!} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
