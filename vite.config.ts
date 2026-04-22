import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'http'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

function json(res: ServerResponse, status: number, data: unknown) {
  const payload = JSON.stringify(data, null, 2)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(payload)
}

// ─── Mock: POST /uat-ext/pub/ebconnect/external/authenticate/ ─────────────────

const MOCK_AUTH_RESPONSE = {
  respCode: '00',
  respDesc: 'Success',
  errorDetails: [],
  caseDetail: {
    policyNumber: '3148421',
    companyName: 'SANTI PTE LTD',
    employeeIc: 'S4635302A',
    employeeLastName: 'S4635302A',
    employeeFirstName: null,
    employeeDob: '1990-01-01',
    insuredIc: 'S4635302A',
    insuredLastName: 'S4635302A',
    insuredFirstName: null,
    insuredDob: '1990-01-01',
    relationship: 'SELF',
    employeeEmail: 'thivanka_ilanperuma@singlife.com',
    caseData: {
      case: {
        POLICY_NUMBER: '3148421',
        DI_FLAG: 'false',
        HEALTH_FLAG: 'false',
        SKIP_STP_FLAG: 'false',
        COMPANY: 'E_BILL',
      },
      life: {
        EFFECTIVE_DATE: '2025-04-01',
        LTC_FLAG: 'false',
        GENDER: 'M',
        RELATIONSHIP: 'SELF',
        DATE_OF_BIRTH: '1990-01-01',
        RISK_TYPES: 'LIF',
        AGE: '35',
      },
    },
  },
}

// ─── Mock: POST /uat-ext/pub/ebconnect/external/categoryData/ ─────────────────

const MOCK_CATEGORY_DATA = [
  {
    catCode: 'MEDICAL_MUSCULOSKELETAL',
    catRuleList: [
      { ruleId: 'R10',  text: 'Achilles Heel Injury or Pain' },
      { ruleId: 'R10',  text: 'Achilles tendon' },
      { ruleId: 'R34',  text: 'Aching Back' },
      { ruleId: 'R19',  text: 'Ankle Contusion' },
      { ruleId: 'R19',  text: 'Ankle Fracture' },
      { ruleId: 'R21',  text: 'Ankylosing Spondylitis' },
      { ruleId: 'R25',  text: 'Arm Injury or Pain' },
      { ruleId: 'R27',  text: 'Arthritis' },
      { ruleId: 'R34',  text: 'Back Pain' },
      { ruleId: 'R266', text: 'Knee Pain' },
      { ruleId: 'R270', text: 'Leg Injury or Pain' },
      { ruleId: 'R395', text: 'Ligament Injury' },
    ],
  },
]

// ─── Mock: POST /uat-ext/pub/ebconnect/external/baseQuestions/ ────────────────

const MOCK_BASE_QUESTIONS = {
  respCode: '00',
  respDesc: 'Success',
  errorDetails: [],
  baseQuestions: {
    sectionList: [
      {
        page: 0, text: 'Tell us about your lifestyle', order: 0,
        headingList: [{
          text: 'Group Business Application', order: 1,
          baseQuestionList: [
            { id: 'occupation', prompt: 'What is your occupation?', answerType: 'CASE_DATA', caseData: { dataType: 'SCALAR', dataSubType: 'TEXT' } },
            { id: 'race', prompt: 'What is your race?', answerType: 'CASE_DATA', caseData: { dataType: 'SELECTION', list: [{ code: 'ASIAN', description: 'Asian' }, { code: 'OTHERS', description: 'Others' }] } },
            { id: 'height', prompt: 'What is your height (cm)?', answerType: 'CASE_DATA', caseData: { dataType: 'SCALAR', dataSubType: 'NUMBER', unit: 'cm', minimum: 30, maximum: 250 } },
            { id: 'weight', prompt: 'What is your weight (kg)?', answerType: 'CASE_DATA', caseData: { dataType: 'SCALAR', dataSubType: 'NUMBER', unit: 'kg' } },
            { id: 'alcohol', prompt: 'On average, what is the total number of standard alcoholic drinks you consume per week? (*Please enter "0" if you do not consume alcohol.)', answerType: 'CASE_DATA', caseData: { dataType: 'SCALAR', dataSubType: 'NUMBER' } },
            { id: 'smoker', prompt: 'Have you smoked cigarettes in the last 12 months?', answerType: 'CASE_DATA', caseData: { dataType: 'SELECTION', list: [{ code: 'N', description: 'Non-smoker' }, { code: 'Y', description: 'Smoker' }] } },
            { id: 'cigarettes_per_day', prompt: 'How many sticks of cigarettes you had smoked average per day?', answerType: 'CASE_DATA', caseData: { dataType: 'SCALAR', dataSubType: 'NUMBER' }, conditionalParent: 'smoker', conditionalValue: 'Y' },
          ],
        }],
      },
      {
        page: 1, text: 'Health - EBill', order: 1,
        headingList: [
          {
            text: 'Have you ever had or been told to have or been treated for:', order: 1,
            baseQuestionList: [
              { id: 'hq_a', prompt: 'a) Epilepsy / fits, stroke, paralysis / weakness of limb, prolonged headache, nervous breakdown, depression or any other nervous / mental disorders?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_nervous' }] },
              { id: 'hq_b', prompt: 'b) Ear discharge, nose bleeds, double vision, impaired sight, hearing or speech, or any other disorders of ear, nose, eye and throat?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_ent' }] },
              { id: 'hq_c', prompt: 'c) Asthma, bronchitis, persistent cough, coughing with blood, pneumonia, tuberculosis, breathing complaints / discomfort or any other lung disorders?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_lung' }] },
              { id: 'hq_d', prompt: 'd) Raised cholesterol, high blood pressure, heart attack, mitral valve prolapse or other heart valve disorders, breathlessness, irregular heart rate, chest pain, or any disease or disorders of the heart or blood vessels?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_cardiac' }] },
              { id: 'hq_e', prompt: 'e) Diabetes mellitus, thyroid disorders or any endocrine disorders?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_endocrine' }] },
              { id: 'hq_f', prompt: 'f) Gastritis, stomach or duodenal ulcer, blood in stools, fistula, piles or any other stomach or bowel disorder?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_gastro' }] },
              { id: 'hq_g', prompt: 'g) Jaundice, hepatitis B carrier or any form of hepatitis, liver or gallbladder disorders?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_liver' }] },
              { id: 'hq_h', prompt: 'h) Blood, protein or sugar in urine, kidney stones, infection or any other disorders of the kidney, bladder or genital organs?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_kidney' }] },
              { id: 'hq_i', prompt: 'i) Cancer, tumour, cyst or growth of any kind?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_cancer' }] },
              { id: 'hq_j', prompt: 'j) Slipped disc, gout, arthritis, pain or deformity or disorders of the muscles, spine, limbs or joints, or severe injury?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R19' }] },
              { id: 'hq_k', prompt: 'k) Any sexually transmitted disease or have received any medical advice or counselling for AIDS related conditions (including HIV positive)?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_std' }] },
              { id: 'hq_l', prompt: 'l) Endometriosis, fibroids, breast and / or ovarian cysts / lumps / tumours / abnormal pap smear, irregular or painful menstruation or any other gynaecological disorders?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_gynaeco' }] },
              { id: 'hq_m', prompt: 'm) Anaemia, haemophilia or any disorders of the blood or any other congenital or hereditary disorders not listed above?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_blood' }] },
              { id: 'hq_drug', prompt: 'Have you ever been treated for drug or alcohol addiction?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_addiction' }] },
              { id: 'hq_biopsy', prompt: 'Have you had (a) any biopsy, CT scans or (b) any abnormal or pending investigations, scans, blood or urine tests?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_biopsy' }] },
            ],
          },
          {
            text: 'n) Other than the conditions listed above, have you had any other health condition which led to:', order: 2,
            baseQuestionList: [
              { id: 'hq_n1', prompt: 'More than 10 consecutive days off work?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_absence' }] },
              { id: 'hq_n2', prompt: 'More than 5 consecutive days of hospitalisation?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_hospital' }] },
              { id: 'hq_n3', prompt: 'Follow up consultations or treatment lasting more than a month?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_followup' }] },
            ],
          },
        ],
      },
      {
        page: 2, text: 'Other Information', order: 2,
        headingList: [{
          text: '', order: 1,
          baseQuestionList: [
            { id: 'oq_family', prompt: "Have any of your natural parents or siblings been diagnosed with, suffered from or died of any of the following before the age of 60: Alzheimer's disease, High blood pressure, Diabetes, Cancer, Heart disease/disorder, Neurological/muscular disease, Mental disorder, Kidney disease, Stroke or any other hereditary disease or disorder?", answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_family' }] },
            { id: 'oq_coverage', prompt: 'Have you ever been accepted at special terms or rates, deferred or declined for any application, renewal, or reinstatement of life, accident, health disability or other insurance policy?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_coverage' }] },
            { id: 'oq_avocation', prompt: 'Do you engage or have any intention of engaging in a hazardous activity or occupation such as private flying, scuba diving, motor racing, mountaineering etc?', answerType: 'TRIGGER_YES', ruleList: [{ ruleId: 'R_avocation' }] },
          ],
        }],
      },
    ],
  },
}

// ─── Mock: POST /uat-ext/pub/ebconnect/external/reflexiveQuestions/ ───────────

const MOCK_REFLEXIVE: Record<string, unknown> = {
  R19: {
    type: 'BOOLEAN',
    prompt: 'Are you currently awaiting hospital referral or surgery?',
    valueList: [{ index: 0, text: 'Yes' }, { index: 1, text: 'No' }],
    choiceList: [
      { type: 'FREE_TEXT', prompt: 'Provide details about treatment and pending procedures', valueList: [{ index: 0, text: 'Auto Select' }], choiceList: [] },
      {
        type: 'OPTION',
        prompt: 'What caused your condition?',
        valueList: [{ index: 0, text: 'Injury' }, { index: 1, text: 'Fracture' }, { index: 2, text: 'Other' }],
        choiceList: [
          { type: 'BOOLEAN', prompt: 'Do you have pain currently?', valueList: [{ index: 0, text: 'Yes' }, { index: 1, text: 'No' }], choiceList: [] },
          { type: 'BOOLEAN', prompt: 'Do you have pain currently?', valueList: [{ index: 0, text: 'Yes' }, { index: 1, text: 'No' }], choiceList: [] },
          { type: 'FREE_TEXT', prompt: 'Please describe your condition in detail', valueList: [{ index: 0, text: 'Auto Select' }], choiceList: [] },
        ],
      },
    ],
  },
  default: {
    type: 'FREE_TEXT',
    prompt: 'Please provide details about your condition (diagnosis, date first noticed, treatment received, current status)',
    valueList: [{ index: 0, text: 'Auto Select' }],
    choiceList: [],
  },
}

// ─── Route table ─────────────────────────────────────────────────────────────

const MOCK_ROUTES: Record<string, unknown> = {
  '/uat-ext/pub/ebconnect/external/authenticate/': MOCK_AUTH_RESPONSE,
  '/uat-ext/pub/ebconnect/external/categoryData/': MOCK_CATEGORY_DATA,
  '/uat-ext/pub/ebconnect/external/baseQuestions/': MOCK_BASE_QUESTIONS,
}

// ─── Vite config ──────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
          const url = req.url ?? ''

          // CORS preflight for any mock route
          if (req.method === 'OPTIONS' && MOCK_ROUTES[url] !== undefined) {
            json(res, 204, {})
            return
          }

          // reflexiveQuestions: dynamic response based on ruleId in request body
          if (req.method === 'POST' && url === '/uat-ext/pub/ebconnect/external/reflexiveQuestions/') {
            try {
              const raw = await readBody(req)
              const body = JSON.parse(raw || '{}')
              const ruleId: string = body.ruleId ?? 'default'
              console.log(`\n[mock-api] POST ${url} (ruleId: ${ruleId})`)
              const reflexiveQuestion = (MOCK_REFLEXIVE[ruleId] ?? MOCK_REFLEXIVE['default'])
              json(res, 200, { respCode: '00', respDesc: 'Success', errorDetails: [], ruleId, reflexiveQuestion })
              console.log('[mock-api] Responded 200 OK\n')
            } catch (err) {
              console.error('[mock-api] Error:', err)
              json(res, 500, { error: 'Mock server error' })
            }
            return
          }

          if (req.method === 'POST' && MOCK_ROUTES[url] !== undefined) {
            try {
              const raw = await readBody(req)
              const body = JSON.parse(raw || '{}')

              console.log(`\n[mock-api] POST ${url}`)
              console.log('[mock-api] Request body:', JSON.stringify(body, null, 2))

              json(res, 200, MOCK_ROUTES[url])
              console.log('[mock-api] Responded 200 OK\n')
            } catch (err) {
              console.error('[mock-api] Error:', err)
              json(res, 500, { error: 'Mock server error' })
            }
            return
          }

          next()
        })
      },
    },
  ],
})
