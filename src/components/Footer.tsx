// White web footer — matches Figma: Desktop / Web Footer (1440×40px)
const NAV_LINKS = ['Terms of Use', 'Privacy Statement', 'Help', 'Security & You', 'Contact Us']

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-line-footer h-[40px] flex items-center justify-between px-6">
      <nav className="flex items-center gap-4">
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            className="text-[12px] font-semibold font-sans text-text-primary hover:text-brand-red transition-colors whitespace-nowrap"
          >
            {link}
          </button>
        ))}
      </nav>
      <span className="text-[12px] text-text-sub whitespace-nowrap">
        © 2024 Singapore Life Ltd. | Company Reg. No: 196900499K | GST Reg No: MR-8500166-8
      </span>
    </footer>
  )
}
