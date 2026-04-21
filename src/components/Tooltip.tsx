/**
 * Figma: "Tooltip" layer — data-name="Tooltip" wrapping tooltip_line icon (Node 2824:156068)
 * Used in ProfileCard header next to each section label.
 *
 * Behaviour: hover the ⓘ icon → dark popup appears above with role description text.
 * Popup dismisses on mouse-leave or focus-out.
 */

import { useState, useRef, useEffect } from 'react'

// ⓘ icon — matches Figma tooltip_line (Node 1:171, 16×16)
function TooltipLineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#8A8988" strokeWidth="1.4" />
      <circle cx="8" cy="4.5" r="0.7" fill="#8A8988" />
      <line x1="8" y1="7" x2="8" y2="12" stroke="#8A8988" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

interface TooltipProps {
  text: string
}

export default function Tooltip({ text }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!visible) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [visible])

  return (
    <div
      ref={containerRef}
      className="relative flex items-center py-[2px]"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Trigger icon — tooltip_line */}
      <button
        type="button"
        aria-label="More information"
        className="flex items-center focus:outline-none"
        onClick={() => setVisible((v) => !v)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        <TooltipLineIcon />
      </button>

      {/* Popup — appears above the icon */}
      {visible && (
        <div
          role="tooltip"
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
            w-[220px] bg-[#434343] text-white
            text-[12px] font-normal font-sans leading-[1.6]
            rounded-lg px-3 py-2 shadow-lg
            pointer-events-none
          "
        >
          {text}
          {/* Arrow pointing down */}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#434343]"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}
