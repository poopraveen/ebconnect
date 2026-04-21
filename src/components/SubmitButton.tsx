/**
 * Figma: "Button" (Primary, Large) component
 * Node: 2824:155425 (disabled/pink state shown in Figma)
 * Active state: #FF0008 | Disabled state: #FFC7CB
 */

function SpinnerIcon() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

interface SubmitButtonProps {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  label?: string
}

export default function SubmitButton({
  onClick,
  disabled = false,
  loading = false,
  label = 'Submit',
}: SubmitButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      onClick={loading ? undefined : onClick}
      aria-disabled={isDisabled}
      disabled={loading}
      className={`
        h-[52px] min-w-[180px] px-10 rounded-full
        text-[16px] font-semibold font-display text-white tracking-[0.24px]
        transition-colors flex items-center justify-center gap-2
        ${isDisabled
          ? 'bg-brand-red-light cursor-not-allowed'
          : 'bg-brand-red hover:bg-red-700 cursor-pointer'
        }
      `}
    >
      {loading ? (
        <>
          <SpinnerIcon />
          Submitting…
        </>
      ) : (
        label
      )}
    </button>
  )
}
