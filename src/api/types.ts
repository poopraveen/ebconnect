// ─── Domain Types ────────────────────────────────────────────────────────────

export interface LoginRequest {
  nricLast4: string
  mobileNumber: string
}

export interface LoginResponse {
  success: boolean
  token?: string
  agentName?: string
  companyName?: string
  errorMessage?: string
}

export interface ProfileRow {
  id: string
  name: string
  email: string
}

export interface ProfileQuestion {
  id: string
  question: string
  answer: string
  subItems?: { label: string; answer: string }[]
}

export interface ProfileSection {
  id: string
  label: string
  tooltip?: string          // text shown in the Tooltip layer on hover
  profiles: ProfileRow[]
  questions?: ProfileQuestion[]
}

/**
 * kind mirrors the two Figma components:
 *  'as-ad'    → Declaration_AS AD         (shows "Not completed" / "Completed")
 *  'wellness' → Singlife Corporate Wellness Programme Declaration (shows "Enrolled" when done)
 */
export type DeclarationKind = 'as-ad' | 'wellness'

export interface Declaration {
  id: string
  kind: DeclarationKind
  title: string
  url: string
  completed: boolean
}

export interface AgentContact {
  name: string
  email: string
  phone: string
}

export interface ApplicationSummary {
  companyName: string
  coveragePeriod: string
  totalEmployees: number
  totalAnnualPremium: number
  profileSections: ProfileSection[]
  agentContact: AgentContact
  declarations: Declaration[]
}

export interface SubmitReviewRequest {
  token: string
  declarationIds: string[]
}

export interface SubmitReviewResponse {
  success: boolean
  errorMessage?: string
}
