/**
 * EHD Questions Page — /ehd/questions
 *
 * Dynamically renders health declaration questionnaire from:
 *   POST /uat-ext/pub/ebconnect/external/baseQuestions/
 *
 * For TRIGGER_YES questions answered "Yes", triggers:
 *   POST /uat-ext/pub/ebconnect/external/reflexiveQuestions/
 *
 * Reflexive questions are rendered recursively inline.
 */

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Masthead from '../components/Masthead'
import Footer from '../components/Footer'

// ─── API Types ────────────────────────────────────────────────────────────────

interface SelectionOption { code: string; description: string }

interface CaseDataConfig {
  dataType: 'SCALAR' | 'SELECTION'
  dataSubType?: 'TEXT' | 'NUMBER'
  unit?: string
  minimum?: number
  maximum?: number
  list?: SelectionOption[]
}

interface RuleRef { ruleId: string }

interface BaseQuestion {
  id: string
  prompt: string
  answerType: 'CASE_DATA' | 'TRIGGER_YES'
  caseData?: CaseDataConfig
  ruleList?: RuleRef[]
  conditionalParent?: string
  conditionalValue?: string
}

interface Heading { text: string; order: number; baseQuestionList: BaseQuestion[] }
interface Section { page: number; text: string; order: number; headingList: Heading[] }

interface ReflexiveQuestion {
  type: 'BOOLEAN' | 'OPTION' | 'FREE_TEXT'
  prompt: string
  valueList: Array<{ index: number; text: string }>
  choiceList: ReflexiveQuestion[]
}

interface ReflexiveAnswer {
  value: number | string | null
  childAnswer: ReflexiveAnswer | null
}

// ─── Reflexive Renderer (recursive) ──────────────────────────────────────────

interface RQProps {
  question: ReflexiveQuestion
  answer: ReflexiveAnswer | null
  onChange: (a: ReflexiveAnswer) => void
  depth?: number
}

function ReflexiveRenderer({ question, answer, onChange, depth = 0 }: RQProps) {
  const val = answer?.value ?? null

  if (question.type === 'FREE_TEXT') {
    return (
      <div className={depth > 0 ? 'mt-3' : ''}>
        <p className="text-[12px] font-semibold font-sans text-[#344054] mb-1.5">{question.prompt}</p>
        <textarea
          value={typeof val === 'string' ? val : ''}
          onChange={e => onChange({ value: e.target.value, childAnswer: null })}
          placeholder="Please provide details..."
          rows={3}
          className="w-full text-[13px] font-sans border border-[#d0d5dd] rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-[#7f56d9] transition-colors placeholder-[#98a2b3]"
        />
      </div>
    )
  }

  // BOOLEAN / OPTION
  const selectedIdx = typeof val === 'number' ? val : null
  const childQuestion =
    selectedIdx !== null && question.choiceList?.[selectedIdx]
      ? question.choiceList[selectedIdx]
      : null

  return (
    <div className={depth > 0 ? 'mt-3 pl-4 border-l-2 border-[#d6bbfb]' : ''}>
      <p className="text-[12px] font-semibold font-sans text-[#344054] mb-2">{question.prompt}</p>
      <div className="flex flex-wrap gap-2">
        {question.valueList.map(opt => (
          <button
            key={opt.index}
            type="button"
            onClick={() => onChange({ value: opt.index, childAnswer: null })}
            className={`h-8 px-4 rounded-full border text-[12px] font-sans transition-all ${
              selectedIdx === opt.index
                ? 'bg-[#7f56d9] border-[#7f56d9] text-white'
                : 'bg-white border-[#d0d5dd] text-[#344054] hover:border-[#667085]'
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>
      {childQuestion && (
        <ReflexiveRenderer
          question={childQuestion}
          answer={answer?.childAnswer ?? null}
          onChange={childAns => onChange({ value: selectedIdx!, childAnswer: childAns })}
          depth={depth + 1}
        />
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EhdQuestionsPage() {
  const navigate = useNavigate()
  const topRef = useRef<HTMLDivElement>(null)

  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [error, setError] = useState('')

  const [caseAnswers, setCaseAnswers] = useState<Record<string, string>>({})
  const [triggerAnswers, setTriggerAnswers] = useState<Record<string, 'yes' | 'no' | null>>({})
  const [reflexiveData, setReflexiveData] = useState<Record<string, ReflexiveQuestion>>({})
  const [reflexiveLoading, setReflexiveLoading] = useState<Record<string, boolean>>({})
  const [reflexiveAnswers, setReflexiveAnswers] = useState<Record<string, ReflexiveAnswer>>({})

  const authRaw = sessionStorage.getItem('ehd_auth_response')
  const auth = authRaw ? JSON.parse(authRaw) : null
  const nric: string = auth?.caseDetail?.insuredIc ?? 'S4635302A'
  const caseRef = sessionStorage.getItem('ehd_case_ref') ?? ''

  useEffect(() => {
    fetch('/uat-ext/pub/ebconnect/external/baseQuestions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId: '' }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.respCode === '00') {
          const sorted = [...(data.baseQuestions.sectionList as Section[])].sort(
            (a, b) => a.order - b.order
          )
          setSections(sorted)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function isVisible(q: BaseQuestion): boolean {
    if (!q.conditionalParent) return true
    return caseAnswers[q.conditionalParent] === q.conditionalValue
  }

  async function handleTrigger(q: BaseQuestion, value: 'yes' | 'no') {
    setTriggerAnswers(prev => ({ ...prev, [q.id]: value }))
    setError('')

    if (value === 'yes' && q.ruleList?.length && !reflexiveData[q.id]) {
      const ruleId = q.ruleList[0].ruleId
      setReflexiveLoading(prev => ({ ...prev, [q.id]: true }))
      try {
        const resp = await fetch('/uat-ext/pub/ebconnect/external/reflexiveQuestions/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: '', ruleId }),
        })
        const data = await resp.json()
        if (data.respCode === '00') {
          setReflexiveData(prev => ({ ...prev, [q.id]: data.reflexiveQuestion }))
        }
      } catch (e) {
        console.error('Reflexive API error', e)
      } finally {
        setReflexiveLoading(prev => ({ ...prev, [q.id]: false }))
      }
    }

    if (value === 'no') {
      setReflexiveAnswers(prev => {
        const next = { ...prev }
        delete next[q.id]
        return next
      })
    }
  }

  function validatePage(): boolean {
    const section = sections[currentPage]
    if (!section) return true

    for (const heading of section.headingList) {
      for (const q of heading.baseQuestionList) {
        if (!isVisible(q)) continue

        if (q.answerType === 'CASE_DATA') {
          if (!(caseAnswers[q.id] ?? '').trim()) {
            setError('Please answer all required questions before proceeding.')
            topRef.current?.scrollIntoView({ behavior: 'smooth' })
            return false
          }
        } else if (q.answerType === 'TRIGGER_YES') {
          if (!triggerAnswers[q.id]) {
            setError('Please answer all questions before proceeding.')
            topRef.current?.scrollIntoView({ behavior: 'smooth' })
            return false
          }
        }
      }
    }
    return true
  }

  function handleNext() {
    if (!validatePage()) return
    if (currentPage < sections.length - 1) {
      setCurrentPage(p => p + 1)
      setError('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/ehd/otp')
    }
  }

  function handleBack() {
    setError('')
    if (currentPage > 0) {
      setCurrentPage(p => p - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/ehd/screen')
    }
  }

  const section = sections[currentPage]
  const totalPages = sections.length
  const stepNum = currentPage + 1

  // ── Loading state ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f6f8fb]">
        <Masthead />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-[#667085]">
            <svg className="animate-spin h-8 w-8 text-brand-red" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-[13px] font-sans">Loading questions…</span>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Page render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fb]">
      <Masthead />

      {/* Hero banner */}
      <section className="bg-[#0d2c5c] relative overflow-hidden">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          <h1 className="text-[22px] font-semibold font-display text-white tracking-[0.3px]">
            Electronic Health Declaration
          </h1>
        </div>
      </section>

      {/* Sticky progress + person header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#eaecf0] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
        <div className="max-w-[900px] mx-auto px-6 pt-3 pb-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] font-sans text-[#667085]">
              Health Declaration —{' '}
              <strong className="text-[#101828]">Step {stepNum} of {totalPages}</strong>
            </span>
            <span className="text-[11px] font-sans text-[#667085]">
              {Math.round((stepNum / (totalPages || 1)) * 100)}% complete
            </span>
          </div>
          <div className="flex gap-1.5">
            {sections.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i < stepNum ? 'bg-brand-red' : 'bg-[#eaecf0]'}`}
              />
            ))}
          </div>
        </div>

        {/* Person chip */}
        <div className="bg-[#1a61bd] px-6 py-2.5">
          <div className="max-w-[900px] mx-auto flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="3" stroke="white" strokeWidth="1.4" />
                <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] text-white/60 font-sans uppercase tracking-[0.5px]">Insured Person</div>
              <div className="text-[13px] font-semibold font-display text-white">{nric}</div>
            </div>
            {caseRef && (
              <div className="ml-auto text-right">
                <div className="text-[10px] text-white/60 font-sans uppercase tracking-[0.5px]">Case Ref</div>
                <div className="text-[12px] font-sans text-white/80">{caseRef}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-[900px] mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-5">
        <div ref={topRef} />

        {/* Section title */}
        {section && (
          <div>
            <h2 className="text-[20px] font-semibold font-display text-[#101828]">{section.text}</h2>
            <p className="text-[13px] font-sans text-[#667085] mt-0.5">
              Please answer all questions truthfully and completely.
            </p>
          </div>
        )}

        {/* Validation error */}
        {error && (
          <div className="flex items-start gap-3 bg-[#fff5f5] border border-[#fda29b] rounded-xl px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
              <circle cx="8" cy="8" r="7" stroke="#f04438" strokeWidth="1.4" />
              <path d="M8 4.5v4" stroke="#f04438" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="#f04438" />
            </svg>
            <p className="text-[12px] font-sans text-[#b42318]">{error}</p>
          </div>
        )}

        {/* Question headings */}
        {section?.headingList.map((heading, hi) => (
          <div key={hi} className="bg-white rounded-2xl border border-[#eaecf0] overflow-hidden">
            {heading.text && (
              <div className="px-6 py-4 bg-[#f9fafb] border-b border-[#eaecf0]">
                <p className="text-[14px] font-semibold font-display text-[#1d2939] leading-[1.5]">{heading.text}</p>
              </div>
            )}

            <div className="divide-y divide-[#f2f4f7]">
              {heading.baseQuestionList.map(question => {
                if (!isVisible(question)) return null

                // ── CASE_DATA (SELECTION) ───────────────────────────────────────
                if (question.answerType === 'CASE_DATA' && question.caseData?.dataType === 'SELECTION') {
                  const val = caseAnswers[question.id] ?? ''
                  return (
                    <div key={question.id} className="px-6 py-4">
                      <label className="block text-[13px] font-semibold font-sans text-[#344054] mb-2.5">
                        {question.prompt} <span className="text-brand-red ml-0.5">*</span>
                      </label>
                      <div className="relative w-full sm:w-72">
                        <select
                          value={val}
                          onChange={e => {
                            setCaseAnswers(prev => ({ ...prev, [question.id]: e.target.value }))
                            setError('')
                          }}
                          className="appearance-none w-full text-[13px] font-sans text-[#101828] bg-transparent border-b border-[#d0d5dd] focus:border-brand-red pb-1.5 outline-none transition-colors pr-6"
                        >
                          <option value="">Please select…</option>
                          {question.caseData!.list?.map(opt => (
                            <option key={opt.code} value={opt.code}>{opt.description}</option>
                          ))}
                        </select>
                        <svg className="absolute right-0 bottom-2 text-[#667085] pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )
                }

                // ── CASE_DATA (SCALAR) ──────────────────────────────────────────
                if (question.answerType === 'CASE_DATA' && question.caseData?.dataType === 'SCALAR') {
                  const cd = question.caseData!
                  const val = caseAnswers[question.id] ?? ''
                  const isNum = cd.dataSubType === 'NUMBER'
                  return (
                    <div key={question.id} className="px-6 py-4">
                      <label className="block text-[13px] font-semibold font-sans text-[#344054] mb-2.5">
                        {question.prompt} <span className="text-brand-red ml-0.5">*</span>
                      </label>
                      <div className="relative w-full sm:w-64">
                        <input
                          type={isNum ? 'number' : 'text'}
                          value={val}
                          onChange={e => {
                            setCaseAnswers(prev => ({ ...prev, [question.id]: e.target.value }))
                            setError('')
                          }}
                          placeholder={isNum ? '0' : 'Please type here…'}
                          min={cd.minimum}
                          max={cd.maximum}
                          className={`w-full text-[13px] font-sans text-[#101828] bg-transparent border-b border-[#d0d5dd] focus:border-brand-red pb-1.5 outline-none transition-colors placeholder-[#98a2b3] ${cd.unit ? 'pr-10' : ''}`}
                        />
                        {cd.unit && (
                          <span className="absolute right-0 bottom-2 text-[12px] font-sans text-[#667085]">{cd.unit}</span>
                        )}
                      </div>
                    </div>
                  )
                }

                // ── TRIGGER_YES ─────────────────────────────────────────────────
                if (question.answerType === 'TRIGGER_YES') {
                  const tVal = triggerAnswers[question.id] ?? null
                  const refLoad = reflexiveLoading[question.id]
                  const refQ = reflexiveData[question.id]
                  const refAns = reflexiveAnswers[question.id] ?? null

                  return (
                    <div key={question.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-6">
                        <p className="text-[13px] font-sans text-[#344054] leading-[1.65] flex-1">{question.prompt}</p>
                        <div className="shrink-0 flex gap-2">
                          {(['yes', 'no'] as const).map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleTrigger(question, opt)}
                              className={`h-9 w-[52px] rounded-full border text-[13px] font-semibold font-display transition-all ${
                                tVal === opt
                                  ? opt === 'yes'
                                    ? 'bg-brand-red border-brand-red text-white'
                                    : 'bg-[#101828] border-[#101828] text-white'
                                  : 'bg-white border-[#d0d5dd] text-[#344054] hover:border-[#667085]'
                              }`}
                            >
                              {opt === 'yes' ? 'Yes' : 'No'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Reflexive loading */}
                      {tVal === 'yes' && refLoad && (
                        <div className="mt-3 flex items-center gap-2 text-[12px] font-sans text-[#667085]">
                          <svg className="animate-spin h-3.5 w-3.5 text-[#7f56d9]" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Loading follow-up questions…
                        </div>
                      )}

                      {/* Reflexive questions (inline, recursive) */}
                      {tVal === 'yes' && refQ && !refLoad && (
                        <div className="mt-3 bg-[#f9f5ff] border border-[#e9d7fe] rounded-xl px-4 py-4">
                          <ReflexiveRenderer
                            question={refQ}
                            answer={refAns}
                            onChange={a => setReflexiveAnswers(prev => ({ ...prev, [question.id]: a }))}
                          />
                        </div>
                      )}
                    </div>
                  )
                }

                return null
              })}
            </div>
          </div>
        ))}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <button
            type="button"
            onClick={handleBack}
            className="h-11 px-7 rounded-full border border-[#d0d5dd] text-[14px] font-semibold font-display text-[#344054] hover:border-[#667085] transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="h-11 px-8 rounded-full bg-brand-red text-white text-[14px] font-semibold font-display hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            {currentPage < sections.length - 1 ? 'Next' : 'Proceed to OTP'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
