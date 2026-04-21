/**
 * Figma: "Frame 427322982 / Frame 427322983" — Company/Insurance details card
 * Node: 2824:155495
 */

interface CompanyCardProps {
  companyName: string
  coveragePeriod: string
  totalEmployees: number
  totalAnnualPremium: number
  onSummaryByProduct?: () => void
  onSummaryByEmployee?: () => void
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF0008" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function CompanyCard({
  companyName,
  coveragePeriod,
  totalEmployees,
  totalAnnualPremium,
  onSummaryByProduct,
  onSummaryByEmployee,
}: CompanyCardProps) {
  const fmt = new Intl.NumberFormat('en-SG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-6 w-full">
      {/* Company name */}
      <h2 className="text-[18px] font-semibold font-sans text-text-primary tracking-[0.27px]">
        {companyName}
      </h2>

      <div className="flex flex-col gap-6">
        {/* Coverage Period */}
        <div className="flex items-start justify-between text-[14px]">
          <span className="font-normal font-sans text-text-primary tracking-[0.21px] w-[200px]">
            Coverage Period
          </span>
          <span className="font-semibold font-sans text-text-primary text-right whitespace-nowrap">
            {coveragePeriod}
          </span>
        </div>

        {/* Total Employees */}
        <div className="flex items-start justify-between text-[14px]">
          <span className="font-normal font-sans text-text-primary tracking-[0.21px] w-[200px]">
            Total No. of Employees
          </span>
          <span className="font-semibold font-sans text-text-primary text-right whitespace-nowrap">
            {totalEmployees.toLocaleString()}
          </span>
        </div>

        <hr className="border-t border-line-medium" />

        {/* Total Annual Premium */}
        <div className="flex items-center justify-between">
          <span className="text-[18px] font-semibold font-sans text-text-primary tracking-[0.27px] max-w-[347px]">
            Total Annual Premium (excl. GST)
          </span>
          <span className="text-[18px] font-semibold font-sans text-black text-right whitespace-nowrap">
            S$ {fmt.format(totalAnnualPremium)}
          </span>
        </div>

        {/* View buttons */}
        <div className="flex gap-4">
          <button
            onClick={onSummaryByProduct}
            className="flex items-center gap-2 h-[33px] px-6 rounded-full border border-brand-red text-brand-red text-[12px] font-semibold font-display tracking-[0.18px] hover:bg-red-50 transition-colors"
          >
            <EyeIcon />
            Summary By Product
          </button>
          <button
            onClick={onSummaryByEmployee}
            className="flex items-center gap-2 h-[33px] px-6 rounded-full border border-brand-red text-brand-red text-[12px] font-semibold font-display tracking-[0.18px] hover:bg-red-50 transition-colors"
          >
            <EyeIcon />
            Summary By Employee
          </button>
        </div>
      </div>
    </div>
  )
}
