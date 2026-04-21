/**
 * STUB API — replace each function body with real API calls when ready.
 * All functions return Promises so call-sites need no changes when switching.
 */

import type {
  LoginRequest,
  LoginResponse,
  ApplicationSummary,
  SubmitReviewRequest,
  SubmitReviewResponse,
  ProfileQuestion,
} from './types'

// Simulated network delay (ms)
const DELAY = 600

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/as/login
 * Verifies the Authorised Signatory's NRIC last-4 + mobile number.
 */
export async function loginAS(req: LoginRequest): Promise<LoginResponse> {
  await delay(DELAY)

  // Stub: accept any non-empty input; reject if NRIC ends with "0000"
  if (req.nricLast4 === '0000') {
    return {
      success: false,
      errorMessage: "The details you've entered are incorrect. Please try again.",
    }
  }

  return {
    success: true,
    token: 'stub-jwt-token-abc123',
    agentName: 'Bimba binte Lola',
    companyName: 'Company Name Pte Ltd',
  }
}

// ─── Application ──────────────────────────────────────────────────────────────

/**
 * GET /api/as/application?token=...
 * Returns the full application summary for the AS to review.
 */
export async function fetchApplicationSummary(_token: string): Promise<ApplicationSummary> {
  await delay(DELAY)

  return {
    companyName: 'Company Name Pte Ltd',
    coveragePeriod: '15 Jul 2025 – 14 Jul 2026',
    totalEmployees: 1400,
    totalAnnualPremium: 24500.88,
    profileSections: [
      {
        id: 'as',
        label: 'Authorised Signatory',
        tooltip: 'The person authorised to sign and execute legal documents and agreements on behalf of the company.',
        profiles: Array.from({ length: 10 }, (_, i) => ({
          id: `as-${i + 1}`,
          name: `Name Input ${i + 1}`,
          email: `email${i + 1}@domain.com`,
        })),
      },
      {
        id: 'ad',
        label: 'Authorised Director',
        tooltip: 'A director of the company authorised to represent the entity in this application.',
        profiles: Array.from({ length: 5 }, (_, i) => ({
          id: `ad-${i + 1}`,
          name: `Director Name ${i + 1}`,
          email: `director${i + 1}@domain.com`,
        })),
      },
      {
        id: 'aa',
        label: 'Authorised Admin',
        tooltip: 'An administrator designated to manage employee benefits and policy administration on behalf of the company.',
        profiles: Array.from({ length: 5 }, (_, i) => ({
          id: `aa-${i + 1}`,
          name: `Admin Name ${i + 1}`,
          email: `admin${i + 1}@domain.com`,
        })),
      },
      {
        id: 'bo',
        label: 'Beneficiary Owner',
        tooltip: 'An individual who ultimately owns or controls the entity, typically holding 25% or more of shares or voting rights.',
        profiles: Array.from({ length: 5 }, (_, i) => ({
          id: `bo-${i + 1}`,
          name: `Owner Name ${i + 1}`,
          email: `owner${i + 1}@domain.com`,
        })),
        questions: [
          {
            id: 'q-sgx',
            question: 'Is the entity listed and traded on the Singapore Stock Exchange?',
            answer: 'Yes',
            subItems: [
              { label: 'Trading Code', answer: 'ABC123456789B' },
            ],
          },
          {
            id: 'q-overseas-exchange',
            question:
              'Is the entity listed on a stock exchange outside of Singapore that is subject to: (i) regulatory disclosure requirements and; (ii) requirements relating to adequate transparency in respect of its beneficial owners (imposed through stock exchange rules, law or other enforceable means)?',
            answer: 'Yes',
          },
        ] satisfies ProfileQuestion[],
      },
    ],
    agentContact: {
      name: 'Bimba binte Lola',
      email: 'Bimba_binte_lola@sfa.com.sg',
      phone: '+65 9123 4567',
    },
    declarations: [
      {
        id: 'decl-as',
        kind: 'as-ad' as const,
        title: 'Declaration for Authorised Signatory',
        url: 'https://example.com/declaration-as',
        completed: false,
      },
      {
        id: 'decl-wellness',
        kind: 'wellness' as const,
        title: 'Enrolment for Singlife Corporate Wellness Programme',
        url: 'https://example.com/declaration-wellness',
        completed: false,
      },
    ],
  }
}

// ─── Submit ───────────────────────────────────────────────────────────────────

/**
 * POST /api/as/submit
 * Submits the AS review with accepted declaration IDs.
 */
export async function submitReview(req: SubmitReviewRequest): Promise<SubmitReviewResponse> {
  await delay(DELAY)

  if (!req.token) {
    return { success: false, errorMessage: 'Session expired. Please log in again.' }
  }

  return { success: true }
}
