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
  EhdLookupRequest,
  EhdSummary,
  EhdStep,
  EhdSubmitRequest,
  EhdSubmitResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
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

// ─── EHD (Electronic Health Declaration) ─────────────────────────────────────

/**
 * POST /api/ehd/lookup
 * Looks up the insured person by case reference number and date of birth.
 */
export async function ehdLookup(req: EhdLookupRequest): Promise<{ success: boolean; data?: EhdSummary; errorMessage?: string }> {
  await delay(DELAY)

  if (req.caseRefNumber === 'ERR001') {
    return { success: false, errorMessage: 'The details you have entered do not match our records. Please try again.' }
  }

  return {
    success: true,
    data: {
      caseRefNumber: req.caseRefNumber,
      insuredPerson: {
        name: 'Tan Wei Ming',
        nric: 'S****789A',
        dateOfBirth: req.dateOfBirth,
        policyNumber: 'PL-2025-' + req.caseRefNumber.slice(-4),
        productName: 'Singlife Shield Plus',
        sumAssured: 500000,
        mobileNumber: '+65 **** 4567',
      },
      sections: [
        { id: 'sec-1', title: 'Personal & Medical History', description: 'Existing conditions, past surgeries, and hospitalisations', status: 'not_started', questionCount: 8 },
        { id: 'sec-2', title: 'Current Medications', description: 'Medicines and supplements you currently take', status: 'not_started', questionCount: 5 },
        { id: 'sec-3', title: 'Lifestyle & Occupational Hazards', description: 'Smoking, alcohol, and high-risk activities', status: 'not_started', questionCount: 6 },
        { id: 'sec-4', title: 'Family Medical History', description: 'Hereditary conditions in your immediate family', status: 'not_started', questionCount: 4 },
      ],
      totalSections: 4,
      completedSections: 0,
    },
  }
}

/**
 * GET /api/ehd/step/:sectionId
 * Returns the questions for a given step/section.
 */
export async function ehdGetStep(sectionId: string, stepNumber: number): Promise<EhdStep> {
  await delay(300)

  const stepMap: Record<string, EhdStep> = {
    'sec-1': {
      stepNumber,
      totalSteps: 4,
      sectionTitle: 'Personal & Medical History',
      sectionId,
      questions: [
        { id: 'q1-1', code: '1.1', text: 'Have you ever been diagnosed with or suffered from diabetes mellitus, high blood pressure, high cholesterol or any heart condition?', hasDetails: true, detailsLabel: 'Please provide details including the condition, date of diagnosis, and current treatment.' },
        { id: 'q1-2', code: '1.2', text: 'Have you ever suffered from, or been diagnosed with any disorder of the brain or nervous system including epilepsy, stroke, or paralysis?', hasDetails: true, detailsLabel: 'Please provide details of the condition and any ongoing treatment.' },
        { id: 'q1-3', code: '1.3', text: 'Have you ever been diagnosed with or treated for any form of cancer, tumour, or growth?', hasDetails: true, detailsLabel: 'Please state the type of cancer/tumour, date, and treatment received.' },
        { id: 'q1-4', code: '1.4', text: 'Have you ever been hospitalised for any reason, or undergone any surgery?', hasDetails: true, detailsLabel: 'Please provide reason for hospitalisation/surgery and date.' },
        { id: 'q1-5', code: '1.5', text: 'Do you have any physical disabilities, deformities, or have you lost or had an amputation of any limb or organ?', hasDetails: true, detailsLabel: 'Please describe the disability or deformity.' },
        { id: 'q1-6', code: '1.6', text: 'Have you ever been diagnosed with any mental or psychiatric disorder, including depression or anxiety?', hasDetails: true, detailsLabel: 'Please provide details of diagnosis and current status.' },
        { id: 'q1-7', code: '1.7', text: 'Have you ever had an application for life or health insurance declined, postponed, or accepted on special terms?', hasDetails: true, detailsLabel: 'Please state the insurer, type of policy, and reason given.' },
        { id: 'q1-8', code: '1.8', text: 'Are you currently pregnant or have you had any pregnancy complications in the last 2 years?', hasDetails: true, detailsLabel: 'Please provide details including expected delivery date or complications.' },
      ],
    },
    'sec-2': {
      stepNumber,
      totalSteps: 4,
      sectionTitle: 'Current Medications',
      sectionId,
      questions: [
        { id: 'q2-1', code: '2.1', text: 'Are you currently taking any prescribed medications on a regular basis?', hasDetails: true, detailsLabel: 'Please list all medications, dosages, and the conditions they treat.' },
        { id: 'q2-2', code: '2.2', text: 'Are you currently taking any over-the-counter medications or health supplements regularly?', hasDetails: true, detailsLabel: 'Please list all supplements and medications.' },
        { id: 'q2-3', code: '2.3', text: 'Have you ever been advised to stop taking any medication due to adverse effects?', hasDetails: true, detailsLabel: 'Please provide details of the medication and adverse effect.' },
        { id: 'q2-4', code: '2.4', text: 'Are you under the care of any specialist doctor currently?', hasDetails: true, detailsLabel: 'Please state the specialty and reason for specialist care.' },
        { id: 'q2-5', code: '2.5', text: 'Have you undergone any medical investigations (X-ray, MRI, blood tests) in the past 12 months?', hasDetails: true, detailsLabel: 'Please describe the investigations and their results.' },
      ],
    },
    'sec-3': {
      stepNumber,
      totalSteps: 4,
      sectionTitle: 'Lifestyle & Occupational Hazards',
      sectionId,
      questions: [
        { id: 'q3-1', code: '3.1', text: 'Do you currently smoke or have you smoked in the last 12 months?', hasDetails: true, detailsLabel: 'Please state how many cigarettes per day and for how long.' },
        { id: 'q3-2', code: '3.2', text: 'Do you consume alcohol more than 14 units per week?', hasDetails: true, detailsLabel: 'Please provide details of your alcohol consumption.' },
        { id: 'q3-3', code: '3.3', text: 'Do you participate in any hazardous sports or activities (e.g., skydiving, motorsports, deep-sea diving)?', hasDetails: true, detailsLabel: 'Please list the activities and their frequency.' },
        { id: 'q3-4', code: '3.4', text: 'Does your occupation involve working with hazardous materials, heavy machinery, or at heights?', hasDetails: true, detailsLabel: 'Please describe your occupational hazards.' },
        { id: 'q3-5', code: '3.5', text: 'Have you been involved in any criminal investigation or have any pending charges against you?', hasDetails: true, detailsLabel: 'Please provide details.' },
        { id: 'q3-6', code: '3.6', text: 'Do you travel outside Singapore for more than 3 months per year?', hasDetails: true, detailsLabel: 'Please state the countries and purpose of travel.' },
      ],
    },
    'sec-4': {
      stepNumber,
      totalSteps: 4,
      sectionTitle: 'Family Medical History',
      sectionId,
      questions: [
        { id: 'q4-1', code: '4.1', text: 'Have any of your biological parents, siblings, or children been diagnosed with heart disease, stroke, or diabetes before the age of 60?', hasDetails: true, detailsLabel: 'Please state the relationship and condition.' },
        { id: 'q4-2', code: '4.2', text: 'Have any of your biological family members been diagnosed with hereditary or genetic conditions?', hasDetails: true, detailsLabel: 'Please state the condition and affected family member.' },
        { id: 'q4-3', code: '4.3', text: 'Have any of your biological family members died from cancer before the age of 60?', hasDetails: true, detailsLabel: 'Please state the type of cancer, relationship, and age at death.' },
        { id: 'q4-4', code: '4.4', text: 'Have any of your biological family members been diagnosed with a mental health condition?', hasDetails: true, detailsLabel: 'Please state the condition and your relationship to the affected person.' },
      ],
    },
  }

  return stepMap[sectionId] ?? stepMap['sec-1']
}

/**
 * POST /api/ehd/submit
 * Submits the health declaration answers. Returns whether OTP is required.
 */
export async function ehdSubmit(_req: EhdSubmitRequest): Promise<EhdSubmitResponse> {
  await delay(DELAY)
  return {
    success: true,
    requiresOtp: true,
    maskedMobile: '+65 **** 4567',
  }
}

/**
 * POST /api/ehd/otp/verify
 * Verifies the OTP entered by the user.
 */
export async function ehdVerifyOtp(req: OtpVerifyRequest): Promise<OtpVerifyResponse> {
  await delay(DELAY)

  if (req.otpCode === '000000') {
    return { success: false, errorMessage: 'The code you entered is incorrect. Please try again.' }
  }
  return { success: true }
}

/**
 * POST /api/ehd/otp/resend
 * Resends the OTP.
 */
export async function ehdResendOtp(_caseRefNumber: string): Promise<{ success: boolean }> {
  await delay(DELAY)
  return { success: true }
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
