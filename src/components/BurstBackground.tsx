// Faint decorative burst pattern (bottom-right) — matches Figma background
export default function BurstBackground() {
  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 opacity-10 overflow-hidden"
      style={{ width: '794px', height: '794px', transform: 'translate(310px, 190px)' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 794 794" fill="none" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i * 20 * Math.PI) / 180
          const x1 = 397 + 150 * Math.cos(angle)
          const y1 = 397 + 150 * Math.sin(angle)
          const x2 = 397 + 380 * Math.cos(angle)
          const y2 = 397 + 380 * Math.sin(angle)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FF0008"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )
        })}
        <circle cx="397" cy="397" r="140" stroke="#FF0008" strokeWidth="2" fill="none" />
        <circle cx="397" cy="397" r="80" stroke="#FF0008" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}
