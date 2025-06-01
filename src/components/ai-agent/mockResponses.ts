import { ModuleType, PromptIntent } from './types';

interface MockResponse {
  response: string;
  timestamp: string;
}

const defaultResponse: MockResponse = {
  response: 'Not applicable to this module',
  timestamp: new Date().toISOString()
};

const mockResponses: Record<ModuleType, Record<PromptIntent, MockResponse>> = {
  OPD: {
    screening: {
      response: `Based on the patient's profile and current guidelines:

1. Breast Cancer Screening
- Annual mammogram recommended
- Consider breast MRI given family history
- Next screening due in 10 months

2. Additional Considerations
- Regular clinical breast exams
- Breast awareness and monthly self-exams
- Genetic counseling may be beneficial`,
      timestamp: new Date().toISOString()
    },
    triage: {
      response: `Urgent Referral Recommended ⚠️

Key Findings:
- Multiple high-risk features present
- Symptoms concerning for malignancy
- Meets urgent referral criteria

Suggested Workup:
1. Immediate imaging studies
2. Expedited biopsy if indicated
3. Basic labs within 48 hours`,
      timestamp: new Date().toISOString()
    },
    'follow-up': {
      response: `Follow-up Recommendations:

1. Surveillance Schedule
- Clinical exam every 3 months for first 2 years
- Annual imaging per protocol
- Regular tumor marker assessment

2. Key Monitoring Points
- Watch for specific recurrence patterns
- Quality of life assessment
- Late treatment effects`,
      timestamp: new Date().toISOString()
    },
    evaluation: {
      response: `Patient Evaluation Summary:

1. Risk Assessment
- Multiple high-risk features identified
- Family history significant
- Requires expedited workup

2. Recommended Actions
- Urgent imaging studies
- Genetic counseling referral
- Consider early intervention`,
      timestamp: new Date().toISOString()
    },    toxicity: {
      ...defaultResponse
    },
    general: { ...defaultResponse },
    'dose-check': { ...defaultResponse },
    pathway: { ...defaultResponse },
    'rescue-agent': { ...defaultResponse }
  },
  CDU: {
    toxicity: {
      response: `Toxicity Management Plan:

1. Current Grade 3 Toxicity
- Requires dose modification
- Supportive care measures indicated
- Close monitoring required

2. Management Strategy
- Temporary hold on treatment
- Initiate supportive medications
- Follow-up in 48-72 hours`,
      timestamp: new Date().toISOString()
    },
    screening: { ...defaultResponse },
    triage: { ...defaultResponse },
    'follow-up': { ...defaultResponse },
    evaluation: { ...defaultResponse },
    general: { ...defaultResponse },
    'dose-check': { ...defaultResponse },
    pathway: { ...defaultResponse },
    'rescue-agent': { ...defaultResponse }
  },
  Inpatient: {
    evaluation: {
      response: `Inpatient Evaluation Summary:

1. Current Status
- Stable but requires monitoring
- Pain well controlled
- Nutrition status improving

2. Care Plan
- Continue current management
- Physical therapy consultation
- Discharge planning initiated`,
      timestamp: new Date().toISOString()
    },
    toxicity: {
      response: `Inpatient Toxicity Management:

1. Current Issues
- Grade 2 mucositis
- Mild neutropenia
- GI symptoms controlled

2. Management Plan
- Continue supportive care
- Monitor blood counts
- Adjust medications as needed`,
      timestamp: new Date().toISOString()
    },    screening: { ...defaultResponse },
    triage: { ...defaultResponse },
    'follow-up': { ...defaultResponse },
    general: { ...defaultResponse },
    'dose-check': { ...defaultResponse },
    pathway: { ...defaultResponse },
    'rescue-agent': { ...defaultResponse }
  },
  Palliative: {
    evaluation: {
      response: `Palliative Care Assessment:

1. Symptom Control
- Pain adequately managed
- Breathlessness improved
- Anxiety decreased

2. Care Planning
- Updated advance directives
- Family meeting scheduled
- Support services engaged`,
      timestamp: new Date().toISOString()
    },
    'follow-up': {
      response: `Palliative Follow-up Plan:

1. Monitoring
- Weekly symptom assessment
- Medication review
- Quality of life check

2. Support Services
- Continue home visits
- Maintain family support
- Regular social work input`,
      timestamp: new Date().toISOString()
    },    screening: { ...defaultResponse },
    triage: { ...defaultResponse },
    toxicity: { ...defaultResponse },
    general: { ...defaultResponse },
    'dose-check': { ...defaultResponse },
    pathway: { ...defaultResponse },
    'rescue-agent': { ...defaultResponse }
  },
  RadOnc: {
    evaluation: {
      response: `Radiation Oncology Assessment:

1. Treatment Progress
- Week 3 of planned course
- Good tolerance overall
- Minor skin reaction

2. Plan
- Continue current dose
- Review side effects
- Weekly on-treatment visit`,
      timestamp: new Date().toISOString()
    },
    toxicity: {
      response: `RT Toxicity Management:

1. Current Side Effects
- Grade 2 radiation dermatitis
- Mild fatigue
- Adequate oral intake

2. Management
- Skin care protocol
- Conservative measures
- Weekly assessment`,
      timestamp: new Date().toISOString()
    },
    'follow-up': {
      response: `RT Follow-up Plan:

1. Schedule
- First follow-up at 4 weeks
- Then 3-monthly for first year
- Imaging as per protocol

2. Monitoring
- Treatment response
- Late effects
- Quality of life`,
      timestamp: new Date().toISOString()
    },    screening: { ...defaultResponse },
    triage: { ...defaultResponse },
    general: { ...defaultResponse },
    'dose-check': { ...defaultResponse },
    pathway: { ...defaultResponse },
    'rescue-agent': { ...defaultResponse }
  }
};

export async function getOfflineResponse(
  module?: ModuleType,
  intent?: PromptIntent,
  _prompt?: string
): Promise<MockResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!module || !intent) {
    return {
      response: 'This is a generic mock response',
      timestamp: new Date().toISOString()
    };
  }
  
  // Return mock response with current timestamp
  const response = mockResponses[module][intent] || defaultResponse;
  return {
    ...response,
    timestamp: new Date().toISOString()
  };
}