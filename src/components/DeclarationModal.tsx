/**
 * Figma: "Desktop / Popup Modal / Paragraph" component
 * Node: 8406:346515
 *
 * Layout (exact from Figma):
 *  - White card 584×758px, rounded-[16px], px-[32px] py-[56px], gap-[24px]
 *  - × close button: absolute top-[16px] right-[16px], size-[32px]
 *  - Scroll content area: h-[578px], overflow hidden, custom grey scrollbar pill (8px wide)
 *  - Fade gradient at bottom of scroll area
 *  - Title: Sharp Sans Semibold 18px #434343
 *  - Body: Open Sans Regular 12px, numbered list, leading-[1.6]
 *  - "I confirm" button: h-[44px] min-w-[144px] pill
 *     → disabled (pink #ffc7cb) until scrolled to bottom
 *     → active (red #ff0008) once reached bottom
 */

import { useEffect, useRef, useState } from 'react'
import type { Declaration } from '../api/types'

// ─── Declaration text content ─────────────────────────────────────────────────

const AS_DECLARATION_ITEMS = [
  'The information I have provided is true, accurate and complete.',
  'I am one of the Authorised Signatories appointed and authorised to act on behalf of the company listed in this application (the "Company").',
  <>
    By using Singlife EBConnect, I have read and agree to be bound by Singlife's Terms and Conditions (which may be found on{' '}
    <a href="https://singlife.com/en/terms-and-conditions" target="_blank" rel="noopener" className="text-text-error underline">
      https://singlife.com/en/terms-and-conditions
    </a>
    ).
  </>,
  'As an Authorised Signatory, I will have access to personal data of the individuals whose personal data will be processed as part of this application ("Individuals").',
  'I shall not use, process, download and/or disclose any personal data from Singlife EBConnect for any purpose other than as authorised by the company and permitted by Singlife.',
  'I consent to Singlife collecting, using and/or disclosing my personal data to assist the Company with the Company\'s application for the purposes of the issuance, administration and servicing of the Company\'s insurance policy(ies) and/or account(s) with Singlife, including the processing of Individuals\' personal data for underwriting purposes, payment of premiums and/or claims purposes; for statistical, research, compliance, audit and regulatory purposes and for providing general information on product enhancements and services, which are relevant to the Company\'s needs or policies (including increasing benefits and/or insured lives).',
  'I further consent to Singlife disclosing and/or transferring my personal data to Singlife related group of companies, third party service providers, reinsurers, suppliers and intermediaries (including the Company\'s financial advisers, where applicable), whether located in Singapore or elsewhere, for the above purposes.',
  <>
    I confirm that I have read, understood and agree to be bound by the terms of Singlife's Data Protection Notice (found on{' '}
    <a href="https://singlife.com/en/pdpa" target="_blank" rel="noopener" className="text-text-error underline">
      https://singlife.com/en/pdpa
    </a>
    ) as may be amended, supplemented and/or substituted by Singlife from time to time, and confirm that I am aware that the latest version of such terms (amended, supplemented and/or substituted version) will be posted on Singlife's website and such version shall bind me upon posting and/or where the Company continues to use the relevant products and services offered by Singlife to which such terms relate to.
  </>,
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isScrolledToBottom(el: HTMLDivElement) {
  return el.scrollTop + el.clientHeight >= el.scrollHeight - 8
}

// ─── Close icon (cross_line, 32px) ────────────────────────────────────────────

function CrossLine() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 8L24 24" stroke="#434343" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M24 8L8 24" stroke="#434343" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface DeclarationModalProps {
  declaration: Declaration | null
  onClose: () => void
  onConfirm: (id: string) => void
}

export default function DeclarationModal({ declaration, onClose, onConfirm }: DeclarationModalProps) {
  const [hasReachedBottom, setHasReachedBottom] = useState(false)
  const [optOut, setOptOut] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [thumbTop, setThumbTop] = useState(0)

  const isOpen = Boolean(declaration)
  const isWellness = declaration?.kind === 'wellness'
  const title = isWellness
    ? 'Enrolment for Singlife Corporate Wellness Programme'
    : 'Declaration for Authorised Signatory'

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Reset state when declaration changes
  useEffect(() => {
    setHasReachedBottom(false)
    setOptOut(false)
    // Check immediately on open (content may be short enough)
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el && isScrolledToBottom(el)) setHasReachedBottom(true)
      updateThumb()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [declaration?.id])

  // For wellness (short content), enable immediately
  useEffect(() => {
    if (isWellness) setHasReachedBottom(true)
  }, [isWellness])

  function updateThumb() {
    const el = scrollRef.current
    const track = trackRef.current
    if (!el || !track) return
    const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight || 1)
    const maxThumbTop = track.clientHeight - 90
    setThumbTop(Math.round(ratio * maxThumbTop))
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const target = e.currentTarget
    if (isScrolledToBottom(target)) setHasReachedBottom(true)
    updateThumb()
  }

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!declaration) return null

  const confirmEnabled = hasReachedBottom

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/30"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {/* Centering wrapper — sits inside the scrollable backdrop */}
      <div className="flex min-h-full items-center justify-center px-4 py-[86px]">
        {/* Modal card — 584px wide, max-height so content scrolls inside, never outside */}
        <div
          className="relative bg-white rounded-2xl w-[584px] max-w-full flex flex-col items-center gap-6 px-8 py-14"
          style={{ maxHeight: 'min(758px, calc(100vh - 172px))' }}
          onClick={e => e.stopPropagation()}
        >

        {/* × close button — absolute top-[16px] right-[16px] size-[32px] */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 size-8 flex items-center justify-center"
        >
          <CrossLine />
        </button>

        {/* Scroll content area — grows to fill available space, min 0 */}
        <div className="relative w-full flex-1 min-h-0 overflow-hidden flex flex-col">

          {/* Inner scroll + scrollbar row */}
          <div className="flex gap-2 flex-1 min-h-0 overflow-hidden">
            {/* Scrollable text */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto pr-2 scroll-smooth"
              style={{ scrollbarWidth: 'none' }}
              onScroll={handleScroll}
            >
              {/* Title */}
              <h2 className="font-display font-semibold text-[18px] text-text-primary tracking-[0.27px] leading-[1.4] mb-1">
                {title}
              </h2>

              {isWellness ? (
                /* Wellness: subtitle + paragraphs + opt-out checkbox */
                <div className="flex flex-col gap-4">
                  <p className="font-sans font-normal text-[12px] text-text-primary leading-[1.6] tracking-[0.18px]">
                    (Applicable to Authorised Director)
                  </p>
                  <p className="font-sans font-normal text-[12px] text-text-primary leading-[1.6] tracking-[0.18px]">
                    For and on behalf of the Company as indicated in this application, the Authorised Director agrees to enrol the Company and its employees in the Singlife Corporate Wellness programme* where they can enjoy complimentary basic health screenings, attend wellbeing seminars, participate in health and wellness carnivals, get invited to special events, be notified on offers and/or receive updates on other wellness related matters.
                  </p>
                  <p className="font-sans font-normal text-[12px] text-text-primary leading-[1.6] tracking-[0.18px]">
                    *Contact your employee benefits manager or email:{' '}
                    <a href="mailto:corporate.wellness@singlife.com" className="text-text-error underline">
                      corporate.wellness@singlife.com
                    </a>{' '}
                    for details.
                  </p>

                  {/* Opt-out checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={optOut}
                      onChange={e => setOptOut(e.target.checked)}
                      className="mt-[2px] shrink-0 w-4 h-4 accent-[#434343] cursor-pointer"
                    />
                    <span className="font-sans font-normal text-[12px] text-text-primary leading-[1.6] tracking-[0.18px]">
                      Please tick this box if you do not wish to enrol the company and its employees in the Singlife Corporate Wellness programme.
                    </span>
                  </label>
                </div>
              ) : (
                /* AS Declaration: preamble + numbered list */
                <>
                  <p className="font-sans font-normal text-[12px] text-text-primary leading-[1.6] tracking-[0.18px] mb-2 mt-4">
                    By accepting this application, I hereby represent, undertake and warrant to Singapore Life Ltd. ("Singlife") that:
                  </p>
                  <ol className="list-decimal pl-5 flex flex-col gap-2">
                    {AS_DECLARATION_ITEMS.map((item, i) => (
                      <li key={i} className="font-sans font-normal text-[12px] text-text-primary leading-[1.6] tracking-[0.18px]">
                        {item}
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>

            {/* Custom scrollbar — grey pill, 8px wide (Figma: bg-[#d8d8d8] w-[8px] h-[90px] rounded-[8px]) */}
            <div ref={trackRef} className="relative w-2 shrink-0 rounded-full">
              <div
                className="absolute w-2 h-[90px] rounded-lg bg-[#D8D8D8]"
                style={{ top: thumbTop }}
              />
            </div>
          </div>

          {/* Fade gradient at bottom — Figma: Rectangle 12832 inverted */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
            }}
          />
        </div>

        {/* "I confirm" button — h-[44px] w-[144px] pill */}
        <button
          type="button"
          onClick={() => confirmEnabled && onConfirm(declaration.id)}
          aria-disabled={!confirmEnabled}
          className={`h-[44px] min-w-[144px] px-10 rounded-full font-display font-semibold text-[14px] text-white tracking-[0.21px] leading-[1.4] transition-colors shrink-0 ${
            confirmEnabled
              ? 'bg-brand-red hover:bg-red-700 cursor-pointer'
              : 'bg-brand-red-light cursor-not-allowed'
          }`}
        >
          I confirm
        </button>
        </div>
      </div>
    </div>
  )
}
