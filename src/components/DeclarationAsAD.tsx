/**
 * Figma: "Declaration_AS AD" component — Node: 8351:343204 (component set)
 * Three states exactly matching Figma:
 *
 *  Property 1=Default  (8351:343205)
 *    - white bg, no border
 *    - right: "Not completed"  #434343  Sharp Sans Medium
 *
 *  Property 1=Complete (8351:343220)
 *    - white bg, no border
 *    - right: "Completed"  #00AC95  Sharp Sans Semibold
 *
 *  Property 1=Error    (8351:343235)
 *    - white bg + border border-[#990005]
 *    - right: "Not completed"  #434343  Sharp Sans Medium
 *    - below: "Complete declaration to continue."  #990005  12px Open Sans Semibold
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

type Property1 = 'Default' | 'Complete' | 'Error'

function resolveState(completed: boolean, showError: boolean): Property1 {
  if (completed) return 'Complete'
  if (showError) return 'Error'
  return 'Default'
}

interface DeclarationAsADProps {
  declaration: Declaration
  showError?: boolean
  onOpenDeclaration: (declaration: Declaration) => void
}

export default function DeclarationAsAD({
  declaration,
  showError = false,
  onOpenDeclaration,
}: DeclarationAsADProps) {
  const state = resolveState(declaration.completed, showError)

  return (
    <div
      className={`bg-white rounded-2xl p-6 flex flex-col gap-4 w-full ${
        state === 'Error' ? 'border border-[#990005]' : ''
      }`}
    >
      {/* Row: file icon + link | status */}
      <div className="flex items-center justify-between">
        {/* Left: file icon + declaration link */}
        <div className="flex items-center gap-2">
          <FileIcon />
          <button
            onClick={() => onOpenDeclaration(declaration)}
            className="text-[14px] font-semibold font-display text-brand-red underline underline-offset-2 decoration-solid tracking-[0.56px] text-left leading-[1.4]"
          >
            {declaration.title}
          </button>
        </div>

        {/* Right: status text — font weight and color change by state */}
        {state === 'Complete' ? (
          <span className="text-[14px] font-semibold font-display text-success-complete whitespace-nowrap tracking-[0.56px] leading-[1.4]">
            Completed
          </span>
        ) : (
          <span className="text-[14px] font-display text-text-primary whitespace-nowrap tracking-[0.56px] leading-[1.4]" style={{ fontWeight: 500 }}>
            Not completed
          </span>
        )}
      </div>

      {/* Error sub-text — only shown in Error state */}
      {state === 'Error' && (
        <p className="text-[12px] font-semibold font-sans text-[#990005] tracking-[0.18px] leading-[1.4]">
          Complete declaration to continue.
        </p>
      )}
    </div>
  )
}
