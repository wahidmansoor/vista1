export interface ReferralTemplate {
  id: string;
  cancerType: string;
  pathwayName: string;
  urgencyLevel: string; // This might be redundant if calculated by triage engine
  aiTriageFactors: {
    highRiskFactors: string[];
    moderateRiskFactors: string[];
    lowRiskFactors: string[]; // Optional, for context
    redFlags: { trigger: string[]; message: string }[]; // Red flag definitions
  };
  requiredInformation: {
    clinical: string[]; // Symptoms, findings
  };
  slaTimeframes: {
    urgent: string; // e.g., "24 hours"
    soon: string; // e.g., "7 days"
    routine: string; // e.g., "14 days"
  };
}

export const referralTemplates: ReferralTemplate[] = [
  {
    id: 'breast-001',
    cancerType: 'Breast Cancer',
    pathwayName: 'Suspected Breast Cancer Pathway',
    urgencyLevel: 'Calculated', // Determined by triage engine
    aiTriageFactors: {
      highRiskFactors: ['Palpable lump', 'Skin changes (peau d\'orange)', 'Nipple discharge (bloody)'],
      moderateRiskFactors: ['Axillary lymphadenopathy', 'Persistent breast pain'],
      lowRiskFactors: ['Family history (low risk)', 'Fibrocystic changes'],
      redFlags: [
        { trigger: ['Palpable lump', 'Skin changes'], message: '🚨 Red Flag: High suspicion for inflammatory breast cancer.' },
      ],
    },
    requiredInformation: {
      clinical: ['Age', 'Symptoms', 'Duration', 'Clinical Findings'],
    },
    slaTimeframes: {
      urgent: 'See within 2 weeks',
      soon: 'See within 4 weeks',
      routine: 'See within 6 weeks',
    },
  },
  {
    id: 'lung-001',
    cancerType: 'Lung Cancer',
    pathwayName: 'Suspected Lung Cancer Pathway',
    urgencyLevel: 'Calculated',
    aiTriageFactors: {
      highRiskFactors: ['Hemoptysis', 'Unexplained weight loss (>10%)', 'Chest X-ray suggestive of malignancy'],
      moderateRiskFactors: ['Persistent cough (>3 weeks)', 'Smoker (>20 pack-years)', 'Hoarseness'],
      lowRiskFactors: ['Shortness of breath (stable)', 'Resolved pneumonia'],
      redFlags: [
        { trigger: ['Hemoptysis', 'Weight loss'], message: '🚨 Red Flag: High suspicion for malignancy. Expedite referral.' },
        { trigger: ['Hoarseness', 'Persistent cough'], message: '🚨 Red Flag: Possible recurrent laryngeal nerve involvement.' },
      ],
    },
    requiredInformation: {
      clinical: ['Age', 'Symptoms', 'Duration', 'Smoking history', 'Clinical Findings'],
    },
    slaTimeframes: {
      urgent: 'See within 1 week',
      soon: 'See within 3 weeks',
      routine: 'See within 5 weeks',
    },
  },
  {
    id: 'colorectal-001',
    cancerType: 'Colorectal Cancer',
    pathwayName: 'Suspected Colorectal Cancer Pathway',
    urgencyLevel: 'Calculated',
    aiTriageFactors: {
      highRiskFactors: ['Rectal bleeding with change in bowel habit', 'Palpable abdominal mass', 'Iron deficiency anemia (unexplained)'],
      moderateRiskFactors: ['Change in bowel habit (>6 weeks)', 'Family history (first-degree relative)', 'Weight loss'],
      lowRiskFactors: ['Hemorrhoids (confirmed)', 'Anal fissure'],
      redFlags: [
        { trigger: ['Rectal bleeding', 'Change in bowel habit', 'Age > 50'], message: '🚨 Red Flag: High suspicion for colorectal cancer. Urgent colonoscopy needed.' },
      ],
    },
    requiredInformation: {
      clinical: ['Age', 'Symptoms', 'Duration', 'Family history', 'Clinical Findings'],
    },
    slaTimeframes: {
      urgent: 'See within 2 weeks',
      soon: 'See within 4 weeks',
      routine: 'See within 6 weeks',
    },
  },
  // Add more templates for other cancer types as needed
];
