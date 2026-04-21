/**
 * Figma: "Singlife Corporate Wellness Programme Declaration" component
 * Node: 8406:345910 (master component)
 *
 * Behaviour from Figma layer:
 *  - Default:  link visible, "{Enrolled}" text is opacity-0 (invisible, no "Not completed" label)
 *  - Enrolled: same layout, "{Enrolled}" text becomes opacity-100 → shows "Enrolled" in #434343
 *  - Error:    red border + "Complete declaration to continue." sub-text
 *              (mirrors Declaration_AS AD Error state — used by DeclarationStack when submit attempted)
 *
 * Key difference from DeclarationAsAD:
 *  - No "Not completed" label ever shown
 *  - Status is revealed by opacity transition, not text swap
 *  - "Enrolled" uses Sharp Sans Medium (not Semibold) in #434343 (not teal)
 */

import type { Declaration } from '../api/types'

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#434343" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface DeclarationWellnessProps {
  declaration: Declaration
  showError?: boolean
  onOpenDeclaration: (declaration: Declaration) => void
}

export default function DeclarationWellness({
  declaration,
  showError = false,
  onOpenDeclaration,
}: DeclarationWellnessProps) {
  const isError = showError && !declaration.completed

  return (
    <div
      className={`bg-white rounded-2xl p-6 flex flex-col gap-4 w-full ${
        isError ? 'border border-[#990005]' : ''
      }`}
    >
      {/* Row: file icon + link | enrolled status */}
      <div className="flex items-center justify-between">
        {/* Left: file icon + enrolment link */}
        <div className="flex items-center gap-2">
          <FileIcon />
          <button
            onClick={() => onOpenDeclaration(declaration)}
            className="text-[14px] font-semibold font-display text-brand-red underline underline-offset-2 decoration-solid tracking-[0.56px] text-left leading-[1.4]"
          >
            {declaration.title}
          </button>
        </div>

        {/* Right: "Enrolled" — opacity-0 by default, visible once enrolled (Figma: opacity-0 on {Enrolled}) */}
        <span
          className={`text-[14px] font-display text-text-primary whitespace-nowrap tracking-[0.56px] leading-[1.4] transition-opacity ${
            declaration.completed ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontWeight: 500 }}
        >
          Enrolled
        </span>
      </div>

      {/* Error sub-text */}
      {isError && (
        <p className="text-[12px] font-semibold font-sans text-[#990005] tracking-[0.18px] leading-[1.4]">
          Complete declaration to continue.
        </p>
      )}
    </div>
  )
}
