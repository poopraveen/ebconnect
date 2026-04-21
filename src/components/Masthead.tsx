// Red Singlife header — matches Figma: Journey/Masthead (1440×70px)
export default function Masthead() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-red h-[70px] flex items-center px-[120px]">
      <SinglifeLogo />
    </header>
  )
}

function SinglifeLogo() {
  return (
    <div className="flex items-center gap-2">
      {/* Singlife burst icon */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="1.5" fill="none" />
        {/* Simplified burst rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const x1 = 20 + 12 * Math.cos(angle)
          const y1 = 20 + 12 * Math.sin(angle)
          const x2 = 20 + 18 * Math.cos(angle)
          const y2 = 20 + 18 * Math.sin(angle)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )
        })}
        <circle cx="20" cy="20" r="7" fill="white" />
      </svg>
      <span
        className="text-white font-display font-semibold text-xl tracking-wide"
        style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 700 }}
      >
        Singlife
      </span>
    </div>
  )
}
