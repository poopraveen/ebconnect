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

// ─── EHD (Electronic Health Declaration) Types ───────────────────────────────

export interface EhdLookupRequest {
  caseRefNumber: string
  dateOfBirth: string  // YYYY-MM-DD
}

export interface EhdInsuredPerson {
  name: string
  nric: string
  dateOfBirth: string
  policyNumber: string
  productName: string
  sumAssured: number
  mobileNumber: string  // masked, e.g. +65 **** 4567
}

export interface EhdSection {
  id: string
  title: string
  description: string
  status: 'not_started' | 'in_progress' | 'completed'
  questionCount: number
}

export interface EhdSummary {
  caseRefNumber: string
  insuredPerson: EhdInsuredPerson
  sections: EhdSection[]
  totalSections: number
  completedSections: number
}

export interface EhdAnswer {
  questionId: string
  answer: 'yes' | 'no' | null
  details?: string
}

export interface EhdQuestion {
  id: string
  code: string
  text: string
  hasDetails: boolean  // whether a "yes" answer requires free-text details
  detailsLabel?: string
}

export interface EhdStep {
  stepNumber: number
  totalSteps: number
  sectionTitle: string
  sectionId: string
  questions: EhdQuestion[]
}

export interface EhdSubmitRequest {
  caseRefNumber: string
  answers: EhdAnswer[]
}

export interface EhdSubmitResponse {
  success: boolean
  requiresOtp: boolean
  maskedMobile: string
  errorMessage?: string
}

export interface OtpVerifyRequest {
  caseRefNumber: string
  otpCode: string
}

export interface OtpVerifyResponse {
  success: boolean
  errorMessage?: string
}
