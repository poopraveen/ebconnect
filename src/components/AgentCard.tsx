/**
 * Figma: "Agent Card" component
 * Node: 2824:155423
 * Shows Financial Adviser Representative (FAR) contact details.
 */

import type { AgentContact } from '../api/types'

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#434343" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#434343" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6L12 13 2 6" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#434343" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.21 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
    </svg>
  )
}

interface AgentCardProps {
  contact: AgentContact
}

export default function AgentCard({ contact }: AgentCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 w-full">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[18px] font-semibold font-sans text-text-primary tracking-[0.27px]">
            Financial Adviser Representative (FAR) Contact Details
          </h3>
          <p className="text-[14px] font-normal font-sans text-text-primary leading-[1.6]">
            If you have any questions about your application, please contact your FAR below.
          </p>
        </div>

        {/* Contact details */}
        <div className="flex flex-wrap gap-8">
          <div className="flex items-center gap-2">
            <UserIcon />
            <span className="text-[14px] font-semibold font-sans text-text-primary whitespace-nowrap">
              {contact.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MailIcon />
            <a
              href={`mailto:${contact.email}`}
              className="text-[14px] font-semibold font-sans text-text-error underline underline-offset-2 whitespace-nowrap"
            >
              {contact.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon />
            <span className="text-[14px] font-semibold font-sans text-text-primary whitespace-nowrap">
              {contact.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
